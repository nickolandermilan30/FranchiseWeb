import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import logo from '../../assets/Images/logo.png';

const DigitalPrint = ({ data, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const d = data || {
    permitType: "MOTORIZED TRICYCLE OPERATOR'S PERMIT",
    nameOfOperator: "N/A",
    address: "N/A",
    classification: "Public Utility",
    dateGranted: "",
    entryDate: "",
    franchiseNo: "N/A",
    expiryDate: "",
    tinNo: "N/A",
    authorizedRoute: "N/A",
    authorizedUnits: "0",
    make: "N/A",
    motorNo: "N/A",
    chassisNo: "N/A",
    plateNo: "N/A",
    amount: "0.00",
    supervisionFee: "0.00",
    orNo: "N/A",
    resolutionNo: "N/A",
    purpose: "Loss of OR/CR",
    treasurerSignatureURL: null,
    operatorSignatureURL: null
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-500 py-10 print:bg-white print:p-0 print:m-0">
      {/* ACTION BAR */}
      <div className="max-w-[8.5in] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-md print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-black font-bold"
        >
          <ArrowLeft size={20} /> <span>Back to List</span>
        </button>
        
        <div className="flex items-center space-x-3">
            <button onClick={handlePrint} className="flex items-center space-x-2 px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-bold shadow-lg">
                <Printer size={18} /> <span>Print Permit</span>
            </button>
        </div>
      </div>

      {/* PAPER START */}
      <div 
        id="permit-paper"
        className="bg-white mx-auto relative text-black shadow-2xl print:shadow-none print:m-0 print:border-0"
        style={{ 
            width: '8.5in', 
            height: '11in', 
            padding: '0.5in 0.7in',
            fontFamily: "'Times New Roman', Times, serif"
        }}
      >
        {/* HEADER SECTION */}
        <div className="relative flex flex-col items-center text-center">
            <img 
                src={logo} 
                alt="Logo" 
                className="absolute left-0 top-0 w-24 h-24 object-contain"
            />
            <div className="mt-2">
                <p className="text-[14px] leading-tight">Republic of the Philippines</p>
                <p className="text-[14px] leading-tight">Province of Iloilo</p>
                <p className="text-[15px] font-bold leading-tight">MUNICIPALITY OF BAROTAC NUEVO</p>
                <p className="text-[13px] italic leading-tight">OFFICE OF THE SANGGUNIANG BAYAN</p>
            </div>
        </div>

        <div className="mt-10 mb-8">
            <h1 className="text-center text-xl font-bold tracking-wider uppercase">
                {d.permitType || "MOTORIZED TRICYCLE OPERATOR'S PERMIT"}
            </h1>
            <div className="w-full border-t-2 border-black mt-1"></div>
        </div>

        {/* MAIN FORM CONTENT */}
        <div className="grid grid-cols-12 gap-y-3 text-[14px]">
            <div className="col-span-7 space-y-3">
                <div className="flex items-end">
                    <span className="w-40">Name of Operator:</span>
                    <span className="border-b border-black flex-1 font-bold px-2 uppercase">{d.nameOfOperator}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-40">Address:</span>
                    <span className="border-b border-black flex-1 px-2 text-[12px]">{d.address}</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span>Classification of Tricycle:</span>
                    <div className="flex items-center space-x-1">
                        <span className="font-bold">({d.classification === 'Public Utility' ? '✔' : ' '})</span>
                        <span>Public Utility</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span className="font-bold">({d.classification === 'Private Utility' ? '✔' : ' '})</span>
                        <span>Private Utility</span>
                    </div>
                </div>
                <div className="flex items-end">
                    <span className="w-40">Validity Period:</span>
                    <span className="border-b border-black flex-1 px-2 font-bold uppercase">{d.validityPeriod || 'THREE (3) YEARS'}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-40">Date Granted:</span>
                    <span className="border-b border-black flex-1 px-2">{formatDate(d.dateGranted)}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-40">Authorized No. of Unit:</span>
                    <span className="border-b border-black flex-1 px-2 font-bold">{d.authorizedUnits}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-40">Authorized Route:</span>
                    <span className="border-b border-black flex-1 px-2 italic uppercase font-bold">{d.authorizedRoute}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-40">Registering Agency:</span>
                    <span className="border-b border-black flex-1 px-2 uppercase font-bold">{d.registeringAgency || 'LTO / MUNICIPALITY'}</span>
                </div>
            </div>

            <div className="col-span-5 pl-8 space-y-3">
                <div className="flex items-end">
                    <span className="w-24">Date:</span>
                    <span className="border-b border-black flex-1 px-2 font-bold">{formatDate(d.entryDate)}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-24">Franchise No.:</span>
                    <span className="border-b border-black flex-1 px-2 font-bold text-red-600">{d.franchiseNo}</span>
                </div>
                <div className="flex items-end">
                    <span className="w-24">TIN No.:</span>
                    <span className="border-b border-black flex-1 px-2 font-bold">{d.tinNo}</span>
                </div>
                <div className="flex items-end mt-4">
                    <span className="w-24 font-bold">Expiry Date:</span>
                    <span className="border-b border-black flex-1 px-2 font-bold text-red-600">{formatDate(d.expiryDate)}</span>
                </div>
            </div>
        </div>

        {/* TABLE SECTION */}
        <div className="mt-8">
            <table className="w-full border-collapse border border-black">
                <thead>
                    <tr className="bg-gray-50 text-[11px] font-bold text-center">
                        <th className="border border-black py-1">MAKE</th>
                        <th className="border border-black py-1">MOTOR NO.</th>
                        <th className="border border-black py-1">CHASSIS NO.</th>
                        <th className="border border-black py-1">PLATE NO.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="text-center text-[13px] font-bold uppercase h-10">
                        <td className="border border-black">{d.make}</td>
                        <td className="border border-black">{d.motorNo}</td>
                        <td className="border border-black">{d.chassisNo}</td>
                        <td className="border border-black">{d.plateNo}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* PURPOSE SECTION */}
        <div className="mt-6 text-[13px] space-y-1">
            <p className="font-bold">Purpose:</p>
            <div className="pl-4">
                <p>({d.purpose === 'Loss of OR/CR' ? '✔' : ' '}) Loss of OR/CR</p>
                <p>({d.purpose === 'Change Unit' ? '✔' : ' '}) Change Unit</p>
                <p>({d.purpose === 'Others' ? '✔' : ' '}) Others: <span className="border-b border-black px-2">{d.purpose === 'Others' ? d.othersPurpose : '____________________'}</span></p>
            </div>
        </div>

        {/* PAYMENT SECTION */}
        <div className="mt-8 text-[12px] space-y-2">
            <p className="font-bold underline uppercase">Cleared as to Payment:</p>
            <div className="flex flex-col space-y-1">
                <div className="flex space-x-2">
                    <span className="border-b border-black w-24 text-center font-bold">₱ {d.supervisionFee || '0.00'}</span>
                    <span>Supervision Fee / Confirmation:</span>
                </div>
            </div>

            <div className="mt-4 space-y-1">
                <div className="flex">
                    <span className="w-20">O.R No.:</span>
                    <span className="border-b border-black w-48 font-bold">{d.orNo}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Amount:</span>
                    <span className="border-b border-black w-48 font-bold">₱ {d.amount}</span>
                </div>
                <div className="flex">
                    <span className="w-20">Date:</span>
                    <span className="border-b border-black w-48 font-bold">{formatDate(d.paymentDate || d.entryDate)}</span>
                </div>
            </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-20 flex justify-between items-end px-4">
            {/* Treasurer Signature */}
            <div className="text-center relative flex flex-col items-center">
                <div className="absolute -top-14 w-48 h-16 flex items-center justify-center">
                    {d.treasurerSignatureURL && (
                        <img 
                            src={d.treasurerSignatureURL} 
                            alt="Treasurer Signature" 
                            className="w-full h-full object-contain pointer-events-none" 
                        />
                    )}
                </div>
                <p className="font-bold underline uppercase text-[14px]">RHADY JOY D. RONQUILLO</p>
                <p className="text-[11px]">Municipal Treasurer</p>
            </div>

            {/* Approved Signature */}
            <div className="text-center relative flex flex-col items-center">
                <div className="absolute -top-16 w-56 h-20 flex items-center justify-center">
                    {d.operatorSignatureURL && (
                        <img 
                            src={d.operatorSignatureURL} 
                            alt="Approver Signature" 
                            className="w-full h-full object-contain pointer-events-none" 
                        />
                    )}
                </div>
                
                <div className="w-64 border-b border-black mb-1"></div>
                <p className="font-bold uppercase text-[13px]">Approved by the Sangguniang Bayan</p>
                <div className="flex items-center text-[12px] mt-2">
                    <span>As Per Resolution No.</span>
                    <span className="border-b border-black px-4 font-bold mx-1">{d.resolutionNo}</span>
                    <span>, Series of 2026</span>
                </div>
            </div>
        </div>

        {/* CSS FOR PRINTING */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #permit-paper, #permit-paper * {
              visibility: visible;
            }
            
            #permit-paper {
              position: absolute;
              left: 0;
              top: 0;
              margin: 0 !important;
              padding: 0.5in 0.7in !important;
              box-shadow: none !important;
              border: none !important;
              width: 8.5in !important;
              height: 11in !important;
            }

            @page {
              size: 8.5in 11in;
              margin: 0;
            }

            body {
              background: white !important;
            }

            table { border-collapse: collapse !important; width: 100% !important; }
            th, td { border: 1px solid black !important; }
          }
        `}} />
      </div>
    </div>
  );
};

export default DigitalPrint;