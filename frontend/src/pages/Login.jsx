import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ZidioLogo from '../assets/logos/zidio-logo.png'; // ✅ Updated path

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5174/api/auth/login', {
        email,
        password,
      });
      dispatch(loginSuccess(res.data));
      toast.success('Login Successful 🎉');

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed ❌');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={ZidioLogo} alt="Zidio Logo" className="w-20 h-20 mb-2" />
          <h1 className="text-2xl font-bold text-blue-700">Zidio Task Manager</h1>
          <p className="text-sm text-gray-500">Login to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          <input
            className="border border-gray-300 rounded p-2 w-full mb-4 focus:ring focus:ring-blue-300 outline-none"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 rounded p-2 w-full mb-4 focus:ring focus:ring-blue-300 outline-none"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
