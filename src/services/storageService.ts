import { AreaLocation, BuildingLocation, RoomLocation, Equipment, InspectionRecord } from '../types/hse';

const STORAGE_AREAS_KEY = 'edge_hse_areas_hierarchical_v2';
const STORAGE_BUILDINGS_KEY = 'edge_hse_buildings_hierarchical_v2';
const STORAGE_ROOMS_KEY = 'edge_hse_rooms_hierarchical_v2';
const STORAGE_EQUIPMENT_KEY = 'edge_hse_equipment_v2';
const STORAGE_INSPECTIONS_KEY = 'edge_hse_inspections_v2';

const SAMPLE_INSPECTION_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23121214"/><circle cx="300" cy="200" r="140" fill="%231c1c1f" stroke="%23ff5500" stroke-width="4"/><path d="M280 120 L320 120 L320 160 L280 160 Z" fill="%23ef4444"/><rect x="270" y="160" width="60" height="150" rx="10" fill="%23ef4444"/><path d="M330 180 Q370 200 360 250" fill="none" stroke="%23ff5500" stroke-width="8" stroke-linecap="round"/><text x="300" y="340" fill="%23ff5500" font-family="sans-serif" font-size="18" text-anchor="middle" font-weight="bold">EDGE GROUP - VERIFIED HSE INSPECTION</text><text x="300" y="365" fill="%23a1a1aa" font-family="monospace" font-size="14" text-anchor="middle">TAG: FE-101 | PASS | GAUGE NORMAL</text></svg>`;

// Default Areas per user spec
const INITIAL_AREAS: AreaLocation[] = [
  { id: 'AREA-D1', name: 'D1', code: 'D1', description: 'Sector D1 Range & Facility Area' },
  { id: 'AREA-D2', name: 'D2', code: 'D2', description: 'Sector D2 Range Complex' },
  { id: 'AREA-S', name: 'S', code: 'S', description: 'Sector S High Security Area' },
  { id: 'AREA-HQ', name: 'XRange HQ Area', code: 'HQ', description: 'XRange Central Command & Headquarters' },
  { id: 'AREA-ISLAND', name: 'General Island Area', code: 'ISLAND', description: 'Perimeter, Entry Gates & Island Facilities' }
];

// Default Buildings per user spec
const INITIAL_BUILDINGS: BuildingLocation[] = [
  { id: 'BLDG-AF2R', areaId: 'AREA-D1', areaName: 'D1', name: 'AF2R', code: 'AF2R', description: 'AF2R Range Facility Building' },
  { id: 'BLDG-HQ-1', areaId: 'AREA-HQ', areaName: 'XRange HQ Area', name: 'Building 1', code: 'HQ-B1', description: 'HQ Building 1 - Command Ops' },
  { id: 'BLDG-HQ-2', areaId: 'AREA-HQ', areaName: 'XRange HQ Area', name: 'Building 2', code: 'HQ-B2', description: 'HQ Building 2 - Administration' },
  { id: 'BLDG-HQ-3', areaId: 'AREA-HQ', areaName: 'XRange HQ Area', name: 'Building 3', code: 'HQ-B3', description: 'HQ Building 3 - Main Armory' },
  { id: 'BLDG-HQ-4', areaId: 'AREA-HQ', areaName: 'XRange HQ Area', name: 'Building 4', code: 'HQ-B4', description: 'HQ Building 4 - Ammo Storage Bunker' },
  { id: 'BLDG-D2-MAIN', areaId: 'AREA-D2', areaName: 'D2', name: 'Range Complex D2', code: 'D2-RC', description: 'D2 Firing Range Building' },
  { id: 'BLDG-S-VAULT', areaId: 'AREA-S', areaName: 'S', name: 'Sector S Vault', code: 'S-V1', description: 'Sector S High Security Vault' },
  { id: 'BLDG-GATE-1', areaId: 'AREA-ISLAND', areaName: 'General Island Area', name: 'Main Gatehouse', code: 'GATE-1', description: 'Island Main Entry Barrier' }
];

