import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import sensible from '@fastify/sensible'
import { authRoutes } from './modules/auth/auth.routes.js'
import { taskRoutes } from './modules/tasks/task.routes.js'

export async function buildApp() {
  const app = Fastify({ logger: true })

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], //Methods allowed for CORS
    credentials: true,
  })

  await app.register(sensible)

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
  })

  app.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify()
    } catch {
      return reply.unauthorized('Invalid or missing token')
    }
  })

  app.get('/health', async () => {
    return { ok: true }
  })

  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(taskRoutes, { prefix: '/api/tasks' })

  return app
}