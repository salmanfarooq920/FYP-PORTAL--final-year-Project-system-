import { useState } from 'react';
import { DUMMY_GROUP } from '../../utils/constants';

const initialTasks = {
  todo: [
    { id: 't1', title: 'Implement RBAC rules', description: 'Set up role-based access control for the system.', assignee: 'Zara Rashid', deadline: '2024-03-01', priority: 'high' },
    { id: 't2', title: 'Add Popups', description: 'Implement modal dialogs for user actions.', assignee: 'Ali Hassan', deadline: '2024-03-05', priority: 'medium' },
    { id: 't3', title: 'BRD document', description: 'Complete business requirements document.', assignee: null, deadline: null, priority: 'low' },
    { id: 't4', title: 'API Integration', description: 'Connect frontend with backend APIs.', assignee: null, deadline: null, priority: 'high' },
  ],
  inProgress: [
    { id: 't5', title: 'Make Figma Design', description: 'Create UI/UX designs in Figma.', assignee: 'Sara Ahmed', deadline: '2024-03-10', priority: 'high' },
    { id: 't6', title: 'Create an SRS doc', description: 'Software requirements specification.', assignee: 'Zara Rashid', deadline: null, priority: 'medium' },
  ],
  done: [
    { id: 't8', title: 'Make Proposal Draft', description: 'Initial project proposal completed.', assignee: 'Zara Rashid', deadline: '2024-02-20', priority: 'high' },
    { id: 't9', title: 'Team Formation', description: 'Assembled the FYP team.', assignee: 'You', deadline: '2024-02-15', priority: 'medium' },
  ],
};

