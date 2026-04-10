import { FastifyInstance } from 'fastify'
import { db } from '../../db/database.js'
import {
  createTaskSchema,
  listTasksSchema,
  updateStatusSchema,
  updateTaskSchema,
} from './task.schemas.js'

export async function taskRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.get('/', async (request: any, reply) => {
    const parsed = listTasksSchema.safeParse(request.query)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: parsed.error.flatten(),
      })
    }

    const userId = request.user.sub as string
    const { page, limit, status } = parsed.data
    const offset = (page - 1) * limit

    let query = db
      .selectFrom('tasks')
      .select([
        'id',
        'title',
        'description',
        'status',
        'created_at as createdAt',
        'updated_at as updatedAt',
      ])
      .where('user_id', '=', userId)

    let countQuery = db
      .selectFrom('tasks')
      .select(({ fn }) => fn.count<string>('id').as('count'))
      .where('user_id', '=', userId)

    if (status) {
      query = query.where('status', '=', status)
      countQuery = countQuery.where('status', '=', status)
    }

    const [tasks, countRow] = await Promise.all([
      query.orderBy('created_at', 'desc').limit(limit).offset(offset).execute(),
      countQuery.executeTakeFirstOrThrow(),
    ])

    const total = Number(countRow.count)

    return reply.send({
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  })

  app.post('/', async (request: any, reply) => {
    const parsed = createTaskSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: parsed.error.flatten(),
      })
    }

    const userId = request.user.sub as string

    const createdTask = await db
      .insertInto('tasks')
      .values({
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        status: 'pending',
        user_id: userId,
      })
      .returning([
        'id',
        'title',
        'description',
        'status',
        'created_at as createdAt',
        'updated_at as updatedAt',
      ])
      .executeTakeFirstOrThrow()
   
    if (!createdTask) {
      return reply.code(500).send({
        message: 'Failed to create task',
      })
    }

    return reply.code(201).send(createdTask)

  })

  app.patch('/:id', async (request: any, reply) => {
    const parsed = updateTaskSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: parsed.error.flatten(),
      })
    }

    const { id } = request.params as { id: string }
    const userId = request.user.sub as string

    const existingTask = await db
      .selectFrom('tasks')
      .select(['id'])
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst()

    if (!existingTask) {
      return reply.code(404).send({
        message: 'Task not found',
      })
    }

    const updatedTask = await db
      .updateTable('tasks')
      .set({
        ...parsed.data,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .returning([
        'id',
        'title',
        'description',
        'status',
        'created_at as createdAt',
        'updated_at as updatedAt',
      ])
      .executeTakeFirstOrThrow()

    return reply.send(updatedTask)
  })

  app.patch('/:id/status', async (request: any, reply) => {
    const parsed = updateStatusSchema.safeParse(request.body)

    if (!parsed.success) {
      return reply.code(400).send({
        message: 'Validation error',
        errors: parsed.error.flatten(),
      })
    }

    const { id } = request.params as { id: string }
    const userId = request.user.sub as string

    const updatedTask = await db
      .updateTable('tasks')
      .set({
        status: parsed.data.status,
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .returning([
        'id',
        'title',
        'description',
        'status',
        'created_at as createdAt',
        'updated_at as updatedAt',
      ])
      .executeTakeFirst()

    if (!updatedTask) {
      return reply.code(404).send({
        message: 'Task not found',
      })
    }

    return reply.send(updatedTask)
  })

  app.delete('/:id', async (request: any, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user.sub as string

    const existingTask = await db
      .selectFrom('tasks')
      .select(['id'])
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst()

    if (!existingTask) {
      return reply.code(404).send({
        message: 'Task not found',
      })
    }

    await db
      .deleteFrom('tasks')
      .where('id', '=', id)
      .where('user_id', '=', userId)
      .executeTakeFirst()

    return reply.code(204).send()
  })

  app.get('/test', async () => {
    return { module: 'tasks ok' }
  })
}