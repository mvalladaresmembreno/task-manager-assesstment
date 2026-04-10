import { useState, type FormEvent, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { useAuth } from '../contexts/auth-context'

type SignupResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
  }
}

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await apiFetch<SignupResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

      login(response.token, response.user)
      navigate('/tasks')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Sign up</h1>

        <input
          style={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? <p style={styles.error}>{error}</p> : null}

        <button style={styles.primaryButton} type="submit">
          Create account
        </button>

        <p style={styles.text}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: '#f8fafc',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#ffffff',
    padding: 24,
    borderRadius: 16,
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: {
    margin: 0,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #cbd5e1',
  },
  primaryButton: {
    padding: 12,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: '#dc2626',
    margin: 0,
  },
  text: {
    margin: 0,
  },
}