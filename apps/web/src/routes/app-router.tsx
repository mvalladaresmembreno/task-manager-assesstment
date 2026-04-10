import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/protected-route'
import { LoginPage } from '../pages/login-page'
import { SignupPage } from '../pages/signup-page'
import { TasksPage } from '../pages/tasks-page'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}