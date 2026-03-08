import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import type { ClockMethod } from '@/types';
import {
  Clock,
  Camera,
  CreditCard,
  Keyboard,
  ScanFace,
  MapPin,
  CheckCircle,
  X,
  RotateCcw,
} from 'lucide-react';

interface ClockInModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'clock-in' | 'clock-out';
}

const METHOD_OPTIONS: { value: ClockMethod; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'rfid',
    label: 'RFID Card',
    icon: <CreditCard size={20} />,
    description: 'Tap your RFID badge to the reader',
  },
  {
    value: 'manual',
    label: 'Manual Entry',
    icon: <Keyboard size={20} />,
    description: 'Enter your Employee ID manually',
  },
  {
    value: 'photo-recognition',
    label: 'Photo Recognition',
    icon: <ScanFace size={20} />,
    description: 'Use face recognition to clock in',
  },
];

export function ClockInModal({ open, onClose, mode }: ClockInModalProps): React.ReactElement | null {
  const { user } = useAuthStore();
  const [step, setStep] = useState<'method' | 'rfid' | 'manual' | 'selfie' | 'confirm' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<ClockMethod | null>(null);
  const [manualId, setManualId] = useState('');
  const [selfieData, setSelfieData] = useState<string | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'detecting' | 'found' | 'error'>('detecting');
  const [currentTime, setCurrentTime] = useState(new Date());

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [open]);

  // Get GPS location
  useEffect(() => {
    if (open) {
      setGpsStatus('detecting');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setGpsLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setGpsStatus('found');
          },
          () => {
            // Fallback to mock location (BGC area) if geolocation is denied
            setGpsLocation({ lat: 14.5547, lng: 121.0244 });
            setGpsStatus('found');
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        setGpsLocation({ lat: 14.5547, lng: 121.0244 });
        setGpsStatus('found');
      }
    }
  }, [open]);

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setStep('method');
      setSelectedMethod(null);
      setManualId('');
      setSelfieData(null);
      stopCamera();
    }
  }, [open]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 480, height: 360 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // Camera not available — user can skip selfie
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const captureSelfie = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSelfieData(dataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleMethodSelect = (method: ClockMethod) => {
    setSelectedMethod(method);
    if (method === 'rfid') {
      setStep('rfid');
      // Simulate RFID scan after 2 seconds
      setTimeout(() => {
        setStep('selfie');
        startCamera();
      }, 2000);
    } else if (method === 'manual') {
      setStep('manual');
    } else if (method === 'photo-recognition') {
      setStep('selfie');
      startCamera();
    }
  };

  const handleManualSubmit = () => {
    if (manualId.trim()) {
      setStep('selfie');
      startCamera();
    }
  };

  const handleSelfieNext = () => {
    stopCamera();
    setStep('confirm');
  };

  const handleConfirm = () => {
    stopCamera();
    setStep('success');
    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  const timeString = currentTime.toLocaleTimeString('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const methodLabel = METHOD_OPTIONS.find((m) => m.value === selectedMethod)?.label ?? '';

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>{mode === 'clock-in' ? 'Clock In' : 'Clock Out'}</DialogTitle>
          <button onClick={onClose} className="p-1 rounded hover:bg-[rgb(55,55,55)] text-[#A3A3A3]">
            <X size={18} />
          </button>
        </div>
      </DialogHeader>

      {/* Time & Location strip */}
      <div className="bg-[rgb(26,26,26)] rounded-lg p-3 mb-4 space-y-2">
        <div className="text-center">
          <p className="text-3xl font-mono font-bold text-brand-primary">{timeString}</p>
          <p className="text-xs text-[#A3A3A3]">{dateString}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-[#A3A3A3]">
          <MapPin size={12} className={gpsStatus === 'found' ? 'text-green-400' : 'text-yellow-400 animate-pulse'} />
          {gpsStatus === 'detecting' && 'Detecting GPS...'}
          {gpsStatus === 'found' && gpsLocation && `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}`}
          {gpsStatus === 'error' && 'GPS unavailable'}
        </div>
      </div>

      {/* Step: Select Method */}
      {step === 'method' && (
        <div className="space-y-3">
          <p className="text-sm text-[#A3A3A3] mb-3">Select your {mode === 'clock-in' ? 'clock-in' : 'clock-out'} method:</p>
          {METHOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleMethodSelect(opt.value)}
              className="w-full flex items-center gap-4 p-4 rounded-lg border border-[rgb(55,55,55)] bg-[rgb(26,26,26)] hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary/20 text-brand-primary flex-shrink-0">
                {opt.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#FAFAFA]">{opt.label}</p>
                <p className="text-xs text-[#A3A3A3]">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step: RFID scanning */}
      {step === 'rfid' && (
        <div className="text-center py-8 space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/20 mx-auto animate-pulse">
            <CreditCard size={36} className="text-brand-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#FAFAFA]">Tap Your RFID Card</p>
            <p className="text-sm text-[#A3A3A3]">Hold your badge near the reader...</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Step: Manual entry */}
      {step === 'manual' && (
        <div className="space-y-4">
          <p className="text-sm text-[#A3A3A3]">Enter your Employee ID:</p>
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="e.g. GL-2024-001"
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-[rgb(55,55,55)] bg-[rgb(26,26,26)] text-[#FAFAFA] placeholder:text-[#A3A3A3] outline-none focus:border-brand-primary text-center font-mono text-lg"
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
          />
          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleManualSubmit} disabled={!manualId.trim()}>
              Continue
            </Button>
            <Button variant="outline" onClick={() => setStep('method')}>
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Step: Selfie capture */}
      {step === 'selfie' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#A3A3A3]">
              <Camera size={14} className="inline mr-1" />
              Take a selfie for verification
            </p>
            <Badge variant="on-time">{methodLabel}</Badge>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-black aspect-[4/3]">
            {!selfieData ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={selfieData} alt="Selfie preview" className="w-full h-full object-cover" />
            )}

            {/* Overlay guide */}
            {!selfieData && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 rounded-full border-2 border-brand-primary/50 border-dashed" />
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            {!selfieData ? (
              <>
                <Button className="flex-1" onClick={captureSelfie}>
                  <Camera size={16} className="mr-2" />
                  Capture Selfie
                </Button>
                <Button variant="outline" onClick={handleSelfieNext}>
                  Skip
                </Button>
              </>
            ) : (
              <>
                <Button className="flex-1" onClick={handleSelfieNext}>
                  <CheckCircle size={16} className="mr-2" />
                  Use This Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelfieData(null);
                    startCamera();
                  }}
                >
                  <RotateCcw size={16} className="mr-2" />
                  Retake
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === 'confirm' && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-[#FAFAFA] mb-2">Confirm {mode === 'clock-in' ? 'Clock In' : 'Clock Out'}</p>

          <div className="bg-[rgb(26,26,26)] rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#A3A3A3]">Employee:</span>
              <span className="text-[#FAFAFA] font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A3A3A3]">Method:</span>
              <Badge variant="on-time">{methodLabel}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A3A3A3]">Location:</span>
              <span className="text-[#FAFAFA]">
                {gpsLocation ? `${gpsLocation.lat.toFixed(4)}, ${gpsLocation.lng.toFixed(4)}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#A3A3A3]">Selfie:</span>
              <span className="text-[#FAFAFA]">{selfieData ? '✓ Captured' : 'Skipped'}</span>
            </div>
            {selfieData && (
              <div className="flex justify-center pt-2">
                <img
                  src={selfieData}
                  alt="Selfie"
                  className="w-20 h-20 rounded-full object-cover border-2 border-brand-primary"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" onClick={handleConfirm}>
              <Clock size={16} className="mr-2" />
              {mode === 'clock-in' ? 'Confirm Clock In' : 'Confirm Clock Out'}
            </Button>
            <Button variant="outline" onClick={() => setStep('method')}>
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="text-center py-8 space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mx-auto">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#FAFAFA]">
              {mode === 'clock-in' ? 'Clocked In!' : 'Clocked Out!'}
            </p>
            <p className="text-sm text-[#A3A3A3]">{timeString} • {methodLabel}</p>
          </div>
          {selfieData && (
            <img
              src={selfieData}
              alt="Selfie"
              className="w-16 h-16 rounded-full object-cover border-2 border-green-400 mx-auto"
            />
          )}
        </div>
      )}
    </Dialog>
  );
}
