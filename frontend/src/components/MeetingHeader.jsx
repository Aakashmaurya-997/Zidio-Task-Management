import { ClipboardCopy, LogOut } from "lucide-react";

const MeetingHeader = ({ roomId, onLeave, onCopy }) => {
  return (
    <div className="flex items-center justify-between bg-white shadow px-4 py-3 rounded">
      <div>
        <h2 className="text-xl font-semibold">Meeting Room: {roomId}</h2>
        <button
          onClick={onCopy}
          className="text-sm text-blue-600 hover:underline flex items-center mt-1"
        >
          <ClipboardCopy size={16} className="mr-1" />
          Copy Meeting Link
        </button>
      </div>

      <button
        onClick={onLeave}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
      >
        <LogOut size={18} className="mr-1" />
        Leave
      </button>
    </div>
  );
};

export default MeetingHeader;
