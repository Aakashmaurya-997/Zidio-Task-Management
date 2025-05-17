import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import MeetingRoom from './pages/MeetingRoom';
import { useParams } from 'react-router-dom';
import ChatDashboard from './pages/ChatDashboard';
import MeetingEnded from './pages/MeetingEnded'; 
import WaitingRoom from './pages/WaitingRoom';

// 🆕 Proper wrapper outside App
const MeetingRoomWrapper = () => {
  const { roomId } = useParams();
  return <MeetingRoom roomId={roomId} />;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/meeting/:roomId" element={<MeetingRoomWrapper />} /> {/* 🆕 clean usage */}
        <Route path="/chat" element={<ChatDashboard />} />
        <Route path="/meeting-ended" element={<MeetingEnded />} />
        <Route path="/waiting/:roomId" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
