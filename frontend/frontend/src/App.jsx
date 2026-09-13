import './App.css'
import RegisterRfid from './Components/RegisterRfid'
import PresentList from './Components/PresentList'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentStatistics from './Components/StudentStatistics'
import UpdateStudent from './Components/UpdateStudent'
import DeleteStudent from './Components/DeleteStudent'
import Reports from './Components/Reports'
import Presented from './Components/Presented'
import MyAttendance from './pages/MyAttendance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rfid" element={<RegisterRfid />} />
        <Route path="/present" element={<PresentList />} />
        <Route path="/students/update" element={<UpdateStudent />} />
        <Route path="/students/delete" element={<DeleteStudent />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/presented" element={<Presented />} />
        <Route path="/dashboard/:type" element={<StudentStatistics />} />
        <Route path="/my-attendance" element={<MyAttendance />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