const columnConfig = {
  todo: { title: 'To Do', color: 'from-[#1F2E5A] to-[#2E3A6B]', bg: 'bg-[#1F2E5A]/5', border: 'border-[#1F2E5A]/20', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  inProgress: { title: 'In Progress', color: 'from-[#F4B400] to-[#E6A700]', bg: 'bg-[#F4B400]/10', border: 'border-[#F4B400]/30', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  done: { title: 'Completed', color: 'from-[#1F2E5A] to-[#334155]', bg: 'bg-[#1F2E5A]/10', border: 'border-[#1F2E5A]/20', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
};

const priorityColors = {
  high: 'bg-[#F4B400]/20 text-[#B38600] border-[#F4B400]/30',
  medium: 'bg-[#1F2E5A]/10 text-[#1F2E5A] border-[#1F2E5A]/20',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const TEAM_OPTIONS = (DUMMY_GROUP.members || []).map((m) => ({ id: m.id, name: m.name }));

export default function StudentKanban() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addToColumn, setAddToColumn] = useState('todo');
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', deadline: '', priority: 'medium' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragStart = (task, column) => {
    setDraggedTask(task);
    setDraggedFrom(column);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumn) => {
    if (!draggedTask || draggedFrom === targetColumn) return;
    setTasks((prev) => ({
      ...prev,
      [draggedFrom]: prev[draggedFrom].filter((t) => t.id !== draggedTask.id),
      [targetColumn]: [...prev[targetColumn], draggedTask],
    }));
    setDraggedTask(null);
    setDraggedFrom(null);
  };

  const openAddTask = (colId) => {
    setAddToColumn(colId);
    setNewTask({ title: '', description: '', assignee: '', deadline: '', priority: 'medium' });
    setShowAddModal(true);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const assigneeName = newTask.assignee ? (TEAM_OPTIONS.find((o) => o.id === newTask.assignee)?.name || null) : null;
    const task = {
      id: 't' + Date.now(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || '',
      assignee: assigneeName,
      deadline: newTask.deadline || null,
      priority: newTask.priority,
    };
    setTasks((prev) => ({ ...prev, [addToColumn]: [...(prev[addToColumn] || []), task] }));
    setShowAddModal(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filterTasks = (taskList) => {
    if (!searchQuery) return taskList;
    return taskList.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const columns = ['todo', 'inProgress', 'done'];
  const todoCount = (tasks.todo || []).length;
  const inProgressCount = (tasks.inProgress || []).length;
  const doneCount = (tasks.done || []).length;
  const totalCount = todoCount + inProgressCount + doneCount;
  const completionPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1F2E5A] via-[#F4B400] to-[#1F2E5A]"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2E5A]">Task Board</h1>
              <p className="text-sm text-[#1F2E5A]/60">Drag tasks between columns to update status</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-[#1F2E5A] focus:ring-2 focus:ring-[#1F2E5A]/20 transition w-48"
              />
            </div>
            <button 
              onClick={() => openAddTask('todo')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F4B400] text-white text-sm font-medium hover:bg-[#E6A700] transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#1F2E5A]">Project Progress</span>
              <span className="text-sm font-bold text-[#F4B400]">{completionPct}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#1F2E5A] to-[#F4B400] rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center px-3 py-1 rounded-lg bg-[#1F2E5A]/10 border border-[#1F2E5A]/20">
              <span className="block font-bold text-[#1F2E5A]">{todoCount}</span>
              <span className="text-xs text-[#1F2E5A]/70">To Do</span>
            </div>
            <div className="text-center px-3 py-1 rounded-lg bg-[#F4B400]/10 border border-[#F4B400]/30">
              <span className="block font-bold text-[#F4B400]">{inProgressCount}</span>
              <span className="text-xs text-[#D99C00]">In Progress</span>
            </div>
            <div className="text-center px-3 py-1 rounded-lg bg-[#1F2E5A]/10 border border-[#1F2E5A]/20">
              <span className="block font-bold text-[#1F2E5A]">{doneCount}</span>
              <span className="text-xs text-[#1F2E5A]/70">Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((colId) => {
            const config = columnConfig[colId];
            const list = filterTasks(tasks[colId] || []);
            const originalCount = (tasks[colId] || []).length;
            return (
              <div
                key={colId}
                className={`rounded-2xl flex flex-col border-2 ${config.border} ${config.bg} min-h-[500px]`}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(colId)}
              >
                {/* Column Header */}
                <div className="px-5 py-4 border-b border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1F2E5A]">{config.title}</h3>
                        <p className="text-xs text-[#1F2E5A]/60">{originalCount} tasks</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAddTask(colId)}
                      className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-[#F4B400] transition shadow-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {list.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task, colId)}
                      className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-[#F4B400]/50 transition-all cursor-grab active:cursor-grabbing group"
                    >
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityColors[task.priority] || priorityColors.medium}`}>
                          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                        </span>
                        <button type="button" className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 text-slate-400 transition">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-[#1F2E5A] mb-2">{task.title}</h4>
                      
                      {/* Description */}
                      {task.description && (
                        <p className="text-sm text-[#1F2E5A]/60 line-clamp-2 mb-3">{task.description}</p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center text-white text-xs font-bold">
                                {getInitials(task.assignee)}
                              </div>
                              <span className="text-xs text-[#1F2E5A]/80">{task.assignee}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-[#1F2E5A]/40 italic">Unassigned</span>
                          )}
                        </div>
                        {task.deadline && (
                          <div className="flex items-center gap-1 text-xs text-[#1F2E5A]/60">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {list.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#1F2E5A]/50">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F2E5A]">Create New Task</h2>
                <p className="text-sm text-[#1F2E5A]/60">Add to {columnConfig[addToColumn].title}</p>
              </div>
            </div>
            
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Task Title *</label>
                <input 
                  type="text" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F2E5A] focus:ring-2 focus:ring-[#1F2E5A]/20 transition"
                  placeholder="Enter task title"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Description</label>
                <textarea 
                  value={newTask.description} 
                  onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition resize-none"
                  placeholder="Add task details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask((t) => ({ ...t, priority: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F2E5A] focus:ring-2 focus:ring-[#1F2E5A]/20 transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Deadline</label>
                  <input 
                    type="date" 
                    value={newTask.deadline}
                    onChange={(e) => setNewTask((t) => ({ ...t, deadline: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F2E5A] focus:ring-2 focus:ring-[#1F2E5A]/20 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Assign To</label>
                <select 
                  value={newTask.assignee}
                  onChange={(e) => setNewTask((t) => ({ ...t, assignee: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1F2E5A] focus:ring-2 focus:ring-[#1F2E5A]/20 transition"
                >
                  <option value="">— Unassigned —</option>
                  {TEAM_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-[#1F2E5A] font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4B400] text-white font-medium hover:bg-[#E6A700] transition-colors shadow-lg"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
