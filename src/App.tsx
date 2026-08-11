import React, { useState, useEffect } from 'react';
import { AreaLocation, BuildingLocation, RoomLocation, Equipment, InspectionRecord } from './types/hse';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AreaRiskManager } from './components/AreaRiskManager';
import { EquipmentManager } from './components/EquipmentManager';
import { MobileInspectionPortal } from './components/MobileInspectionPortal';
import { QRStudio } from './components/QRStudio';
import { CSVExportView } from './components/CSVExportView';
import { QRScannerModal } from './components/QRScannerModal';
import { InspectionDetailModal } from './components/InspectionDetailModal';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'areas' | 'equipment' | 'qr_studio' | 'inspection' | 'csv'>('dashboard');
  
  const [areas, setAreas] = useState<AreaLocation[]>([]);
  const [buildings, setBuildings] = useState<BuildingLocation[]>([]);
  const [rooms, setRooms] = useState<RoomLocation[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);

  // Selection states
  const [inspectTargetId, setInspectTargetId] = useState<string | undefined>(undefined);
  const [studioTargetId, setStudioTargetId] = useState<string | undefined>(undefined);
  
  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedInspectionRecord, setSelectedInspectionRecord] = useState<InspectionRecord | null>(null);

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
    setAreas(StorageService.getAreas());
    setBuildings(StorageService.getBuildings());
    setRooms(StorageService.getRooms());
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

  // Area Handlers
  const handleAddArea = (area: Omit<AreaLocation, 'id'>) => {
    StorageService.addArea(area);
    refreshData();
  };

  const handleDeleteArea = (id: string) => {
    StorageService.deleteArea(id);
    refreshData();
  };

  // Building Handlers
  const handleAddBuilding = (bldg: Omit<BuildingLocation, 'id'>) => {
    StorageService.addBuilding(bldg);
    refreshData();
  };

  const handleDeleteBuilding = (id: string) => {
    StorageService.deleteBuilding(id);
    refreshData();
  };

  // Room Handlers
  const handleAddRoom = (room: Omit<RoomLocation, 'id'>) => {
    StorageService.addRoom(room);
    refreshData();
  };

  const handleDeleteRoom = (id: string) => {
    StorageService.deleteRoom(id);
    refreshData();
  };

  // Equipment Handlers
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

  const handleQuickAddExtinguisherForRoom = (room: RoomLocation, recommendedSubtype: string) => {
    setActiveTab('equipment');
  };

  const handleResetData = () => {
    if (confirm('Reset to initial EDGE Group Remaya sample equipment & area data?')) {
      StorageService.resetToDefaultData();
      refreshData();
    }
  };

  const handleQRScanSuccess = (scannedText: string) => {
    let tagId = scannedText;
    if (scannedText.includes('id=')) {
      const match = scannedText.match(/id=([A-Za-z0-9-]+)/);
      if (match && match[1]) tagId = match[1];
    }
    setInspectTargetId(tagId.toUpperCase());
    setActiveTab('inspection');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0f] text-slate-100 selection:bg-[#ff5500] selection:text-white">
      
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

        {activeTab === 'areas' && (
          <AreaRiskManager
            areas={areas}
            buildings={buildings}
            rooms={rooms}
            equipmentList={equipmentList}
            onAddArea={handleAddArea}
            onDeleteArea={handleDeleteArea}
            onAddBuilding={handleAddBuilding}
            onDeleteBuilding={handleDeleteBuilding}
            onAddRoom={handleAddRoom}
            onDeleteRoom={handleDeleteRoom}
            onQuickAddExtinguisherForRoom={handleQuickAddExtinguisherForRoom}
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
      <footer className="no-print border-t border-[#27272a] bg-[#0d0d0f] py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#ff7700]">EDGE Group • Remaya HSE Division</span>
            <span>•</span>
            <span>Area ➔ Building ➔ Room Risk & Equipment System</span>
          </div>
          <div className="font-mono text-[11px] text-slate-500">
            NFPA 10 Portable Fire Extinguisher Standard Compliant
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
