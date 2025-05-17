import React from 'react';
import { useSelector } from 'react-redux';
import ZidioLogo from '../assets/logos/zidio-logo.png'; // Adjust based on actual filename

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow rounded-lg mt-10">
      <div className="flex items-center gap-4 mb-6">
        <img src={ZidioLogo} alt="Zidio Logo" className="w-16 h-16 rounded-full" />
        <div>
          <h2 className="text-2xl font-bold text-indigo-600">Zidio Task Manager</h2>
          <p className="text-sm text-gray-500">User Profile</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-medium text-gray-700">Name:</label>
          <p className="text-lg text-gray-900">{user?.name}</p>
        </div>
        <div>
          <label className="font-medium text-gray-700">Email:</label>
          <p className="text-lg text-gray-900">{user?.email}</p>
        </div>
        <div>
          <label className="font-medium text-gray-700">Role:</label>
          <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