// Default Rooms per user spec
const INITIAL_ROOMS: RoomLocation[] = [
  {
    id: 'ROOM-D1-101',
    areaId: 'AREA-D1',
    areaName: 'D1',
    buildingId: 'BLDG-AF2R',
    buildingName: 'AF2R',
    name: 'AF2R Firing Bay 1',
    floorLevel: 'Ground Floor',
    areaSqMeters: 220,
    occupancyType: 'tactical_range',
    riskLevel: 'high',
    notes: 'Live tactical range bay requiring CO2 and Dry Powder extinguishers.'
  },
  {
    id: 'ROOM-HQ1-101',
    areaId: 'AREA-HQ',
    areaName: 'XRange HQ Area',
    buildingId: 'BLDG-HQ-1',
    buildingName: 'Building 1',
    name: 'Server & Comms Room 101',
    floorLevel: '1st Floor',
    areaSqMeters: 95,
    occupancyType: 'electrical_server',
    riskLevel: 'high',
    notes: 'Clean Agent CO2 required to protect electronics.'
  },
  {
    id: 'ROOM-HQ3-101',
    areaId: 'AREA-HQ',
    areaName: 'XRange HQ Area',
    buildingId: 'BLDG-HQ-3',
    buildingName: 'Building 3',
    name: 'Armory Gear Vault',
    floorLevel: 'Ground Floor',
    areaSqMeters: 140,
    occupancyType: 'office_hq',
    riskLevel: 'medium',
    notes: 'Armory gear storage room.'
  },
  {
    id: 'ROOM-HQ4-101',
    areaId: 'AREA-HQ',
    areaName: 'XRange HQ Area',
    buildingId: 'BLDG-HQ-4',
    buildingName: 'Building 4',
    name: 'Ammunition Storage Vault 1',
    floorLevel: 'Basement 1',
    areaSqMeters: 180,
    occupancyType: 'ammo_pyro_store',
    riskLevel: 'critical',
    notes: 'High explosive pyrotechnics vault. NFPA 10 powder & foam required.'
  }
];

