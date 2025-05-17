import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logos/zidio-logo.png'; // make sure there's no space in filename

const Sidebar = () => {
  return (
    <aside className="bg-white shadow-md h-screen w-64 p-4 flex flex-col">
      {/* Logo + Title */}
      <div className="mb-10 text-center">
        <img src={logo} alt="Zidio Logo" className="w-20 h-20 mx-auto mb-2" />
        <h1 className="text-xl font-bold text-indigo-600">Zidio Task Manager</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:text-indigo-600'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:text-indigo-600'
            }`
          }
        >
          Tasks
        </NavLink>

        <NavLink
          to="/meeting"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:text-indigo-600'
            }`
          }
        >
          Meetings
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:text-indigo-600'
            }`
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
