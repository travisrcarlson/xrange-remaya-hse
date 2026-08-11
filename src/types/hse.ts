export type EquipmentType = 
  | 'fire_extinguisher' 
  | 'first_aid_kit' 
  | 'eyewash_station' 
  | 'aed' 
  | 'fire_blanket';

export type ExtinguisherSubtype = 'co2' | 'dry_powder' | 'foam' | 'water' | 'wet_chemical';

export type FirstAidSubtype = 'tactical_range' | 'industrial_a' | 'vehicle_kit' | 'burn_station';

export type EquipmentStatus = 'compliant' | 'due_soon' | 'overdue' | 'maintenance_required' | 'out_of_service';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type RoomOccupancyType = 
  | 'ammo_pyro_store' 
  | 'tactical_range' 
  | 'electrical_server' 
  | 'vehicle_workshop' 
  | 'kitchen_mess' 
  | 'office_hq' 
  | 'medical_post';

// HIERARCHY: Area -> Building -> Room
export interface AreaLocation {
  id: string; // e.g. "AREA-D1", "AREA-HQ"
  name: string; // e.g. "D1", "D2", "S", "XRange HQ Area", "General Island Area"
  code: string;
  description?: string;
}

export interface BuildingLocation {
  id: string; // e.g. "BLDG-AF2R", "BLDG-HQ-1"
  areaId: string; // Parent Area ID
  areaName: string;
  name: string; // e.g. "AF2R", "Building 1", "Building 2", "Building 3", "Building 4"
  code: string;
  description?: string;
}

export interface RoomLocation {
  id: string; // e.g. "ROOM-101"
  areaId: string;
  areaName: string;
  buildingId: string;
  buildingName: string;
  name: string; // e.g. "Armory Vault 1", "Server Room 101"
  floorLevel: string; // e.g. "Ground Floor", "1st Floor"
  areaSqMeters: number; // e.g. 150 sq meters
  occupancyType: RoomOccupancyType;
  riskLevel: RiskLevel;
  notes?: string;
}

export interface RiskAssessmentResult {
  roomId: string;
  roomName: string;
  minRequiredExtinguishers: number;
  recommendedSubtypes: string[];
  currentExtinguisherCount: number;
  isCountSufficient: boolean;
  hasCorrectTypes: boolean;
  coverageStatus: 'OPTIMAL' | 'UNDER_EQUIPPED' | 'WRONG_TYPE' | 'DEFICIENT';
  recommendations: string[];
}

export interface Equipment {
  id: string; // e.g. "FE-101"
  qrCodeUrl?: string; // Direct link payload e.g. "https://xrange.remaya/inspect?id=FE-101"
  type: EquipmentType;
  subtype: string; // e.g. "CO2", "Dry Powder", "Type A Industrial"
  name: string; // e.g. "5kg CO2 Extinguisher - HQ Server Room"
  areaId: string; // Linked Area ID (e.g. "AREA-HQ")
  areaName: string; // e.g. "XRange HQ Area"
  buildingId: string; // Linked Building ID (e.g. "BLDG-HQ-1")
  buildingName: string; // e.g. "Building 1"
  roomId: string; // Linked Room ID (e.g. "ROOM-101")
  roomName: string; // e.g. "Server Room 101"
  location?: string; // Display string helper
  zone?: string; // Display string helper
  serialNumber: string;
  capacity: string; // e.g. "5kg", "50 Person Kit", "500ml Dual Wash"
  manufactureDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  lastInspectionDate?: string; // YYYY-MM-DD
  nextInspectionDue: string; // YYYY-MM-DD
  status: EquipmentStatus;
  notes?: string;
  createdAt: string;
}

export type InspectionResultStatus = 'PASS' | 'PASS_WITH_REMARKS' | 'FAIL';

export interface InspectionRecord {
  id: string;
  equipmentId: string;
  equipmentType: EquipmentType;
  equipmentName: string;
  areaName: string;
  buildingName: string;
  roomName: string;
  location?: string;
  zone?: string;
  inspectorName: string;
  inspectorRole: string;
  inspectionDate: string; // ISO date string
  status: InspectionResultStatus;
  // Extinguisher / General checklists
  pressureGauge: 'NORMAL' | 'LOW' | 'HIGH' | 'N/A';
  tamperSealIntact: boolean;
  physicalCondition: 'EXCELLENT' | 'GOOD' | 'MINOR_DAMAGE' | 'SEVERE_DAMAGE';
  hoseCondition: 'INTACT' | 'CRACKED' | 'MISSING' | 'N/A';
  accessibility: 'CLEAR' | 'PARTIALLY_BLOCKED' | 'BLOCKED';
  // First aid specific checklists
  suppliesReplenished?: boolean;
  sanitizationChecked?: boolean;
  // Evidence
  photoDataUrl?: string;
  notes: string;
  correctiveActionRequired?: string;
}

export interface LocationZoneOption {
  id: string;
  name: string;
  building: string;
}

export const XRANGE_ZONES: LocationZoneOption[] = [
  { id: 'zone_d1', name: 'D1', building: 'AF2R' },
  { id: 'zone_d2', name: 'D2', building: 'Range Complex D2' },
  { id: 'zone_s', name: 'S', building: 'Sector S Vault' },
  { id: 'zone_hq', name: 'XRange HQ Area', building: 'Building 1' },
  { id: 'zone_island', name: 'General Island Area', building: 'Main Gatehouse' },
];
