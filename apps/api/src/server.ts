import dotenv from 'dotenv'
import { buildApp } from './app'

dotenv.config()

const start = async () => {
  const app = await buildApp()

  try {
    await app.listen({
      port: Number(process.env.PORT || 3000),
      host: '0.0.0.0',
    })

    app.log.info(`Server running on port ${process.env.PORT || 3000}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

start()