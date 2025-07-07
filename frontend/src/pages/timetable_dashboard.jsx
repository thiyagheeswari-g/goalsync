import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Zap, 
  Plus,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Brain,
  Coffee,
  BookOpen,
  Users,
  Target,
  Bell,
  Settings,
  Eye,
  Grid3X3,
  List
} from 'lucide-react';

const TimetableDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // day, week, month
  const [showSmartPanel, setShowSmartPanel] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sample schedule data
  const [schedule, setSchedule] = useState([
    {
      id: 1,
      title: "DBMS Study Session",
      type: "study",
      subject: "Database Systems",
      startTime: "09:00",
      endTime: "11:00",
      date: "2025-07-02",
      status: "scheduled",
      priority: "high",
      goalId: 1,
      description: "Focus on normalization and SQL queries"
    },
    {
      id: 2,
      title: "ML Group Discussion",
      type: "discussion",
      subject: "Machine Learning",
      startTime: "14:00",
      endTime: "16:00",
      date: "2025-07-02",
      status: "scheduled",
      priority: "high",
      goalId: 2,
      description: "Team collaboration on project"
    },
    {
      id: 3,
      title: "Wellness Break",
      type: "wellness",
      subject: "Self Care",
      startTime: "16:30",
      endTime: "17:00",
      date: "2025-07-02",
      status: "scheduled",
      priority: "medium",
      description: "Meditation and stretching"
    },
    {
      id: 4,
      title: "Data Structures Review",
      type: "revision",
      subject: "DSA",
      startTime: "10:00",
      endTime: "12:00",
      date: "2025-07-03",
      status: "scheduled",
      priority: "medium",
      goalId: 3,
      description: "Trees and graph algorithms"
    },
    {
      id: 5,
      title: "OS Exam Preparation",
      type: "exams",
      subject: "Operating Systems",
      startTime: "09:00",
      endTime: "11:30",
      date: "2025-07-04",
      status: "scheduled",
      priority: "high",
      goalId: 4,
      description: "Final revision before exam"
    }
  ]);

  // Sample goals for smart scheduling
  const goals = [
    { id: 1, title: "Finish Unit 3 - DBMS", priority: "high", deadline: "2025-07-10", progress: 65 },
    { id: 2, title: "ML Group Project", priority: "high", deadline: "2025-07-15", progress: 40 },
    { id: 3, title: "Data Structures Revision", priority: "medium", deadline: "2025-07-08", progress: 80 },
    { id: 4, title: "OS Exam Prep", priority: "high", deadline: "2025-07-05", progress: 90 }
  ];

  const taskTypes = {
    study: { 
      color: 'bg-blue-500', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700', 
      icon: BookOpen,
      emoji: '📚' 
    },
    revision: { 
      color: 'bg-yellow-500', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700', 
      icon: RotateCcw,
      emoji: '📝' 
    },
    discussion: { 
      color: 'bg-purple-500', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700', 
      icon: Users,
      emoji: '💬' 
    },
    exams: { 
      color: 'bg-red-500', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      textColor: 'text-red-700', 
      icon: Target,
      emoji: '📋' 
    },
    wellness: { 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      textColor: 'text-green-700', 
      icon: Coffee,
      emoji: '🧘' 
    }
  };

  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date);
    return schedule.filter(task => task.date === dateStr);
  };

  const getTasksForTimeSlot = (date, time) => {
    const tasks = getTasksForDate(date);
    return tasks.filter(task => {
      const taskStart = parseInt(task.startTime.split(':')[0]);
      const taskEnd = parseInt(task.endTime.split(':')[0]);
      const slotTime = parseInt(time.split(':')[0]);
      return slotTime >= taskStart && slotTime < taskEnd;
    });
  };

  const SmartSchedulerPanel = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          Smart Scheduler
        </h3>
        <button
          onClick={() => setShowSmartPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-6">
        {/* Auto-generate button */}
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3">
          <Zap className="w-5 h-5" />
          Auto-generate Schedule
        </button>

        {/* Pending Goals */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Pending Goals</h4>
          <div className="space-y-2">
            {goals.filter(goal => goal.progress < 100).map(goal => (
              <div 
                key={goal.id}
                draggable
                onDragStart={(e) => {
                  setDraggedTask({
                    type: 'goal',
                    data: goal,
                    taskType: 'study'
                  });
                }}
                className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 cursor-move hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{goal.title}</p>
                    <p className="text-xs text-gray-600">Priority: {goal.priority}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{goal.progress}%</p>
                    <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Suggestions</h4>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Optimal Study Time</p>
                  <p className="text-xs text-blue-600">Based on your energy levels, 9-11 AM is ideal for DBMS study</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Break Reminder</p>
                  <p className="text-xs text-yellow-600">Schedule 15-min breaks between study sessions</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-green-800 font-medium">Wellness Integration</p>
                  <p className="text-xs text-green-600">Add meditation after intensive study sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TaskCard = ({ task, isCompact = false }) => {
    const typeConfig = taskTypes[task.type];
    const Icon = typeConfig.icon;

    return (
      <div 
        className={`${typeConfig.bgColor} ${typeConfig.borderColor} border-l-4 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
          isCompact ? 'mb-1' : 'mb-2'
        }`}
        onClick={() => setSelectedTimeSlot(task)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${typeConfig.textColor}`} />
              <span className={`text-sm font-medium ${typeConfig.textColor}`}>
                {task.title}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-1">{task.subject}</p>
            <p className="text-xs text-gray-500">{task.startTime} - {task.endTime}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.priority === 'high' ? 'bg-red-100 text-red-700' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {task.priority}
            </span>
            <button className="p-1 hover:bg-gray-200 rounded">
              <MoreHorizontal className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const WeekView = () => {
    const weekDates = getWeekDates(currentDate);

    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 bg-gray-50 border-r">
            <span className="text-sm font-medium text-gray-600">Time</span>
          </div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-4 bg-gray-50 border-r last:border-r-0 text-center">
              <div className="text-sm font-medium text-gray-800">{weekDays[index]}</div>
              <div className={`text-lg font-semibold mt-1 ${
                formatDate(date) === formatDate(new Date()) 
                  ? 'text-blue-600 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto' 
                  : 'text-gray-600'
              }`}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="max-h-96 overflow-y-auto">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8 border-b last:border-b-0 min-h-[80px]">
              <div className="p-3 bg-gray-50 border-r flex items-start">
                <span className="text-sm font-medium text-gray-600">{time}</span>
              </div>
              {weekDates.map((date, dateIndex) => {
                const tasksInSlot = getTasksForTimeSlot(date, time);
                return (
                  <div 
                    key={dateIndex}
                    className="p-2 border-r last:border-r-0 hover:bg-gray-50 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedTask) {
                        // Handle task drop logic here
                        console.log('Dropped task:', draggedTask, 'at', formatDate(date), time);
                        setDraggedTask(null);
                      }
                    }}
                  >
                    {tasksInSlot.map(task => (
                      <TaskCard key={task.id} task={task} isCompact />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DayView = () => {
    const tasksForDay = getTasksForDate(currentDate);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.map((time, index) => {
                const tasksInSlot = getTasksForTimeSlot(currentDate, time);
                return (
                  <div key={index} className="flex border-b last:border-b-0 min-h-[80px]">
                    <div className="w-20 p-3 bg-gray-50 border-r flex items-start">
                      <span className="text-sm font-medium text-gray-600">{time}</span>
                    </div>
                    <div className="flex-1 p-3">
                      {tasksInSlot.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="text-sm font-medium">{tasksForDay.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Study Hours</span>
                <span className="text-sm font-medium">6.5 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Break Time</span>
                <span className="text-sm font-medium">1 hr</span>
              </div>
            </div>
          </div>

          {showSmartPanel && <SmartSchedulerPanel />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Smart Timetable</h1>
                <p className="text-gray-600">GoalSync schedule that adapts to your goals and well-being</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSmartPanel(!showSmartPanel)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Smart Scheduler
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() - (viewMode === 'day' ? 1 : 7));
                    setCurrentDate(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="text-center min-w-[200px]">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {viewMode === 'week' 
                      ? `${getWeekDates(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekDates(currentDate)[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    }
                  </h2>
                </div>
                
                <button 
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setDate(currentDate.getDate() + (viewMode === 'day' ? 1 : 7));
                    setCurrentDate(newDate);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'day' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Week
                </button>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Tasks</option>
                  <option value="study">Study</option>
                  <option value="revision">Revision</option>
                  <option value="discussion">Discussion</option>
                  <option value="exams">Exams</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Views */}
        {viewMode === 'week' ? <WeekView /> : <DayView />}

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border">
          <h3 className="font-medium text-gray-800 mb-3">Task Types</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(taskTypes).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${config.color}`}></div>
                  <Icon className={`w-4 h-4 ${config.textColor}`} />
                  <span className="text-sm text-gray-600 capitalize">{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableDashboard;