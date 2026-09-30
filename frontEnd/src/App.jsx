import { Routes, Route, useNavigate } from "react-router-dom";
import Register from './pages/Register'
import Login from './pages/Login'
import Home from "./pages/Home";
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import Roadmap from "./pages/Roadmap";
function App() {
  return (
    <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<Home/>} />
              <Route path="/roadmaps/:roadmapId" element={<Roadmap/>} />
          </Route>
    </Routes>
      
  )
}

export default App
