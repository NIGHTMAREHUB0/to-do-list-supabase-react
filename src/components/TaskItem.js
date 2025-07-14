import React from 'react'

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  return (
    <div
      className={`flex items-center justify-between p-3 mb-2 rounded border ${
        task.is_complete ? 'bg-gray-200 line-through text-gray-500' : 'bg-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.is_complete}
          onChange={() => onToggleComplete(task)}
          className="w-5 h-5"
        />
        <span>{task.title}</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:text-blue-800"
          aria-label="Edit task"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          onClick={() => onDelete(task)}
          className="text-red-600 hover:text-red-800"
          aria-label="Delete task"
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  )
}
