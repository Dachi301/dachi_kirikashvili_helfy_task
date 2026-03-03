import type { Task } from '../services/taskService'

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
}

function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
  const handleDelete = (): void => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
    }
  }

  const priorityClass = `priority-${task.priority}`

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
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
    </div>
  )
}

export default TaskItem
