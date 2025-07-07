// 📁 src/pages/home_dashboard.jsx
import React, { useState, useEffect } from 'react';
import GoalsDashboard from './goals_dashboard';
import TimetableDashboard from './timetable_dashboard';
import WellnessDashboard from './wellness_dashboard';
import ResourceDashboard from './resource_dashboard';
import GoalAIDashboard from './goal_ai_dashboard';
import StudentDashboard from './student_dashboard';

import { 
  Calendar, 
  Target, 
  Heart, 
  BookOpen, 
  Users, 
  Home,
  Bell,
  Settings,
} from 'lucide-react';

const GoalSyncDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState('home');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const Sidebar = () => (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-purple-900 text-white p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
          <Target className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold">GoalSync</h1>
      </div>
      <nav className="space-y-2">
        {[{ id: 'dashboard', icon: Home, label: 'Dashboard' }, { id: 'goals', icon: Target, label: 'Goals' }, { id: 'timetable', icon: Calendar, label: 'Smart Timetable' }, { id: 'wellness', icon: Heart, label: 'Wellness' }, { id: 'resources', icon: BookOpen, label: 'Resources' }, { id: 'goalai', icon: Users, label: 'Goal.AI' }].map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedTab(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${selectedTab === item.id ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const Header = () => (
    <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, Thiya! 👋
        </h2>
        <p className="text-gray-600">Ready to crush your goals today?</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="font-mono text-lg">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <div className="p-6 text-gray-700 text-lg">Dashboard content will go here.</div>;
      case 'goals':
        return <GoalsDashboard />;
      case 'timetable':
        return <TimetableDashboard />;
      case 'wellness':
        return <WellnessDashboard />;
      case 'resources':
        return <ResourceDashboard />;
      case 'goalai':
        return <GoalAIDashboard />;
      case 'dashboard':
        return <StudentDashboard />;
      default:
        return <div className="p-6 text-gray-700 text-lg">This section is under construction.</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default GoalSyncDashboard;
