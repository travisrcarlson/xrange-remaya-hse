import React, { useState, useEffect } from 'react';
import { Equipment, InspectionRecord, InspectionResultStatus } from '../types/hse';
import confetti from 'canvas-confetti';
import { 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Upload, 
  Flame, 
  MapPin, 
  UserCheck, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  FileText,
  Sparkles,
  Check,
  ChevronRight,
  ArrowLeft
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
  // Target Equipment selection
  const [targetId, setTargetId] = useState<string>(selectedEquipmentId || (equipmentList[0]?.id || 'FE-101'));
  const currentEquipment = equipmentList.find(e => e.id.toUpperCase() === targetId.toUpperCase()) || equipmentList[0];

  useEffect(() => {
    if (selectedEquipmentId) {
      setTargetId(selectedEquipmentId);
    }
  }, [selectedEquipmentId]);

  // Form State
  const [inspectorName, setInspectorName] = useState('Captain Ahmed Al-Mansoori');
  const [inspectorRole, setInspectorRole] = useState('Senior HSE Safety Officer');
  const [inspectionDate, setInspectionDate] = useState<string>(new Date().toISOString().slice(0, 16));

  // Checklists
  const [pressureGauge, setPressureGauge] = useState<'NORMAL' | 'LOW' | 'HIGH' | 'N/A'>('NORMAL');
  const [tamperSealIntact, setTamperSealIntact] = useState<boolean>(true);
  const [physicalCondition, setPhysicalCondition] = useState<'EXCELLENT' | 'GOOD' | 'MINOR_DAMAGE' | 'SEVERE_DAMAGE'>('EXCELLENT');
  const [hoseCondition, setHoseCondition] = useState<'INTACT' | 'CRACKED' | 'MISSING' | 'N/A'>('INTACT');
  const [accessibility, setAccessibility] = useState<'CLEAR' | 'PARTIALLY_BLOCKED' | 'BLOCKED'>('CLEAR');
  
  // First aid specific
  const [suppliesReplenished, setSuppliesReplenished] = useState<boolean>(true);
  const [sanitizationChecked, setSanitizationChecked] = useState<boolean>(true);

  // Photo state
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // Overall result
  const [resultStatus, setResultStatus] = useState<InspectionResultStatus>('PASS');
  const [notes, setNotes] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Photo capture handler
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoDataUrl(dataUrl);
      setIsPhotoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEquipment || !inspectorName) return;

    const record: Omit<InspectionRecord, 'id'> = {
      equipmentId: currentEquipment.id,
      equipmentType: currentEquipment.type,
      equipmentName: currentEquipment.name,
      location: currentEquipment.location,
      zone: currentEquipment.zone,
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
        // Fallback if confetti script not available
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
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
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 max-w-xs mx-auto">
              <p className="text-[11px] text-slate-400 font-semibold mb-1 text-left">Inspection Photo Evidence:</p>
              <img src={photoDataUrl} alt="Evidence" className="w-full h-40 object-cover rounded-lg" />
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
            >
              Perform Another Inspection
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 transition-all"
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
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <ScanLine className="w-4 h-4" />
          <span>Mobile Field Inspection Mode</span>
        </div>
      </div>

      {/* Scanned Equipment Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-2xl shrink-0 shadow-lg shadow-emerald-900/30">
              {currentEquipment?.type === 'fire_extinguisher' ? '🧯' : '🩹'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
                  {currentEquipment?.id}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {currentEquipment?.subtype}
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {currentEquipment?.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 inline" />
                <span>{currentEquipment?.location} • <strong className="text-slate-300">{currentEquipment?.zone}</strong></span>
              </p>
            </div>
          </div>

          {/* Target Equipment Selector Dropdown */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-right">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Select/Change Extinguisher Tag:
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-emerald-500"
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

      {/* Main Inspection Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        
        {/* Section 1: Inspector Metadata */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>1. Officer & Inspection Metadata</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Inspector Full Name *</label>
              <input
                type="text"
                required
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                placeholder="Enter officer name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-semibold focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Staff Designation / Rank</label>
              <input
                type="text"
                value={inspectorRole}
                onChange={(e) => setInspectorRole(e.target.value)}
                placeholder="e.g. Lead HSE Safety Officer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Inspection Timestamp</label>
              <input
                type="datetime-local"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Technical Checklists */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2. Safety Checklist Items ({currentEquipment?.type === 'fire_extinguisher' ? 'Fire Extinguisher' : 'First Aid Kit'})</span>
          </h3>

          {currentEquipment?.type === 'fire_extinguisher' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              
              {/* Pressure Gauge */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">Pressure Gauge Status</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPressureGauge('NORMAL')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      pressureGauge === 'NORMAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    ✓ Normal (Green Zone)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPressureGauge('LOW')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      pressureGauge === 'LOW'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    ⚠️ Low Charge
                  </button>
                </div>
              </div>

              {/* Tamper Seal & Safety Pin */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">Safety Pin & Tamper Seal</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setTamperSealIntact(true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
                      tamperSealIntact
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
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
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    ❌ Broken / Missing
                  </button>
                </div>
              </div>

              {/* Physical Condition & Hose */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">Cylinder & Hose Condition</label>
                <select
                  value={physicalCondition}
                  onChange={(e) => setPhysicalCondition(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="EXCELLENT">Excellent (Clean, no rust/dents)</option>
                  <option value="GOOD">Good (Minor surface scuffs)</option>
                  <option value="MINOR_DAMAGE">Minor Damage (Needs hose check)</option>
                  <option value="SEVERE_DAMAGE">Severe Damage (Cracked hose/corrosion)</option>
                </select>
              </div>

              {/* Accessibility & Bracket */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase">Accessibility & Wall Mount</label>
                <select
                  value={accessibility}
                  onChange={(e) => setAccessibility(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
                >
                  <option value="CLEAR">Clear Access (Unobstructed)</option>
                  <option value="PARTIALLY_BLOCKED">Partially Obstructed</option>
                  <option value="BLOCKED">Blocked by Equipment</option>
                </select>
              </div>

            </div>
          ) : (
            /* First Aid Kit Checklists */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Trauma Supplies Replenished</span>
                  <span className="text-[11px] text-slate-400">Bandages, gauze, tourniquets verified</span>
                </div>
                <input
                  type="checkbox"
                  checked={suppliesReplenished}
                  onChange={(e) => setSuppliesReplenished(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Sanitization & Expiry Dates</span>
                  <span className="text-[11px] text-slate-400 font-medium">All items within valid expiry window</span>
                </div>
                <input
                  type="checkbox"
                  checked={sanitizationChecked}
                  onChange={(e) => setSanitizationChecked(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Photo Capture Evidence */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>3. Take / Upload Physical Evidence Photo *</span>
          </h3>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
            <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all">
              <Camera className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-slate-200">Tap to Snap Photo with Camera</span>
              <span className="text-[10px] text-slate-400 mt-1">Or choose file from device gallery</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>

            {/* Photo Preview Thumbnail */}
            {photoDataUrl ? (
              <div className="relative w-full sm:w-48 h-36 bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-xl shrink-0">
                <img src={photoDataUrl} alt="Inspection capture" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/75 p-1.5 text-[9px] font-mono text-emerald-300 text-center">
                  STAMPED: {currentEquipment?.id} • {new Date().toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="w-full sm:w-48 h-36 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs shrink-0">
                <span>No photo selected</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Final Overall Result */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>4. Overall Inspection Result & Officer Notes</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 mt-4">
            
            <button
              type="button"
              onClick={() => setResultStatus('PASS')}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                resultStatus === 'PASS'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
              <span>PASS (COMPLIANT)</span>
            </button>

            <button
              type="button"
              onClick={() => setResultStatus('PASS_WITH_REMARKS')}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                resultStatus === 'PASS_WITH_REMARKS'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1 text-amber-400" />
              <span>PASS W/ REMARKS</span>
            </button>

            <button
              type="button"
              onClick={() => setResultStatus('FAIL')}
              className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                resultStatus === 'FAIL'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 ring-2 ring-rose-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <XCircle className="w-5 h-5 mx-auto mb-1 text-rose-400" />
              <span>FAIL (REPAIR NEEDED)</span>
            </button>

          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Inspection Remarks / Observations</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional observations, pin status, wall bracket stability, etc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500"
              ></textarea>
            </div>

            {resultStatus === 'FAIL' && (
              <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-rose-300 uppercase">Corrective Action Required *</label>
                <input
                  type="text"
                  required
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  placeholder="e.g. Tagged out for workshop recharge. Replace cylinder."
                  className="w-full bg-slate-950 border border-rose-900 rounded-xl p-2.5 text-xs text-rose-200 font-semibold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Submit Official Inspection Record</span>
          </button>
        </div>

      </form>

    </div>
  );
};
