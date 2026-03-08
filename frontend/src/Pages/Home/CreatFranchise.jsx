import React, { useState, useRef } from 'react';
import { FilePlus, Save, ClipboardList, CreditCard, Truck, CheckCircle, AlertCircle, ChevronDown, Trash2, PenTool, TrendingUp } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

// Firebase Imports
import { db, storage } from '../../Database/firebaseConfig';
import { ref, push, set } from 'firebase/database';
import { ref as sRef, uploadString, getDownloadURL } from 'firebase/storage';

const CreatFranchise = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Refs for signature pads - initialized as null for better React compliance
  const operatorSigCanvas = useRef(null); 
  const treasurerSigCanvas = useRef(null);

  const [formData, setFormData] = useState({
    permitType: "MOTORIZED TRICYCLE OPERATOR'S PERMIT", 
    entryDate: new Date().toISOString().split('T')[0],
    nameOfOperator: '',
    address: '',
    classification: 'Public Utility',
    validityPeriod: '',
    dateGranted: '',
    franchiseNo: '',
    tinNo: '',
    expiryDate: '',
    authorizedRoute: '',
    authorizedUnits: '',
    make: '',
    motorNo: '',
    chassisNo: '',
    plateNo: '',
    purpose: 'Loss of OR/CR',
    othersPurpose: '',
    supervisionFee: '',
    increaseRateFee: '',
    registeringAgency: '', 
    orNo: '',
    amount: '',
    paymentDate: '',
    resolutionNo: '', 
    operatorSignatureURL: '',
    treasurerSignatureURL: '',
    createdAt: new Date().toISOString()
  });

  const isFormValid = () => {
    const requiredFields = [
      'nameOfOperator', 'address', 'franchiseNo', 'dateGranted', 
      'expiryDate', 'authorizedRoute', 'authorizedUnits', 'make', 
      'motorNo', 'chassisNo', 'plateNo', 'supervisionFee', 
      'registeringAgency', 'orNo', 'amount', 'paymentDate', 'resolutionNo',
      'classification'
    ];
    const fieldsFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    
    // Check if signatures are not empty
    const opSigFilled = operatorSigCanvas.current && !operatorSigCanvas.current.isEmpty();
    const trSigFilled = treasurerSigCanvas.current && !treasurerSigCanvas.current.isEmpty();
    
    return fieldsFilled && opSigFilled && trSigFilled;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearOperatorSignature = () => operatorSigCanvas.current?.clear();
  const clearTreasurerSignature = () => treasurerSigCanvas.current?.clear();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!isFormValid()) {
      alert("Please fill up all required fields and ensure both signatures are provided.");
      return;
    }

    setIsSaving(true);

    try {
      // FIX: Use getCanvas().toDataURL() if getTrimmedCanvas() causes library internal errors
      const opSigBase64 = operatorSigCanvas.current.getCanvas().toDataURL('image/png');
      const trSigBase64 = treasurerSigCanvas.current.getCanvas().toDataURL('image/png');
      
      const timestamp = Date.now();

      // Upload Signatures
      const opStorageRef = sRef(storage, `signatures/operator_${timestamp}.png`);
      await uploadString(opStorageRef, opSigBase64, 'data_url');
      const opDownloadURL = await getDownloadURL(opStorageRef);

      const trStorageRef = sRef(storage, `signatures/treasurer_${timestamp}.png`);
      await uploadString(trStorageRef, trSigBase64, 'data_url');
      const trDownloadURL = await getDownloadURL(trStorageRef);

      // Save to Realtime Database
      const franchisesRef = ref(db, 'franchises');
      const newFranchiseRef = push(franchisesRef);
      
      await set(newFranchiseRef, {
        ...formData,
        operatorSignatureURL: opDownloadURL,
        treasurerSignatureURL: trDownloadURL,
        createdAt: new Date().toISOString()
      });

      setShowSuccessModal(true);
      
      // Reset Form and Signatures
      operatorSigCanvas.current.clear();
      treasurerSigCanvas.current.clear();
      setFormData({
        permitType: "MOTORIZED TRICYCLE OPERATOR'S PERMIT",
        entryDate: new Date().toISOString().split('T')[0],
        nameOfOperator: '', address: '', classification: 'Public Utility', validityPeriod: '',
        dateGranted: '', franchiseNo: '', tinNo: '', expiryDate: '', authorizedRoute: '',
        authorizedUnits: '', make: '', motorNo: '', chassisNo: '', plateNo: '',
        purpose: 'Loss of OR/CR', othersPurpose: '',
        supervisionFee: '', increaseRateFee: '', registeringAgency: '', orNo: '', amount: '', 
        paymentDate: '', resolutionNo: '', operatorSignatureURL: '', treasurerSignatureURL: '',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      alert("Failed to save data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Data Saved!</h3>
            <p className="text-gray-500 mt-2">The record with classification and fees has been uploaded.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header & Document Type */}
      <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-800 p-1 rounded-3xl shadow-lg">
        <div className="bg-white p-6 rounded-[28px]">
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3 ml-1">Select Document Type</label>
            <div className="relative">
                <select 
                    name="permitType"
                    value={formData.permitType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-100 text-gray-800 text-lg font-black px-5 py-4 rounded-2xl outline-none appearance-none focus:border-blue-500 transition-all cursor-pointer"
                >
                    <option value="MOTORIZED TRICYCLE OPERATOR'S PERMIT">MOTORIZED TRICYCLE OPERATOR'S PERMIT (MTOP)</option>
                    <option value="FRANCHISE CONFIRMATION AND VERIFICATION">FRANCHISE CONFIRMATION AND VERIFICATION</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                    <ChevronDown size={24} />
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
            <FilePlus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-tight">
                {formData.permitType.includes('CONFIRMATION') ? 'New Confirmation' : 'Create New MTOP'}
            </h1>
            <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 font-medium">Entry Date:</p>
                <input 
                    type="date" 
                    name="entryDate" 
                    value={formData.entryDate} 
                    onChange={handleChange}
                    className="text-sm font-bold text-blue-600 bg-transparent outline-none"
                />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
            <button 
              onClick={handleSubmit}
              disabled={isSaving || !isFormValid()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition duration-300 transform active:scale-95 shadow-md ${
                isSaving || !isFormValid() 
                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save size={18} />
              <span>{isSaving ? 'Saving...' : 'Save Record'}</span>
            </button>
            {!isFormValid() && (
                <span className="text-[10px] text-red-500 mt-1 font-bold flex items-center italic text-right">
                    <AlertCircle size={10} className="mr-1"/> Fill all fields & Provide both signatures
                </span>
            )}
        </div>
      </div>

      <form className="space-y-6">
        {/* OPERATOR INFORMATION */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 pb-4">
            <ClipboardList className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-700">Operator Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Name of Operator</label>
              <input type="text" 
              name="nameOfOperator" value={formData.nameOfOperator} onChange={handleChange} required placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Address</label>
              <input type="text" 
              name="address" value={formData.address} onChange={handleChange} required placeholder="Complete Address" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
            </div>
            
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Classification</label>
              <select 
                name="classification" 
                value={formData.classification} 
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-bold text-blue-700 outline-none appearance-none"
              >
                <option value="Public Utility">Public Utility</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Franchise No.</label>
              <input type="text" 
              name="franchiseNo" value={formData.franchiseNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-bold text-red-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">TIN No.</label>
              <input type="text" 
              name="tinNo" value={formData.tinNo} onChange={handleChange} placeholder="000-000-000" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Validity Period</label>
              <input type="text" 
              name="validityPeriod" value={formData.validityPeriod} onChange={handleChange} placeholder="e.g. 3 Years" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
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
                name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-red-600 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Authorized Route</label>
                <input type="text" 
                name="authorizedRoute" value={formData.authorizedRoute} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">No. of Units</label>
                <input type="number" 
                name="authorizedUnits" value={formData.authorizedUnits} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* VEHICLE DETAILS */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 pb-4">
            <Truck className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-700">Vehicle Specification</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Make</label>
              <input type="text" 
              name="make" value={formData.make} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Motor No.</label>
              <input type="text" 
              name="motorNo" value={formData.motorNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Chassis No.</label>
              <input type="text" 
              name="chassisNo" value={formData.chassisNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Plate No.</label>
              <input type="text" 
              name="plateNo" value={formData.plateNo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" />
            </div>
          </div>
        </div>

        {/* PURPOSE & PAYMENT */}
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
                <input type="text" 
                name="othersPurpose" value={formData.othersPurpose} onChange={handleChange} placeholder="Specify..." className="w-full mt-2 px-4 py-2 bg-gray-50 border-b-2 border-blue-500 outline-none" />
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="text-blue-600" size={20} />
              <h2 className="text-lg font-bold text-gray-700">Payment & Fees</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <span className="text-sm font-medium text-gray-500">Supervision Fee:</span>
                <input type="number" 
                name="supervisionFee" value={formData.supervisionFee} onChange={handleChange} className="w-32 px-3 py-2 bg-gray-50 border rounded-lg text-right font-bold outline-none" />
              </div>
              
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                    <TrendingUp size={14} className="text-orange-500" />
                    <span className="text-sm font-medium text-gray-500">Increase Rate Fee:</span>
                </div>
                <input type="number" 
                name="increaseRateFee" value={formData.increaseRateFee} onChange={handleChange} placeholder="0.00" className="w-32 px-3 py-2 bg-orange-50/50 border border-orange-100 rounded-lg text-right font-bold text-orange-700 outline-none" />
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-500">Registering Agency:</span>
                <input type="text" 
                name="registeringAgency" value={formData.registeringAgency} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border rounded-lg font-bold uppercase outline-none" />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-gray-500">As per Resolution No:</span>
                <input type="text" 
                name="resolutionNo" value={formData.resolutionNo} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border rounded-lg font-bold outline-none" />
              </div>
              <div className="pt-4 border-t grid grid-cols-2 gap-2">
                 <div className="flex flex-col">
                   <label className="text-[10px] text-gray-400 font-bold ml-1">O.R. NO.</label>
                   <input type="text" 
                   name="orNo" value={formData.orNo} onChange={handleChange} className="px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none" />
                 </div>
                 <div className="flex flex-col">
                   <label className="text-[10px] text-gray-400 font-bold ml-1">TOTAL AMOUNT</label>
                   <input type="number" 
                   name="amount" value={formData.amount} onChange={handleChange} className="px-3 py-2 bg-gray-50 border rounded-lg text-sm font-bold text-blue-600 outline-none" />
                 </div>
              </div>
              <div className="flex flex-col">
                 <label className="text-[10px] text-gray-400 font-bold ml-1">PAYMENT DATE</label>
                 <input type="date" 
                 name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* APPROVAL SIGNATURES */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6 border-b border-gray-50 pb-4">
                <PenTool className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-gray-700">Approval Signatures</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
                {/* Operator Section */}
                <div className="flex flex-col items-center">
                    <div className="w-full h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 relative mb-4 overflow-hidden">
                        <SignatureCanvas 
                            ref={operatorSigCanvas}
                            penColor="black"
                            canvasProps={{ className: "w-full h-full cursor-crosshair" }}
                        />
                        <button 
                            type="button" onClick={clearOperatorSignature}
                            className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="w-full text-center">
                        <div className="w-full border-b border-black mb-1"></div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                            APPROVED BY THE SANGGUNIANG BAYAN
                        </h3>
                    </div>
                </div>

                {/* Treasurer Section */}
                <div className="flex flex-col items-center">
                    <div className="w-full h-40 bg-blue-50/30 rounded-2xl border-2 border-dashed border-blue-200 relative mb-4 overflow-hidden">
                        <SignatureCanvas 
                            ref={treasurerSigCanvas}
                            penColor="black"
                            canvasProps={{ className: "w-full h-full cursor-crosshair" }}
                        />
                        <button 
                            type="button" onClick={clearTreasurerSignature}
                            className="absolute top-2 right-2 p-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="w-full text-center">
                        <div className="w-full border-b border-black mb-1"></div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                            RHADY JOY D. RONQUILLO
                        </h3>
                        <p className="text-xs text-gray-600 font-bold">Municipal Treasurer</p>
                    </div>
                </div>
            </div>
            
            <p className="text-[10px] text-gray-400 mt-12 italic text-center">
                Note: Verification and validation of signatures are required for official document processing.
            </p>
        </div>
      </form>
    </div>
  );
};

export default CreatFranchise;