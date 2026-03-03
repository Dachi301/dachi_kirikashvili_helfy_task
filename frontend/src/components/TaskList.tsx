import { useEffect, useRef, useCallback, useState } from 'react'
import type { Task } from '../services/taskService'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  search: string
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
  onReorder: (tasks: Task[]) => void
  onLoadMore: () => void
  hasMore: boolean
  loadingMore: boolean
}

function TaskList({ tasks, search, onToggle, onDelete, onEdit, onReorder, onLoadMore, hasMore, loadingMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)
  onLoadMoreRef.current = onLoadMore

  const hasMoreRef = useRef(hasMore)
  hasMoreRef.current = hasMore

  const loadingMoreRef = useRef(loadingMore)
  loadingMoreRef.current = loadingMore

  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const dragIdxRef = useRef<number | null>(null)
  const tasksRef = useRef(tasks)
  tasksRef.current = tasks
  const onReorderRef = useRef(onReorder)
  onReorderRef.current = onReorder
  const lastSwap = useRef(0)

  const isDragging = dragIdx !== null

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMoreRef.current && !loadingMoreRef.current) {
      onLoadMoreRef.current()
    }
  }, [])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
    })
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [handleIntersect])

  useEffect(() => {
    if (!isDragging) return

    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'

    const handleUp = () => {
      dragIdxRef.current = null
      setDragIdx(null)
    }

    document.addEventListener('mouseup', handleUp)
    return () => {
      document.removeEventListener('mouseup', handleUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  const handleGripMouseDown = useCallback((index: number) => {
    dragIdxRef.current = index
    setDragIdx(index)
  }, [])

  const handleItemMouseEnter = useCallback((index: number) => {
    const from = dragIdxRef.current
    if (from === null || from === index) return
    if (Date.now() - lastSwap.current < 80) return

    lastSwap.current = Date.now()
    const reordered = [...tasksRef.current]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(index, 0, moved)

    dragIdxRef.current = index
    setDragIdx(index)
    onReorderRef.current(reordered)
  }, [])

  if (tasks.length === 0) {
    return (
      <p className="empty-state">
        {search ? `No tasks matching "${search}"` : 'No tasks found.'}
      </p>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task: Task, index: number) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isDragging={dragIdx === index}
          onGripMouseDown={() => handleGripMouseDown(index)}
          onItemMouseEnter={() => handleItemMouseEnter(index)}
        />
      ))}

      <div ref={sentinelRef} className="scroll-sentinel" />

      {loadingMore && (
        <div className="loading-more">
          <div className="spinner" />
          <span>Loading more tasks...</span>
        </div>
      )}
    </div>
  )
}

export default TaskList
