import { BuildingArea, Equipment, RiskAssessmentResult } from '../types/hse';

export function evaluateAreaRiskAssessment(
  area: BuildingArea,
  allEquipment: Equipment[]
): RiskAssessmentResult {
  // Find equipment located in this area or zone
  const areaEquipment = allEquipment.filter(
    (e) => (e.areaId && e.areaId === area.id) || e.location.toLowerCase().includes(area.name.toLowerCase()) || e.zone === area.zone
  );

  const extinguishers = areaEquipment.filter((e) => e.type === 'fire_extinguisher');
  const currentCount = extinguishers.length;

  let minRequiredExtinguishers = 1;
  let recommendedSubtypes: string[] = [];

  switch (area.occupancyType) {
    case 'ammo_pyro_store':
      // High hazard flammable / explosive storage
      minRequiredExtinguishers = Math.max(2, Math.ceil(area.areaSqMeters / 100));
      recommendedSubtypes = ['ABC Dry Powder', 'AFFF Foam'];
      break;

    case 'electrical_server':
      // Electrical equipment clean agent CO2
      minRequiredExtinguishers = Math.max(1, Math.ceil(area.areaSqMeters / 75));
      recommendedSubtypes = ['CO2 (Carbon Dioxide)'];
      break;

    case 'vehicle_workshop':
      // Fuel & heavy machinery
      minRequiredExtinguishers = Math.max(2, Math.ceil(area.areaSqMeters / 150));
      recommendedSubtypes = ['AFFF Foam', 'ABC Dry Powder'];
      break;

    case 'kitchen_mess':
      // Cooking fats Class K
      minRequiredExtinguishers = Math.max(1, Math.ceil(area.areaSqMeters / 100));
      recommendedSubtypes = ['Wet Chemical (Class K)', 'ABC Dry Powder'];
      break;

    case 'tactical_range':
      // High traffic live firing range
      minRequiredExtinguishers = Math.max(2, Math.ceil(area.areaSqMeters / 150));
      recommendedSubtypes = ['CO2 (Carbon Dioxide)', 'ABC Dry Powder'];
      break;

    case 'medical_post':
      minRequiredExtinguishers = Math.max(1, Math.ceil(area.areaSqMeters / 200));
      recommendedSubtypes = ['ABC Dry Powder', 'CO2 (Carbon Dioxide)'];
      break;

    case 'office_hq':
    default:
      minRequiredExtinguishers = Math.max(1, Math.ceil(area.areaSqMeters / 200));
      recommendedSubtypes = ['ABC Dry Powder', 'Water'];
      break;
  }

  const isCountSufficient = currentCount >= minRequiredExtinguishers;

  // Check if at least one recommended subtype is present
  const hasCorrectTypes = recommendedSubtypes.some((recType) =>
    extinguishers.some((e) => e.subtype.toLowerCase().includes(recType.toLowerCase().split(' ')[0]))
  );

  let coverageStatus: 'OPTIMAL' | 'UNDER_EQUIPPED' | 'WRONG_TYPE' | 'DEFICIENT' = 'OPTIMAL';
  const recommendations: string[] = [];

  if (isCountSufficient && hasCorrectTypes) {
    coverageStatus = 'OPTIMAL';
    recommendations.push(`Area hazard requirements satisfied (${currentCount} units installed for ${area.areaSqMeters}m²).`);
  } else if (!isCountSufficient && hasCorrectTypes) {
    coverageStatus = 'UNDER_EQUIPPED';
    recommendations.push(`Under-equipped: Add ${minRequiredExtinguishers - currentCount} more unit(s) to meet NFPA 10 coverage standard.`);
  } else if (isCountSufficient && !hasCorrectTypes) {
    coverageStatus = 'WRONG_TYPE';
    recommendations.push(`Risk Type Mismatch: Recommended type (${recommendedSubtypes.join(' or ')}) is missing for ${area.occupancyType.replace('_', ' ')} hazard.`);
  } else {
    coverageStatus = 'DEFICIENT';
    recommendations.push(`Critical Gap: Need at least ${minRequiredExtinguishers} unit(s) of type: ${recommendedSubtypes.join(' / ')}.`);
  }

  return {
    areaId: area.id,
    minRequiredExtinguishers,
    recommendedSubtypes,
    currentExtinguisherCount: currentCount,
    isCountSufficient,
    hasCorrectTypes,
    coverageStatus,
    recommendations
  };
}
