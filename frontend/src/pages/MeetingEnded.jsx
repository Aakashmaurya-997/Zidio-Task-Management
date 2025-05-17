import React from 'react';
import { Link } from 'react-router-dom';

function MeetingEnded() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Meeting Ended 🚪</h1>
      <p className="mb-6">Thanks for attending. See you next time!</p>
      <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded">
        Back to Home
      </Link>
    </div>
  );
}

export default MeetingEnded;
