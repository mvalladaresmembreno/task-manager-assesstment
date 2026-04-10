import { Kysely, PostgresDialect, Generated } from 'kysely'
import { Pool } from 'pg'

export interface UserTable {
  id: Generated<string>
  name: string
  email: string
  password_hash: string
  role: 'admin' | 'user'
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface TaskTable {
  id: Generated<string>
  title: string
  description: string | null
  status: 'pending' | 'completed'
  user_id: string
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

export interface Database {
  users: UserTable
  tasks: TaskTable
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: 'localhost',
      port: 5433,
      user: 'postgres',
      password: 'postgres',
      database: 'task_manager',
      max: 10,
    }),
  }),
})