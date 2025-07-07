import React, { useState, useEffect } from 'react';
import { Heart, Brain, CheckCircle, TrendingUp, Zap, Clock, Users, Target, Calendar, Moon, Sun, Activity, Smile, Frown, Meh, AlertCircle, Award, BookOpen, Coffee, Headphones } from 'lucide-react';

const WellnessDashboard = () => {
  const [wellnessData, setWellnessData] = useState({
    mood: 7,
    energy: 6,
    stress: 4,
    sleep: 8,
    notes: '',
    waterIntake: 6,
    exerciseMinutes: 30,
    screenTime: 4
  });

  const [wellnessHistory, setWellnessHistory] = useState([
    { date: '2025-06-26', mood: 8, energy: 7, stress: 3, sleep: 9, waterIntake: 8, exerciseMinutes: 45, screenTime: 3 },
    { date: '2025-06-27', mood: 6, energy: 5, stress: 6, sleep: 7, waterIntake: 5, exerciseMinutes: 20, screenTime: 6 },
    { date: '2025-06-28', mood: 7, energy: 8, stress: 4, sleep: 8, waterIntake: 7, exerciseMinutes: 60, screenTime: 4 },
    { date: '2025-06-29', mood: 9, energy: 9, stress: 2, sleep: 9, waterIntake: 9, exerciseMinutes: 40, screenTime: 2 },
    { date: '2025-06-30', mood: 5, energy: 4, stress: 7, sleep: 6, waterIntake: 4, exerciseMinutes: 15, screenTime: 8 },
    { date: '2025-07-01', mood: 8, energy: 7, stress: 3, sleep: 8, waterIntake: 6, exerciseMinutes: 35, screenTime: 5 },
    { date: '2025-07-02', mood: 7, energy: 6, stress: 4, sleep: 8, waterIntake: 6, exerciseMinutes: 30, screenTime: 4 }
  ]);

  const [goals, setGoals] = useState([
    { id: 1, title: 'Meditate Daily', type: 'wellness', completed: 5, target: 7, streak: 3 },
    { id: 2, title: 'Exercise 30min', type: 'fitness', completed: 4, target: 7, streak: 2 },
    { id: 3, title: 'Sleep 8+ hours', type: 'sleep', completed: 6, target: 7, streak: 4 },
    { id: 4, title: 'Drink 8 glasses water', type: 'nutrition', completed: 3, target: 7, streak: 1 }
  ]);

  const [activeTab, setActiveTab] = useState('checkin');
  const [showTips, setShowTips] = useState(true);

  // Get current time for dynamic greetings
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleWellnessSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { date: today, ...wellnessData };
    setWellnessHistory(prev => [...prev.filter(entry => entry.date !== today), newEntry]);
    
    // Simulate streak update
    setGoals(prev => prev.map(goal => ({
      ...goal,
      completed: goal.completed + (Math.random() > 0.5 ? 1 : 0),
      streak: goal.streak + (Math.random() > 0.3 ? 1 : 0)
    })));
    
    alert('Wellness check-in saved! 🌟');
  };

  const getWellnessScore = () => {
    return Math.round((wellnessData.mood + wellnessData.energy + (10-wellnessData.stress) + wellnessData.sleep) / 4);
  };

  const getWellnessInsight = () => {
    const recent = wellnessHistory.slice(-3);
    const avgMood = recent.reduce((sum, day) => sum + day.mood, 0) / recent.length;
    const avgStress = recent.reduce((sum, day) => sum + day.stress, 0) / recent.length;
    const avgSleep = recent.reduce((sum, day) => sum + day.sleep, 0) / recent.length;
    
    if (avgMood >= 8 && avgStress <= 3) return { 
      text: "You're thriving! Your mood is excellent and stress is low. Keep up the amazing work! 🌟", 
      color: "text-green-600", 
      icon: <Smile className="w-5 h-5" />,
      type: "excellent"
    };
    if (avgStress >= 7) return { 
      text: "High stress detected over recent days. Consider taking breaks, practicing mindfulness, or talking to someone. 🧘‍♀️", 
      color: "text-red-600", 
      icon: <AlertCircle className="w-5 h-5" />,
      type: "concerning"
    };
    if (avgMood <= 4) return { 
      text: "Your mood has been low lately. Remember it's okay to have tough days. Reach out for support if needed. 💚", 
      color: "text-blue-600", 
      icon: <Frown className="w-5 h-5" />,
      type: "support"
    };
    if (avgSleep <= 6) return { 
      text: "Your sleep quality could use improvement. Try establishing a bedtime routine and limiting screen time before bed. 🌙", 
      color: "text-purple-600", 
      icon: <Moon className="w-5 h-5" />,
      type: "sleep"
    };
    return { 
      text: "You're maintaining good balance! Stay consistent with your wellness routine and keep monitoring your progress. ⚖️", 
      color: "text-indigo-600", 
      icon: <Meh className="w-5 h-5" />,
      type: "balanced"
    };
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 9) return "😄";
    if (mood >= 7) return "😊";
    if (mood >= 5) return "😐";
    if (mood >= 3) return "😕";
    return "😢";
  };

  const getStressColor = (stress) => {
    if (stress <= 3) return "text-green-600";
    if (stress <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateWeeklyAverage = (metric) => {
    const sum = wellnessHistory.reduce((acc, day) => acc + day[metric], 0);
    return (sum / wellnessHistory.length).toFixed(1);
  };

  const renderCheckinTab = () => {
    const insight = getWellnessInsight();
    
    return (
      <div className="space-y-6">
        {/* Header with Wellness Score */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{getGreeting()}! 👋</h2>
              <p className="text-indigo-100 mt-1">How are you feeling today?</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{getWellnessScore()}</div>
              <div className="text-sm text-indigo-100">Wellness Score</div>
            </div>
          </div>
        </div>

        {/*Insight Card */}
        <div className={`bg-gradient-to-r ${insight.type === 'excellent' ? 'from-green-50 to-emerald-50 border-green-200' : 
                                              insight.type === 'concerning' ? 'from-red-50 to-pink-50 border-red-200' : 
                                              insight.type === 'support' ? 'from-blue-50 to-cyan-50 border-blue-200' : 
                                              'from-purple-50 to-indigo-50 border-purple-200'} p-6 rounded-xl border`}>
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-lg ${insight.type === 'excellent' ? 'bg-green-100' : 
                                               insight.type === 'concerning' ? 'bg-red-100' : 
                                               insight.type === 'support' ? 'bg-blue-100' : 
                                               'bg-purple-100'}`}>
              <Brain className="w-6 h-6 text-current" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-800">GoalSync Insight</h3>
                {insight.icon}
              </div>
              <p className={`${insight.color} font-medium`}>{insight.text}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Check-in Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Daily Check-in
            </h3>
            
            <div className="space-y-6">
              {/* Mood */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Mood</label>
                  <span className="text-2xl">{getMoodEmoji(wellnessData.mood)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wellnessData.mood}
                  onChange={(e) => setWellnessData(prev => ({...prev, mood: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Terrible</span>
                  <span className="font-medium">{wellnessData.mood}/10</span>
                  <span>10 - Amazing</span>
                </div>
              </div>

              {/* Energy */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Energy Level</label>
                  <Zap className={`w-5 h-5 ${wellnessData.energy >= 7 ? 'text-yellow-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wellnessData.energy}
                  onChange={(e) => setWellnessData(prev => ({...prev, energy: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 via-orange-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Exhausted</span>
                  <span className="font-medium">{wellnessData.energy}/10</span>
                  <span>10 - Energized</span>
                </div>
              </div>

              {/* Stress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Stress Level</label>
                  <AlertCircle className={`w-5 h-5 ${getStressColor(wellnessData.stress).replace('text-', '')}`} />
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wellnessData.stress}
                  onChange={(e) => setWellnessData(prev => ({...prev, stress: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Very Calm</span>
                  <span className={`font-medium ${getStressColor(wellnessData.stress)}`}>{wellnessData.stress}/10</span>
                  <span>10 - Very Stressed</span>
                </div>
              </div>

              {/* Sleep */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Sleep Quality</label>
                  <Moon className={`w-5 h-5 ${wellnessData.sleep >= 7 ? 'text-indigo-500' : 'text-gray-400'}`} />
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wellnessData.sleep}
                  onChange={(e) => setWellnessData(prev => ({...prev, sleep: parseInt(e.target.value)}))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 via-blue-200 to-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Terrible</span>
                  <span className="font-medium">{wellnessData.sleep}/10</span>
                  <span>10 - Excellent</span>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Water Intake (glasses)</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={wellnessData.waterIntake}
                    onChange={(e) => setWellnessData(prev => ({...prev, waterIntake: parseInt(e.target.value) || 0}))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Exercise (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={wellnessData.exerciseMinutes}
                    onChange={(e) => setWellnessData(prev => ({...prev, exerciseMinutes: parseInt(e.target.value) || 0}))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Reflection</label>
                <textarea
                  value={wellnessData.notes}
                  onChange={(e) => setWellnessData(prev => ({...prev, notes: e.target.value}))}
                  placeholder="How was your day? Any thoughts, feelings, or things you're grateful for?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              <button 
                onClick={handleWellnessSubmit}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                Save Today's Check-in ✨
              </button>
            </div>
          </div>

          {/* Wellness Goals */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Wellness Goals
            </h3>
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{goal.title}</h4>
                    <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      {goal.streak} day streak 🔥
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                        style={{width: `${(goal.completed / goal.target) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{goal.completed}/{goal.target}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{getCurrentTime()}</div>
                <div className="text-sm text-gray-600">Current Time</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{Math.max(...goals.map(g => g.streak))}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrendsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Wellness Trends</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Last 7 days</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <Smile className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{calculateWeeklyAverage('mood')}</div>
                <div className="text-sm text-gray-600">Avg Mood</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{calculateWeeklyAverage('energy')}</div>
                <div className="text-sm text-gray-600">Avg Energy</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{calculateWeeklyAverage('stress')}</div>
                <div className="text-sm text-gray-600">Avg Stress</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3">
              <Moon className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{calculateWeeklyAverage('sleep')}</div>
                <div className="text-sm text-gray-600">Avg Sleep</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood & Energy Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Mood & Energy Trends</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Daily Mood</span>
                  <Smile className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {wellnessHistory.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-400 rounded-t w-full transition-all hover:bg-blue-500 cursor-pointer"
                        style={{height: `${(day.mood / 10) * 100}%`}}
                        title={`${day.date}: ${day.mood}/10`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{day.date.split('-')[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Energy Levels</span>
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {wellnessHistory.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-green-400 rounded-t w-full transition-all hover:bg-green-500 cursor-pointer"
                        style={{height: `${(day.energy / 10) * 100}%`}}
                        title={`${day.date}: ${day.energy}/10`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{day.date.split('-')[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stress & Sleep Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Stress & Sleep Quality</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Stress Levels</span>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {wellnessHistory.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-red-400 rounded-t w-full transition-all hover:bg-red-500 cursor-pointer"
                        style={{height: `${(day.stress / 10) * 100}%`}}
                        title={`${day.date}: ${day.stress}/10`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{day.date.split('-')[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Sleep Quality</span>
                  <Moon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-end space-x-1 h-20">
                  {wellnessHistory.map((day, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-purple-400 rounded-t w-full transition-all hover:bg-purple-500 cursor-pointer"
                        style={{height: `${(day.sleep / 10) * 100}%`}}
                        title={`${day.date}: ${day.sleep}/10`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{day.date.split('-')[2]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lifestyle Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Lifestyle Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Water Intake */}
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-600">{calculateWeeklyAverage('waterIntake')}</div>
              <div className="text-sm text-gray-600">Avg Water Intake (glasses/day)</div>
            </div>
            
            {/* Exercise */}
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
              <div className="text-3xl mb-2">🏃‍♂️</div>
              <div className="text-2xl font-bold text-orange-600">{calculateWeeklyAverage('exerciseMinutes')}</div>
              <div className="text-sm text-gray-600">Avg Exercise (minutes/day)</div>
            </div>
            
            {/* Screen Time */}
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-2xl font-bold text-gray-600">{calculateWeeklyAverage('screenTime')}</div>
              <div className="text-sm text-gray-600">Avg Screen Time (hours/day)</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecommendationsTab = () => {
    const score = getWellnessScore();
    const insight = getWellnessInsight();
    
    const recommendations = [
      {
        id: 1,
        category: 'Energy Boost',
        title: 'Take a Power Walk',
        description: 'A 5-10 minute walk can boost your energy naturally and improve focus.',
        icon: <Activity className="w-6 h-6 text-green-600" />,
        color: 'from-green-100 to-emerald-100',
        borderColor: 'border-green-200',
        buttonColor: 'text-green-600 hover:text-green-700',
        time: '5-10 min',
        difficulty: 'Easy'
      },
      {
        id: 2,
        category: 'Mindfulness',
        title: 'Deep Breathing Exercise',
        description: 'Practice 4-7-8 breathing technique to reduce stress and anxiety.',
        icon: <Brain className="w-6 h-6 text-blue-600" />,
        color: 'from-blue-100 to-indigo-100',
        borderColor: 'border-blue-200',
        buttonColor: 'text-blue-600 hover:text-blue-700',
        time: '3-5 min',
        difficulty: 'Easy'
      },
      {
        id: 3,
        category: 'Social Connection',
        title: 'Reach Out to Friends',
        description: 'Send a message to a friend or study group member for social support.',
        icon: <Users className="w-6 h-6 text-purple-600" />,
        color: 'from-purple-100 to-pink-100',
        borderColor: 'border-purple-200',
        buttonColor: 'text-purple-600 hover:text-purple-700',
        time: '2-15 min',
        difficulty: 'Easy'
      },
      {
        id: 4,
        category: 'Hydration',
        title: 'Drink Water',
        description: 'Stay hydrated to maintain energy levels and cognitive function.',
        icon: <Coffee className="w-6 h-6 text-cyan-600" />,
        color: 'from-cyan-100 to-blue-100',
        borderColor: 'border-cyan-200',
        buttonColor: 'text-cyan-600 hover:text-cyan-700',
        time: '1 min',
        difficulty: 'Easy'
      },
      {
        id: 5,
        category: 'Study Break',
        title: 'Pomodoro Technique',
        description: 'Take a 5-minute break after 25 minutes of focused study.',
        icon: <Clock className="w-6 h-6 text-orange-600" />,
        color: 'from-orange-100 to-yellow-100',
        borderColor: 'border-orange-200',
        buttonColor: 'text-orange-600 hover:text-orange-700',
        time: '25+5 min',
        difficulty: 'Medium'
      },
      {
        id: 6,
        category: 'Music Therapy',
        title: 'Listen to Calming Music',
        description: 'Play some relaxing music to reduce stress and improve mood.',
        icon: <Headphones className="w-6 h-6 text-indigo-600" />,
        color: 'from-indigo-100 to-purple-100',
        borderColor: 'border-indigo-200',
        buttonColor: 'text-indigo-600 hover:text-indigo-700',
        time: '10-30 min',
        difficulty: 'Easy'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Wellness Recommendations</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Personalized for you</span>
          </div>
        </div>

        {/* Current Status Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Heart className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Your Wellness Status</h3>
              <p className="text-gray-600 mt-1">Current score: <span className="font-bold text-indigo-600">{score}/10</span></p>
              <p className={`mt-2 ${insight.color} font-medium`}>{insight.text}</p>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`bg-gradient-to-br ${rec.color} p-6 rounded-xl border ${rec.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  {rec.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                  <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full">{rec.category}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{rec.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3" />
                    <span>{rec.difficulty}</span>
                  </div>
                </div>
              </div>
              
              <button className={`w-full ${rec.buttonColor} text-sm font-medium py-2 px-4 bg-white rounded-lg hover:bg-gray-50 transition-colors`}>
                Try Now →
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Resources */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">Need Immediate Support?</h3>
              <p className="text-gray-600 mb-4">If you're experiencing persistent low mood, high stress, or need someone to talk to, don't hesitate to reach out for professional help.</p>
              <div className="flex flex-wrap gap-2">
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                  Campus Counseling
                </button>
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                  Crisis Hotline
                </button>
                <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                  Talk to Someone
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-center mb-6">
        <div className="flex space-x-4 bg-white p-2 rounded-full shadow border">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'checkin' ? 'bg-indigo-500 text-white' : 'text-gray-700 hover:bg-indigo-100'}`}
            onClick={() => setActiveTab('checkin')}
          >
            Check-In
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'trends' ? 'bg-indigo-500 text-white' : 'text-gray-700 hover:bg-indigo-100'}`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'recommendations' ? 'bg-indigo-500 text-white' : 'text-gray-700 hover:bg-indigo-100'}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>
      </div>

      {activeTab === 'checkin' && renderCheckinTab()}
      {activeTab === 'trends' && renderTrendsTab()}
      {activeTab === 'recommendations' && renderRecommendationsTab()}
    </div>
  );
};

export default WellnessDashboard;