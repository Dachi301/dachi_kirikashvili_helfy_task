import type { Task } from "../services/taskService"

export function getSavedOrder(ORDER_KEY: string): number[] {
    try {
      const raw = localStorage.getItem(ORDER_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
}
  
export function applyOrder(tasks: Task[], order: number[]): Task[] {
    if (!order.length) return tasks
    const map = new Map(tasks.map(t => [t.id, t]))
    const ordered: Task[] = []
    for (const id of order) {
      const task = map.get(id)
      if (task) {
        ordered.push(task)
        map.delete(id)
      }
    }
    for (const task of map.values()) {
      ordered.push(task)
    }
    return ordered
}