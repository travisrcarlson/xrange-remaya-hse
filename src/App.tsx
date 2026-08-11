import React, { useState, useEffect } from 'react';
import { Equipment, InspectionRecord } from './types/hse';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { EquipmentManager } from './components/EquipmentManager';
import { MobileInspectionPortal } from './components/MobileInspectionPortal';
import { QRStudio } from './components/QRStudio';
import { CSVExportView } from './components/CSVExportView';
import { QRScannerModal } from './components/QRScannerModal';
import { InspectionDetailModal } from './components/InspectionDetailModal';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'equipment' | 'qr_studio' | 'inspection' | 'csv'>('dashboard');
  
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);

  // Selection states
  const [inspectTargetId, setInspectTargetId] = useState<string | undefined>(undefined);
  const [studioTargetId, setStudioTargetId] = useState<string | undefined>(undefined);
  
  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedInspectionRecord, setSelectedInspectionRecord] = useState<InspectionRecord | null>(null);

  // Load initial data & check URL hash for scanned QR code deep link
  useEffect(() => {
    refreshData();
    checkUrlHashRoute();

    const handleHashChange = () => {
      checkUrlHashRoute();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const refreshData = () => {
    setEquipmentList(StorageService.getEquipment());
    setInspections(StorageService.getInspections());
  };

  const checkUrlHashRoute = () => {
    const hash = window.location.hash;
    if (hash.includes('inspect')) {
      const match = hash.match(/id=([A-Za-z0-9-]+)/);
      if (match && match[1]) {
        setInspectTargetId(match[1].toUpperCase());
        setActiveTab('inspection');
      } else {
        setActiveTab('inspection');
      }
    }
  };

  // Handlers
  const handleAddEquipment = (newItem: Omit<Equipment, 'createdAt'>) => {
    StorageService.addEquipment(newItem);
    refreshData();
  };

  const handleUpdateEquipment = (updated: Equipment) => {
    StorageService.updateEquipment(updated);
    refreshData();
  };

  const handleDeleteEquipment = (id: string) => {
    StorageService.deleteEquipment(id);
    refreshData();
  };

  const handleSubmitInspection = (record: Omit<InspectionRecord, 'id'>) => {
    StorageService.addInspection(record);
    refreshData();
  };

  const handleStartInspection = (equipmentId: string) => {
    setInspectTargetId(equipmentId);
    setActiveTab('inspection');
  };

  const handleOpenQRStudio = (equipmentId?: string) => {
    setStudioTargetId(equipmentId);
    setActiveTab('qr_studio');
  };

  const handleResetData = () => {
    if (confirm('Reset to initial XRange Remaya sample equipment & inspection data?')) {
      StorageService.resetToDefaultData();
      refreshData();
    }
  };

  const handleQRScanSuccess = (scannedText: string) => {
    // Check if scannedText is a full URL or direct tag ID
    let tagId = scannedText;
    if (scannedText.includes('id=')) {
      const match = scannedText.match(/id=([A-Za-z0-9-]+)/);
      if (match && match[1]) tagId = match[1];
    }
    setInspectTargetId(tagId.toUpperCase());
    setActiveTab('inspection');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Topbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setActiveTab('equipment')}
        onOpenScanner={() => setIsScannerOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <DashboardOverview
            equipmentList={equipmentList}
            inspections={inspections}
            onStartInspection={handleStartInspection}
            onOpenQRStudio={handleOpenQRStudio}
            onViewInspectionDetail={(record) => setSelectedInspectionRecord(record)}
            onExportCSV={() => setActiveTab('csv')}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentManager
            equipmentList={equipmentList}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onStartInspection={handleStartInspection}
            onOpenQRStudio={handleOpenQRStudio}
          />
        )}

        {activeTab === 'qr_studio' && (
          <QRStudio
            equipmentList={equipmentList}
            selectedSingleId={studioTargetId}
          />
        )}

        {activeTab === 'inspection' && (
          <MobileInspectionPortal
            equipmentList={equipmentList}
            selectedEquipmentId={inspectTargetId}
            onSubmitInspection={handleSubmitInspection}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'csv' && (
          <CSVExportView
            equipmentList={equipmentList}
            inspections={inspections}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">XRange Remaya HSE Division</span>
            <span>•</span>
            <span>Equipment Inspection & Compliance System</span>
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            Compliant with ISO 45001 & NFPA 10 Portable Fire Extinguisher Standards
          </div>
        </div>
      </footer>

      {/* Live Camera Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />

      {/* Inspection Detail Popover */}
      <InspectionDetailModal
        record={selectedInspectionRecord}
        onClose={() => setSelectedInspectionRecord(null)}
      />

    </div>
  );
}
