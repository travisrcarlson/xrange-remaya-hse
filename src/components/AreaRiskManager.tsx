import React, { useState } from 'react';
import { BuildingArea, Equipment, RoomOccupancyType, RiskLevel, XRANGE_ZONES } from '../types/hse';
import { evaluateAreaRiskAssessment } from '../utils/riskAssessmentEngine';
import { 
  Building2, 
  ShieldAlert, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Flame, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  X,
  Sparkles,
  Info,
  Ruler,
  AlertCircle
} from 'lucide-react';

interface AreaRiskManagerProps {
  areas: BuildingArea[];
  equipmentList: Equipment[];
  onAddArea: (area: Omit<BuildingArea, 'id'>) => void;
  onUpdateArea: (area: BuildingArea) => void;
  onDeleteArea: (id: string) => void;
  onQuickAddExtinguisherForArea: (area: BuildingArea, recommendedSubtype: string) => void;
}

export const AreaRiskManager: React.FC<AreaRiskManagerProps> = ({
  areas,
  equipmentList,
  onAddArea,
  onUpdateArea,
  onDeleteArea,
  onQuickAddExtinguisherForArea
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<BuildingArea | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBuilding, setFormBuilding] = useState('Sector 1');
  const [formZone, setFormZone] = useState('Tactical Shooting Range A');
  const [formFloor, setFormFloor] = useState('Ground Floor');
  const [formAreaSqMeters, setFormAreaSqMeters] = useState(150);
  const [formOccupancyType, setFormOccupancyType] = useState<RoomOccupancyType>('tactical_range');
  const [formRiskLevel, setFormRiskLevel] = useState<RiskLevel>('high');
  const [formNotes, setFormNotes] = useState('');

  const handleOpenAddModal = () => {
    setEditingArea(null);
    setFormName('Firing Bay 3');
    setFormBuilding('Sector 1');
    setFormZone(XRANGE_ZONES[0].name);
    setFormFloor('Ground Floor');
    setFormAreaSqMeters(180);
    setFormOccupancyType('tactical_range');
    setFormRiskLevel('high');
    setFormNotes('High volume firing bay requiring CO2 and Dry Powder coverage.');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (area: BuildingArea) => {
    setEditingArea(area);
    setFormName(area.name);
    setFormBuilding(area.building);
    setFormZone(area.zone);
    setFormFloor(area.floorLevel);
    setFormAreaSqMeters(area.areaSqMeters);
    setFormOccupancyType(area.occupancyType);
    setFormRiskLevel(area.riskLevel);
    setFormNotes(area.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    if (editingArea) {
      onUpdateArea({
        ...editingArea,
        name: formName,
        building: formBuilding,
        zone: formZone,
        floorLevel: formFloor,
        areaSqMeters: Number(formAreaSqMeters),
        occupancyType: formOccupancyType,
        riskLevel: formRiskLevel,
        notes: formNotes
      });
    } else {
      onAddArea({
        name: formName,
        building: formBuilding,
        zone: formZone,
        floorLevel: formFloor,
        areaSqMeters: Number(formAreaSqMeters),
        occupancyType: formOccupancyType,
        riskLevel: formRiskLevel,
        notes: formNotes
      });
    }

    setIsModalOpen(false);
  };

  // Filtered areas
  const filteredAreas = areas.filter((area) => {
    const matchesSearch =
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.zone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOcc = occupancyFilter === 'all' || area.occupancyType === occupancyFilter;

    const evalResult = evaluateAreaRiskAssessment(area, equipmentList);
    const matchesStatus = statusFilter === 'all' || evalResult.coverageStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesOcc && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#121214] via-[#1c1c1f] to-[#28282d] p-6 rounded-2xl border border-[#ff5500]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#ff5500]/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-[#ff5500] font-bold text-xs tracking-wider uppercase mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>EDGE Group HSE Building Risk Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Building Areas, Rooms & Initial Risk Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Register facility rooms, evaluate fire hazard levels (NFPA 10 Standards), and determine required fire extinguisher counts & types.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] hover:from-[#e64c00] hover:to-[#ff6600] text-white font-extrabold text-xs shadow-lg shadow-orange-950/40 border border-orange-400/40 transition-all transform hover:-translate-y-0.5 relative z-10 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add New Area / Room</span>
        </button>
      </div>

      {/* Filter Controls Toolbar */}
      <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] shadow-md flex flex-wrap items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Room Name, Building, or Sector Zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border border-[#27272a] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#ff5500] transition-colors"
          />
        </div>

        {/* Occupancy Type Filter */}
        <select
          value={occupancyFilter}
          onChange={(e) => setOccupancyFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff5500]"
        >
          <option value="all">All Occupancy Risk Types</option>
          <option value="tactical_range">Tactical Firing Range 🎯</option>
          <option value="ammo_pyro_store">Ammunition & Pyrotechnics 💥</option>
          <option value="electrical_server">Server & Electrical Room ⚡</option>
          <option value="vehicle_workshop">Vehicle Workshop 🚜</option>
          <option value="kitchen_mess">Kitchen & Mess 🍳</option>
          <option value="office_hq">Office & Administrative 🏢</option>
        </select>

        {/* Risk Assessment Coverage Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff5500]"
        >
          <option value="all">All Risk Coverage Statuses</option>
          <option value="optimal">Optimal Coverage ✓</option>
          <option value="under_equipped">Under-Equipped ⚠️</option>
          <option value="wrong_type">Risk Type Mismatch ⚠️</option>
          <option value="deficient">Critical Deficient Gap ❌</option>
        </select>

      </div>

      {/* Building Rooms & Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAreas.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center text-slate-500 bg-[#18181b] rounded-2xl border border-[#27272a]">
            No building rooms matched your filter options.
          </div>
        ) : (
          filteredAreas.map((area) => {
            const risk = evaluateAreaRiskAssessment(area, equipmentList);

            const isOptimal = risk.coverageStatus === 'OPTIMAL';
            const isUnder = risk.coverageStatus === 'UNDER_EQUIPPED';
            const isWrong = risk.coverageStatus === 'WRONG_TYPE';
            const isDeficient = risk.coverageStatus === 'DEFICIENT';

            return (
              <div 
                key={area.id}
                className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] hover:border-[#ff5500]/40 shadow-xl flex flex-col justify-between space-y-4 transition-all"
              >
                {/* Card Top Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded border border-[#ff5500]/30">
                          {area.id}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                          {area.occupancyType.replace('_', ' ')}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-1">{area.name}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Building: <strong className="text-slate-200">{area.building}</strong> • {area.floorLevel} ({area.areaSqMeters} m²)
                      </p>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(area)}
                        className="p-1.5 rounded-lg bg-[#121214] hover:bg-[#27272a] text-slate-300 border border-[#27272a] transition-all"
                        title="Edit Area"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete area ${area.name}?`)) onDeleteArea(area.id);
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-all"
                        title="Delete Area"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* NFPA 10 Risk Assessment Summary Box */}
                  <div className={`mt-4 p-4 rounded-xl border text-xs space-y-2 ${
                    isOptimal ? 'bg-emerald-950/20 border-emerald-500/30' :
                    isUnder ? 'bg-amber-950/30 border-amber-500/30' :
                    isWrong ? 'bg-orange-950/30 border-orange-500/30' :
                    'bg-rose-950/40 border-rose-500/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold uppercase flex items-center space-x-1.5">
                        {isOptimal ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> :
                         isUnder ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                         isWrong ? <AlertCircle className="w-4 h-4 text-orange-400" /> :
                         <XCircle className="w-4 h-4 text-rose-400" />}
                        <span className={isOptimal ? 'text-emerald-300' : isUnder ? 'text-amber-300' : 'text-rose-300'}>
                          NFPA 10 Risk Status: {risk.coverageStatus}
                        </span>
                      </span>

                      <span className="font-mono text-[11px] text-slate-300 font-bold">
                        Installed: <strong className="text-white">{risk.currentExtinguisherCount}</strong> / Req: <strong className="text-[#ff5500]">{risk.minRequiredExtinguishers}</strong>
                      </span>
                    </div>

                    {/* Recommendations */}
                    <div className="space-y-1 text-slate-300 text-[11px]">
                      {risk.recommendations.map((rec, i) => (
                        <p key={i} className="flex items-start gap-1">
                          <span>•</span>
                          <span>{rec}</span>
                        </p>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-700/40 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                      <span>Rec Types: <strong>{risk.recommendedSubtypes.join(', ')}</strong></span>
                      <span className="uppercase text-amber-400 font-bold">Risk: {area.riskLevel}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Auto-Assign Extinguisher */}
                <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{area.zone}</span>

                  {!isOptimal && (
                    <button
                      onClick={() => onQuickAddExtinguisherForArea(area, risk.recommendedSubtypes[0])}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff5500] to-[#ff7700] hover:from-[#e64c00] text-white font-bold text-xs shadow-md transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Auto-Assign {risk.recommendedSubtypes[0]}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Area Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
            
            <div className="px-6 py-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#ff5500]" />
                <h2 className="text-base font-bold text-white">
                  {editingArea ? `Edit Area: ${editingArea.id}` : 'Add Building Area & Conduct Risk Assessment'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Room / Area Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ammunition Prep Room 2"
                  className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-100 font-semibold focus:border-[#ff5500]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Building / Structure</label>
                  <input
                    type="text"
                    required
                    value={formBuilding}
                    onChange={(e) => setFormBuilding(e.target.value)}
                    placeholder="e.g. Bunker 4"
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Floor Level</label>
                  <input
                    type="text"
                    value={formFloor}
                    onChange={(e) => setFormFloor(e.target.value)}
                    placeholder="e.g. Ground Floor, Basement"
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Sector Zone *</label>
                  <select
                    value={formZone}
                    onChange={(e) => setFormZone(e.target.value)}
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-200"
                  >
                    {XRANGE_ZONES.map(z => (
                      <option key={z.id} value={z.name}>{z.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Area Size (sq. meters) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={10000}
                    value={formAreaSqMeters}
                    onChange={(e) => setFormAreaSqMeters(Number(e.target.value))}
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Occupancy Risk Type *</label>
                  <select
                    value={formOccupancyType}
                    onChange={(e) => setFormOccupancyType(e.target.value as RoomOccupancyType)}
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="ammo_pyro_store">Ammunition & Pyrotechnics 💥</option>
                    <option value="tactical_range">Tactical Firing Range 🎯</option>
                    <option value="electrical_server">Server & Electrical Room ⚡</option>
                    <option value="vehicle_workshop">Vehicle Workshop 🚜</option>
                    <option value="kitchen_mess">Kitchen & Mess 🍳</option>
                    <option value="office_hq">Office & Administrative 🏢</option>
                    <option value="medical_post">Medical Post 🏥</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Hazard Risk Level *</label>
                  <select
                    value={formRiskLevel}
                    onChange={(e) => setFormRiskLevel(e.target.value as RiskLevel)}
                    className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                    <option value="critical">Critical Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Area Notes / Risk Observations</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Enter specific risk observations or equipment bracket instructions..."
                  className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-3 text-slate-200"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg shadow-orange-950/40"
                >
                  {editingArea ? 'Save Area Changes' : 'Register Area & Calculate NFPA Coverage'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#27272a] text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
