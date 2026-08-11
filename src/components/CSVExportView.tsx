import React, { useState } from 'react';
import { Equipment, InspectionRecord } from '../types/hse';
import { exportInspectionsToCSV, exportEquipmentToCSV } from '../utils/csvExporter';
import { StorageService } from '../services/storageService';
import { 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Table, 
  Flame, 
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
  const areas = StorageService.getAreas();
  const [activeReportTab, setActiveReportTab] = useState<'inspections' | 'equipment'>('inspections');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'this_month'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  const filteredInspections = inspections.filter((item) => {
    const matchesType = typeFilter === 'all' || item.equipmentType === typeFilter;
    const matchesArea = areaFilter === 'all' || item.areaName === areaFilter || item.zone === areaFilter;

    if (dateRange === '7days') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      return new Date(item.inspectionDate) >= past && matchesType && matchesArea;
    }
    if (dateRange === '30days') {
      const past = new Date();
      past.setDate(past.getDate() - 30);
      return new Date(item.inspectionDate) >= past && matchesType && matchesArea;
    }
    return matchesType && matchesArea;
  });

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesArea = areaFilter === 'all' || item.areaId === areaFilter || item.areaName === areaFilter;
    return matchesType && matchesArea;
  });

  const handleExportInspections = () => {
    exportInspectionsToCSV(filteredInspections, `EDGE_HSE_Inspection_Report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportEquipment = () => {
    exportEquipmentToCSV(filteredEquipment, `EDGE_HSE_Equipment_Register_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-[#121214] via-[#1c1c1f] to-[#28282d] p-6 rounded-2xl border border-[#ff5500]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#ff7700] font-bold text-xs uppercase mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>EDGE Group Compliance Exporter</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">CSV Compliance Exporter</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Export complete inspection logs and equipment registers formatted with Area ➔ Building ➔ Room hierarchy location columns.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeReportTab === 'inspections' ? (
            <button
              onClick={handleExportInspections}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Inspection CSV ({filteredInspections.length} rows)</span>
            </button>
          ) : (
            <button
              onClick={handleExportEquipment}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-xs shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download Equipment CSV ({filteredEquipment.length} rows)</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-[#121214] p-1.5 rounded-xl border border-[#27272a] w-fit">
        <button
          onClick={() => setActiveReportTab('inspections')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
            activeReportTab === 'inspections'
              ? 'bg-[#ff5500] text-white shadow-md'
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
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Master Equipment Register</span>
        </button>
      </div>

      <div className="bg-[#18181b] p-4 rounded-2xl border border-[#27272a] shadow-md flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#ff7700]" />
          <span className="font-bold text-slate-300 uppercase">Filter Export Data:</span>
        </div>

        {activeReportTab === 'inspections' && (
          <div className="flex items-center space-x-2">
            <label className="text-slate-400">Time Window:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-1.5 text-slate-200"
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
            className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-1.5 text-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="fire_extinguisher">Fire Extinguishers 🧯</option>
            <option value="first_aid_kit">First Aid Kits 🩹</option>
            <option value="eyewash_station">Eyewash Stations 👁️</option>
            <option value="aed">AED Defibrillators ⚡</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-slate-400">Area Sector:</label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="bg-[#121214] border border-[#27272a] rounded-xl px-3 py-1.5 text-slate-200"
          >
            <option value="all">All Areas (D1, D2, S, HQ, Island)</option>
            {areas.map(a => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#18181b] rounded-2xl border border-[#27272a] shadow-xl overflow-hidden">
        <div className="p-4 bg-[#121214] border-b border-[#27272a] flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase flex items-center space-x-2">
            <Table className="w-4 h-4 text-[#ff7700]" />
            <span>CSV Export Live Preview ({activeReportTab === 'inspections' ? filteredInspections.length : filteredEquipment.length} Rows)</span>
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          {activeReportTab === 'inspections' ? (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-[#121214] text-slate-400 border-b border-[#27272a]">
                <tr>
                  <th className="py-3 px-4">Inspection ID</th>
                  <th className="py-3 px-4">Equipment ID</th>
                  <th className="py-3 px-4">Area ➔ Building ➔ Room</th>
                  <th className="py-3 px-4">Inspector Name</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]/60 text-slate-300">
                {filteredInspections.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-[#ff7700]">{row.id}</td>
                    <td className="py-2.5 px-4">{row.equipmentId}</td>
                    <td className="py-2.5 px-4">{row.areaName || 'HQ'} • {row.buildingName || 'Bldg'} • {row.roomName || 'Room'}</td>
                    <td className="py-2.5 px-4">{row.inspectorName}</td>
                    <td className="py-2.5 px-4">{new Date(row.inspectionDate).toLocaleString()}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-400">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-[#121214] text-slate-400 border-b border-[#27272a]">
                <tr>
                  <th className="py-3 px-4">Tag ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Area ➔ Building ➔ Room</th>
                  <th className="py-3 px-4">Next Due Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]/60 text-slate-300">
                {filteredEquipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-[#ff7700]">{eq.id}</td>
                    <td className="py-2.5 px-4 uppercase">{eq.type}</td>
                    <td className="py-2.5 px-4">{eq.areaName} • {eq.buildingName} • {eq.roomName}</td>
                    <td className="py-2.5 px-4">{eq.nextInspectionDue}</td>
                    <td className="py-2.5 px-4 font-bold uppercase">{eq.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
