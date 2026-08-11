import React, { useState } from 'react';
import { Equipment } from '../types/hse';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Printer, 
  CheckSquare, 
  Square, 
  Download, 
  Flame, 
  ShieldCheck,
  Settings2,
  Sparkles
} from 'lucide-react';

interface QRStudioProps {
  equipmentList: Equipment[];
  selectedSingleId?: string;
}

export const QRStudio: React.FC<QRStudioProps> = ({
  equipmentList,
  selectedSingleId
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedSingleId ? [selectedSingleId] : equipmentList.map(e => e.id)
  );

  const [labelSize, setLabelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showLogo, setShowLogo] = useState(true);
  const [showWarning, setShowWarning] = useState(true);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === equipmentList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(equipmentList.map(e => e.id));
    }
  };

  const handleToggleId = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedItems = equipmentList.filter(e => selectedIds.includes(e.id));
  const currentAppDomain = window.location.origin + window.location.pathname;

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls (Hidden on Print) */}
      <div className="no-print bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase mb-1">
            <QrCode className="w-4 h-4" />
            <span>XRange Equipment Badge Generator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Printable QR Code Studio</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate and print physical scannable QR badges to attach to fire extinguishers, first aid kits, and eyewash stations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleSelectAll}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            {selectedIds.length === equipmentList.length ? 'Deselect All' : 'Select All Items'}
          </button>

          <button
            onClick={handlePrint}
            disabled={selectedIds.length === 0}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/40 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print {selectedItems.length} QR Badges</span>
          </button>
        </div>
      </div>

      {/* Control Panel (Hidden on Print) */}
      <div className="no-print bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-slate-300 uppercase flex items-center space-x-1">
            <Settings2 className="w-4 h-4 text-emerald-400" />
            <span>Label Specs:</span>
          </span>

          <div className="flex items-center space-x-2">
            <label className="text-slate-400">Size:</label>
            <select
              value={labelSize}
              onChange={(e) => setLabelSize(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200"
            >
              <option value="small">Small Tag (2.5" x 2.5")</option>
              <option value="medium">Standard Badge (3.5" x 4")</option>
              <option value="large">Wall Station (4" x 6")</option>
            </select>
          </div>

          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showLogo}
              onChange={(e) => setShowLogo(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Show Logo Header</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showWarning}
              onChange={(e) => setShowWarning(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Show Monthly Inspection Notice</span>
          </label>
        </div>

        <div className="text-slate-400 font-mono">
          Selected: <strong className="text-emerald-400">{selectedIds.length}</strong> / {equipmentList.length} Units
        </div>
      </div>

      {/* Items Selector Grid (Hidden on Print) */}
      <div className="no-print bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Select Equipment to Include in Print Run:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {equipmentList.map(item => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggleId(item.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center space-x-2 ${
                  isSelected 
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                <div className="truncate">
                  <span className="font-mono font-bold block">{item.id}</span>
                  <span className="text-[10px] truncate block opacity-75">{item.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRINTABLE QR BADGES GRID */}
      <div className="print-area">
        {selectedItems.length === 0 ? (
          <div className="no-print py-12 text-center text-slate-500">
            No equipment selected for QR badge printing.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedItems.map((item) => {
              const qrPayload = `${currentAppDomain}#inspect?id=${item.id}`;

              return (
                <div
                  key={item.id}
                  className="qr-label-card bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden"
                >
                  
                  {/* Badge Header */}
                  {showLogo && (
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-black text-xs tracking-wider text-slate-100 uppercase block">XRANGE REMAYA</span>
                          <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-widest block">HSE SAFETY BADGE</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {item.id}
                      </span>
                    </div>
                  )}

                  {/* QR Code Graphic Section */}
                  <div className="my-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-slate-800 inline-block">
                      <QRCodeSVG
                        value={qrPayload}
                        size={labelSize === 'small' ? 120 : labelSize === 'medium' ? 150 : 190}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <span className="font-mono font-extrabold text-sm text-slate-100 mt-2 block">
                      SCAN TO INSPECT
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {item.id} • {item.subtype}
                    </span>
                  </div>

                  {/* Badge Details */}
                  <div className="pt-3 border-t border-slate-800 space-y-1 text-left">
                    <p className="text-xs font-bold text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Zone: <strong className="text-slate-300">{item.zone}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 flex justify-between font-mono">
                      <span>Serial: {item.serialNumber}</span>
                      <span>Hydro: {item.expiryDate}</span>
                    </p>
                  </div>

                  {/* Warning Footer */}
                  {showWarning && (
                    <div className="mt-3 bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg text-[9px] font-bold text-amber-300 text-center uppercase tracking-wider">
                      ⚠️ MANDATORY MONTHLY HSE INSPECTION REQ
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
