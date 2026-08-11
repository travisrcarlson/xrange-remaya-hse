import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Flame, 
  QrCode, 
  ScanLine, 
  FileSpreadsheet, 
  Plus, 
  Camera,
  RotateCcw,
  Building2
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'areas' | 'equipment' | 'qr_studio' | 'inspection' | 'csv';
  setActiveTab: (tab: 'dashboard' | 'areas' | 'equipment' | 'qr_studio' | 'inspection' | 'csv') => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenScanner,
  onResetData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0f]/95 backdrop-blur-md border-b border-[#27272a] text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* EDGE Group Corporate Logo Header */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl edge-orange-gradient flex items-center justify-center shadow-lg shadow-orange-950/40 border border-orange-400/40">
              <ShieldCheck className="w-6 h-6 text-white font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight edge-orange-text">
                  EDGE
                </span>
                <span className="text-xs font-bold text-slate-300 tracking-wider">
                  REMAYA HSE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-[#ff5500]/15 text-[#ff7700] border border-[#ff5500]/30">
                  OFFICER PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Equipment Inspection, Building Risk & Compliance System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#121214] p-1 rounded-xl border border-[#27272a]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'edge-orange-gradient text-white shadow-md shadow-orange-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#18181b]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('areas')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'areas'
                  ? 'edge-orange-gradient text-white shadow-md shadow-orange-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#18181b]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Area Risk Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'equipment'
                  ? 'edge-orange-gradient text-white shadow-md shadow-orange-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#18181b]'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Equipment Register</span>
            </button>

            <button
              onClick={() => setActiveTab('qr_studio')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'qr_studio'
                  ? 'edge-orange-gradient text-white shadow-md shadow-orange-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#18181b]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('inspection')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inspection'
                  ? 'edge-orange-gradient text-white shadow-md shadow-orange-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#18181b]'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>Field Inspection</span>
            </button>

            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'csv'
                  ? 'edge-orange-gradient text-white shadow-md shadow-orange-950/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#18181b]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Reports</span>
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenScanner}
              title="Scan physical QR code with device camera"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#ff5500]/10 hover:bg-[#ff5500]/20 text-[#ff7700] border border-[#ff5500]/30 text-xs font-bold transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg edge-orange-gradient text-white font-extrabold text-xs shadow-md shadow-orange-950/40 border border-orange-400/40 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Item</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset to sample EDGE Remaya data"
              className="p-1.5 text-slate-400 hover:text-[#ff7700] hover:bg-[#18181b] rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-around bg-[#0d0d0f] border-t border-[#27272a] py-2 px-1 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-[#ff7700] font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('areas')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'areas' ? 'text-[#ff7700] font-bold' : 'text-slate-400'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Areas Risk</span>
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'equipment' ? 'text-[#ff7700] font-bold' : 'text-slate-400'}`}
        >
          <Flame className="w-4 h-4" />
          <span>Equipment</span>
        </button>
        <button
          onClick={() => setActiveTab('qr_studio')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'qr_studio' ? 'text-[#ff7700] font-bold' : 'text-slate-400'}`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Studio</span>
        </button>
        <button
          onClick={() => setActiveTab('inspection')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'inspection' ? 'text-[#ff7700] font-bold' : 'text-slate-400'}`}
        >
          <ScanLine className="w-4 h-4" />
          <span>Inspect</span>
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'csv' ? 'text-[#ff7700] font-bold' : 'text-slate-400'}`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV Export</span>
        </button>
      </div>
    </header>
  );
};
