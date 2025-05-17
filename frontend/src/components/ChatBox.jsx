import { motion, AnimatePresence } from "framer-motion";

const ChatBox = ({ messages, newMessage, onChange, onSend, chatEndRef, selfId }) => {
  return (
    <div className="border rounded p-4 bg-gray-50 flex flex-col h-[80vh]">
      <h3 className="text-lg font-bold mb-2">Meeting Chat 💬</h3>

      <div className="flex-1 overflow-y-auto border p-2 rounded mb-2 bg-white">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className={`mb-2 ${msg.sender === selfId ? "text-green-600" : "text-blue-600"}`}
            >
              <span className="font-bold">{msg.sender === selfId ? "You" : "User"}:</span> {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          className="border p-2 flex-1 rounded-l"
          placeholder="Type a message..."
        />
        <button
          onClick={onSend}
          className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
