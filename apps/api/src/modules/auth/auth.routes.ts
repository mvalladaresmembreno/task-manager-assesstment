import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import { db } from '../../db/database.js'
import { loginSchema, signupSchema } from './auth.schemas.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/signup', async (request, reply) => {
    const parsed = signupSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: parsed.error.flatten(),
      })
    }

    const { name, email, password } = parsed.data

    const existingUser = await db
      .selectFrom('users')
      .select(['id'])
      .where('email', '=', email)
      .executeTakeFirst()

    if (existingUser) {
      return reply.code(409).send({
        message: 'Email already in use',
      })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const createdUser = await db
      .insertInto('users')
      .values({
        name,
        email,
        password_hash,
        role: 'user',
      })
      .returning(['id', 'name', 'email', 'role'])
      .executeTakeFirstOrThrow()

    const token = await reply.jwtSign({
      sub: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    })

    return reply.code(201).send({
      user: createdUser,
      token,
    })
  })

  app.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: parsed.error.flatten(),
      })
    }

    const { email, password } = parsed.data

    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

    if (!user) {
      return reply.code(401).send({
        message: 'Invalid credentials',
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return reply.code(401).send({
        message: 'Invalid credentials',
      })
    }

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    return reply.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  })

  app.get('/me', { preHandler: [app.authenticate] }, async (request: any, reply) => {
    const userId = request.user.sub as string

    const user = await db
      .selectFrom('users')
      .select(['id', 'name', 'email', 'role', 'created_at'])
      .where('id', '=', userId)
      .executeTakeFirst()

    if (!user) {
      return reply.code(404).send({
        message: 'User not found',
      })
    }

    return reply.send(user)
  })

  app.get('/test', async () => {
    return { module: 'auth ok' }
  })
}