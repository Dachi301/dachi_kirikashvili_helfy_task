import type { Task } from '../services/taskService'
import TaskItem from './TaskItem'

interface Props {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (task: Task) => void
}

function TaskList({ tasks, onToggle, onDelete, onEdit }: Props) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found.</p>
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
    </div>
  )
}

export default TaskList
