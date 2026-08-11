import React from 'react';
import { Equipment, InspectionRecord, XRANGE_ZONES } from '../types/hse';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Flame, 
  ShieldAlert, 
  ScanLine, 
  QrCode, 
  Eye,
  Building2,
  CalendarCheck,
  FileSpreadsheet,
  Award
} from 'lucide-react';

interface DashboardOverviewProps {
  equipmentList: Equipment[];
  inspections: InspectionRecord[];
  onStartInspection: (equipmentId: string) => void;
  onOpenQRStudio: (equipmentId?: string) => void;
  onViewInspectionDetail: (record: InspectionRecord) => void;
  onExportCSV: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  equipmentList,
  inspections,
  onStartInspection,
  onOpenQRStudio,
  onViewInspectionDetail,
  onExportCSV
}) => {
  const totalCount = equipmentList.length;
  const compliantCount = equipmentList.filter(e => e.status === 'compliant').length;
  const dueSoonCount = equipmentList.filter(e => e.status === 'due_soon').length;
  const overdueCount = equipmentList.filter(e => e.status === 'overdue').length;
  const maintenanceCount = equipmentList.filter(e => e.status === 'maintenance_required' || e.status === 'out_of_service').length;

  const complianceRate = totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 100;

  // Overdue or Action items
  const urgentActionItems = equipmentList.filter(e => e.status === 'overdue' || e.status === 'maintenance_required');

  // Breakdown by Equipment Type
  const extinguishers = equipmentList.filter(e => e.type === 'fire_extinguisher');
  const firstAidKits = equipmentList.filter(e => e.type === 'first_aid_kit');
  const others = equipmentList.filter(e => e.type !== 'fire_extinguisher' && e.type !== 'first_aid_kit');

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-r from-[#0b1322] via-[#0e1726] to-[#15233c] p-6 rounded-2xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#d4af37]/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-[#e6c363] font-bold text-xs tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
            <span>Remaya Live Central Compliance Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            REMAYA <span className="remaya-gold-text">XRANGE</span> HSE DASHBOARD
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time equipment monitoring, QR code verification, and compliance auditing for fire extinguishers, first-aid stations, and safety equipment.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onExportCSV}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#142035] hover:bg-[#1a2b47] text-slate-200 text-xs font-bold border border-[#d4af37]/30 transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#e6c363]" />
            <span>Export CSV Report</span>
          </button>

          <button
            onClick={() => onOpenQRStudio()}
            className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl remaya-gold-gradient text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-900/40 border border-amber-200/50 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Print QR Labels</span>
          </button>
        </div>
      </div>

      {/* Urgent Action Alert Banner (If overdue/failed items exist) */}
      {urgentActionItems.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-rose-200 flex items-center gap-2">
                Remaya HSE Action Required: {urgentActionItems.length} Equipment Items Need Review
              </h3>
              <p className="text-xs text-rose-300/80 mt-0.5">
                {overdueCount > 0 ? `${overdueCount} items are overdue for monthly inspection. ` : ''}
                {maintenanceCount > 0 ? `${maintenanceCount} items failed inspection & require maintenance.` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            {urgentActionItems.map(item => (
              <button
                key={item.id}
                onClick={() => onStartInspection(item.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Inspect {item.id}</span>
              </button>
            )).slice(0, 2)}
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Registered Equipment */}
        <div className="bg-[#0e1726] p-4 rounded-xl border border-[#1b273b] shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total HSE Units</span>
            <Flame className="w-4 h-4 text-[#e6c363]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{totalCount}</span>
            <span className="text-xs text-[#e6c363] font-semibold">{extinguishers.length} Extinguishers</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{firstAidKits.length} First Aid, {others.length} Other</p>
        </div>

        {/* Compliant Rate */}
        <div className="bg-[#0e1726] p-4 rounded-xl border border-[#1b273b] shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Compliance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400">{complianceRate}%</span>
            <span className="text-xs text-emerald-400/80 font-bold">{compliantCount} / {totalCount}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${complianceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Due Soon (< 30 days) */}
        <div className="bg-[#0e1726] p-4 rounded-xl border border-[#1b273b] shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Due Soon</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-400">{dueSoonCount}</span>
            <span className="text-xs text-amber-400/80 font-medium">Next 7-30 Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending routine check</p>
        </div>

        {/* Overdue */}
        <div className="bg-[#0e1726] p-4 rounded-xl border border-[#1b273b] shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-400">{overdueCount}</span>
            <span className="text-xs text-rose-400/80 font-semibold">Immediate</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Past inspection date</p>
        </div>

        {/* Failed / Maintenance Required */}
        <div className="bg-[#0e1726] p-4 rounded-xl border border-[#1b273b] shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Needs Repair</span>
            <XCircle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-400">{maintenanceCount}</span>
            <span className="text-xs text-orange-400/80 font-semibold">Flagged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Fault / Pressure low</p>
        </div>

      </div>

      {/* Main Grid Section: Zone Compliance + Recent Inspections Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sector Zone Health Breakdown */}
        <div className="bg-[#0e1726] p-5 rounded-2xl border border-[#1b273b] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1b273b]">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#e6c363]" />
                <span>Sector Zone Compliance</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">{XRANGE_ZONES.length} Sectors</span>
            </div>

            <div className="mt-4 space-y-3">
              {XRANGE_ZONES.map((zone) => {
                const zoneEquipment = equipmentList.filter(e => e.zone === zone.name);
                const zoneTotal = zoneEquipment.length;
                const zoneCompliant = zoneEquipment.filter(e => e.status === 'compliant').length;
                const pct = zoneTotal > 0 ? Math.round((zoneCompliant / zoneTotal) * 100) : 100;
                const hasIssue = zoneEquipment.some(e => e.status === 'overdue' || e.status === 'maintenance_required');

                return (
                  <div key={zone.id} className="p-3 rounded-xl bg-[#070d18] border border-[#1b273b] hover:border-[#d4af37]/40 transition-all">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200">{zone.name}</span>
                      <div className="flex items-center space-x-2">
                        {hasIssue && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Attention
                          </span>
                        )}
                        <span className="text-slate-400 font-mono">{zoneCompliant}/{zoneTotal} compliant</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1b273b] text-xs text-slate-400 flex items-center justify-between">
            <span>Monthly HSE inspection threshold: 100%</span>
            <span className="text-[#e6c363] font-bold">Remaya Standards</span>
          </div>
        </div>

        {/* Right Column (2 spans): Recent Inspection History Feed */}
        <div className="lg:col-span-2 bg-[#0e1726] p-5 rounded-2xl border border-[#1b273b] shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b273b]">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-[#e6c363]" />
              <span>Recent Field Inspection Activity</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{inspections.length} Total Records</span>
          </div>

          {inspections.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <ScanLine className="w-12 h-12 mx-auto text-slate-600 mb-2 opacity-50" />
              <p>No inspections recorded yet.</p>
              <p className="text-xs mt-1">Scan a QR code on an extinguisher to submit your first inspection record!</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {inspections.map((record) => {
                const isPass = record.status === 'PASS';
                const isRemarks = record.status === 'PASS_WITH_REMARKS';

                return (
                  <div 
                    key={record.id}
                    className="p-4 rounded-xl bg-[#070d18] border border-[#1b273b] hover:border-[#d4af37]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPass ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isRemarks ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isPass ? <CheckCircle2 className="w-5 h-5" /> : isRemarks ? <Clock className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-100 font-mono">{record.equipmentId}</span>
                          <span className="text-xs text-slate-400 font-medium">({record.equipmentName})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Location: <span className="text-slate-300 font-semibold">{record.location}</span> ({record.zone})
                        </p>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                          <span>Inspector: <strong className="text-[#e6c363]">{record.inspectorName}</strong></span>
                          <span>•</span>
                          <span>{new Date(record.inspectionDate).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      {record.photoDataUrl && (
                        <button
                          onClick={() => onViewInspectionDetail(record)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/30 text-xs font-semibold transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Photo</span>
                        </button>
                      )}

                      <button
                        onClick={() => onStartInspection(record.equipmentId)}
                        className="px-3 py-1.5 rounded-lg bg-[#142035] hover:bg-[#1a2b47] text-slate-200 text-xs font-bold border border-[#1b273b] transition-all"
                      >
                        Re-inspect
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
