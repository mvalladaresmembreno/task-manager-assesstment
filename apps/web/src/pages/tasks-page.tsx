import { useState, type FormEvent, type CSSProperties } from 'react'
import { useAuth } from '../contexts/auth-context'
import { useCreateTask, useDeleteTask, useTasks, useUpdateTaskStatus } from '../features/tasks/hooks'

export function TasksPage() {
  const { user, logout } = useAuth()

  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'' | 'pending' | 'completed'>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const tasksQuery = useTasks({ page, status })
  const createTask = useCreateTask()
  const updateTaskStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()

  const tasks = tasksQuery.data?.data ?? []
  const meta = tasksQuery.data?.meta


  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    await createTask.mutateAsync({
      title,
      description,
    })

    setTitle('')
    setDescription('')
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Tasks</h1>
            <p style={styles.subtitle}>Welcome, {user?.name}</p>
          </div>

          <button onClick={logout} style={styles.secondaryButton}>
            Logout
          </button>
        </div>

        <form onSubmit={handleCreate} style={styles.card}>
          <h2 style={styles.sectionTitle}>Create task</h2>

          <input
            style={styles.input}
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" style={styles.primaryButton}>
            Add task
          </button>
        </form>

        <div style={styles.filters}>
          <button onClick={() => setStatus('')} style={styles.secondaryButton}>
            All
          </button>
          <button onClick={() => setStatus('pending')} style={styles.secondaryButton}>
            Pending
          </button>
          <button onClick={() => setStatus('completed')} style={styles.secondaryButton}>
            Completed
          </button>
        </div>

        {tasksQuery.isLoading ? <p>Loading tasks...</p> : null}
        {tasksQuery.isError ? <p>Failed to load tasks.</p> : null}

        <div style={styles.list}>
          {tasks.map((task) => (
            <div key={task.id} style={styles.taskCard}>
              <div>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskDescription}>{task.description}</p>
                <span style={styles.badge}>{task.status}</span>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.secondaryButton}
                  onClick={() =>
                    updateTaskStatus.mutate({
                      id: task.id,
                      status: task.status === 'completed' ? 'pending' : 'completed',
                    })
                  }
                >
                  Toggle
                </button>

                <button style={styles.secondaryButton} onClick={() => deleteTask.mutate(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {meta ? (
          <div style={styles.pagination}>
            <button
              style={styles.secondaryButton}
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {meta.page} of {meta.totalPages}
            </span>

            <button
              style={styles.secondaryButton}
              disabled={page >= meta.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: 24,
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  header: {
    background: '#ffffff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
  },
  subtitle: {
    margin: '4px 0 0',
  },
  sectionTitle: {
    margin: 0,
  },
  card: {
    background: '#ffffff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #cbd5e1',
  },
  textarea: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    minHeight: 100,
    resize: 'vertical',
  },
  primaryButton: {
    padding: 12,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: 8,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  taskCard: {
    background: '#ffffff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
  },
  taskTitle: {
    margin: 0,
  },
  taskDescription: {
    marginTop: 8,
    marginBottom: 0,
  },
  actions: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start',
  },
  badge: {
    display: 'inline-block',
    marginTop: 8,
    padding: '4px 10px',
    border: '1px solid #cbd5e1',
    borderRadius: 999,
    fontSize: 12,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
  },
}