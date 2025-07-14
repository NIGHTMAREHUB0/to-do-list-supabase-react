import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import TaskList from '../components/TaskList'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function Dashboard({ session }) {
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [sortOption, setSortOption] = useState('created_at')

  const userId = session.user.id

  useEffect(() => {
    fetchTasks()
    const subscription = supabase
      .channel('public:tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${userId}` },
        (payload) => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [userId, sortOption])

  async function fetchTasks() {
    setLoading(true)
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
    if (sortOption === 'due_date') {
      query = query.order('due_date', { ascending: true })
    } else if (sortOption === 'priority') {
      query = query.order('priority', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: true })
    }
    const { data, error } = await query
    setLoading(false)
    if (error) {
      alert('Error loading tasks: ' + error.message)
    } else {
      setTasks(data)
    }
  }

  async function addTask() {
    if (!newTaskTitle.trim()) return
    setLoading(true)
    const { data, error } = await supabase.from('tasks').insert([
      {
        user_id: userId,
        title: newTaskTitle,
        due_date: newTaskDueDate || null,
        is_complete: false,
        priority: 0,
      },
    ])
    setLoading(false)
    if (error) {
      alert('Error adding task: ' + error.message)
    } else {
      setNewTaskTitle('')
      setNewTaskDueDate('')
      fetchTasks()
    }
  }

  async function toggleComplete(task) {
    const { error } = await supabase
      .from('tasks')
      .update({ is_complete: !task.is_complete })
      .eq('id', task.id)
    if (error) {
      alert('Error updating task: ' + error.message)
    } else {
      fetchTasks()
    }
  }

  async function deleteTask(task) {
    const { error } = await supabase.from('tasks').delete().eq('id', task.id)
    if (error) {
      alert('Error deleting task: ' + error.message)
    } else {
      fetchTasks()
    }
  }

  function startEdit(task) {
    setEditingTask(task)
    setNewTaskTitle(task.title)
    setNewTaskDueDate(task.due_date ? task.due_date.split('T')[0] : '')
  }

  async function saveEdit() {
    if (!newTaskTitle.trim()) return
    setLoading(true)
    const { error } = await supabase
      .from('tasks')
      .update({ title: newTaskTitle, due_date: newTaskDueDate || null })
      .eq('id', editingTask.id)
    setLoading(false)
    if (error) {
      alert('Error updating task: ' + error.message)
    } else {
      setEditingTask(null)
      setNewTaskTitle('')
      setNewTaskDueDate('')
      fetchTasks()
    }
  }

  function cancelEdit() {
    setEditingTask(null)
    setNewTaskTitle('')
    setNewTaskDueDate('')
  }

  function onDragEnd(result) {
    if (!result.destination) return
    const reorderedTasks = Array.from(tasks)
    const [removed] = reorderedTasks.splice(result.source.index, 1)
    reorderedTasks.splice(result.destination.index, 0, removed)

    setTasks(reorderedTasks)
    // Update priority in DB based on new order
    reorderedTasks.forEach(async (task, index) => {
      await supabase.from('tasks').update({ priority: index }).eq('id', task.id)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My To-Do List</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:space-x-4">
        <input
          type="text"
          placeholder="New task title"
          className="flex-grow p-2 border border-gray-300 rounded mb-2 sm:mb-0"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 rounded mb-2 sm:mb-0"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
        />
        {editingTask ? (
          <>
            <button
              onClick={saveEdit}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition mr-2"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              disabled={loading}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={addTask}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        )}
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <label htmlFor="sort" className="font-semibold">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="created_at">Created Date</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskList
                          tasks={[task]}
                          onToggleComplete={toggleComplete}
                          onEdit={startEdit}
                          onDelete={deleteTask}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}
