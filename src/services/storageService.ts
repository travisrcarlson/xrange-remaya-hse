import { BuildingArea, Equipment, InspectionRecord } from '../types/hse';

const STORAGE_AREAS_KEY = 'edge_hse_areas_v1';
const STORAGE_EQUIPMENT_KEY = 'edge_hse_equipment_v1';
const STORAGE_INSPECTIONS_KEY = 'edge_hse_inspections_v1';

// Pre-generated sample image data
const SAMPLE_INSPECTION_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23121214"/><circle cx="300" cy="200" r="140" fill="%231c1c1f" stroke="%23ff5500" stroke-width="4"/><path d="M280 120 L320 120 L320 160 L280 160 Z" fill="%23ef4444"/><rect x="270" y="160" width="60" height="150" rx="10" fill="%23ef4444"/><path d="M330 180 Q370 200 360 250" fill="none" stroke="%23ff5500" stroke-width="8" stroke-linecap="round"/><text x="300" y="340" fill="%23ff5500" font-family="sans-serif" font-size="18" text-anchor="middle" font-weight="bold">EDGE GROUP - VERIFIED HSE INSPECTION</text><text x="300" y="365" fill="%23a1a1aa" font-family="monospace" font-size="14" text-anchor="middle">TAG: FE-101 | PASS | GAUGE NORMAL</text></svg>`;

const INITIAL_AREAS: BuildingArea[] = [
  {
    id: 'AREA-101',
    name: 'Firing Bay 1 & 2',
    building: 'Sector 1 Main Range',
    zone: 'Tactical Shooting Range A',
    floorLevel: 'Ground Floor',
    areaSqMeters: 250,
    occupancyType: 'tactical_range',
    riskLevel: 'high',
    notes: 'Live tactical firing bay. Requires CO2 and Heavy Powder extinguishers at exit doors.'
  },
  {
    id: 'AREA-102',
    name: 'Ammunition Vault 1',
    building: 'Bunker 4',
    zone: 'Ammunition & Pyrotechnics Store',
    floorLevel: 'Basement 1',
    areaSqMeters: 180,
    occupancyType: 'ammo_pyro_store',
    riskLevel: 'critical',
    notes: 'High explosive pyrotechnics vault. Strict NFPA 10 powder & foam requirements.'
  },
  {
    id: 'AREA-103',
    name: 'Main Server & Comms Room',
    building: 'HQ Main',
    zone: 'Command & Control Center',
    floorLevel: '1st Floor',
    areaSqMeters: 120,
    occupancyType: 'electrical_server',
    riskLevel: 'high',
    notes: 'Clean agent CO2 mandated to prevent electrical gear damage during discharge.'
  },
  {
    id: 'AREA-104',
    name: 'Heavy Vehicle Bay',
    building: 'Hangar B',
    zone: 'Vehicle Maintenance Depot',
    floorLevel: 'Ground Floor',
    areaSqMeters: 350,
    occupancyType: 'vehicle_workshop',
    riskLevel: 'high',
    notes: 'Hydraulic oils and diesel fuels present. AFFF Foam & Powder required.'
  },
  {
    id: 'AREA-105',
    name: 'Armory Mess Hall Kitchen',
    building: 'HQ Vault',
    zone: 'Main Armory & Gear Room',
    floorLevel: 'Ground Floor',
    areaSqMeters: 90,
    occupancyType: 'kitchen_mess',
    riskLevel: 'medium',
    notes: 'Commercial kitchen range hood. Class K wet chemical unit required.'
  }
];

