import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, ScanLine, AlertCircle } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedText: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const qrRegionId = 'qr-reader-container';

    // Timeout to ensure DOM container renders before initializing camera scanner
    const timer = setTimeout(() => {
      const html5QrCode = new Html5Qrcode(qrRegionId);
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // Stop scanner & trigger success callback
            html5QrCode.stop().then(() => {
              onScanSuccess(decodedText);
              onClose();
            }).catch(() => {
              onScanSuccess(decodedText);
              onClose();
            });
          },
          () => {
            // Quietly ignore scan frame misses
          }
        )
        .catch((err) => {
          console.warn('Camera access error:', err);
          setErrorMsg('Camera permission not granted or device camera unavailable. You can also manually pick equipment from the inspector portal.');
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Live Camera QR Scanner</h3>
          </div>
          <button 
            onClick={() => {
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(() => {});
              }
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Scanner Container */}
        <div className="p-6 flex flex-col items-center">
          <div 
            id="qr-reader-container" 
            className="w-full h-64 bg-black rounded-2xl overflow-hidden border-2 border-emerald-500/40 relative shadow-inner"
          ></div>

          {errorMsg ? (
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Point device camera at the QR code tag on the fire extinguisher</span>
            </p>
          )}
        </div>

        {/* Manual Test Link Helper */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              onScanSuccess('FE-101');
              onClose();
            }}
            className="text-xs text-emerald-400 font-semibold hover:underline"
          >
            Simulate Scanning FE-101 (Demo Mode)
          </button>
        </div>

      </div>
    </div>
  );
};
