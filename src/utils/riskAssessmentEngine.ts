import { RoomLocation, Equipment, RiskAssessmentResult } from '../types/hse';

export function evaluateRoomRiskAssessment(
  room: RoomLocation,
  allEquipment: Equipment[]
): RiskAssessmentResult {
  // Find equipment located in this specific room
  const roomEquipment = allEquipment.filter(
    (e) => (e.roomId && e.roomId === room.id) || (e.roomName && e.roomName.toLowerCase() === room.name.toLowerCase())
  );

  const extinguishers = roomEquipment.filter((e) => e.type === 'fire_extinguisher');
  const currentCount = extinguishers.length;

  let minRequiredExtinguishers = 1;
  let recommendedSubtypes: string[] = [];

  switch (room.occupancyType) {
    case 'ammo_pyro_store':
      minRequiredExtinguishers = Math.max(2, Math.ceil(room.areaSqMeters / 100));
      recommendedSubtypes = ['ABC Dry Powder', 'AFFF Foam'];
      break;

    case 'electrical_server':
      minRequiredExtinguishers = Math.max(1, Math.ceil(room.areaSqMeters / 75));
      recommendedSubtypes = ['CO2 (Carbon Dioxide)'];
      break;

    case 'vehicle_workshop':
      minRequiredExtinguishers = Math.max(2, Math.ceil(room.areaSqMeters / 150));
      recommendedSubtypes = ['AFFF Foam', 'ABC Dry Powder'];
      break;

    case 'kitchen_mess':
      minRequiredExtinguishers = Math.max(1, Math.ceil(room.areaSqMeters / 100));
      recommendedSubtypes = ['Wet Chemical (Class K)', 'ABC Dry Powder'];
      break;

    case 'tactical_range':
      minRequiredExtinguishers = Math.max(2, Math.ceil(room.areaSqMeters / 150));
      recommendedSubtypes = ['CO2 (Carbon Dioxide)', 'ABC Dry Powder'];
      break;

    case 'medical_post':
      minRequiredExtinguishers = Math.max(1, Math.ceil(room.areaSqMeters / 200));
      recommendedSubtypes = ['ABC Dry Powder', 'CO2 (Carbon Dioxide)'];
      break;

    case 'office_hq':
    default:
      minRequiredExtinguishers = Math.max(1, Math.ceil(room.areaSqMeters / 200));
      recommendedSubtypes = ['ABC Dry Powder', 'Water'];
      break;
  }

  const isCountSufficient = currentCount >= minRequiredExtinguishers;

  const hasCorrectTypes = recommendedSubtypes.some((recType) =>
    extinguishers.some((e) => e.subtype.toLowerCase().includes(recType.toLowerCase().split(' ')[0]))
  );

  let coverageStatus: 'OPTIMAL' | 'UNDER_EQUIPPED' | 'WRONG_TYPE' | 'DEFICIENT' = 'OPTIMAL';
  const recommendations: string[] = [];

  if (isCountSufficient && hasCorrectTypes) {
    coverageStatus = 'OPTIMAL';
    recommendations.push(`Room hazard requirements satisfied (${currentCount} units installed for ${room.areaSqMeters}m²).`);
  } else if (!isCountSufficient && hasCorrectTypes) {
    coverageStatus = 'UNDER_EQUIPPED';
    recommendations.push(`Under-equipped: Add ${minRequiredExtinguishers - currentCount} more unit(s) to meet NFPA 10 coverage standard.`);
  } else if (isCountSufficient && !hasCorrectTypes) {
    coverageStatus = 'WRONG_TYPE';
    recommendations.push(`Risk Type Mismatch: Recommended type (${recommendedSubtypes.join(' or ')}) missing for ${room.occupancyType.replace('_', ' ')} hazard.`);
  } else {
    coverageStatus = 'DEFICIENT';
    recommendations.push(`Critical Gap: Need at least ${minRequiredExtinguishers} unit(s) of type: ${recommendedSubtypes.join(' / ')}.`);
  }

  return {
    roomId: room.id,
    roomName: room.name,
    minRequiredExtinguishers,
    recommendedSubtypes,
    currentExtinguisherCount: currentCount,
    isCountSufficient,
    hasCorrectTypes,
    coverageStatus,
    recommendations
  };
}
