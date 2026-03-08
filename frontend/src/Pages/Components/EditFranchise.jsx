import React, { useState, useEffect } from 'react';
import { db } from '../../Database/firebaseConfig';
import { ref, update } from 'firebase/database';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  ClipboardList, 
  Truck, 
  CreditCard, 
  ChevronDown,
  AlertCircle 
} from 'lucide-react';

const EditFranchise = ({ data, onBack }) => {
  // Ginagamit ang data mula sa props para i-populate ang form
  const [formData, setFormData] = useState({ ...data });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    try {
      const updates = {};
      // Siguraduhing updated din ang 'updatedAt' timestamp
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      updates[`/franchises/${data.id}`] = updatedData;
      
      await update(ref(db), updates);
      alert("Record updated successfully!");
      onBack(); // Bumalik sa listahan pagkatapos ma-save
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update record: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in duration-500">
      
      {/* STICKY HEADER ACTIONS */}
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack} 
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-tight">
              Edit Record
            </h1>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">
              ID: {data.id.substring(0, 8)}...
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleUpdate}
          disabled={isSaving}
          className="flex items-center space-x-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition duration-300 shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{isSaving ? 'Updating...' : 'Update Record'}</span>
        </button>
      </div>

      <form className="space-y-6">
        
        {/* DOCUMENT TYPE SELECTOR */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <label className="block text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Document Type</label>
          <div className="relative">
            <select 
              name="permitType"
              value={formData.permitType}
              onChange={handleChange}
              className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 text-lg font-black px-5 py-4 rounded-2xl outline-none appearance-none focus:border-blue-500 transition-all"
            >
              <option value="MOTORIZED TRICYCLE OPERATOR'S PERMIT">MOTORIZED TRICYCLE OPERATOR'S PERMIT (MTOP)</option>
              <option value="FRANCHISE CONFIRMATION AND VERIFICATION">FRANCHISE CONFIRMATION AND VERIFICATION</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>

        {/* SECTION 1: OPERATOR INFORMATION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 pb-4">
            <ClipboardList className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-700">Operator Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Name of Operator</label>
              <input type="text" 
              name="nameOfOperator" value={formData.nameOfOperator} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none uppercase font-bold" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Address</label>
              <input type="text" 
              name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Franchise No.</label>
              <input type="text" 
              name="franchiseNo" value={formData.franchiseNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-bold text-red-600" />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">TIN No.</label>
              <input type="text" 
              name="tinNo" value={formData.tinNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Date Granted</label>
                <input type="date" 
                name="dateGranted" value={formData.dateGranted} onChange={handleChange} className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Expiry Date</label>
                <input type="date" 
                name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none font-bold text-red-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Authorized Route</label>
                <input type="text" 
                name="authorizedRoute" value={formData.authorizedRoute} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">No. of Units</label>
                <input type="number" 
                name="authorizedUnits" value={formData.authorizedUnits} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: VEHICLE DETAILS */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 pb-4">
            <Truck className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-700">Vehicle Specification</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Make</label>
              <input type="text" 
              name="make" value={formData.make} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-bold uppercase" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Motor No.</label>
              <input type="text" 
              name="motorNo" value={formData.motorNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-bold uppercase" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Chassis No.</label>
              <input type="text" 
              name="chassisNo" value={formData.chassisNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-bold uppercase" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Plate No.</label>
              <input type="text" 
              name="plateNo" value={formData.plateNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-black uppercase" />
            </div>
          </div>
        </div>

        {/* SECTION 3: PURPOSE & PAYMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-6">Purpose</h2>
            <div className="space-y-3">
              {['Loss of OR/CR', 'Change Unit', 'Others'].map((item) => (
                <label key={item} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                  <input 
                    type="radio" name="purpose" value={item} 
                    checked={formData.purpose === item}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600" 
                  />
                  <span className="font-medium text-gray-700">{item}</span>
                </label>
              ))}
              {formData.purpose === 'Others' && (
                <input 
                  type="text" 
                  name="othersPurpose" 
                  value={formData.othersPurpose || ''} 
                  onChange={handleChange} 
                  placeholder="Specify purpose..." 
                  className="w-full mt-2 px-4 py-2 bg-gray-50 border-b-2 border-blue-500 outline-none" 
                />
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-700">Payment & Agency</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <span className="text-sm font-medium text-gray-500">Supervision Fee:</span>
                <input type="number" 
                name="supervisionFee" value={formData.supervisionFee} onChange={handleChange} className="w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-right font-bold" />
              </div>
              
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-500">Registering Agency:</span>
                <input type="text" 
                name="registeringAgency" value={formData.registeringAgency} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold uppercase" />
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-500">As per Resolution No:</span>
                <input type="text" 
                name="resolutionNo" value={formData.resolutionNo} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold" />
              </div>

              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                   <div className="flex flex-col">
                     <label className="text-[10px] text-gray-400 font-bold ml-1">O.R. NO.</label>
                     <input type="text" 
                     name="orNo" value={formData.orNo} onChange={handleChange} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold" />
                   </div>
                   <div className="flex flex-col">
                     <label className="text-[10px] text-gray-400 font-bold ml-1">AMOUNT PAID</label>
                     <input type="number" 
                     name="amount" value={formData.amount} onChange={handleChange} className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-blue-600" />
                   </div>
                </div>
                <div className="flex flex-col">
                   <label className="text-[10px] text-gray-400 font-bold ml-1">PAYMENT DATE</label>
                   <input type="date" 
                   name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-10 flex justify-center">
        <p className="text-xs text-gray-400 italic">
          Last updated: {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : 'Never'}
        </p>
      </div>
    </div>
  );
};

export default EditFranchise;