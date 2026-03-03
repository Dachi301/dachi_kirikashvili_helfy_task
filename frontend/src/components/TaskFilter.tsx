interface Props {
  currentFilter: string
  onFilterChange: (filter: string) => void
}

function TaskFilter({ currentFilter, onFilterChange }: Props) {
  
  const filters: string[] = ['all', 'completed', 'pending']

  return (
    <div className="task-filter">
      {filters.map((filter: string) => (
        <button
          key={filter}
          className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default TaskFilter