const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'FE-101',
    type: 'fire_extinguisher',
    subtype: 'CO2 (Carbon Dioxide)',
    name: '5kg CO2 Extinguisher - AF2R Bay 1',
    areaId: 'AREA-D1',
    areaName: 'D1',
    buildingId: 'BLDG-AF2R',
    buildingName: 'AF2R',
    roomId: 'ROOM-D1-101',
    roomName: 'AF2R Firing Bay 1',
    location: 'D1 • AF2R • AF2R Firing Bay 1',
    zone: 'D1',
    serialNumber: 'SN-EDGE-2024-8891',
    capacity: '5 kg',
    manufactureDate: '2023-01-15',
    expiryDate: '2028-01-15',
    lastInspectionDate: '2026-08-01',
    nextInspectionDue: '2026-09-01',
    status: 'compliant',
    notes: 'Pressure normal, safety clip sealed. High traffic tactical range area.',
    createdAt: '2024-01-10T08:00:00.000Z'
  },
  {
    id: 'FE-102',
    type: 'fire_extinguisher',
    subtype: 'ABC Dry Powder',
    name: '6kg Dry Powder - Ammo Vault 1',
    areaId: 'AREA-HQ',
    areaName: 'XRange HQ Area',
    buildingId: 'BLDG-HQ-4',
    buildingName: 'Building 4',
    roomId: 'ROOM-HQ4-101',
    roomName: 'Ammunition Storage Vault 1',
    location: 'XRange HQ Area • Building 4 • Ammunition Storage Vault 1',
    zone: 'XRange HQ Area',
    serialNumber: 'SN-EDGE-2024-9042',
    capacity: '6 kg',
    manufactureDate: '2023-05-20',
    expiryDate: '2028-05-20',
    lastInspectionDate: '2026-07-10',
    nextInspectionDue: '2026-08-10',
    status: 'due_soon',
    notes: 'Requires monthly gauge verify prior to ammo transport ops.',
    createdAt: '2024-01-10T08:00:00.000Z'
  },
  {
    id: 'FE-104',
    type: 'fire_extinguisher',
    subtype: 'CO2 (Carbon Dioxide)',
    name: '5kg CO2 Extinguisher - HQ Server Room',
    areaId: 'AREA-HQ',
    areaName: 'XRange HQ Area',
    buildingId: 'BLDG-HQ-1',
    buildingName: 'Building 1',
    roomId: 'ROOM-HQ1-101',
    roomName: 'Server & Comms Room 101',
    location: 'XRange HQ Area • Building 1 • Server & Comms Room 101',
    zone: 'XRange HQ Area',
    serialNumber: 'SN-EDGE-2024-1109',
    capacity: '5 kg',
    manufactureDate: '2024-02-01',
    expiryDate: '2029-02-01',
    lastInspectionDate: '2026-08-05',
    nextInspectionDue: '2026-09-05',
    status: 'compliant',
    notes: 'Clean agent CO2 for electrical electronics protection.',
    createdAt: '2024-02-05T08:00:00.000Z'
  },
  {
    id: 'FAK-201',
    type: 'first_aid_kit',
    subtype: 'Type B Tactical Range Kit',
    name: 'AF2R Tactical Range First Aid Station',
    areaId: 'AREA-D1',
    areaName: 'D1',
    buildingId: 'BLDG-AF2R',
    buildingName: 'AF2R',
    roomId: 'ROOM-D1-101',
    roomName: 'AF2R Firing Bay 1',
    location: 'D1 • AF2R • AF2R Firing Bay 1',
    zone: 'D1',
    serialNumber: 'FAK-EDGE-8812',
    capacity: '25 Person Trauma',
    manufactureDate: '2024-01-01',
    expiryDate: '2026-12-31',
    lastInspectionDate: '2026-08-01',
    nextInspectionDue: '2026-09-01',
    status: 'compliant',
    notes: 'Includes tourniquets, chest seals, compression bandages.',
    createdAt: '2024-01-15T08:00:00.000Z'
  }
];

const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INSP-2026-001',
    equipmentId: 'FE-101',
    equipmentType: 'fire_extinguisher',
    equipmentName: '5kg CO2 Extinguisher - AF2R Bay 1',
    areaName: 'D1',
    buildingName: 'AF2R',
    roomName: 'AF2R Firing Bay 1',
    location: 'D1 • AF2R • AF2R Firing Bay 1',
    zone: 'D1',
    inspectorName: 'Captain Ahmed Al-Mansoori',
    inspectorRole: 'Lead EDGE HSE Safety Officer',
    inspectionDate: '2026-08-01T09:30:00.000Z',
    status: 'PASS',
    pressureGauge: 'NORMAL',
    tamperSealIntact: true,
    physicalCondition: 'EXCELLENT',
    hoseCondition: 'INTACT',
    accessibility: 'CLEAR',
    photoDataUrl: SAMPLE_INSPECTION_PHOTO,
    notes: 'Routine monthly inspection. Pin intact, pressure indicator dead center in green band.'
  }
];

export class StorageService {
  // --- AREA MANAGEMENT ---
  public static getAreas(): AreaLocation[] {
    const raw = localStorage.getItem(STORAGE_AREAS_KEY);
    if (!raw) {
      this.saveAreas(INITIAL_AREAS);
      return INITIAL_AREAS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AREAS;
    }
  }

  public static saveAreas(areas: AreaLocation[]): void {
    localStorage.setItem(STORAGE_AREAS_KEY, JSON.stringify(areas));
  }

  public static addArea(area: Omit<AreaLocation, 'id'>): AreaLocation {
    const areas = this.getAreas();
    const newArea: AreaLocation = {
      ...area,
      id: `AREA-${area.code.toUpperCase().replace(/\s+/g, '-')}`
    };
    const updated = [newArea, ...areas];
    this.saveAreas(updated);
    return newArea;
  }

