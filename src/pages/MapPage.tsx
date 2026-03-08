import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { mockWorksites, mockAttendance, mockEmployees } from '@/lib/mockData';
import { formatTime } from '@/lib/utils';
import type { AttendanceRecord } from '@/types';
import {
  MapPin,
  Users,
  Radio,
  Clock,
  Camera,
  CreditCard,
  Keyboard,
  ScanFace,
  Eye,
  Filter,
} from 'lucide-react';

// Fix default Leaflet icon issue with bundlers
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createIcon = (color: string, label?: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background:${color};
      width:32px;height:32px;
      border-radius:50%;
      border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:11px;font-weight:700;
    ">${label ?? ''}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const worksiteIcon = createIcon('#3b82f6', '🏗');
const onTimeIcon = (initials: string) => createIcon('#22c55e', initials);
const lateIcon = (initials: string) => createIcon('#f59e0b', initials);
const halfDayIcon = (initials: string) => createIcon('#8b5cf6', initials);

function getStatusIcon(initials: string, status: string) {
  switch (status) {
    case 'late': return lateIcon(initials);
    case 'half-day': return halfDayIcon(initials);
    default: return onTimeIcon(initials);
  }
}

const METHOD_LABELS: Record<string, string> = {
  'rfid': 'RFID',
  'manual': 'Manual',
  'photo-recognition': 'Photo Recognition',
  'gps': 'GPS',
};

const METHOD_ICONS: Record<string, React.ReactNode> = {
  'rfid': <CreditCard size={10} />,
  'manual': <Keyboard size={10} />,
  'photo-recognition': <ScanFace size={10} />,
  'gps': <MapPin size={10} />,
};

export function MapPage(): React.ReactElement {
  const { user } = useAuthStore();
  const isAdminView = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'supervisor';
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter attendance records: employees only see their own
  const visibleRecords = useMemo(() => {
    let records = mockAttendance.filter((a) => a.clockInLocation);
    if (!isAdminView) {
      records = records.filter((a) => a.employeeId === user?.id);
    }
    if (filterStatus !== 'all') {
      records = records.filter((a) => a.status === filterStatus);
    }
    return records;
  }, [isAdminView, user?.id, filterStatus]);

  // Map center: Philippines (BGC area)
  const center: [number, number] = [14.5530, 121.0244];

  const getEmployee = (employeeId: string) => mockEmployees.find((e) => e.id === employeeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#FAFAFA]">
            {isAdminView ? 'Employee Map Tracking' : 'My Attendance Map'}
          </h1>
          <p className="text-sm text-[#A3A3A3]">
            {isAdminView
              ? 'View all employee clock-in/out locations in real-time'
              : 'View your own clock-in and clock-out locations'}
          </p>
        </div>

        {/* Status filter */}
        {isAdminView && (
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#A3A3A3]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm bg-[rgb(26,26,26)] border border-[rgb(55,55,55)] text-[#FAFAFA] rounded-lg px-3 py-1.5 outline-none focus:border-brand-primary"
            >
              <option value="all">All Status</option>
              <option value="on-time">On Time</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
            <Badge variant="default" className="ml-2">
              {visibleRecords.length} active
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative" style={{ height: '560px' }}>
              <MapContainer
                center={center}
                zoom={14}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Worksite markers with geofence circles */}
                {isAdminView && mockWorksites.filter((s) => s.isActive).map((site) => (
                  <React.Fragment key={site.id}>
                    <Circle
                      center={[site.lat, site.lng]}
                      radius={site.geoFenceRadius}
                      pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.08,
                        weight: 1,
                        dashArray: '6 4',
                      }}
                    />
                    <Marker position={[site.lat, site.lng]} icon={worksiteIcon}>
                      <Popup>
                        <div style={{ minWidth: 180, fontFamily: 'Inter, sans-serif' }}>
                          <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🏗 {site.name}</p>
                          <p style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>{site.address}</p>
                          <p style={{ fontSize: 11, color: '#888' }}>Geofence: {site.geoFenceRadius}m radius</p>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                ))}

                {/* Employee attendance markers */}
                {visibleRecords.map((record) => {
                  const loc = record.clockInLocation!;
                  const emp = getEmployee(record.employeeId);
                  const initials = record.employeeName.split(' ').map((n) => n[0]).join('');

                  return (
                    <Marker
                      key={record.id}
                      position={[loc.lat, loc.lng]}
                      icon={getStatusIcon(initials, record.status)}
                      eventHandlers={{
                        click: () => setSelectedRecord(record),
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: 250, fontFamily: 'Inter, sans-serif' }}>
                          {/* Header with selfie */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            {record.clockInSelfie ? (
                              <img
                                src={record.clockInSelfie}
                                alt={record.employeeName}
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid #FB923C',
                                }}
                              />
                            ) : (
                              <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: '#FB923C',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: 14,
                              }}>
                                {initials}
                              </div>
                            )}
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>
                                {record.employeeName}
                              </p>
                              <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                                {emp?.position ?? ''} • {emp?.department ?? ''}
                              </p>
                            </div>
                          </div>

                          {/* Clock In/Out Info */}
                          <div style={{ background: '#f8f9fa', borderRadius: 6, padding: 8, marginBottom: 6, fontSize: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ color: '#666' }}>⏰ Clock In:</span>
                              <span style={{ fontWeight: 600 }}>{record.clockIn ? formatTime(record.clockIn) : '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ color: '#666' }}>⏰ Clock Out:</span>
                              <span style={{ fontWeight: 600 }}>{record.clockOut ? formatTime(record.clockOut) : 'Active'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ color: '#666' }}>📍 Method:</span>
                              <span style={{ fontWeight: 600 }}>{record.clockInMethod ? METHOD_LABELS[record.clockInMethod] : 'GPS'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#666' }}>⏱ Hours:</span>
                              <span style={{ fontWeight: 600 }}>{record.hoursWorked}h</span>
                            </div>
                          </div>

                          {/* Status badge */}
                          <div style={{ textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 10px',
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 600,
                              background: record.status === 'on-time' ? '#dcfce7' : record.status === 'late' ? '#fef3c7' : '#ede9fe',
                              color: record.status === 'on-time' ? '#166534' : record.status === 'late' ? '#92400e' : '#5b21b6',
                            }}>
                              {record.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>

                          {/* Selfie thumbnails */}
                          {(record.clockInSelfie || record.clockOutSelfie) && (
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                              {record.clockInSelfie && (
                                <div style={{ textAlign: 'center' }}>
                                  <img
                                    src={record.clockInSelfie}
                                    alt="Clock In selfie"
                                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #22c55e' }}
                                  />
                                  <p style={{ fontSize: 9, color: '#888', margin: '2px 0 0' }}>In</p>
                                </div>
                              )}
                              {record.clockOutSelfie && (
                                <div style={{ textAlign: 'center' }}>
                                  <img
                                    src={record.clockOutSelfie}
                                    alt="Clock Out selfie"
                                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ef4444' }}
                                  />
                                  <p style={{ fontSize: 9, color: '#888', margin: '2px 0 0' }}>Out</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Worksites (admin/hr/supervisor only) */}
          {isAdminView && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin size={16} className="text-brand-primary" />
                  Worksites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockWorksites.map((site) => (
                    <div key={site.id} className="flex items-start gap-3 py-2 border-b border-[rgb(55,55,55)] last:border-0">
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${site.isActive ? 'bg-green-400' : 'bg-gray-500'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#FAFAFA]">{site.name}</p>
                        <p className="text-xs text-[#A3A3A3]">{site.address}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[#A3A3A3] flex items-center gap-1">
                            <Radio size={10} />
                            {site.geoFenceRadius}m radius
                          </span>
                          <Badge variant={site.isActive ? 'active' : 'default'}>
                            {site.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Live Activity / Employee List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={16} className="text-brand-primary" />
                {isAdminView ? 'Employee Locations' : 'My Attendance Today'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {visibleRecords.length === 0 && (
                  <p className="text-sm text-[#A3A3A3] text-center py-4">No records found</p>
                )}
                {visibleRecords.map((record) => (
                    <div
                      key={record.id}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition-colors cursor-pointer ${
                        selectedRecord?.id === record.id
                          ? 'border-brand-primary bg-brand-primary/10'
                          : 'border-[rgb(55,55,55)] hover:border-[rgb(80,80,80)]'
                      }`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      {/* Avatar/Selfie */}
                      <div className="flex-shrink-0">
                        {record.clockInSelfie ? (
                          <img
                            src={record.clockInSelfie}
                            alt={record.employeeName}
                            className="w-9 h-9 rounded-full object-cover border-2 border-brand-primary"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold">
                            {record.employeeName.split(' ').map((n) => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#FAFAFA] truncate">{record.employeeName}</p>
                        <div className="flex items-center gap-2 text-xs text-[#A3A3A3]">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {record.clockIn ? formatTime(record.clockIn) : '—'}
                            {record.clockOut ? ` → ${formatTime(record.clockOut)}` : ' (active)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {record.clockInMethod && (
                            <span className="flex items-center gap-1 text-[10px] text-[#A3A3A3] bg-[rgb(55,55,55)] rounded px-1.5 py-0.5">
                              {METHOD_ICONS[record.clockInMethod]}
                              {METHOD_LABELS[record.clockInMethod]}
                            </span>
                          )}
                          {record.clockInSelfie && (
                            <span className="flex items-center gap-1 text-[10px] text-green-400">
                              <Camera size={10} />
                              Selfie
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={record.status}>{record.status.replace('-', ' ')}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye size={16} className="text-brand-primary" />
                Map Legend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
                  <span className="text-[#A3A3A3]">On Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow" />
                  <span className="text-[#A3A3A3]">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow" />
                  <span className="text-[#A3A3A3]">Half Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
                  <span className="text-[#A3A3A3]">Worksite</span>
                </div>
                <hr className="border-[rgb(55,55,55)]" />
                <p className="text-[#A3A3A3]">Clock Methods:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 bg-[rgb(55,55,55)] rounded px-2 py-1">
                    <CreditCard size={10} /> RFID
                  </span>
                  <span className="flex items-center gap-1 bg-[rgb(55,55,55)] rounded px-2 py-1">
                    <Keyboard size={10} /> Manual
                  </span>
                  <span className="flex items-center gap-1 bg-[rgb(55,55,55)] rounded px-2 py-1">
                    <ScanFace size={10} /> Photo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
