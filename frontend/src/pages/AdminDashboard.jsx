import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/taskSlice';
import TaskCard from '../components/TaskCard';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import TaskModal from '../components/TaskModal';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, status } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleStartMeeting = () => {
    const newRoomId = uuidv4();
    navigate(`/meeting/${newRoomId}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = user.token;
      await axios.post(
        'http://localhost:5174/api/tasks',
        {
          ...formData,
          assignedTo: [formData.assignedTo],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Task Created Successfully! 🚀');
      dispatch(fetchTasks());
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error creating task ❌');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId !== source.droppableId) {
      try {
        const token = user.token;
        await axios.put(
          `http://localhost:5174/api/tasks/${draggableId}`,
          { status: destination.droppableId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchTasks());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const goToChat = () => {
    navigate('/chat');
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h2>
            <button
              onClick={goToChat}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded animate-pulse"
            >
              💬 Team Chat
            </button>
          </div>

          <div className="mb-6">
            <button
              onClick={handleStartMeeting}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              🚀 Start New Meeting
            </button>
          </div>

          {/* Task Creation Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-4 rounded shadow">
            <input
              className="border p-2"
              type="text"
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              className="border p-2"
              type="text"
              name="assignedTo"
              placeholder="Assign to (User ID)"
              value={formData.assignedTo}
              onChange={handleChange}
              required
            />
            <textarea
              className="border p-2 col-span-full"
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <select
              className="border p-2"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              className="border p-2"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded col-span-full">
              ➕ Create Task
            </button>
          </form>

          {/* Task Board */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['todo', 'in-progress', 'completed'].map((statusKey) => (
                <Droppable droppableId={statusKey} key={statusKey}>
                  {(provided) => (
                    <div
                      className="bg-gray-100 p-4 rounded min-h-[200px]"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <h3 className="font-bold capitalize mb-2 text-gray-700">
                        {statusKey.replace('-', ' ')}
                      </h3>
                      {getTasksByStatus(statusKey).map((task, index) => (
                        <Draggable draggableId={task._id} index={index} key={task._id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openModal(task)}
                              className="cursor-pointer"
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>

          <TaskModal isOpen={isModalOpen} closeModal={closeModal} task={selectedTask} />

          {status === 'loading' && <p>Loading tasks...</p>}
          {status === 'failed' && <p>Failed to load tasks.</p>}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