  public static updateArea(area: AreaLocation): void {
    const areas = this.getAreas();
    const updated = areas.map(a => a.id === area.id ? area : a);
    this.saveAreas(updated);
  }

  public static deleteArea(id: string): void {
    const areas = this.getAreas();
    const updated = areas.filter(a => a.id !== id);
    this.saveAreas(updated);
  }

  // --- BUILDING MANAGEMENT ---
  public static getBuildings(): BuildingLocation[] {
    const raw = localStorage.getItem(STORAGE_BUILDINGS_KEY);
    if (!raw) {
      this.saveBuildings(INITIAL_BUILDINGS);
      return INITIAL_BUILDINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BUILDINGS;
    }
  }

  public static saveBuildings(buildings: BuildingLocation[]): void {
    localStorage.setItem(STORAGE_BUILDINGS_KEY, JSON.stringify(buildings));
  }

  public static addBuilding(bldg: Omit<BuildingLocation, 'id'>): BuildingLocation {
    const buildings = this.getBuildings();
    const newBldg: BuildingLocation = {
      ...bldg,
      id: `BLDG-${bldg.code.toUpperCase().replace(/\s+/g, '-')}`
    };
    const updated = [newBldg, ...buildings];
    this.saveBuildings(updated);
    return newBldg;
  }

  public static updateBuilding(bldg: BuildingLocation): void {
    const buildings = this.getBuildings();
    const updated = buildings.map(b => b.id === bldg.id ? bldg : b);
    this.saveBuildings(updated);
  }

  public static deleteBuilding(id: string): void {
    const buildings = this.getBuildings();
    const updated = buildings.filter(b => b.id !== id);
    this.saveBuildings(updated);
  }

  // --- ROOM MANAGEMENT ---
  public static getRooms(): RoomLocation[] {
    const raw = localStorage.getItem(STORAGE_ROOMS_KEY);
    if (!raw) {
      this.saveRooms(INITIAL_ROOMS);
      return INITIAL_ROOMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ROOMS;
    }
  }

  public static saveRooms(rooms: RoomLocation[]): void {
    localStorage.setItem(STORAGE_ROOMS_KEY, JSON.stringify(rooms));
  }

  public static addRoom(room: Omit<RoomLocation, 'id'>): RoomLocation {
    const rooms = this.getRooms();
    const newRoom: RoomLocation = {
      ...room,
      id: `ROOM-${100 + rooms.length + 1}`
    };
    const updated = [newRoom, ...rooms];
    this.saveRooms(updated);
    return newRoom;
  }

  public static updateRoom(room: RoomLocation): void {
    const rooms = this.getRooms();
    const updated = rooms.map(r => r.id === room.id ? room : r);
    this.saveRooms(updated);
  }

  public static deleteRoom(id: string): void {
    const rooms = this.getRooms();
    const updated = rooms.filter(r => r.id !== id);
    this.saveRooms(updated);
  }

  // --- EQUIPMENT MANAGEMENT ---
  public static getEquipment(): Equipment[] {
    const raw = localStorage.getItem(STORAGE_EQUIPMENT_KEY);
    if (!raw) {
      this.saveEquipment(INITIAL_EQUIPMENT);
      return INITIAL_EQUIPMENT;
    }
    try {
      const list: Equipment[] = JSON.parse(raw);
      return list.map(item => ({
        ...item,
        location: item.location || `${item.areaName || 'HQ'} • ${item.buildingName || 'Building'} • ${item.roomName || 'Room'}`,
        zone: item.zone || item.areaName || 'HQ'
      }));
    } catch {
      return INITIAL_EQUIPMENT;
    }
  }

  public static saveEquipment(equipment: Equipment[]): void {
    localStorage.setItem(STORAGE_EQUIPMENT_KEY, JSON.stringify(equipment));
  }

