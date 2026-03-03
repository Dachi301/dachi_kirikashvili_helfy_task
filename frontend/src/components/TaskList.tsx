import { useEffect, useRef, useCallback } from 'react'
import type { Task } from '../services/taskService'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  search: string
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
  onLoadMore: () => void
  hasMore: boolean
  loadingMore: boolean
}

function TaskList({ tasks, search, onToggle, onDelete, onEdit, onLoadMore, hasMore, loadingMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const onLoadMoreRef = useRef(onLoadMore)
  onLoadMoreRef.current = onLoadMore

  const hasMoreRef = useRef(hasMore)
  hasMoreRef.current = hasMore

  const loadingMoreRef = useRef(loadingMore)
  loadingMoreRef.current = loadingMore

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

  if (tasks.length === 0) {
    return (
      <p className="empty-state">
        {search ? `No tasks matching "${search}"` : 'No tasks found.'}
      </p>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task: Task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
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
