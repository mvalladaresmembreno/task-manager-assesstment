import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../api/client'

type TaskStatus = 'pending' | 'completed'

type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

type TasksResponse = {
  data: Task[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useTasks(params: { page: number; status?: '' | TaskStatus }) {
  const search = new URLSearchParams()
  search.set('page', String(params.page))
  search.set('limit', '3')

  if (params.status) {
    search.set('status', params.status)
  }

  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => apiFetch<TasksResponse>(`/api/tasks?${search.toString()}`),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const token = localStorage.getItem('token')
  return useMutation({
    mutationFn: (body: { title: string; description?: string }) =>
      apiFetch<Task>('/api/tasks', {
        method: 'POST',
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
const token = localStorage.getItem('token')
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      apiFetch<Task>(`/api/tasks/${id}/status`, {
        method: 'PATCH',
         headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
const token = localStorage.getItem('token')
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/tasks/${id}`, {
        method: 'DELETE',
         headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}