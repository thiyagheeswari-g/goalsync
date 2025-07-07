import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  SortAsc, 
  Target, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  CheckCircle,
  Circle,
  X,
  Save,
  AlertCircle
} from 'lucide-react';

const GoalsDashboard = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Finish Unit 3 - DBMS",
      type: "study",
      priority: "high",
      deadline: "2025-07-10",
      progress: 65,
      description: "Complete database normalization and SQL queries",
      completed: false,
      category: "individual"
    },
    {
      id: 2,
      title: "Machine Learning Group Project",
      type: "discussion",
      priority: "high",
      deadline: "2025-07-15",
      progress: 40,
      description: "Collaborate on ML model implementation",
      completed: false,
      category: "group"
    },
    {
      id: 3,
      title: "Data Structures Revision",
      type: "revision",
      priority: "medium",
      deadline: "2025-07-08",
      progress: 80,
      description: "Review trees, graphs, and dynamic programming",
      completed: false,
      category: "individual"
    },
    {
      id: 4,
      title: "Operating Systems Exam Prep",
      type: "exams",
      priority: "high",
      deadline: "2025-07-05",
      progress: 90,
      description: "Final preparation for OS midterm",
      completed: false,
      category: "individual"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'study',
    priority: 'medium',
    deadline: '',
    description: '',
    category: 'individual'
  });

  const goalTypes = {
    study: { color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700', icon: '📚' },
    revision: { color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', icon: '📝' },
    discussion: { color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700', icon: '💬' },
    exams: { color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700', icon: '📋' }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const filteredAndSortedGoals = goals
    .filter(goal => {
      if (filter === 'all') return true;
      if (filter === 'individual' || filter === 'group') return goal.category === filter;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'completion') return b.progress - a.progress;
      return 0;
    });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.deadline) return;
    
    const goal = {
      ...newGoal,
      id: Date.now(),
      progress: 0,
      completed: false
    };
    
    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      type: 'study',
      priority: 'medium',
      deadline: '',
      description: '',
      category: 'individual'
    });
    setShowModal(false);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({ ...goal });
    setShowModal(true);
  };

  const handleUpdateGoal = () => {
    if (!newGoal.title || !newGoal.deadline) return;
    
    setGoals(goals.map(goal => 
      goal.id === editingGoal.id ? { ...newGoal } : goal
    ));
    setEditingGoal(null);
    setNewGoal({
      title: '',
      type: 'study',
      priority: 'medium',
      deadline: '',
      description: '',
      category: 'individual'
    });
    setShowModal(false);
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const toggleGoalCompletion = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 }
        : goal
    ));
  };

  const updateProgress = (id, progress) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, progress: Math.min(100, Math.max(0, progress)) } : goal
    ));
  };

  const GoalCard = ({ goal }) => {
    const [localProgress, setLocalProgress] = useState(goal.progress);
    const typeConfig = goalTypes[goal.type];
    const isOverdue = new Date(goal.deadline) < new Date() && !goal.completed;

    return (
      <div className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
        goal.completed ? 'border-green-200 bg-green-50' : 
        isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-100'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${typeConfig.color} flex items-center justify-center text-white text-lg`}>
              {typeConfig.icon}
            </div>
            <div>
              <h3 className={`font-semibold text-gray-800 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                {goal.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[goal.priority]}`}>
                  {goal.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.textColor}`}>
                  {goal.type}
                </span>
                {goal.category === 'group' && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Group
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => toggleGoalCompletion(goal.id)}
              className={`p-2 rounded-lg transition-colors ${
                goal.completed 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {goal.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleEditGoal(goal)}
              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteGoal(goal.id)}
              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(localProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                goal.completed ? 'bg-green-500' : 
                localProgress >= 80 ? 'bg-blue-500' :
                localProgress >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
              style={{ width: `${localProgress}%` }}
            />
          </div>
          {!goal.completed && (
            <input
              type="range"
              min="0"
              max="100"
              value={localProgress}
              onChange={(e) => setLocalProgress(parseInt(e.target.value))}
              onMouseUp={() => updateProgress(goal.id, localProgress)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          )}
        </div>

        {/* Deadline */}
        <div className={`flex items-center gap-2 text-sm ${
          isOverdue ? 'text-red-600' : 
          goal.completed ? 'text-green-600' : 'text-gray-600'
        }`}>
          {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          <span>{formatDate(goal.deadline)}</span>
          <span className="text-gray-400">•</span>
          <span>{new Date(goal.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              setEditingGoal(null);
              setNewGoal({
                title: '',
                type: 'study',
                priority: 'medium',
                deadline: '',
                description: '',
                category: 'individual'
              });
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter goal title..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newGoal.type}
                onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="study">Study</option>
                <option value="revision">Revision</option>
                <option value="discussion">Discussion</option>
                <option value="exams">Exams</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional description..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingGoal ? 'Update Goal' : 'Add Goal'}
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              setEditingGoal(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Goals Dashboard</h1>
              <p className="text-gray-600">Track, organize, and complete your academic goals easily</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Goal
              </button>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Goals</option>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="completion">Sort by Completion</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {filteredAndSortedGoals.length} goal{filteredAndSortedGoals.length !== 1 ? 's' : ''} • {filteredAndSortedGoals.filter(g => g.completed).length} completed
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {filteredAndSortedGoals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first academic goal to track your progress!</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && <Modal />}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default GoalsDashboard;