const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'FE-101',
    type: 'fire_extinguisher',
    subtype: 'CO2 (Carbon Dioxide)',
    name: '5kg CO2 Extinguisher - Range A South',
    location: 'Firing Bay 1 & 2',
    zone: 'Tactical Shooting Range A',
    areaId: 'AREA-101',
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
    name: '6kg Dry Powder - Ammo Storage Vault 1',
    location: 'Ammunition Vault 1',
    zone: 'Ammunition & Pyrotechnics Store',
    areaId: 'AREA-102',
    serialNumber: 'SN-EDGE-2024-9042',
    capacity: '6 kg',
    manufactureDate: '2023-05-20',
    expiryDate: '2028-05-20',
    lastInspectionDate: '2026-07-10',
    nextInspectionDue: '2026-08-10', // Due soon!
    status: 'due_soon',
    notes: 'Requires monthly gauge verify prior to ammo transport ops.',
    createdAt: '2024-01-10T08:00:00.000Z'
  },
  {
    id: 'FE-103',
    type: 'fire_extinguisher',
    subtype: 'AFFF Foam',
    name: '9L Foam Extinguisher - Heavy Vehicle Bay',
    location: 'Heavy Vehicle Bay',
    zone: 'Vehicle Maintenance Depot',
    areaId: 'AREA-104',
    serialNumber: 'SN-EDGE-2023-4102',
    capacity: '9 Liters',
    manufactureDate: '2022-11-10',
    expiryDate: '2027-11-10',
    lastInspectionDate: '2026-06-15',
    nextInspectionDue: '2026-07-15', // Overdue!
    status: 'overdue',
    notes: 'Overdue for monthly inspection. Needs immediate HSE review.',
    createdAt: '2024-01-10T08:00:00.000Z'
  },
  {
    id: 'FE-104',
    type: 'fire_extinguisher',
    subtype: 'CO2 (Carbon Dioxide)',
    name: '5kg CO2 Extinguisher - Server Room',
    location: 'Main Server & Comms Room',
    zone: 'Command & Control Center',
    areaId: 'AREA-103',
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
    id: 'FE-105',
    type: 'fire_extinguisher',
    subtype: 'Wet Chemical (Class K)',
    name: '6L Wet Chemical - Kitchen/Mess Hall',
    location: 'Armory Mess Hall Kitchen',
    zone: 'Main Armory & Gear Room',
    areaId: 'AREA-105',
    serialNumber: 'SN-EDGE-2024-3321',
    capacity: '6 Liters',
    manufactureDate: '2023-09-12',
    expiryDate: '2028-09-12',
    lastInspectionDate: '2026-08-02',
    nextInspectionDue: '2026-09-02',
    status: 'compliant',
    notes: 'Class K kitchen grease fire extinguisher.',
    createdAt: '2024-02-05T08:00:00.000Z'
  },
  {
    id: 'FE-106',
    type: 'fire_extinguisher',
    subtype: 'ABC Dry Powder',
    name: '9kg Heavy Powder - Gate 1 Guard Post',
    location: 'Main Entry Barrier Post',
    zone: 'Main Gatehouse & Security',
    serialNumber: 'SN-EDGE-2023-7720',
    capacity: '9 kg',
    manufactureDate: '2022-04-18',
    expiryDate: '2027-04-18',
    lastInspectionDate: '2026-08-08',
    nextInspectionDue: '2026-09-08',
    status: 'maintenance_required',
    notes: 'Pressure gauge pointer in RED under-charge zone during last test.',
    createdAt: '2024-02-05T08:00:00.000Z'
  },
  {
    id: 'FAK-201',
    type: 'first_aid_kit',
    subtype: 'Type B Tactical Range Kit',
    name: 'Tactical Range First Aid Station A',
    location: 'Firing Bay 1 & 2',
    zone: 'Tactical Shooting Range A',
    areaId: 'AREA-101',
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
    equipmentName: '5kg CO2 Extinguisher - Range A South',
    location: 'Firing Bay 1 & 2',
    zone: 'Tactical Shooting Range A',
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
  // Area Management
  public static getAreas(): BuildingArea[] {
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

  public static saveAreas(areas: BuildingArea[]): void {
    localStorage.setItem(STORAGE_AREAS_KEY, JSON.stringify(areas));
  }

  public static addArea(area: Omit<BuildingArea, 'id'>): BuildingArea {
    const areas = this.getAreas();
    const newArea: BuildingArea = {
      ...area,
      id: `AREA-${100 + areas.length + 1}`
    };
    const updated = [newArea, ...areas];
    this.saveAreas(updated);
    return newArea;
  }

  public static updateArea(area: BuildingArea): void {
    const areas = this.getAreas();
    const updated = areas.map(a => a.id === area.id ? area : a);
    this.saveAreas(updated);
  }

  public static deleteArea(id: string): void {
    const areas = this.getAreas();
    const updated = areas.filter(a => a.id !== id);
    this.saveAreas(updated);
  }

  // Equipment Management
  public static getEquipment(): Equipment[] {
    const raw = localStorage.getItem(STORAGE_EQUIPMENT_KEY);
    if (!raw) {
      this.saveEquipment(INITIAL_EQUIPMENT);
      return INITIAL_EQUIPMENT;
    }
    try {
      return JSON.parse(raw);
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
      createdAt: new Date().toISOString()
    };
    const updated = [fullItem, ...list.filter(e => e.id !== fullItem.id)];
    this.saveEquipment(updated);
    return fullItem;
  }

  public static updateEquipment(updatedItem: Equipment): void {
    const list = this.getEquipment();
    const updated = list.map(item => item.id === updatedItem.id ? updatedItem : item);
    this.saveEquipment(updated);
  }

  public static deleteEquipment(id: string): void {
    const list = this.getEquipment();
    const updated = list.filter(item => item.id !== id);
    this.saveEquipment(updated);
  }

  // Inspection Management
  public static getInspections(): InspectionRecord[] {
    const raw = localStorage.getItem(STORAGE_INSPECTIONS_KEY);
    if (!raw) {
      this.saveInspections(INITIAL_INSPECTIONS);
      return INITIAL_INSPECTIONS;
    }
    try {
      return JSON.parse(raw);
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
    localStorage.setItem(STORAGE_EQUIPMENT_KEY, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(STORAGE_INSPECTIONS_KEY, JSON.stringify(INITIAL_INSPECTIONS));
  }
}
