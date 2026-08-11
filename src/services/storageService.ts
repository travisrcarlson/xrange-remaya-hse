import { Equipment, InspectionRecord } from '../types/hse';

const STORAGE_EQUIPMENT_KEY = 'xrange_hse_equipment_v1';
const STORAGE_INSPECTIONS_KEY = 'xrange_hse_inspections_v1';

// Pre-generated sample image data (SVG base64 string for demo preview)
const SAMPLE_INSPECTION_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%230f172a"/><circle cx="300" cy="200" r="140" fill="%231e293b" stroke="%2310b981" stroke-width="4"/><path d="M280 120 L320 120 L320 160 L280 160 Z" fill="%23ef4444"/><rect x="270" y="160" width="60" height="150" rx="10" fill="%23ef4444"/><path d="M330 180 Q370 200 360 250" fill="none" stroke="%23f59e0b" stroke-width="8" stroke-linecap="round"/><text x="300" y="340" fill="%2338bdf8" font-family="sans-serif" font-size="18" text-anchor="middle" font-weight="bold">XRANGE REMAYA - VERIFIED INSPECTION</text><text x="300" y="365" fill="%2394a3b8" font-family="monospace" font-size="14" text-anchor="middle">TAG: FE-101 | PASS | GAUGE NORMAL</text></svg>`;

const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'FE-101',
    type: 'fire_extinguisher',
    subtype: 'CO2 (Carbon Dioxide)',
    name: '5kg CO2 Extinguisher - Range A South',
    location: 'Firing Bay 3, Wall Mount A2',
    zone: 'Tactical Shooting Range A',
    serialNumber: 'SN-XR-2024-8891',
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
    location: 'Bunker 4 Main Entrance Corridor',
    zone: 'Ammunition & Pyrotechnics Store',
    serialNumber: 'SN-XR-2024-9042',
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
    location: 'Hangar B North Ramp',
    zone: 'Vehicle Maintenance Depot',
    serialNumber: 'SN-XR-2023-4102',
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
    location: 'HQ Building, Server Rack B',
    zone: 'Command & Control Center',
    serialNumber: 'SN-XR-2024-1109',
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
    location: 'Main Armory Annex - Catering Area',
    zone: 'Main Armory & Gear Room',
    serialNumber: 'SN-XR-2024-3321',
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
    serialNumber: 'SN-XR-2023-7720',
    capacity: '9 kg',
    manufactureDate: '2022-04-18',
    expiryDate: '2027-04-18',
    lastInspectionDate: '2026-08-08',
    nextInspectionDue: '2026-09-08',
    status: 'maintenance_required',
    notes: 'Pressure gauge pointer in RED under-charge zone during last test. Replacement scheduled.',
    createdAt: '2024-02-05T08:00:00.000Z'
  },
  // Future extensibility HSE equipment
  {
    id: 'FAK-201',
    type: 'first_aid_kit',
    subtype: 'Type B Tactical Range Kit',
    name: 'Tactical Range First Aid Station A',
    location: 'Range Control Room A, Wall Bracket 1',
    zone: 'Tactical Shooting Range A',
    serialNumber: 'FAK-XR-8812',
    capacity: '25 Person Trauma',
    manufactureDate: '2024-01-01',
    expiryDate: '2026-12-31',
    lastInspectionDate: '2026-08-01',
    nextInspectionDue: '2026-09-01',
    status: 'compliant',
    notes: 'Includes tourniquets, chest seals, compression bandages.',
    createdAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 'FAK-202',
    type: 'first_aid_kit',
    subtype: 'Type A Industrial Kit',
    name: 'Depot Industrial First Aid Cabinet',
    location: 'Workshop Office Main Wall',
    zone: 'Vehicle Maintenance Depot',
    serialNumber: 'FAK-XR-9943',
    capacity: '50 Person Industrial',
    manufactureDate: '2023-08-15',
    expiryDate: '2026-08-30',
    lastInspectionDate: '2026-07-20',
    nextInspectionDue: '2026-08-20',
    status: 'due_soon',
    notes: 'Check burn dress refills and eye wash bottles.',
    createdAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: 'EWS-301',
    type: 'eyewash_station',
    subtype: 'Dual Bottle Wall Unit',
    name: 'Ammo Handling Emergency Eyewash',
    location: 'Bunker 4 Prep Area',
    zone: 'Ammunition & Pyrotechnics Store',
    serialNumber: 'EWS-XR-1002',
    capacity: '2 x 500ml Saline',
    manufactureDate: '2024-03-01',
    expiryDate: '2027-03-01',
    lastInspectionDate: '2026-08-04',
    nextInspectionDue: '2026-09-04',
    status: 'compliant',
    notes: 'Bottles sealed and tamper strips clear.',
    createdAt: '2024-03-05T08:00:00.000Z'
  },
  {
    id: 'AED-401',
    type: 'aed',
    subtype: 'Automated External Defibrillator',
    name: 'MedCenter Main Lobby AED Unit',
    location: 'Medical Post Reception',
    zone: 'Medical Emergency Post',
    serialNumber: 'AED-Zoll-3391',
    capacity: 'Adult/Child Dual Padset',
    manufactureDate: '2023-11-10',
    expiryDate: '2028-11-10',
    lastInspectionDate: '2026-08-01',
    nextInspectionDue: '2026-09-01',
    status: 'compliant',
    notes: 'Self-test green LED indicator active. Battery at 98%.',
    createdAt: '2024-03-05T08:00:00.000Z'
  }
];