  public static getEquipmentById(id: string): Equipment | undefined {
    const list = this.getEquipment();
    return list.find((item) => item.id.toUpperCase() === id.toUpperCase());
  }

  public static addEquipment(newItem: Omit<Equipment, 'createdAt'>): Equipment {
    const list = this.getEquipment();
    const fullItem: Equipment = {
      ...newItem,
      id: newItem.id.trim().toUpperCase(),
      location: `${newItem.areaName} • ${newItem.buildingName} • ${newItem.roomName}`,
      zone: newItem.areaName,
      createdAt: new Date().toISOString()
    };
    const updated = [fullItem, ...list.filter(e => e.id !== fullItem.id)];
    this.saveEquipment(updated);
    return fullItem;
  }

  public static updateEquipment(updatedItem: Equipment): void {
    const list = this.getEquipment();
    const fullItem: Equipment = {
      ...updatedItem,
      location: `${updatedItem.areaName} • ${updatedItem.buildingName} • ${updatedItem.roomName}`,
      zone: updatedItem.areaName
    };
    const updated = list.map(item => item.id === fullItem.id ? fullItem : item);
    this.saveEquipment(updated);
  }

  public static deleteEquipment(id: string): void {
    const list = this.getEquipment();
    const updated = list.filter(item => item.id !== id);
    this.saveEquipment(updated);
  }

  // --- INSPECTIONS MANAGEMENT ---
  public static getInspections(): InspectionRecord[] {
    const raw = localStorage.getItem(STORAGE_INSPECTIONS_KEY);
    if (!raw) {
      this.saveInspections(INITIAL_INSPECTIONS);
      return INITIAL_INSPECTIONS;
    }
    try {
      const list: InspectionRecord[] = JSON.parse(raw);
      return list.map(item => ({
        ...item,
        location: item.location || `${item.areaName || 'HQ'} • ${item.buildingName || 'Building'} • ${item.roomName || 'Room'}`,
        zone: item.zone || item.areaName || 'HQ'
      }));
    } catch {
      return INITIAL_INSPECTIONS;
    }
  }

  public static saveInspections(inspections: InspectionRecord[]): void {
    localStorage.setItem(STORAGE_INSPECTIONS_KEY, JSON.stringify(inspections));
  }

  public static addInspection(record: Omit<InspectionRecord, 'id'>): InspectionRecord {
    const list = this.getInspections();
    const fullRecord: InspectionRecord = {
      ...record,
      location: `${record.areaName} • ${record.buildingName} • ${record.roomName}`,
      zone: record.areaName,
      id: `INSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    const updated = [fullRecord, ...list];
    this.saveInspections(updated);

    const eq = this.getEquipmentById(record.equipmentId);
    if (eq) {
      const inspDate = new Date(record.inspectionDate);
      const nextDue = new Date(inspDate);
      nextDue.setDate(nextDue.getDate() + 30);

      let newStatus = eq.status;
      if (record.status === 'PASS') {
        newStatus = 'compliant';
      } else if (record.status === 'PASS_WITH_REMARKS') {
        newStatus = 'compliant';
      } else if (record.status === 'FAIL') {
        newStatus = 'maintenance_required';
      }

      const updatedEq: Equipment = {
        ...eq,
        lastInspectionDate: inspDate.toISOString().split('T')[0],
        nextInspectionDue: nextDue.toISOString().split('T')[0],
        status: newStatus
      };
      this.updateEquipment(updatedEq);
    }

    return fullRecord;
  }

  public static resetToDefaultData(): void {
    localStorage.setItem(STORAGE_AREAS_KEY, JSON.stringify(INITIAL_AREAS));
    localStorage.setItem(STORAGE_BUILDINGS_KEY, JSON.stringify(INITIAL_BUILDINGS));
    localStorage.setItem(STORAGE_ROOMS_KEY, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(STORAGE_EQUIPMENT_KEY, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(STORAGE_INSPECTIONS_KEY, JSON.stringify(INITIAL_INSPECTIONS));
  }
}
