import React from 'react';

function WaitingRoom() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Waiting for Host ⏳</h1>
      <p>Please wait... Host will start the meeting soon.</p>
    </div>
  );
}

export default WaitingRoom;
