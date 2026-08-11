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
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'equipment' | 'qr_studio' | 'inspection' | 'csv';
  setActiveTab: (tab: 'dashboard' | 'equipment' | 'qr_studio' | 'inspection' | 'csv') => void;
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
    <header className="sticky top-0 z-40 bg-[#070d18]/95 backdrop-blur-md border-b border-[#1b273b] text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Remaya Corporate Logo & Crest */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl remaya-gold-gradient flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-300/40">
              <ShieldCheck className="w-6 h-6 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight remaya-gold-text">
                  REMAYA
                </span>
                <span className="text-xs font-bold text-slate-300 tracking-wider">
                  XRANGE HSE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-[#d4af37]/15 text-[#e6c363] border border-[#d4af37]/30">
                  OFFICER PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Equipment Inspection & Compliance Monitoring System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0b1322] p-1 rounded-xl border border-[#1b273b]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'remaya-gold-gradient text-slate-950 shadow-md shadow-amber-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#152033]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'equipment'
                  ? 'remaya-gold-gradient text-slate-950 shadow-md shadow-amber-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#152033]'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Equipment Register</span>
            </button>

            <button
              onClick={() => setActiveTab('qr_studio')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'qr_studio'
                  ? 'remaya-gold-gradient text-slate-950 shadow-md shadow-amber-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#152033]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QR Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('inspection')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'inspection'
                  ? 'remaya-gold-gradient text-slate-950 shadow-md shadow-amber-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#152033]'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>Field Inspection</span>
            </button>

            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'csv'
                  ? 'remaya-gold-gradient text-slate-950 shadow-md shadow-amber-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#152033]'
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/30 text-xs font-bold transition-all"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg remaya-gold-gradient text-slate-950 font-extrabold text-xs shadow-md shadow-amber-900/40 border border-amber-200/50 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Item</span>
            </button>

            <button
              onClick={onResetData}
              title="Reset to sample Remaya XRange data"
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-[#152033] rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#070d18] border-t border-[#1b273b] py-2.5 px-1 text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-[#e6c363] font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'equipment' ? 'text-[#e6c363] font-bold' : 'text-slate-400'}`}
        >
          <Flame className="w-4 h-4" />
          <span>Equipment</span>
        </button>
        <button
          onClick={() => setActiveTab('qr_studio')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'qr_studio' ? 'text-[#e6c363] font-bold' : 'text-slate-400'}`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Studio</span>
        </button>
        <button
          onClick={() => setActiveTab('inspection')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'inspection' ? 'text-[#e6c363] font-bold' : 'text-slate-400'}`}
        >
          <ScanLine className="w-4 h-4" />
          <span>Inspect</span>
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'csv' ? 'text-[#e6c363] font-bold' : 'text-slate-400'}`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV Export</span>
        </button>
      </div>
    </header>
  );
};
