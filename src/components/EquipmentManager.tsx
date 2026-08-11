import React, { useState } from 'react';
import { Equipment, EquipmentType, XRANGE_ZONES, EquipmentStatus } from '../types/hse';
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
  Download, 
  X,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  Package
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
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // Modal State for Add / Edit Equipment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formType, setFormType] = useState<EquipmentType>('fire_extinguisher');
  const [formSubtype, setFormSubtype] = useState('CO2 (Carbon Dioxide)');
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formZone, setFormZone] = useState('Tactical Shooting Range A');
  const [formSerial, setFormSerial] = useState('');
  const [formCapacity, setFormCapacity] = useState('5 kg');
  const [formMfgDate, setFormMfgDate] = useState('2024-01-01');
  const [formExpDate, setFormExpDate] = useState('2029-01-01');
  const [formNotes, setFormNotes] = useState('');

  // Auto-generate tag ID helper
  const handleOpenAddModal = () => {
    setEditingItem(null);
    const count = equipmentList.length + 1;
    const autoTag = `FE-${100 + count}`;
    setFormId(autoTag);
    setFormType('fire_extinguisher');
    setFormSubtype('CO2 (Carbon Dioxide)');
    setFormName(`5kg CO2 Extinguisher - ${XRANGE_ZONES[0].name}`);
    setFormLocation('Main Wall Mount 1');
    setFormZone(XRANGE_ZONES[0].name);
    setFormSerial(`SN-XR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCapacity('5 kg');
    setFormMfgDate('2024-01-01');
    setFormExpDate('2029-01-01');
    setFormNotes('New unit added to master HSE register.');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Equipment) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormType(item.type);
    setFormSubtype(item.subtype);
    setFormName(item.name);
    setFormLocation(item.location);
    setFormZone(item.zone);
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
        location: formLocation,
        zone: formZone,
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
        location: formLocation,
        zone: formZone,
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
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || item.zone === zoneFilter;

    return matchesSearch && matchesType && matchesStatus && matchesZone;
  });

  // Generated QR payload link for live generator
  const currentAppDomain = window.location.origin + window.location.pathname;
  const qrLinkPayload = `${currentAppDomain}#inspect?id=${formId || 'FE-101'}`;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Flame className="w-7 h-7 text-emerald-400" />
            <span>Master HSE Equipment Register</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage fire extinguishers, first-aid kits, eyewash stations, and generate printable QR code badges.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Add Equipment & Generate QR</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Tag ID, Name, Serial, or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Equipment Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Equipment Types</option>
          <option value="fire_extinguisher">Fire Extinguishers 🧯</option>
          <option value="first_aid_kit">First Aid Kits 🩹</option>
          <option value="eyewash_station">Eyewash Stations 👁️</option>
          <option value="aed">AED Defibrillators ⚡</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Compliance Statuses</option>
          <option value="compliant">Compliant (Passed)</option>
          <option value="due_soon">Due Soon (&lt; 30 Days)</option>
          <option value="overdue">Overdue</option>
          <option value="maintenance_required">Maintenance Required / Failed</option>
        </select>

        {/* Zone Location Filter */}
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Range Sectors</option>
          {XRANGE_ZONES.map(z => (
            <option key={z.id} value={z.name}>{z.name}</option>
          ))}
        </select>

      </div>

      {/* Equipment Cards Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Tag ID & Type</th>
                <th className="py-3.5 px-4">Equipment Name & Subtype</th>
                <th className="py-3.5 px-4">Location Zone</th>
                <th className="py-3.5 px-4">Last Inspected</th>
                <th className="py-3.5 px-4">Next Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions & QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
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
                      
                      {/* Tag ID & Icon */}
                      <td className="py-3.5 px-4 font-bold">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-mono">
                            {item.type === 'fire_extinguisher' ? '🧯' : item.type === 'first_aid_kit' ? '🩹' : '⚡'}
                          </div>
                          <div>
                            <span className="font-mono text-sm text-slate-100">{item.id}</span>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">{item.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </td>

                      {/* Name & Subtype */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200 block text-sm">{item.name}</span>
                        <span className="text-[11px] text-slate-400">{item.subtype} • Capacity: {item.capacity}</span>
                      </td>

                      {/* Location Zone */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 font-medium block">{item.zone}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500 inline" />
                          {item.location}
                        </span>
                      </td>

                      {/* Last Inspected */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.lastInspectionDate || 'Not inspected'}
                      </td>

                      {/* Next Due Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className={isOverdue ? 'text-rose-400 font-bold' : isDueSoon ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                          {item.nextInspectionDue}
                        </span>
                      </td>

                      {/* Status Badge */}
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

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Inspect Button */}
                          <button
                            onClick={() => onStartInspection(item.id)}
                            title="Perform Mobile QR Inspection"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center space-x-1 transition-all"
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          {/* Print QR Label */}
                          <button
                            onClick={() => onOpenQRStudio(item.id)}
                            title="Generate & Print QR Badge"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 transition-all"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Specs"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${item.id} (${item.name})?`)) {
                                onDeleteEquipment(item.id);
                              }
                            }}
                            title="Delete Equipment"
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-all"
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

      {/* Add / Edit Equipment Modal with BUILT-IN REALTIME QR CODE GENERATOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {editingItem ? `Edit Equipment: ${editingItem.id}` : 'Add New Equipment & Generate QR Code'}
                  </h2>
                  <p className="text-xs text-slate-400">Instantly builds a scannable QR badge payload for field inspection.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Form Inputs */}
              <div className="md:col-span-2 space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Equipment Tag ID *</label>
                    <input
                      type="text"
                      required
                      value={formId}
                      onChange={(e) => setFormId(e.target.value.toUpperCase())}
                      placeholder="e.g. FE-107"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 font-bold focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category / Type *</label>
                    <select
                      value={formType}
                      onChange={(e) => {
                        const val = e.target.value as EquipmentType;
                        setFormType(val);
                        if (val === 'fire_extinguisher') setFormSubtype('CO2 (Carbon Dioxide)');
                        else if (val === 'first_aid_kit') setFormSubtype('Type B Tactical Range Kit');
                        else if (val === 'eyewash_station') setFormSubtype('Dual Bottle Wall Unit');
                        else if (val === 'aed') setFormSubtype('Automated Defibrillator');
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
                    >
                      <option value="fire_extinguisher">Fire Extinguisher 🧯</option>
                      <option value="first_aid_kit">First Aid Kit 🩹</option>
                      <option value="eyewash_station">Eyewash Station 👁️</option>
                      <option value="aed">AED Defibrillator ⚡</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subtype / Spec *</label>
                    <input
                      type="text"
                      required
                      value={formSubtype}
                      onChange={(e) => setFormSubtype(e.target.value)}
                      placeholder="e.g. ABC Dry Powder 6kg"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Equipment Name *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. 5kg CO2 Extinguisher - Range A"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sector Zone *</label>
                    <select
                      value={formZone}
                      onChange={(e) => setFormZone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
                    >
                      {XRANGE_ZONES.map(z => (
                        <option key={z.id} value={z.name}>{z.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Specific Location *</label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Firing Bay 4 Wall Bracket"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Serial Number</label>
                    <input
                      type="text"
                      value={formSerial}
                      onChange={(e) => setFormSerial(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Mfg Date</label>
                    <input
                      type="date"
                      value={formMfgDate}
                      onChange={(e) => setFormMfgDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Expiry / Hydro Date</label>
                    <input
                      type="date"
                      value={formExpDate}
                      onChange={(e) => setFormExpDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Officer Notes / Specs</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Enter any special installation instructions, bracket notes, or maintenance logs..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500"
                  ></textarea>
                </div>

              </div>

              {/* Right Column: REALTIME BUILT-IN QR CODE GENERATOR PREVIEW */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-between text-center">
                <div className="w-full">
                  <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold text-xs uppercase mb-3">
                    <QrCode className="w-4 h-4" />
                    <span>Real-Time QR Code Generator</span>
                  </div>

                  {/* QR Code Graphic Box */}
                  <div className="bg-white p-4 rounded-xl shadow-xl inline-block border-4 border-slate-900 mx-auto">
                    <QRCodeSVG
                      value={qrLinkPayload}
                      size={160}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div className="mt-3">
                    <span className="font-mono text-sm font-extrabold text-white block">{formId || 'TAG-ID'}</span>
                    <span className="text-[11px] text-slate-400 font-medium block truncate max-w-[200px] mx-auto">{formName || 'Equipment Name'}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">{formZone}</span>
                  </div>

                  <div className="mt-3 text-[10px] text-slate-500 bg-slate-900 p-2 rounded-lg border border-slate-800 font-mono break-all text-left">
                    <span className="text-slate-400 font-bold block mb-0.5">Scanned QR Target URL:</span>
                    {qrLinkPayload}
                  </div>
                </div>

                <div className="w-full mt-4 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all"
                  >
                    {editingItem ? 'Save Equipment Changes' : 'Save Equipment & Register QR Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
