import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../Database/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue, update } from 'firebase/database';
import logo from '../../assets/Images/logo.png';

// Import ang mga Components
import CreateFranchise from './CreatFranchise'; 
import Manage from './Manage'; 

import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  AlertTriangle,
  Menu,
  X 
} from 'lucide-react';

const Mainpage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Para sa Mobile Sidebar
  
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserData(data);
          setLoading(false);
        });
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await update(ref(db, 'users/' + user.uid), { status: 'offline' });
        await signOut(auth);
        navigate('/');
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close sidebar kapag nag-select ng tab sa mobile
  const selectTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-bold bg-gray-50 text-blue-600">
      Loading Admin Dashboard...
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">Welcome back, {userData?.username}! 👋</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your franchise today.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Role</p>
                <p className="text-2xl font-bold text-blue-600 mt-1 capitalize">{userData?.role}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Account Status</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-2xl font-bold text-gray-800">Online</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest">System Access</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">Granted</p>
              </div>
            </div>

            <div className="mt-10 bg-white p-8 md:p-12 rounded-[40px] border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <LayoutDashboard className="h-12 w-12 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold text-lg">Main dashboard modules are being prepared.</p>
              <p className="text-gray-400 text-sm max-w-xs mt-2">Use the sidebar to create or manage your franchise accounts.</p>
            </div>
          </div>
        );
      case 'create-franchise':
        return <CreateFranchise />;
      case 'manage-franchise':
        return <Manage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      
      {/* --- LOGOUT MODAL --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Logout</h3>
              <p className="text-gray-500 mt-2 text-sm">Are you sure you want to log out?</p>
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold">Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-sm
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center space-x-3">
            <img src={logo} 
            alt="Logo" className="h-10 w-auto" />
            <span className="text-xl font-black text-blue-600 tracking-tight italic">Tricomplaints</span>
          </div>
          {/* Close button for mobile */}
          
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => selectTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50 font-semibold'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => selectTab('create-franchise')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${activeTab === 'create-franchise' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50 font-semibold'}`}
          >
            <PlusCircle size={20} />
            <span>Create Franchise</span>
          </button>
          
          <button 
            onClick={() => selectTab('manage-franchise')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${activeTab === 'manage-franchise' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-50 font-semibold'}`}
          >
            <Settings size={20} />
            <span>Manage Franchise</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={() => setShowLogoutModal(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition duration-200">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            {/* Hamburger Button para sa Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-gray-50 rounded-lg text-gray-600 md:hidden hover:bg-gray-100 transition"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight line-clamp-1">
              {activeTab === 'dashboard' && 'Admin Overview'}
              {activeTab === 'create-franchise' && 'Franchise Registration'}
              {activeTab === 'manage-franchise' && 'Franchise Records'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-gray-100">
              <div className="bg-blue-600 p-1.5 md:p-2 rounded-full text-white shadow-md">
                <UserIcon size={18} />
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-black text-gray-800 uppercase tracking-wide">{userData?.username || 'Admin'}</p>
                <p className="text-[9px] text-gray-500 font-medium lowercase line-clamp-1">{userData?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 transition-all duration-500">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Mainpage;