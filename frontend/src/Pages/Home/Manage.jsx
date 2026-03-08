import React, { useEffect, useState } from 'react';
import { db } from '../../Database/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import DigitalPrint from '../Components/DigitalPrint'; 
import EditFranchise from '../Components/EditFranchise';
import { 
  Search, 
  Trash2, 
  Eye, 
  Edit3, // Idinagdag ito
  MapPin, 
  Truck, 
  Calendar,
  Loader2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

const Manage = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // View/Edit States
  const [selectedFranchise, setSelectedFranchise] = useState(null); 
  const [editingFranchise, setEditingFranchise] = useState(null);

  // Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const franchisesRef = ref(db, 'franchises');
    const unsubscribe = onValue(franchisesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setFranchises(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
      } else {
        setFranchises([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFinalDelete = async () => {
    if (itemToDelete) {
      try {
        await remove(ref(db, `franchises/${itemToDelete.id}`));
        setShowDeleteModal(false);
        setItemToDelete(null);
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Failed to delete record.");
      }
    }
  };

  const filteredFranchises = franchises.filter(item => 
    item.nameOfOperator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.plateNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.franchiseNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CONDITIONAL RENDERING ---
  
  // Kung nag-eedit, ipakita ang EditFranchise component
  if (editingFranchise) {
    return <EditFranchise data={editingFranchise} onBack={() => setEditingFranchise(null)} />;
  }

  // Kung nag-viview para i-print, ipakita ang DigitalPrint
  if (selectedFranchise) {
    return <DigitalPrint data={selectedFranchise} onBack={() => setSelectedFranchise(null)} />;
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 text-blue-600">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-bold tracking-widest uppercase text-sm">Synchronizing Records...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="bg-red-50 p-4 rounded-full w-fit mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Confirm Deletion</h3>
              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Are you sure you want to delete the franchise record for <br/>
                <span className="font-black text-gray-800 uppercase tracking-wide">"{itemToDelete?.nameOfOperator}"</span>? 
                <br/><br/>
                <span className="text-red-500 font-semibold italic text-xs">This action cannot be undone.</span>
              </p>
              
              <div className="flex space-x-3 mt-8">
                <button 
                  onClick={() => setShowDeleteModal(false)} 
                  className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFinalDelete} 
                  className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition duration-200 shadow-lg shadow-red-200"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Franchise Records</h1>
          <p className="text-sm text-gray-500 font-medium italic">Manage and monitor all active permits</p>
        </div>

        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search operator, plate, or franchise no..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 transition-all font-medium text-gray-700 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operator & Location</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Franchise Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vehicle Unit</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredFranchises.length > 0 ? (
                filteredFranchises.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-all duration-200 group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-lg uppercase group-hover:text-blue-700 transition-colors tracking-tight">
                          {item.nameOfOperator}
                        </span>
                        <div className="flex items-center text-gray-400 text-xs mt-1 font-medium">
                          <MapPin size={12} className="mr-1 shrink-0" />
                          <span className="truncate max-w-[200px]">{item.address}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-1">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black border border-blue-100 w-fit">
                          #{item.franchiseNo || 'N/A'}
                        </span>
                        <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          <Calendar size={10} className="mr-1 text-gray-400" />
                          Exp: {item.expiryDate || 'No Date'}
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-700 uppercase">{item.make}</span>
                        <span className="mt-1 flex items-center text-[10px] font-black text-white bg-gray-800 px-2 py-0.5 rounded tracking-widest w-fit shadow-sm">
                          <Truck size={10} className="mr-1" />
                          {item.plateNo || 'NO-PLATE'}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        item.classification === 'Public Utility'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-purple-100 text-purple-700 border-purple-200'
                      }`}>
                        {item.classification}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center space-x-2">
                        {/* EDIT BUTTON */}
                        <button 
                          onClick={() => setEditingFranchise(item)}
                          className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-100"
                          title="Edit Record"
                        >
                          <Edit3 size={20} />
                        </button>

                        {/* VIEW/PRINT BUTTON */}
                        <button 
                          onClick={() => setSelectedFranchise(item)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-100"
                          title="View Full Details"
                        >
                          <Eye size={20} />
                        </button>

                        {/* DELETE BUTTON */}
                        <button 
                          onClick={() => {setItemToDelete(item); setShowDeleteModal(true);}}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-gray-100"
                          title="Delete Record"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <AlertCircle className="text-gray-300" size={48} />
                      </div>
                      <p className="text-gray-500 font-black text-xl uppercase tracking-widest">No Records Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Manage;