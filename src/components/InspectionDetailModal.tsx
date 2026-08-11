import React from 'react';
import { InspectionRecord } from '../types/hse';
import { X, CheckCircle2, Clock, XCircle, ShieldCheck, MapPin, UserCheck, Calendar, Camera } from 'lucide-react';

interface InspectionDetailModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  record,
  onClose
}) => {
  if (!record) return null;

  const isPass = record.status === 'PASS';
  const isRemarks = record.status === 'PASS_WITH_REMARKS';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              isPass ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              isRemarks ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isPass ? <CheckCircle2 className="w-5 h-5" /> : isRemarks ? <Clock className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-emerald-400 text-sm">{record.equipmentId}</span>
                <span className="text-xs text-slate-400 uppercase font-semibold">({record.id})</span>
              </div>
              <h2 className="text-base font-bold text-white">{record.equipmentName}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Inspector Officer:</span>
              <span className="text-slate-100 font-bold text-sm block mt-0.5">{record.inspectorName}</span>
              <span className="text-emerald-400 font-medium">{record.inspectorRole}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold uppercase block text-[10px]">Inspection Timestamp:</span>
              <span className="text-slate-200 font-mono block mt-0.5">
                {new Date(record.inspectionDate).toLocaleString()}
              </span>
              <span className="text-slate-400 font-medium">{record.zone}</span>
            </div>
          </div>

          {/* Checklist Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Inspection Checklist Responses:</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Pressure Gauge:</span>
                <span className="font-bold text-slate-200">{record.pressureGauge}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Tamper Pin & Seal:</span>
                <span className={`font-bold ${record.tamperSealIntact ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {record.tamperSealIntact ? '✓ Intact' : '❌ Broken'}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Physical Condition:</span>
                <span className="font-bold text-slate-200">{record.physicalCondition}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex justify-between">
                <span className="text-slate-400">Accessibility:</span>
                <span className="font-bold text-slate-200">{record.accessibility}</span>
              </div>
            </div>
          </div>

          {/* Photo Evidence */}
          {record.photoDataUrl && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Captured Physical Photo Evidence:</span>
              </h3>
              <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 overflow-hidden">
                <img 
                  src={record.photoDataUrl} 
                  alt="Inspection Evidence" 
                  className="w-full max-h-72 object-contain rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Notes & Actions */}
          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-bold uppercase block mb-1">Inspector Notes:</span>
              <p className="text-slate-200">{record.notes || 'No remarks noted.'}</p>
            </div>

            {record.correctiveActionRequired && (
              <div className="bg-rose-950/40 p-3.5 rounded-xl border border-rose-500/30">
                <span className="text-rose-300 font-bold uppercase block mb-1">Corrective Action Needed:</span>
                <p className="text-rose-200 font-semibold">{record.correctiveActionRequired}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