const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INSP-2026-001',
    equipmentId: 'FE-101',
    equipmentType: 'fire_extinguisher',
    equipmentName: '5kg CO2 Extinguisher - Range A South',
    location: 'Firing Bay 3, Wall Mount A2',
    zone: 'Tactical Shooting Range A',
    inspectorName: 'Captain Ahmed Al-Mansoori',
    inspectorRole: 'Lead HSE Safety Officer',
    inspectionDate: '2026-08-01T09:30:00.000Z',
    status: 'PASS',
    pressureGauge: 'NORMAL',
    tamperSealIntact: true,
    physicalCondition: 'EXCELLENT',
    hoseCondition: 'INTACT',
    accessibility: 'CLEAR',
    photoDataUrl: SAMPLE_INSPECTION_PHOTO,
    notes: 'Routine monthly inspection. Pin intact, pressure indicator dead center in green band.'
  },
  {
    id: 'INSP-2026-002',
    equipmentId: 'FE-106',
    equipmentType: 'fire_extinguisher',
    equipmentName: '9kg Heavy Powder - Gate 1 Guard Post',
    location: 'Main Entry Barrier Post',
    zone: 'Main Gatehouse & Security',
    inspectorName: 'Officer Tariq Rashid',
    inspectorRole: 'Field Inspection Technician',
    inspectionDate: '2026-08-08T14:15:00.000Z',
    status: 'FAIL',
    pressureGauge: 'LOW',
    tamperSealIntact: false,
    physicalCondition: 'MINOR_DAMAGE',
    hoseCondition: 'INTACT',
    accessibility: 'CLEAR',
    photoDataUrl: SAMPLE_INSPECTION_PHOTO,
    notes: 'Gauge pressure dropped below minimum threshold. Pin seal broken. Tagged out for maintenance.',
    correctiveActionRequired: 'Send to central workshop for recharge and re-certification.'
  },
  {
    id: 'INSP-2026-003',
    equipmentId: 'FAK-201',
    equipmentType: 'first_aid_kit',
    equipmentName: 'Tactical Range First Aid Station A',
    location: 'Range Control Room A, Wall Bracket 1',
    zone: 'Tactical Shooting Range A',
    inspectorName: 'Captain Ahmed Al-Mansoori',
    inspectorRole: 'Lead HSE Safety Officer',
    inspectionDate: '2026-08-01T11:00:00.000Z',
    status: 'PASS',
    pressureGauge: 'N/A',
    tamperSealIntact: true,
    physicalCondition: 'EXCELLENT',
    hoseCondition: 'N/A',
    accessibility: 'CLEAR',
    suppliesReplenished: true,
    sanitizationChecked: true,
    photoDataUrl: SAMPLE_INSPECTION_PHOTO,
    notes: 'Trauma supplies fully stocked. Expiry dates verified up to Dec 2026.'
  }
];

export class StorageService {
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

    // Automatically update the equipment's last inspected and next due dates & status
    const eq = this.getEquipmentById(record.equipmentId);
    if (eq) {
      const inspDate = new Date(record.inspectionDate);
      const nextDue = new Date(inspDate);
      nextDue.setDate(nextDue.getDate() + 30); // 30 days default monthly check

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
    localStorage.setItem(STORAGE_EQUIPMENT_KEY, JSON.stringify(INITIAL_EQUIPMENT));
    localStorage.setItem(STORAGE_INSPECTIONS_KEY, JSON.stringify(INITIAL_INSPECTIONS));
  }
}
