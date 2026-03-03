import { useState, useEffect, useCallback, useRef } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilter from './components/TaskFilter'
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from './services/taskService'
import { getSavedOrder, applyOrder } from './utils'
import type { Task, TaskData } from './services/taskService'
import './App.css'

const PAGE_SIZE = 10
const ORDER_KEY = 'task-order'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [sort, setSort] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [totalTasks, setTotalTasks] = useState<number>(0)
  const pageRef = useRef(1)
  const initialLoadDone = useRef(false)

  const fetchTasks = useCallback(async (pageNum: number, append: boolean) => {
    try {
      if (!initialLoadDone.current) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError('')
      const data = await getTasks(filter, sort, pageNum, PAGE_SIZE)
      const order = getSavedOrder(ORDER_KEY)
      setTasks(prev => applyOrder(append ? [...prev, ...data.tasks] : data.tasks, order))
      setHasMore(pageNum < data.totalPages)
      setTotalTasks(data.total)
      pageRef.current = pageNum
    } catch {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
      setLoadingMore(false)
      initialLoadDone.current = true
    }
  }, [filter, sort])

  useEffect(() => {
    pageRef.current = 1
    fetchTasks(1, false)
  }, [filter, sort, fetchTasks])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    const nextPage = pageRef.current + 1
    fetchTasks(nextPage, true)
  }, [loadingMore, hasMore, fetchTasks])

  const reloadAll = useCallback(async () => {
    try {
      setLoadingMore(true)
      setError('')
      const currentMax = pageRef.current
      const data = await getTasks(filter, sort, 1, currentMax * PAGE_SIZE)
      const order = getSavedOrder(ORDER_KEY)
      setTasks(applyOrder(data.tasks, order))
      setHasMore(1 < data.totalPages)
      setTotalTasks(data.total)
      pageRef.current = 1
      const actualPages = data.totalPages
      if (currentMax <= actualPages) {
        setHasMore(currentMax < actualPages)
        pageRef.current = currentMax
      }
    } catch {
      setError('Failed to load tasks')
    } finally {
      setLoadingMore(false)
    }
  }, [filter, sort])

  const handleCreateTask = async (taskData: TaskData) => {
    try {
      setError('')
      await createTask(taskData)
      reloadAll()
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
      reloadAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      setError('')
      await deleteTask(id)
      reloadAll()
    } catch {
      setError('Failed to delete task')
    }
  }

  const handleToggleTask = async (id: number) => {
    try {
      setError('')
      await toggleTask(id)
      reloadAll()
    } catch {
      setError('Failed to toggle task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReorder = (reordered: Task[]) => {
    setTasks(reordered)
    localStorage.setItem(ORDER_KEY, JSON.stringify(reordered.map(t => t.id)))
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Task Manager</h1>
        <p>Stay on top of what matters</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <TaskForm
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      <div className="list-controls">
        <TaskFilter currentFilter={filter} onFilterChange={setFilter} />

        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort: Default</option>
          <option value="createdAt">Sort: Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {!loading && (
        <div className="task-count">
          {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <TaskList
          tasks={tasks.filter((t) =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase())
          )}
          search={search}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onEdit={handleEdit}
          onReorder={handleReorder}
          onLoadMore={loadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />
      )}
    </div>
  )
}

export default App