export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string | null
}

export interface TaskData {
  title: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
}

const API_URL = 'http://localhost:4000/api/tasks'

export interface PaginatedResponse {
  tasks: Task[]
  total: number
  page: number
  totalPages: number
}

export async function getTasks(filter = '', sort = '', page = 1, limit = 10): Promise<PaginatedResponse> {
  const params = new URLSearchParams()
  if (filter === 'completed') params.set('completed', 'true')
  if (filter === 'pending') params.set('completed', 'false')
  if (sort) params.set('sort', sort)
  params.set('page', String(page))
  params.set('limit', String(limit))
  const url = `${API_URL}?${params.toString()}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function createTask(taskData: TaskData): Promise<{ task: Task }> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to create task')
  }
  return res.json()
}

export async function updateTask(id: number, updates: Partial<TaskData>): Promise<{ task: Task }> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Failed to update task')
  }
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete task')
}

export async function toggleTask(id: number): Promise<{ task: Task }> {
  const res = await fetch(`${API_URL}/${id}/toggle`, { method: 'PATCH' })
  if (!res.ok) throw new Error('Failed to toggle task')
  return res.json()
}
