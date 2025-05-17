import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { motion } from 'framer-motion';

const socket = io('http://localhost:5000/dashboard-chat'); // Dashboard Chat Namespace

function ChatDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive-dashboard-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-dashboard-message');
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const messageData = {
      sender: user.name,
      text: newMessage,
    };
    socket.emit('send-dashboard-message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6 flex flex-col h-[90vh]">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Dashboard Team Chat 💬</h2>

          {/* Chat Display */}
          <div className="flex-1 overflow-y-auto border p-4 rounded bg-white shadow mb-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-2"
              >
                <span className="font-semibold text-indigo-700">{msg.sender}:</span>{' '}
                <span>{msg.text}</span>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="border p-2 flex-1 rounded-l"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r"
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatDashboard;
