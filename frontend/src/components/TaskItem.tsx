import { useState } from 'react'
import type { Task } from '../services/taskService'
import ConfirmModal from './ConfirmModal'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
}

function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = (): void => {
    setShowConfirm(true)
  }

  const handleConfirmDelete = (): void => {
    setShowConfirm(false)
    onDelete(task.id)
  }

  const priorityClass = `priority-${task.priority}`

  return (
    <div className={`task-item priority-${task.priority}-item ${task.completed ? 'completed' : ''} task-enter`}>
      <div className="task-header">
        <span className={`priority-badge ${priorityClass}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="due-date">Due: {task.dueDate}</span>
        )}
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-actions">
        <button
          className={`btn-toggle ${task.completed ? 'done' : ''}`}
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete task?"
          message={`"${task.title}" will be permanently removed.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}

export default TaskItem
