import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Target, Brain, Calendar, TrendingUp, AlertTriangle, 
  Users, Lightbulb, BarChart3, PieChart, Activity, Sun, Coffee,
  CheckCircle, XCircle, Zap, Star, Bell, Play, Pause, RotateCcw
} from 'lucide-react';

const StudentDashboard = () => {
  const [viewMode, setViewMode] = useState('weekly');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app this would come from API
  const dashboardData = {
    overview: {
      subjectsCompleted: { current: 8, total: 10 },
      studyHours: { current: 24, goal: 30 },
      goalProgress: 78,
      wellnessScore: 85,
      upcomingDeadlines: 3
    },
    trendData: {
      weekly: [
        { day: 'Mon', hours: 4, completed: 85 },
        { day: 'Tue', hours: 3, completed: 70 },
        { day: 'Wed', hours: 5, completed: 90 },
        { day: 'Thu', hours: 2, completed: 60 },
        { day: 'Fri', hours: 6, completed: 95 },
        { day: 'Sat', hours: 3, completed: 75 },
        { day: 'Sun', hours: 1, completed: 40 }
      ]
    },
    subjects: [
      { name: 'DSA', progress: 85, color: 'bg-blue-500' },
      { name: 'DBMS', progress: 60, color: 'bg-green-500' },
      { name: 'OS', progress: 45, color: 'bg-purple-500' },
      { name: 'Networks', progress: 30, color: 'bg-orange-500' },
      { name: 'React', progress: 90, color: 'bg-cyan-500' }
    ],
    risks: [
      { type: 'inactivity', message: 'No study activity for 3 days', level: 'high' },
      { type: 'score', message: 'Math score dropped by 10%', level: 'medium' },
      { type: 'deadline', message: '2 assignments due tomorrow', level: 'high' },
      { type: 'burnout', message: 'High workload detected', level: 'medium' }
    ],
    recommendations: [
      { type: 'revise', message: 'Revise topic: OS Scheduling Algorithms', icon: RotateCcw },
      { type: 'quiz', message: 'Repeat DSA quiz — low accuracy', icon: Play },
      { type: 'video', message: 'Watch 10-min recap: React Hooks', icon: Play },
      { type: 'break', message: 'Take a 5-min break — focus dropped', icon: Pause }
    ],
    mood: [
      { day: 'Mon', mood: 8 },
      { day: 'Tue', mood: 6 },
      { day: 'Wed', mood: 9 },
      { day: 'Thu', mood: 5 },
      { day: 'Fri', mood: 7 },
      { day: 'Sat', mood: 8 },
      { day: 'Sun', mood: 6 }
    ]
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "bg-blue-500", trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={16} className={trend < 0 ? 'transform rotate-180' : ''} />
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const ProgressBar = ({ value, max, color = "bg-blue-500" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color} transition-all duration-500`}
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </div>
  );

  const RiskAlert = ({ risk }) => {
    const levelColors = {
      high: 'border-red-500 bg-red-50 text-red-800',
      medium: 'border-orange-500 bg-orange-50 text-orange-800',
      low: 'border-yellow-500 bg-yellow-50 text-yellow-800'
    };

    return (
      <div className={`p-3 rounded-lg border-l-4 ${levelColors[risk.level]} mb-3`}>
        <div className="flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <span className="text-sm font-medium">{risk.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Learning Dashboard</h1>
              <p className="text-gray-600">Welcome back! Here's your progress overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                {['daily', 'weekly', 'monthly'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === mode
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Subjects Completed"
            value={`${dashboardData.overview.subjectsCompleted.current}/${dashboardData.overview.subjectsCompleted.total}`}
            subtitle="modules"
            color="bg-green-500"
            trend={12}
          />
          <StatCard
            icon={Clock}
            title="Study Hours"
            value={`${dashboardData.overview.studyHours.current}h`}
            subtitle={`Goal: ${dashboardData.overview.studyHours.goal}h`}
            color="bg-blue-500"
            trend={8}
          />
          <StatCard
            icon={Target}
            title="Goal Progress"
            value={`${dashboardData.overview.goalProgress}%`}
            subtitle="on track"
            color="bg-purple-500"
            trend={5}
          />
          <StatCard
            icon={Brain}
            title="Wellness Score"
            value={dashboardData.overview.wellnessScore}
            subtitle="mental health"
            color="bg-pink-500"
            trend={-2}
          />
          <StatCard
            icon={Calendar}
            title="Deadlines"
            value={dashboardData.overview.upcomingDeadlines}
            subtitle="this week"
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Trends */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="mr-2 text-indigo-500" />
                Progress Trends
              </h2>
              <div className="space-y-6">
                {/* Study Hours Chart */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Weekly Study Hours</h3>
                  <div className="flex items-end space-x-2 h-32">
                    {dashboardData.trendData.weekly.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-indigo-500 rounded-t-md w-full transition-all duration-500 hover:bg-indigo-600"
                          style={{ height: `${(day.hours / 6) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">{day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Progress */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Subject Progress</h3>
                  <div className="space-y-3">
                    {dashboardData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 w-16">{subject.name}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${subject.color} transition-all duration-500`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{subject.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Study Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <PieChart className="mr-2 text-indigo-500" />
                Study Distribution & Focus Map
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subject Distribution */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Subject Time Distribution</h3>
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray="50, 100"
                          className="transition-all duration-1000"
                        />
                      </svg>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-blue-600 font-medium">DSA: 50%</span>
                    </div>
                  </div>
                </div>

                {/* Time Productivity Heatmap */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Best Focus Hours</h3>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded text-xs flex items-center justify-center text-white ${
                          i >= 9 && i <= 11 ? 'bg-green-500' : 
                          i >= 14 && i <= 16 ? 'bg-yellow-500' : 
                          'bg-gray-300'
                        }`}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Peak: 9-11 AM</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Lightbulb className="mr-2" />
                AI Insights & Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                    <div className="flex items-center mb-2">
                      <rec.icon size={16} className="mr-2" />
                      <span className="text-sm font-medium">{rec.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Risk Alerts */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="mr-2 text-red-500" />
                Risk Alerts
              </h2>
              <div className="space-y-3">
                {dashboardData.risks.map((risk, index) => (
                  <RiskAlert key={index} risk={risk} />
                ))}
              </div>
            </div>

            {/* Wellness Tracker */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="mr-2 text-pink-500" />
                Wellness & Mood
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Daily Mood</h3>
                  <div className="flex items-end space-x-1 h-16">
                    {dashboardData.mood.map((day, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="bg-pink-400 rounded-t w-full"
                          style={{ height: `${(day.mood / 10) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{day.day.slice(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Coffee className="mx-auto mb-1 text-blue-500" size={20} />
                    <p className="text-xs text-gray-600">8 hrs sleep</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Sun className="mx-auto mb-1 text-green-500" size={20} />
                    <p className="text-xs text-gray-600">5 meditation</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Star className="mx-auto mb-1 text-purple-500" size={20} />
                    <p className="text-xs text-gray-600">Good mood</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar & Tasks */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Calendar className="mr-2 text-green-500" />
                Today's Plan
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={16} />
                    <span className="text-sm">Complete DSA Assignment</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="text-gray-400 mr-2" size={16} />
                    <span className="text-sm">Review OS Concepts</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="text-red-500 mr-2" size={16} />
                    <span className="text-sm">Submit Database Project</span>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Due Today</span>
                </div>
              </div>
            </div>

            {/* Peer Collaboration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="mr-2 text-cyan-500" />
                Collaboration
              </h2>
              <div className="space-y-3">
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <p className="text-2xl font-bold text-cyan-600">4</p>
                  <p className="text-sm text-gray-600">Peers helped this week</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <p className="text-2xl font-bold text-indigo-600">85%</p>
                  <p className="text-sm text-gray-600">Group project progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Dashboard last updated: {currentTime.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;