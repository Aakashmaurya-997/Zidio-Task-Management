// FILE: frontend/src/components/Topbar.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ZidioRoundLogo from '../assets/logos/zidio-round.png';

const Topbar = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
      {/* Branding Section */}
      <div className="flex items-center gap-3">
        <img
          src={ZidioRoundLogo}
          alt="Zidio Logo"
          className="w-10 h-10 object-contain rounded-full"
        />
        <h1 className="text-xl font-bold text-indigo-600 tracking-wide">
          Zidio Task Manager
        </h1>
      </div>

      {/* User Info Section */}
      <div className="flex items-center gap-4 mt-3 sm:mt-0">
        {user?.name ? (
          <span className="text-sm text-gray-700">
            👋 Welcome, <strong>{user.name}</strong>
          </span>
        ) : (
          <span className="text-sm text-gray-700">Logged In</span>
        )}
        <Link
          to="/profile"
          className="text-sm text-indigo-500 hover:text-indigo-700 transition"
        >
          Profile
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
