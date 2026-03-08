import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Images/logo.png';
import { Eye, EyeOff, X, CheckCircle } from 'lucide-react'; // Para sa icons

// Firebase Imports
import { auth, db } from '../../Database/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, update } from 'firebase/database';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false); // State para sa Success Modal
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await update(ref(db, 'users/' + user.uid), {
          status: 'online',
          lastLogin: new Date().toISOString()
        });

        navigate('/mainpage');

      } else {
        // --- REGISTER LOGIC ---
        if (password !== confirmPassword) {
          setError("Passwords do not match!");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, 'users/' + user.uid), {
          username: username,
          email: email,
          role: 'admin',
          status: 'offline',
          createdAt: new Date().toISOString()
        });

        // Imbes na alert, ipakita ang Modal
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const closeSuccessModal = () => {
    setShowModal(false);
    setIsLogin(true); // Lipat sa login screen pagkatapos mag-register
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6 text-gray-800 relative">
      
      {/* --- SUCCESS MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Registration Successful!</h3>
              <p className="text-gray-500 mt-2">
                Your admin account has been created. You can now log in to the dashboard.
              </p>
              <button
                onClick={closeSuccessModal}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-20 w-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight">
            {isLogin ? 'Admin Login' : 'Create Admin Account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            {isLogin ? 'Welcome back, Admin!' : 'Register to manage the franchise.'}
          </p>
        </div>

        {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded mb-4 text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleAuth}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium ml-1">Username</label>
              <input 
                type="text" required value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin_Name"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition duration-200"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium ml-1">Email Address</label>
            <input 
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition duration-200"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition duration-200"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium ml-1">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none transition duration-200"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 transition duration-300 transform active:scale-95 mt-4"
          >
            {isLogin ? 'Sign In' : 'Register Now'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setShowPassword(false); }}
              className="text-blue-600 font-bold hover:underline"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;