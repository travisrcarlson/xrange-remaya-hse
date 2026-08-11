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

export interface BuildingArea {
  id: string; // e.g. "ROOM-101"
  name: string; // e.g. "Ammunition Vault 1"
  building: string; // e.g. "Bunker 4"
  zone: string; // e.g. "Ammunition & Pyrotechnics Store"
  floorLevel: string; // e.g. "Ground", "Basement 1"
  areaSqMeters: number; // e.g. 150 sq meters
  occupancyType: RoomOccupancyType;
  riskLevel: RiskLevel;
  notes?: string;
}

export interface RiskAssessmentResult {
  areaId: string;
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
  name: string; // e.g. "5kg CO2 Extinguisher - Range A South"
  location: string; // e.g. "Building 3 - Room 102"
  zone: string; // e.g. "Tactical Shooting Range A"
  areaId?: string; // Linked BuildingArea ID
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
  location: string;
  zone: string;
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
  { id: 'zone_range_a', name: 'Tactical Shooting Range A', building: 'Sector 1' },
  { id: 'zone_range_b', name: 'Tactical Shooting Range B', building: 'Sector 1' },
  { id: 'zone_ammo_store', name: 'Ammunition & Pyrotechnics Store', building: 'Bunker 4' },
  { id: 'zone_cmd_center', name: 'Command & Control Center', building: 'HQ Main' },
  { id: 'zone_armory', name: 'Main Armory & Gear Room', building: 'HQ Vault' },
  { id: 'zone_depot', name: 'Vehicle Maintenance Depot', building: 'Hangar B' },
  { id: 'zone_gatehouse', name: 'Main Gatehouse & Security', building: 'Entry Gate' },
  { id: 'zone_medical', name: 'Medical Emergency Post', building: 'MedCenter' },
];

export interface FilterOptions {
  searchQuery: string;
  typeFilter: string;
  statusFilter: string;
  zoneFilter: string;
  dateRange: 'all' | '7days' | '30days' | 'this_month' | 'overdue';
}
