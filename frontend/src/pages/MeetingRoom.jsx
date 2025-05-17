import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import VideoCard from '../components/VideoCard';
import MeetingHeader from '../components/MeetingHeader';
import ZidioLogo from '../assets/logos/zidio-logo.png';

const socket = io('http://localhost:5000');

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [videoPeers, setVideoPeers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [waiting, setWaiting] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const userVideo = useRef();
  const peersRef = useRef([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (userVideo.current) userVideo.current.srcObject = stream;

        socket.emit('join-room', { roomId, userId: socket.id });

        socket.on('host-started', () => {
          setWaiting(false);
        });

        socket.on('user-joined', ({ userId, isHost }) => {
          if (userId === socket.id && isHost) {
            setIsHost(true);
            socket.emit('host-started', { roomId });
            setWaiting(false);
          } else {
            const peer = createPeer(userId, socket.id, stream);
            peersRef.current.push({ peerID: userId, peer });
            setVideoPeers([...peersRef.current]);
          }
        });

        socket.on('user-signal', ({ signal, callerId }) => {
          const peer = addPeer(signal, callerId, stream);
          peersRef.current.push({ peerID: callerId, peer });
          setVideoPeers([...peersRef.current]);
        });

        socket.on('receiving-returned-signal', ({ id, signal }) => {
          const item = peersRef.current.find(p => p.peerID === id);
          if (item) item.peer.signal(signal);
        });

        socket.on('participants-update', list => setParticipants(list));
        socket.on('receive-message', msg => setMessages(prev => [...prev, msg]));
      })
      .catch(err => {
        console.error(err);
        toast.error('Camera or microphone access is required.');
      });

    return () => socket.disconnect();
  }, [roomId]);

  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', signal => socket.emit('sending-signal', { userToSignal, callerId, signal }));
    return peer;
  };

  const addPeer = (signal, callerId, stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on('signal', s => socket.emit('returning-signal', { signal: s, callerId }));
    peer.signal(signal);
    return peer;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const data = { roomId, sender: socket.id, text: newMessage };
    socket.emit('send-message', data);
    setMessages(prev => [...prev, data]);
    setNewMessage('');
  };

  const confirmLeave = () => {
    navigate('/');
    toast.info('You left the meeting!');
  };

  if (waiting && !isHost) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <img src={ZidioLogo} alt="Zidio Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold mb-4 animate-pulse">Waiting for Host to Start 🚪</h1>
        <p className="text-gray-600">You’ll be redirected when the host joins.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-4">
        <MeetingHeader
          roomId={roomId}
          onLeave={() => setShowLeaveConfirm(true)}
          onCopy={() => {
            navigator.clipboard.writeText(`http://localhost:5173/meeting/${roomId}`);
            toast.success('Meeting link copied!');
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <h3 className="font-semibold mb-2">Your Video</h3>
            <video ref={userVideo} autoPlay playsInline muted className="rounded border w-full max-w-md mb-6" />

            <h3 className="font-semibold mb-2">Participants</h3>
            <div className="grid grid-cols-2 gap-4">
              {videoPeers.map((peerObj, i) => <VideoCard key={i} peer={peerObj.peer} />)}
            </div>

            <h3 className="font-semibold mt-6">Participants List</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {participants.map((p, i) => <li key={i}>{p === socket.id ? 'You' : p}</li>)}
            </ul>
          </div>

          <ChatBox
            messages={messages}
            newMessage={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            chatEndRef={chatEndRef}
          />
        </div>
      </main>

      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-lg p-6 shadow-lg"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h2 className="text-lg font-semibold mb-4">Are you sure you want to leave?</h2>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowLeaveConfirm(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button onClick={confirmLeave} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Leave</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetingRoom;
