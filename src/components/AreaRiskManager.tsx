import React, { useState } from 'react';
import { AreaLocation, BuildingLocation, RoomLocation, Equipment, RoomOccupancyType, RiskLevel } from '../types/hse';
import { evaluateRoomRiskAssessment } from '../utils/riskAssessmentEngine';
import { 
  Building2, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers, 
  Flame, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  X,
  ShieldAlert,
  ChevronRight,
  Home,
  DoorOpen,
  Ruler,
  AlertCircle
} from 'lucide-react';

interface AreaRiskManagerProps {
  areas: AreaLocation[];
  buildings: BuildingLocation[];
  rooms: RoomLocation[];
  equipmentList: Equipment[];
  onAddArea: (area: Omit<AreaLocation, 'id'>) => void;
  onDeleteArea: (id: string) => void;
  onAddBuilding: (bldg: Omit<BuildingLocation, 'id'>) => void;
  onDeleteBuilding: (id: string) => void;
  onAddRoom: (room: Omit<RoomLocation, 'id'>) => void;
  onDeleteRoom: (id: string) => void;
  onQuickAddExtinguisherForRoom: (room: RoomLocation, recommendedSubtype: string) => void;
}

export const AreaRiskManager: React.FC<AreaRiskManagerProps> = ({
  areas,
  buildings,
  rooms,
  equipmentList,
  onAddArea,
  onDeleteArea,
  onAddBuilding,
  onDeleteBuilding,
  onAddRoom,
  onDeleteRoom,
  onQuickAddExtinguisherForRoom
}) => {
  // Navigation State
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areas[0]?.id || 'AREA-HQ');
  const selectedArea = areas.find(a => a.id === selectedAreaId) || areas[0];

  const areaBuildings = buildings.filter(b => b.areaId === selectedAreaId);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(areaBuildings[0]?.id || '');
  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || areaBuildings[0];

  const buildingRooms = rooms.filter(r => r.buildingId === (selectedBuilding?.id || ''));

  // Modals
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // Form Fields for Area
  const [areaName, setAreaName] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [areaDesc, setAreaDesc] = useState('');

  // Form Fields for Building
  const [bldgName, setBldgName] = useState('');
  const [bldgCode, setBldgCode] = useState('');

  // Form Fields for Room
  const [roomName, setRoomName] = useState('');
  const [roomFloor, setRoomFloor] = useState('Ground Floor');
  const [roomAreaSqMeters, setRoomAreaSqMeters] = useState(150);
  const [roomOccupancy, setRoomOccupancy] = useState<RoomOccupancyType>('tactical_range');
  const [roomRiskLevel, setRoomRiskLevel] = useState<RiskLevel>('high');
  const [roomNotes, setRoomNotes] = useState('');

  // Handlers
  const handleSaveArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaName || !areaCode) return;
    onAddArea({
      name: areaName,
      code: areaCode.toUpperCase(),
      description: areaDesc
    });
    setIsAddAreaOpen(false);
    setAreaName('');
    setAreaCode('');
  };

  const handleSaveBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bldgName || !selectedArea) return;
    onAddBuilding({
      areaId: selectedArea.id,
      areaName: selectedArea.name,
      name: bldgName,
      code: bldgCode ? bldgCode.toUpperCase() : bldgName.toUpperCase().slice(0, 6)
    });
    setIsAddBuildingOpen(false);
    setBldgName('');
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName || !selectedArea || !selectedBuilding) return;
    onAddRoom({
      areaId: selectedArea.id,
      areaName: selectedArea.name,
      buildingId: selectedBuilding.id,
      buildingName: selectedBuilding.name,
      name: roomName,
      floorLevel: roomFloor,
      areaSqMeters: Number(roomAreaSqMeters),
      occupancyType: roomOccupancy,
      riskLevel: roomRiskLevel,
      notes: roomNotes
    });
    setIsAddRoomOpen(false);
    setRoomName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#121214] via-[#1c1c1f] to-[#28282d] p-6 rounded-2xl border border-[#ff5500]/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-[#ff5500] font-bold text-xs tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Hierarchical Location & Risk Assessment Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Area ➔ Building ➔ Room Structure & Risk
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Navigate areas, manage buildings, register rooms, and calculate NFPA 10 fire extinguisher coverage requirements.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsAddAreaOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#ff5500]/10 hover:bg-[#ff5500]/20 text-[#ff7700] border border-[#ff5500]/40 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Area</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: AREA SELECTOR TABS (D1, D2, S, XRange HQ Area, General Island Area) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#ff5500]" />
            <span>1. Select Area Sector:</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{areas.length} Areas Registered</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {areas.map((area) => {
            const isSelected = area.id === selectedAreaId;
            const bCount = buildings.filter(b => b.areaId === area.id).length;

            return (
              <button
                key={area.id}
                onClick={() => {
                  setSelectedAreaId(area.id);
                  const firstBldg = buildings.find(b => b.areaId === area.id);
                  if (firstBldg) setSelectedBuildingId(firstBldg.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected 
                    ? 'bg-[#18181b] border-[#ff5500] text-white shadow-xl shadow-orange-950/40 ring-1 ring-[#ff5500]'
                    : 'bg-[#121214] border-[#27272a] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#ff5500] block">
                    AREA CODE: {area.code}
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-1">{area.name}</h3>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#27272a]">
                  <span className="font-mono text-slate-400">{bCount} Buildings</span>
                  {isSelected && <ChevronRight className="w-4 h-4 text-[#ff5500]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: BUILDINGS INSIDE SELECTED AREA */}
      {selectedArea && (
        <div className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#27272a] pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-[#ff5500]" />
              <h3 className="text-base font-bold text-white">
                2. Buildings inside <span className="text-[#ff7700] uppercase font-mono">{selectedArea.name}</span>:
              </h3>
            </div>

            <button
              onClick={() => setIsAddBuildingOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Building to {selectedArea.code}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {areaBuildings.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No buildings registered under {selectedArea.name} yet.</p>
            ) : (
              areaBuildings.map((bldg) => {
                const isSelected = bldg.id === selectedBuildingId || bldg.id === selectedBuilding?.id;
                const rCount = rooms.filter(r => r.buildingId === bldg.id).length;

                return (
                  <button
                    key={bldg.id}
                    onClick={() => setSelectedBuildingId(bldg.id)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-[#27272a] border-[#ff5500] text-white ring-1 ring-[#ff5500]'
                        : 'bg-[#121214] border-[#27272a] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-[#ff5500]" />
                    <span>{bldg.name}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#121214] text-[10px] text-slate-400 font-mono">
                      {rCount} rooms
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STEP 3: ROOMS INSIDE SELECTED BUILDING & INITIAL RISK ASSESSMENT */}
      {selectedBuilding && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#18181b] p-4 rounded-2xl border border-[#27272a]">
            <div className="flex items-center space-x-2">
              <DoorOpen className="w-5 h-5 text-[#ff5500]" />
              <h3 className="text-sm font-bold text-white">
                3. Rooms in <span className="text-[#ff7700]">{selectedBuilding.name}</span> ({selectedArea.name}) & Risk Assessment:
              </h3>
            </div>

            <button
              onClick={() => setIsAddRoomOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white text-xs font-bold shadow-md transition-all mt-2 sm:mt-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Add Room to {selectedBuilding.name}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buildingRooms.length === 0 ? (
              <div className="md:col-span-2 py-12 text-center text-slate-500 bg-[#18181b] rounded-2xl border border-[#27272a]">
                No rooms registered in {selectedBuilding.name} yet. Click "+ Add Room" to set up rooms and calculate fire risk!
              </div>
            ) : (
              buildingRooms.map((room) => {
                const risk = evaluateRoomRiskAssessment(room, equipmentList);

                const isOptimal = risk.coverageStatus === 'OPTIMAL';
                const isUnder = risk.coverageStatus === 'UNDER_EQUIPPED';
                const isWrong = risk.coverageStatus === 'WRONG_TYPE';

                return (
                  <div
                    key={room.id}
                    className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] hover:border-[#ff5500]/40 shadow-xl flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded border border-[#ff5500]/30">
                              {room.id}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                              {room.occupancyType.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white mt-1">{room.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {selectedArea.name} ➔ {selectedBuilding.name} • {room.floorLevel} ({room.areaSqMeters} m²)
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm(`Delete room ${room.name}?`)) onDeleteRoom(room.id);
                          }}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-all"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* NFPA 10 Risk Assessment Summary Card */}
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

                        <div className="space-y-1 text-slate-300 text-[11px]">
                          {risk.recommendations.map((rec, i) => (
                            <p key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{rec}</span>
                            </p>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-700/40 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                          <span>Rec Subtype: <strong>{risk.recommendedSubtypes.join(', ')}</strong></span>
                          <span className="uppercase text-amber-400 font-bold">Risk: {room.riskLevel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Auto-Assign Recommended Extinguisher */}
                    <div className="pt-3 border-t border-[#27272a] flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{selectedBuilding.name}</span>

                      {!isOptimal && (
                        <button
                          onClick={() => onQuickAddExtinguisherForRoom(room, risk.recommendedSubtypes[0])}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-bold text-xs shadow-md transition-all"
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
        </div>
      )}

      {/* Modal 1: Add Area */}
      {isAddAreaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <h3 className="font-bold text-sm text-white">Add New Area Sector</h3>
              <button onClick={() => setIsAddAreaOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveArea} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Area Name *</label>
                <input type="text" required value={areaName} onChange={e => setAreaName(e.target.value)} placeholder="e.g. D1, D2, XRange HQ Area" className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100 font-semibold" />
              </div>
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Area Code *</label>
                <input type="text" required value={areaCode} onChange={e => setAreaCode(e.target.value)} placeholder="e.g. D1, HQ, ISLAND" className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100 font-mono" />
              </div>
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea rows={2} value={areaDesc} onChange={e => setAreaDesc(e.target.value)} placeholder="Enter area notes..." className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-200" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg">Save New Area</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Building */}
      {isAddBuildingOpen && selectedArea && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <h3 className="font-bold text-sm text-white">Add Building inside {selectedArea.name}</h3>
              <button onClick={() => setIsAddBuildingOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveBuilding} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Building Name *</label>
                <input type="text" required value={bldgName} onChange={e => setBldgName(e.target.value)} placeholder="e.g. Building 1, AF2R" className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100 font-semibold" />
              </div>
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Building Code</label>
                <input type="text" value={bldgCode} onChange={e => setBldgCode(e.target.value)} placeholder="e.g. HQ-B1, AF2R" className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100 font-mono" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg">Save Building</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Room */}
      {isAddRoomOpen && selectedBuilding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 text-xs my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
              <h3 className="font-bold text-sm text-white">Add Room in {selectedBuilding.name} ({selectedArea.name})</h3>
              <button onClick={() => setIsAddRoomOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveRoom} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Room Name *</label>
                <input type="text" required value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="e.g. Server Room 101, Firing Bay 1" className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100 font-semibold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Floor Level</label>
                  <input type="text" value={roomFloor} onChange={e => setRoomFloor(e.target.value)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100" />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Area Size ($m^2$)</label>
                  <input type="number" required min={10} value={roomAreaSqMeters} onChange={e => setRoomAreaSqMeters(Number(e.target.value))} className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-100 font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Occupancy Risk Type</label>
                  <select value={roomOccupancy} onChange={e => setRoomOccupancy(e.target.value as any)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-200">
                    <option value="ammo_pyro_store">Ammunition & Pyrotechnics 💥</option>
                    <option value="tactical_range">Tactical Firing Range 🎯</option>
                    <option value="electrical_server">Server & Electrical Room ⚡</option>
                    <option value="vehicle_workshop">Vehicle Workshop 🚜</option>
                    <option value="kitchen_mess">Kitchen & Mess 🍳</option>
                    <option value="office_hq">Office & Administrative 🏢</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Hazard Risk Level</label>
                  <select value={roomRiskLevel} onChange={e => setRoomRiskLevel(e.target.value as any)} className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-200">
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                    <option value="critical">Critical Risk</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Notes</label>
                <textarea rows={2} value={roomNotes} onChange={e => setRoomNotes(e.target.value)} placeholder="Specific risk notes..." className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-2.5 text-slate-200" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg">Save Room & Calculate Risk</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
