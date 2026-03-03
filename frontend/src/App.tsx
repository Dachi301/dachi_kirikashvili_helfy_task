import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilter from './components/TaskFilter'
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from './services/taskService'
import type { Task, TaskData } from './services/taskService'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getTasks(filter)
      setTasks(data)
    } catch {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const handleCreateTask = async (taskData: TaskData) => {
    try {
      setError('')
      await createTask(taskData)
      fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    }
  }

  const handleUpdateTask = async (taskData: TaskData) => {
    if (!editingTask) return
    try {
      setError('')
      await updateTask(editingTask.id, taskData)
      setEditingTask(null)
      fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      setError('')
      await deleteTask(id)
      fetchTasks()
    } catch {
      setError('Failed to delete task')
    }
  }

  const handleToggleTask = async (id: number) => {
    try {
      setError('')
      await toggleTask(id)
      fetchTasks()
    } catch {
      setError('Failed to toggle task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {error && <p className="error-message">{error}</p>}

      <TaskForm
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}

export default App
