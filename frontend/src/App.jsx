import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeDashboard from "./pages/home_dashboard";
import GoalsDashboard from "./pages/goals_dashboard";
import TimetableDashboard from "./pages/timetable_dashboard";
import WellnessDashboard from "./pages/wellness_dashboard";
import ResourceDashboard from "./pages/resource_dashboard";
import GoalAIDashboard from "./pages/goal_ai_dashboard";
import StudentDashboard from "./pages/student_dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/goals" element={<GoalsDashboard />} />
        <Route path="/timetable" element={<TimetableDashboard />} />
        <Route path="/wellness" element={<WellnessDashboard />} />
        <Route path="/resources" element={<ResourceDashboard />} />
        <Route path="/goalai" element={<GoalAIDashboard />} />
        <Route path="/dashboard" element={<StudentDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
