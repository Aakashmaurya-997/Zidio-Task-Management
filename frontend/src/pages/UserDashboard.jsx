import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, status } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [lastTaskCount, setLastTaskCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    const myTasks = tasks.filter(task =>
      task.assignedTo.some(u => u._id === user._id)
    );

    if (lastTaskCount !== 0 && myTasks.length > lastTaskCount) {
      toast.info('🎯 You have been assigned a new task!');
    }
    setLastTaskCount(myTasks.length);
  }, [tasks, user, lastTaskCount]);

  const myTasks = tasks.filter(task =>
    task.assignedTo.some(u => u._id === user._id)
  );

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleStartMeeting = () => {
    const newRoomId = uuidv4();
    navigate(`/meeting/${newRoomId}`);
  };

  const goToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-indigo-600">User Dashboard</h2>

          {/* Chat + Meeting Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={goToChat}
              className="bg-blue-500 text-white px-4 py-2 rounded animate-pulse hover:bg-blue-600 transition"
            >
              Go to Team Chat 💬
            </button>

            <button
              onClick={handleStartMeeting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              🚀 Start New Meeting
            </button>
          </div>

          {/* Tasks Display */}
          {status === 'loading' && <p>Loading tasks...</p>}
          {status === 'failed' && <p>Failed to load tasks.</p>}
          {status === 'succeeded' && myTasks.length === 0 && <p>No tasks assigned to you yet.</p>}
          {status === 'succeeded' && myTasks.map((task) => (
            <div key={task._id} onClick={() => openModal(task)} className="cursor-pointer mb-4">
              <TaskCard task={task} />
            </div>
          ))}

          {/* Task Modal */}
          <TaskModal isOpen={isModalOpen} closeModal={closeModal} task={selectedTask} />
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
