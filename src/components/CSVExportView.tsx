import React, { useState } from 'react';
import { Equipment, InspectionRecord, XRANGE_ZONES } from '../types/hse';
import { exportInspectionsToCSV, exportEquipmentToCSV } from '../utils/csvExporter';
import { 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Calendar, 
  Table, 
  Flame, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText
} from 'lucide-react';

interface CSVExportViewProps {
  equipmentList: Equipment[];
  inspections: InspectionRecord[];
}

export const CSVExportView: React.FC<CSVExportViewProps> = ({
  equipmentList,
  inspections
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'inspections' | 'equipment'>('inspections');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'this_month'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');

  // Filtered Inspections
  const filteredInspections = inspections.filter((item) => {
    const matchesType = typeFilter === 'all' || item.equipmentType === typeFilter;
    const matchesZone = zoneFilter === 'all' || item.zone === zoneFilter;

    if (dateRange === '7days') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      return new Date(item.inspectionDate) >= past && matchesType && matchesZone;
    }
    if (dateRange === '30days') {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      return new Date(item.inspectionDate) >= past && matchesType && matchesZone;
    }
    return matchesType && matchesZone;
  });

  // Filtered Equipment
  const filteredEquipment = equipmentList.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesZone = zoneFilter === 'all' || item.zone === zoneFilter;
    return matchesType && matchesZone;
  });

  const handleExportInspections = () => {
    exportInspectionsToCSV(filteredInspections, `XRange_HSE_Inspection_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportEquipment = () => {
    exportEquipmentToCSV(filteredEquipment, `XRange_HSE_Equipment_Register_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>HSE Audit & Compliance Reporting</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">CSV Compliance Exporter</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Export complete inspection logs, equipment maintenance histories, and audit records to formatted CSV files.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeReportTab === 'inspections' ? (
            <button
              onClick={handleExportInspections}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/40 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Inspection Log CSV ({filteredInspections.length} rows)</span>
            </button>
          ) : (
            <button
              onClick={handleExportEquipment}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-900/40 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Equipment Register CSV ({filteredEquipment.length} rows)</span>
            </button>
          )}
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveReportTab('inspections')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeReportTab === 'inspections'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Inspection Logs Report</span>
        </button>

        <button
          onClick={() => setActiveReportTab('equipment')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeReportTab === 'equipment'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Master Equipment Register</span>
        </button>
      </div>

      {/* Report Filter Controls */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-300 uppercase">Filter Export Data:</span>
        </div>

        {activeReportTab === 'inspections' && (
          <div className="flex items-center space-x-2">
            <label className="text-slate-400">Time Window:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:border-emerald-500"
            >
              <option value="all">All Historical Records</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <label className="text-slate-400">Category:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            <option value="fire_extinguisher">Fire Extinguishers 🧯</option>
            <option value="first_aid_kit">First Aid Kits 🩹</option>
            <option value="eyewash_station">Eyewash Stations 👁️</option>
            <option value="aed">AED Defibrillators ⚡</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-slate-400">Sector Zone:</label>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:border-emerald-500"
          >
            <option value="all">All Range Sectors</option>
            {XRANGE_ZONES.map(z => (
              <option key={z.id} value={z.name}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CSV Live Preview Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-2">
            <Table className="w-4 h-4 text-emerald-400" />
            <span>CSV Export Live Preview ({activeReportTab === 'inspections' ? filteredInspections.length : filteredEquipment.length} Rows Ready)</span>
          </span>

          <span className="text-[11px] text-slate-400 font-mono">
            Format: UTF-8 CSV (Excel Compatible)
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          {activeReportTab === 'inspections' ? (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Inspection ID</th>
                  <th className="py-3 px-4">Equipment ID</th>
                  <th className="py-3 px-4">Inspector Name</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Gauge</th>
                  <th className="py-3 px-4">Seal</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No inspection data found for selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-emerald-400">{row.id}</td>
                      <td className="py-2.5 px-4">{row.equipmentId}</td>
                      <td className="py-2.5 px-4">{row.inspectorName}</td>
                      <td className="py-2.5 px-4">{new Date(row.inspectionDate).toLocaleString()}</td>
                      <td className="py-2.5 px-4">
                        <span className={`font-bold ${row.status === 'PASS' ? 'text-emerald-400' : row.status === 'PASS_WITH_REMARKS' ? 'text-amber-400' : 'text-rose-400'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">{row.pressureGauge}</td>
                      <td className="py-2.5 px-4">{row.tamperSealIntact ? 'INTACT' : 'BROKEN'}</td>
                      <td className="py-2.5 px-4 max-w-xs truncate">{row.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tag ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subtype</th>
                  <th className="py-3 px-4">Equipment Name</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No equipment matched export criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEquipment.map((eq) => (
                    <tr key={eq.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-bold text-emerald-400">{eq.id}</td>
                      <td className="py-2.5 px-4 uppercase">{eq.type}</td>
                      <td className="py-2.5 px-4">{eq.subtype}</td>
                      <td className="py-2.5 px-4">{eq.name}</td>
                      <td className="py-2.5 px-4">{eq.zone}</td>
                      <td className="py-2.5 px-4">{eq.nextInspectionDue}</td>
                      <td className="py-2.5 px-4 font-bold uppercase">{eq.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
