import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentType, AreaLocation, BuildingLocation, RoomLocation } from '../types/hse';
import { StorageService } from '../services/storageService';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Flame, 
  Search, 
  Plus, 
  QrCode, 
  ScanLine, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  X,
  Sparkles,
  MapPin,
  Building2,
  DoorOpen
} from 'lucide-react';

interface EquipmentManagerProps {
  equipmentList: Equipment[];
  onAddEquipment: (newItem: Omit<Equipment, 'createdAt'>) => void;
  onUpdateEquipment: (updated: Equipment) => void;
  onDeleteEquipment: (id: string) => void;
  onStartInspection: (equipmentId: string) => void;
  onOpenQRStudio: (equipmentId: string) => void;
}

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({
  equipmentList,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onStartInspection,
  onOpenQRStudio
}) => {
  const areas = StorageService.getAreas();
  const buildings = StorageService.getBuildings();
  const rooms = StorageService.getRooms();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Modal State for Add / Edit Equipment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formType, setFormType] = useState<EquipmentType>('fire_extinguisher');
  const [formSubtype, setFormSubtype] = useState('CO2 (Carbon Dioxide)');
  const [formName, setFormName] = useState('');
  
  // Cascading Selection: Area -> Building -> Room
  const [formAreaId, setFormAreaId] = useState<string>(areas[0]?.id || 'AREA-HQ');
  const availableBuildings = buildings.filter(b => b.areaId === formAreaId);
  
  const [formBuildingId, setFormBuildingId] = useState<string>(availableBuildings[0]?.id || '');
  const availableRooms = rooms.filter(r => r.buildingId === formBuildingId);

  const [formRoomId, setFormRoomId] = useState<string>(availableRooms[0]?.id || '');

  const [formSerial, setFormSerial] = useState('');
  const [formCapacity, setFormCapacity] = useState('5 kg');
  const [formMfgDate, setFormMfgDate] = useState('2024-01-01');
  const [formExpDate, setFormExpDate] = useState('2029-01-01');
  const [formNotes, setFormNotes] = useState('');

  // When Area changes, update available buildings
  useEffect(() => {
    const bldgs = buildings.filter(b => b.areaId === formAreaId);
    if (bldgs.length > 0 && !bldgs.some(b => b.id === formBuildingId)) {
      setFormBuildingId(bldgs[0].id);
    }
  }, [formAreaId]);

  // When Building changes, update available rooms
  useEffect(() => {
    const rms = rooms.filter(r => r.buildingId === formBuildingId);
    if (rms.length > 0 && !rms.some(r => r.id === formRoomId)) {
      setFormRoomId(rms[0].id);
    }
  }, [formBuildingId]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    const count = equipmentList.length + 1;
    const autoTag = `FE-${100 + count}`;
    setFormId(autoTag);
    setFormType('fire_extinguisher');
    setFormSubtype('CO2 (Carbon Dioxide)');

    const defaultArea = areas[0] || { id: 'AREA-HQ', name: 'XRange HQ Area' };
    const defaultBldgs = buildings.filter(b => b.areaId === defaultArea.id);
    const defaultBldg = defaultBldgs[0] || { id: 'BLDG-HQ-1', name: 'Building 1' };
    const defaultRms = rooms.filter(r => r.buildingId === defaultBldg.id);
    const defaultRm = defaultRms[0] || { id: 'ROOM-HQ1-101', name: 'Server Room 101' };

    setFormAreaId(defaultArea.id);
    setFormBuildingId(defaultBldg.id);
    setFormRoomId(defaultRm.id);

    setFormName(`5kg CO2 Extinguisher - ${defaultRm.name}`);
    setFormSerial(`SN-EDGE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCapacity('5 kg');
    setFormMfgDate('2024-01-01');
    setFormExpDate('2029-01-01');
    setFormNotes('New unit added to master register.');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Equipment) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormType(item.type);
    setFormSubtype(item.subtype);
    setFormName(item.name);
    setFormAreaId(item.areaId);
    setFormBuildingId(item.buildingId);
    setFormRoomId(item.roomId);
    setFormSerial(item.serialNumber);
    setFormCapacity(item.capacity);
    setFormMfgDate(item.manufactureDate);
    setFormExpDate(item.expiryDate);
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName) return;

    const areaObj = areas.find(a => a.id === formAreaId) || { name: 'HQ' };
    const bldgObj = buildings.find(b => b.id === formBuildingId) || { name: 'Building 1' };
    const roomObj = rooms.find(r => r.id === formRoomId) || { name: 'Main Room' };

    const today = new Date().toISOString().split('T')[0];
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 30);
    const nextDueStr = nextDue.toISOString().split('T')[0];

    if (editingItem) {
      const updated: Equipment = {
        ...editingItem,
        id: formId.trim().toUpperCase(),
        type: formType,
        subtype: formSubtype,
        name: formName,
        areaId: formAreaId,
        areaName: areaObj.name,
        buildingId: formBuildingId,
        buildingName: bldgObj.name,
        roomId: formRoomId,
        roomName: roomObj.name,
        serialNumber: formSerial,
        capacity: formCapacity,
        manufactureDate: formMfgDate,
        expiryDate: formExpDate,
        notes: formNotes
      };
      onUpdateEquipment(updated);
    } else {
      const newEq: Omit<Equipment, 'createdAt'> = {
        id: formId.trim().toUpperCase(),
        type: formType,
        subtype: formSubtype,
        name: formName,
        areaId: formAreaId,
        areaName: areaObj.name,
        buildingId: formBuildingId,
        buildingName: bldgObj.name,
        roomId: formRoomId,
        roomName: roomObj.name,
        serialNumber: formSerial,
        capacity: formCapacity,
        manufactureDate: formMfgDate,
        expiryDate: formExpDate,
        lastInspectionDate: today,
        nextInspectionDue: nextDueStr,
        status: 'compliant',
        notes: formNotes
      };
      onAddEquipment(newEq);
    }

    setIsModalOpen(false);
  };

  // Filtered list logic
  const filteredList = equipmentList.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.roomName && item.roomName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.buildingName && item.buildingName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesArea = areaFilter === 'all' || item.areaId === areaFilter || item.areaName === areaFilter;

    return matchesSearch && matchesType && matchesStatus && matchesArea;
  });

  const currentAppDomain = window.location.origin + window.location.pathname;
  const qrLinkPayload = `${currentAppDomain}#inspect?id=${formId || 'FE-101'}`;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Flame className="w-7 h-7 text-[#ff5500]" />
            <span>Master HSE Equipment Register</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage fire extinguishers & HSE gear mapped across Areas ➔ Buildings ➔ Rooms with built-in QR Code Generator.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] hover:from-[#e64c00] text-white font-extrabold text-sm shadow-lg shadow-orange-950/40 border border-orange-400/40 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Add Equipment & Generate QR</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] shadow-md flex flex-wrap items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Tag ID, Name, Building, or Room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border border-[#27272a] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#ff5500] transition-colors"
          />
        </div>

        {/* Equipment Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff5500]"
        >
          <option value="all">All Equipment Types</option>
          <option value="fire_extinguisher">Fire Extinguishers 🧯</option>
          <option value="first_aid_kit">First Aid Kits 🩹</option>
          <option value="eyewash_station">Eyewash Stations 👁️</option>
          <option value="aed">AED Defibrillators ⚡</option>
        </select>

        {/* Area Filter */}
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff5500]"
        >
          <option value="all">All Areas (D1, D2, S, HQ, Island)</option>
          {areas.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff5500]"
        >
          <option value="all">All Compliance Statuses</option>
          <option value="compliant">Compliant (Passed)</option>
          <option value="due_soon">Due Soon (&lt; 30 Days)</option>
          <option value="overdue">Overdue</option>
          <option value="maintenance_required">Maintenance Required</option>
        </select>

      </div>

      {/* Equipment Table */}
      <div className="bg-[#18181b] rounded-2xl border border-[#27272a] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#121214] text-slate-400 border-b border-[#27272a] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Tag ID & Type</th>
                <th className="py-3.5 px-4">Equipment Name</th>
                <th className="py-3.5 px-4">Area ➔ Building ➔ Room Location</th>
                <th className="py-3.5 px-4">Last Inspected</th>
                <th className="py-3.5 px-4">Next Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions & QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No equipment matched your filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isCompliant = item.status === 'compliant';
                  const isDueSoon = item.status === 'due_soon';
                  const isOverdue = item.status === 'overdue';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      <td className="py-3.5 px-4 font-bold">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#121214] border border-[#27272a] flex items-center justify-center text-[#ff7700] font-mono">
                            {item.type === 'fire_extinguisher' ? '🧯' : '🩹'}
                          </div>
                          <div>
                            <span className="font-mono text-sm text-slate-100">{item.id}</span>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">{item.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200 block text-sm">{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.subtype} • Capacity: {item.capacity}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 font-bold block">
                          {item.areaName} ➔ {item.buildingName}
                        </span>
                        <span className="text-[11px] text-[#ff7700] flex items-center gap-1 font-mono">
                          <DoorOpen className="w-3 h-3 inline" />
                          {item.roomName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.lastInspectionDate || 'Not inspected'}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={isOverdue ? 'text-rose-400 font-bold' : isDueSoon ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                          {item.nextInspectionDue}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                          isCompliant ? 'badge-compliant' :
                          isDueSoon ? 'badge-due-soon' :
                          isOverdue ? 'badge-overdue' : 'badge-maintenance'
                        }`}>
                          {isCompliant ? <CheckCircle2 className="w-3 h-3" /> :
                           isDueSoon ? <Clock className="w-3 h-3" /> :
                           isOverdue ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{item.status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onStartInspection(item.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#ff5500]/20 hover:bg-[#ff5500]/30 text-[#ff7700] border border-[#ff5500]/40 font-bold text-xs flex items-center space-x-1 transition-all"
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => onOpenQRStudio(item.id)}
                            className="p-1.5 rounded-lg bg-[#121214] hover:bg-[#27272a] text-[#ff7700] border border-[#27272a] transition-all"
                            title="Print QR Badge"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg bg-[#121214] hover:bg-[#27272a] text-slate-300 border border-[#27272a] transition-all"
                            title="Edit Specs"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete equipment ${item.id}?`)) onDeleteEquipment(item.id);
                            }}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-all"
                            title="Delete Equipment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Equipment Modal with CASCADING AREA -> BUILDING -> ROOM SELECTORS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            
            <div className="px-6 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#ff5500]" />
                <h2 className="text-base font-bold text-white">
                  {editingItem ? `Edit Equipment: ${editingItem.id}` : 'Add New HSE Equipment & Generate Real-Time QR Code'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              
              <div className="md:col-span-2 space-y-4">
                
                {/* 3-TIER CASCADING LOCATION SELECTOR */}
                <div className="p-4 bg-[#121214] rounded-xl border border-[#27272a] space-y-3">
                  <span className="font-bold text-[#ff7700] uppercase tracking-wider block">Location Placement (Area ➔ Building ➔ Room)</span>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">1. Select Area *</label>
                      <select
                        value={formAreaId}
                        onChange={(e) => setFormAreaId(e.target.value)}
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-slate-200"
                      >
                        {areas.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">2. Select Building *</label>
                      <select
                        value={formBuildingId}
                        onChange={(e) => setFormBuildingId(e.target.value)}
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-slate-200"
                      >
                        {availableBuildings.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">3. Select Room *</label>
                      <select
                        value={formRoomId}
                        onChange={(e) => setFormRoomId(e.target.value)}
                        className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-slate-200"
                      >
                        {availableRooms.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Tag ID *</label>
                    <input type="text" required value={formId} onChange={e => setFormId(e.target.value.toUpperCase())} placeholder="e.g. FE-107" className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 font-mono text-[#ff7700] font-bold" />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Category *</label>
                    <select value={formType} onChange={e => setFormType(e.target.value as any)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-200">
                      <option value="fire_extinguisher">Fire Extinguisher 🧯</option>
                      <option value="first_aid_kit">First Aid Kit 🩹</option>
                      <option value="eyewash_station">Eyewash Station 👁️</option>
                      <option value="aed">AED Defibrillator ⚡</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Subtype / Spec *</label>
                    <input type="text" required value={formSubtype} onChange={e => setFormSubtype(e.target.value)} placeholder="e.g. CO2 5kg" className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-200" />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Equipment Name *</label>
                    <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. 5kg CO2 Extinguisher - Server Room" className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Serial Number</label>
                    <input type="text" value={formSerial} onChange={e => setFormSerial(e.target.value)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 font-mono text-slate-300" />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Mfg Date</label>
                    <input type="date" value={formMfgDate} onChange={e => setFormMfgDate(e.target.value)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-300" />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Expiry / Hydro Date</label>
                    <input type="date" value={formExpDate} onChange={e => setFormExpDate(e.target.value)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Notes</label>
                  <textarea rows={2} value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Installation notes..." className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-3 text-slate-200" />
                </div>

              </div>

              {/* QR Code Generator Preview Box */}
              <div className="bg-[#121214] p-5 rounded-xl border border-[#27272a] flex flex-col items-center justify-between text-center">
                <div className="w-full">
                  <span className="text-[#ff7700] font-bold uppercase text-[10px] block mb-3">Real-Time Scannable QR Code</span>
                  <div className="bg-white p-4 rounded-xl shadow-xl inline-block border-4 border-[#0d0d0f]">
                    <QRCodeSVG value={qrLinkPayload} size={150} level="H" includeMargin={true} />
                  </div>
                  <span className="font-mono text-sm font-extrabold text-white block mt-2">{formId || 'TAG-ID'}</span>
                  <span className="text-[11px] text-slate-400 truncate block mt-0.5 max-w-[200px] mx-auto">{formName}</span>
                </div>

                <div className="w-full mt-4 space-y-2">
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg">Save & Register QR Code</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-2 rounded-xl bg-[#27272a] text-slate-300 text-xs">Cancel</button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
