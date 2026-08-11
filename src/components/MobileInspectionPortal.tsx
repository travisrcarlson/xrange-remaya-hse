import React, { useState, useEffect } from 'react';
import { Equipment, InspectionRecord, InspectionResultStatus } from '../types/hse';
import confetti from 'canvas-confetti';
import { 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Flame, 
  MapPin, 
  UserCheck, 
  ShieldCheck, 
  FileText,
  ArrowLeft,
  DoorOpen
} from 'lucide-react';

interface MobileInspectionPortalProps {
  equipmentList: Equipment[];
  selectedEquipmentId?: string;
  onSubmitInspection: (record: Omit<InspectionRecord, 'id'>) => void;
  onBackToDashboard: () => void;
}

export const MobileInspectionPortal: React.FC<MobileInspectionPortalProps> = ({
  equipmentList,
  selectedEquipmentId,
  onSubmitInspection,
  onBackToDashboard
}) => {
  const [targetId, setTargetId] = useState<string>(selectedEquipmentId || (equipmentList[0]?.id || 'FE-101'));
  const currentEquipment = equipmentList.find(e => e.id.toUpperCase() === targetId.toUpperCase()) || equipmentList[0];

  useEffect(() => {
    if (selectedEquipmentId) {
      setTargetId(selectedEquipmentId);
    }
  }, [selectedEquipmentId]);

  // Form State
  const [inspectorName, setInspectorName] = useState('Captain Ahmed Al-Mansoori');
  const [inspectorRole, setInspectorRole] = useState('Senior EDGE HSE Safety Officer');
  const [inspectionDate, setInspectionDate] = useState<string>(new Date().toISOString().slice(0, 16));

  // Checklists
  const [pressureGauge, setPressureGauge] = useState<'NORMAL' | 'LOW' | 'HIGH' | 'N/A'>('NORMAL');
  const [tamperSealIntact, setTamperSealIntact] = useState<boolean>(true);
  const [physicalCondition, setPhysicalCondition] = useState<'EXCELLENT' | 'GOOD' | 'MINOR_DAMAGE' | 'SEVERE_DAMAGE'>('EXCELLENT');
  const [hoseCondition, setHoseCondition] = useState<'INTACT' | 'CRACKED' | 'MISSING' | 'N/A'>('INTACT');
  const [accessibility, setAccessibility] = useState<'CLEAR' | 'PARTIALLY_BLOCKED' | 'BLOCKED'>('CLEAR');
  
  const [suppliesReplenished, setSuppliesReplenished] = useState<boolean>(true);
  const [sanitizationChecked, setSanitizationChecked] = useState<boolean>(true);

  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [resultStatus, setResultStatus] = useState<InspectionResultStatus>('PASS');
  const [notes, setNotes] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEquipment || !inspectorName) return;

    const area = currentEquipment.areaName || 'HQ Area';
    const building = currentEquipment.buildingName || 'Building 1';
    const room = currentEquipment.roomName || 'Room';

    const record: Omit<InspectionRecord, 'id'> = {
      equipmentId: currentEquipment.id,
      equipmentType: currentEquipment.type,
      equipmentName: currentEquipment.name,
      areaName: area,
      buildingName: building,
      roomName: room,
      location: `${area} • ${building} • ${room}`,
      zone: area,
      inspectorName,
      inspectorRole,
      inspectionDate: new Date(inspectionDate).toISOString(),
      status: resultStatus,
      pressureGauge,
      tamperSealIntact,
      physicalCondition,
      hoseCondition,
      accessibility,
      suppliesReplenished: currentEquipment.type === 'first_aid_kit' ? suppliesReplenished : undefined,
      sanitizationChecked: currentEquipment.type === 'first_aid_kit' ? sanitizationChecked : undefined,
      photoDataUrl,
      notes,
      correctiveActionRequired: resultStatus === 'FAIL' ? correctiveAction : undefined
    };

    onSubmitInspection(record);
    setIsSubmitted(true);

    if (resultStatus === 'PASS') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // quiet
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-[#18181b] border border-[#27272a] p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Inspection Saved & Registered
            </span>
            <h2 className="text-2xl font-black text-white mt-3">
              Inspection Logged for {currentEquipment?.id}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Central compliance status updated to <strong className="text-emerald-400 uppercase">{resultStatus}</strong>.
            </p>
          </div>

          {photoDataUrl && (
            <div className="p-3 bg-[#121214] rounded-xl border border-[#27272a] max-w-xs mx-auto">
              <p className="text-[11px] text-slate-400 font-semibold mb-1 text-left">Inspection Photo Evidence:</p>
              <img src={photoDataUrl} alt="Evidence" className="w-full h-40 object-cover rounded-lg" />
            </div>
          )}

          <div className="pt-4 border-t border-[#27272a] flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-5 py-2.5 rounded-xl bg-[#27272a] hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              Perform Another Inspection
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-bold text-xs shadow-lg shadow-orange-950/40 transition-all"
            >
              Return to Central Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2 bg-[#ff5500]/10 px-3 py-1 rounded-full border border-[#ff5500]/30 text-[#ff7700] text-xs font-bold">
          <ScanLine className="w-4 h-4" />
          <span>EDGE Mobile Field Inspection Mode</span>
        </div>
      </div>

      {/* Scanned Equipment Card Header */}
      <div className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center text-[#ff7700] font-bold text-2xl shrink-0">
              {currentEquipment?.type === 'fire_extinguisher' ? '🧯' : '🩹'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-[#ff5500]/20 text-[#ff7700] font-mono font-bold text-xs border border-[#ff5500]/30">
                  {currentEquipment?.id}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {currentEquipment?.subtype}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {currentEquipment?.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1 font-mono">
                <DoorOpen className="w-3.5 h-3.5 text-[#ff7700] inline" />
                <span>{currentEquipment?.areaName} ➔ {currentEquipment?.buildingName} ➔ <strong className="text-white">{currentEquipment?.roomName}</strong></span>
              </p>
            </div>
          </div>

          <div className="bg-[#121214] p-3 rounded-xl border border-[#27272a] text-right">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Select Tag ID:
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="bg-[#18181b] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
            >
              {equipmentList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#18181b] p-6 rounded-2xl border border-[#27272a] shadow-xl space-y-6">
        
        {/* Section 1: Inspector Metadata */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#27272a] pb-2">
            <UserCheck className="w-4 h-4 text-[#ff7700]" />
            <span>1. Officer Metadata</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Inspector Full Name *</label>
              <input
                type="text"
                required
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-100 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Staff Designation</label>
              <input
                type="text"
                value={inspectorRole}
                onChange={(e) => setInspectorRole(e.target.value)}
                className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Inspection Timestamp</label>
              <input
                type="datetime-local"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full bg-[#121214] border border-[#27272a] rounded-xl px-3 py-2 text-xs text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Checklists */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#27272a] pb-2">
            <ShieldCheck className="w-4 h-4 text-[#ff7700]" />
            <span>2. Safety Checklist Items</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a] space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase">Pressure Gauge Status</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setPressureGauge('NORMAL')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    pressureGauge === 'NORMAL'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-[#18181b] text-slate-400 border-[#27272a]'
                  }`}
                >
                  ✓ Normal
                </button>
                <button
                  type="button"
                  onClick={() => setPressureGauge('LOW')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    pressureGauge === 'LOW'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                      : 'bg-[#18181b] text-slate-400 border-[#27272a]'
                  }`}
                >
                  ⚠️ Low Charge
                </button>
              </div>
            </div>

            <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a] space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase">Safety Pin & Tamper Seal</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setTamperSealIntact(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    tamperSealIntact
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      : 'bg-[#18181b] text-slate-400 border-[#27272a]'
                  }`}
                >
                  ✓ Intact & Sealed
                </button>
                <button
                  type="button"
                  onClick={() => setTamperSealIntact(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                    !tamperSealIntact
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                      : 'bg-[#18181b] text-slate-400 border-[#27272a]'
                  }`}
                >
                  ❌ Broken / Missing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Photo Capture Evidence */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#27272a] pb-2">
            <Camera className="w-4 h-4 text-[#ff7700]" />
            <span>3. Take / Upload Physical Evidence Photo</span>
          </h3>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#27272a] hover:border-[#ff5500] rounded-2xl cursor-pointer bg-[#121214] transition-all">
              <Camera className="w-8 h-8 text-[#ff7700] mb-2" />
              <span className="text-xs font-bold text-slate-200">Tap to Snap Photo with Camera</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
            </label>

            {photoDataUrl && (
              <div className="relative w-full sm:w-48 h-36 bg-[#121214] rounded-2xl overflow-hidden border border-[#ff5500]/40 shadow-xl shrink-0">
                <img src={photoDataUrl} alt="Evidence" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Final Result */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-[#27272a] pb-2">
            <FileText className="w-4 h-4 text-[#ff7700]" />
            <span>4. Overall Result</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              type="button"
              onClick={() => setResultStatus('PASS')}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                resultStatus === 'PASS'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-[#121214] text-slate-400 border-[#27272a]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
              <span>PASS</span>
            </button>

            <button
              type="button"
              onClick={() => setResultStatus('PASS_WITH_REMARKS')}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                resultStatus === 'PASS_WITH_REMARKS'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-[#121214] text-slate-400 border-[#27272a]'
              }`}
            >
              <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <span>REMARKS</span>
            </button>

            <button
              type="button"
              onClick={() => setResultStatus('FAIL')}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                resultStatus === 'FAIL'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                  : 'bg-[#121214] text-slate-400 border-[#27272a]'
              }`}
            >
              <XCircle className="w-5 h-5 mx-auto mb-1 text-rose-400" />
              <span>FAIL</span>
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Inspector Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter remarks..."
              className="w-full bg-[#121214] border border-[#27272a] rounded-xl p-3 text-xs text-slate-200"
            ></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-[#27272a]">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Submit Inspection Record</span>
          </button>
        </div>

      </form>

    </div>
  );
};
