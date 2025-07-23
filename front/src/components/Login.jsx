import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken, setUser, API_URL } = useContext(ShopContext);

  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        if (!name || !email || !password || !confirmPassword) {
          toast.error('Please fill in all fields.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          setLoading(false);
          return;
        }
        const response = await axios.post(`${API_URL}/user/Register`, {
          name,
          email,
          password,
        });
        if (response.data && response.data.success) {
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user));
              setUser(response.data.user);
            }
            toast.success('Registration successful!');
            navigate('/');
          } else {
            toast.success('Registration successful! Please login.');
            setCurrentState('Login');
            resetFields();
          }
        } else {
          toast.error(response.data?.message || 'Registration failed.');
        }
      } else if (currentState === 'Login') {
        if (!email || !password) {
          toast.error('Please enter email and password.');
          setLoading(false);
          return;
        }
        const response = await axios.post(`${API_URL}/user/Login`, {
          email,
          password,
        });
        if (response.data && response.data.success && response.data.token) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUser(response.data.user);
          }
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(response.data?.message || 'Login failed.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || error.message || 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  const handleSwitchToSignUp = () => {
    setCurrentState('Sign Up');
    resetFields();
  };

  const handleSwitchToLogin = () => {
    setCurrentState('Login');
    resetFields();
  };

  return (
    <form
      className="flex flex-col items-center w-full max-w-md mx-auto mt-16 bg-white shadow-lg rounded-xl p-8"
      onSubmit={submitHandler}
      autoComplete="off"
    >
      <div className="inline-flex gap-2 items-center mb-10 mt-10">
        <p className="w-8 md:w-11 h-[2px] bg-green-500"></p>
        <p className="text-green-800 text-5xl font-semibold">{currentState}</p>
        <p className="w-8 md:w-11 h-[2px] bg-green-500"></p>
      </div>
      {currentState === 'Login' ? (
        <div className="w-full space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="username"
            disabled={loading}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="cursor-pointer text-green-500 hover:text-green-700 text-sm font-medium transition-colors duration-200 bg-transparent border-none p-0"
              onClick={() =>
                toast.info('Password reset not implemented yet.')
              }
              tabIndex={0}
              disabled={loading}
              style={{ background: 'none' }}
            >
              Forgot your password?
            </button>
            <button
              type="button"
              className="cursor-pointer text-green-500 hover:text-green-700 text-sm font-medium transition-colors duration-200 bg-transparent border-none p-0"
              onClick={handleSwitchToSignUp}
              tabIndex={0}
              disabled={loading}
              style={{ background: 'none' }}
            >
              Create Account?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="name"
            disabled={loading}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="username"
            disabled={loading}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="new-password"
            disabled={loading}
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoComplete="new-password"
            disabled={loading}
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="cursor-pointer text-green-500 hover:text-green-700 text-sm text-end font-medium transition-colors duration-200 bg-transparent border-none p-0"
              onClick={handleSwitchToLogin}
              tabIndex={0}
              disabled={loading}
              style={{ background: 'none' }}
            >
              Already have an account?
            </button>
            <button
              type="button"
              className="cursor-pointer text-green-500 hover:text-green-700 text-sm text-end font-medium transition-colors duration-200 bg-transparent border-none p-0"
              onClick={handleSwitchToLogin}
              tabIndex={0}
              disabled={loading}
              style={{ background: 'none' }}
            >
              Login Here
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>
      )}
    </form>
  );
};

export default Login;