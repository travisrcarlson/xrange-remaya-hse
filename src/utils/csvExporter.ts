import { Equipment, InspectionRecord } from '../types/hse';

function escapeCsvField(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportInspectionsToCSV(inspections: InspectionRecord[], filename = 'XRange_HSE_Inspection_Report.csv'): void {
  const headers = [
    'Inspection ID',
    'Equipment Tag ID',
    'Equipment Name',
    'Equipment Category',
    'Location Zone',
    'Specific Location',
    'Inspector Name',
    'Inspector Role',
    'Inspection Date & Time',
    'Overall Result',
    'Pressure Gauge',
    'Tamper Seal Intact',
    'Physical Condition',
    'Hose Condition',
    'Accessibility',
    'Photo Attached',
    'Inspector Remarks',
    'Corrective Action Required'
  ];

  const rows = inspections.map(r => [
    r.id,
    r.equipmentId,
    r.equipmentName,
    r.equipmentType.toUpperCase().replace('_', ' '),
    r.zone,
    r.location,
    r.inspectorName,
    r.inspectorRole,
    new Date(r.inspectionDate).toLocaleString(),
    r.status,
    r.pressureGauge,
    r.tamperSealIntact ? 'YES' : 'NO',
    r.physicalCondition,
    r.hoseCondition,
    r.accessibility,
    r.photoDataUrl ? 'YES' : 'NO',
    r.notes || '',
    r.correctiveActionRequired || ''
  ]);

  const csvContent = [
    headers.map(escapeCsvField).join(','),
    ...rows.map(row => row.map(escapeCsvField).join(','))
  ].join('\r\n');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

export function exportEquipmentToCSV(equipmentList: Equipment[], filename = 'XRange_HSE_Equipment_Master_Register.csv'): void {
  const headers = [
    'Equipment Tag ID',
    'Category',
    'Subtype/Specification',
    'Equipment Name',
    'Location Zone',
    'Specific Location',
    'Serial Number',
    'Capacity/Size',
    'Manufacture Date',
    'Expiry / Hydro Test Date',
    'Last Inspected Date',
    'Next Inspection Due Date',
    'Current Compliance Status',
    'Notes'
  ];

  const rows = equipmentList.map(eq => [
    eq.id,
    eq.type.toUpperCase().replace('_', ' '),
    eq.subtype,
    eq.name,
    eq.zone,
    eq.location,
    eq.serialNumber,
    eq.capacity,
    eq.manufactureDate,
    eq.expiryDate,
    eq.lastInspectionDate || 'N/A',
    eq.nextInspectionDue,
    eq.status.toUpperCase().replace('_', ' '),
    eq.notes || ''
  ]);

  const csvContent = [
    headers.map(escapeCsvField).join(','),
    ...rows.map(row => row.map(escapeCsvField).join(','))
  ].join('\r\n');

  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
