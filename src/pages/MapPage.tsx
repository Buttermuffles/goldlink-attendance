import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockWorksites, mockAttendance } from '@/lib/mockData';
import { MapPin, Users, Radio } from 'lucide-react';

export function MapPage(): React.ReactElement {
  // Since we can't load Leaflet tiles inline without additional setup,
  // this renders a styled placeholder map with worksite data.
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Map Tracking</h1>
        <p className="text-sm text-[#A3A3A3]">Real-time GPS monitoring of worksites and employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative min-h-[500px] bg-[rgb(26,26,26)] flex items-center justify-center">
              {/* Map Placeholder — shows worksite pins on a grid */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, rgb(var(--border)) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />

              <div className="relative z-10 text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/20 mx-auto">
                  <MapPin size={32} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#FAFAFA]">Interactive Map View</p>
                  <p className="text-sm text-[#A3A3A3] max-w-md mx-auto">
                    React Leaflet map integration with real-time GPS markers.
                    Connect to a map tile server to activate the live view.
                  </p>
                </div>

                {/* Mini worksite markers */}
                <div className="grid grid-cols-2 gap-3 pt-4 max-w-sm mx-auto">
                  {mockWorksites.filter(s => s.isActive).map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center gap-2 bg-[rgb(36,36,36)] border border-[rgb(55,55,55)] rounded-lg px-3 py-2"
                    >
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                      <div className="text-left overflow-hidden">
                        <p className="text-xs font-medium text-[#FAFAFA] truncate">{site.name}</p>
                        <p className="text-[10px] text-[#A3A3A3]">{site.lat.toFixed(4)}, {site.lng.toFixed(4)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Worksites & Live Activity */}
        <div className="space-y-6">
          {/* Worksites */}
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

          {/* Live Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users size={16} className="text-brand-primary" />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAttendance
                  .filter((a) => a.clockInLocation)
                  .slice(0, 4)
                  .map((record) => (
                    <div key={record.id} className="flex items-center gap-3 py-2 border-b border-[rgb(55,55,55)] last:border-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold">
                        {record.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#FAFAFA]">{record.employeeName}</p>
                        <p className="text-xs text-[#A3A3A3]">
                          {record.clockInLocation?.lat.toFixed(4)}, {record.clockInLocation?.lng.toFixed(4)}
                        </p>
                      </div>
                      <Badge variant={record.status}>{record.status.replace('-', ' ')}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
