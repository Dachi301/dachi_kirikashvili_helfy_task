import { useState, useEffect, useRef } from 'react'

import type { Task, TaskData } from '../services/taskService'

interface Props {
  onSubmit: (taskData: TaskData) => void
  editingTask: Task | null
  onCancelEdit: () => void
}

function TaskForm({ onSubmit, editingTask, onCancelEdit }: Props) {
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState<string>('')
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title)
      setDescription(editingTask.description)
      setPriority(editingTask.priority)
      setDueDate(editingTask.dueDate || '')
    }
  }, [editingTask])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const taskData: TaskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      ...(dueDate && { dueDate }),
    }

    onSubmit(taskData)
    resetForm()
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setError('')
  }

  const handleCancel = () => {
    resetForm()
    onCancelEdit()
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-field">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          placeholder="Optional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-due-date">Due date</label>
          <input
            id="task-due-date"
            ref={dateInputRef}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onClick={() => dateInputRef.current?.showPicker()}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
