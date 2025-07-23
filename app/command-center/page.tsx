'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CommandCenterPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Status Overview */}
        <Card className="lg:col-span-4 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">
              AGENT ALLOCATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground font-mono">190</div>
                <div className="text-xs text-muted-foreground">Active Field</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground font-mono">990</div>
                <div className="text-xs text-muted-foreground">Undercover</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground font-mono">290</div>
                <div className="text-xs text-muted-foreground">Training</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { id: 'G-078W', name: 'VENGEFUL SPIRIT', status: 'active' },
                { id: 'G-079X', name: 'OBSIDIAN SENTINEL', status: 'standby' },
                { id: 'G-080Y', name: 'GHOSTLY FURY', status: 'active' },
                { id: 'G-081Z', name: 'CURSED REVENANT', status: 'compromised' },
              ].map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-2 bg-muted rounded hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        agent.status === 'active'
                          ? 'bg-status-success'
                          : agent.status === 'standby'
                            ? 'bg-status-warning'
                            : 'bg-status-error'
                      }`}
                    ></div>
                    <div>
                      <div className="text-xs text-foreground font-mono">{agent.id}</div>
                      <div className="text-xs text-muted-foreground">{agent.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="lg:col-span-4 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">
              ACTIVITY LOG
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {[
                {
                  time: '25/06/2025 09:29',
                  agent: 'gh0st_Fire',
                  action: 'completed mission in',
                  location: 'Berlin',
                  target: 'zer0_Nigh',
                },
                {
                  time: '25/06/2025 08:12',
                  agent: 'dr4g0n_V3in',
                  action: 'extracted high-value target in',
                  location: 'Cairo',
                  target: null,
                },
                {
                  time: '24/06/2025 22:55',
                  agent: 'sn4ke_Sh4de',
                  action: 'lost communication in',
                  location: 'Havana',
                  target: null,
                },
                {
                  time: '24/06/2025 21:33',
                  agent: 'ph4nt0m_R4ven',
                  action: 'initiated surveillance in',
                  location: 'Tokyo',
                  target: null,
                },
                {
                  time: '24/06/2025 19:45',
                  agent: 'v0id_Walk3r',
                  action: 'compromised security in',
                  location: 'Moscow',
                  target: 'd4rk_M4trix',
                },
              ].map((log, index) => (
                <div
                  key={index}
                  className="text-xs border-l-2 border-primary-500 pl-3 hover:bg-accent p-2 rounded transition-colors"
                >
                  <div className="text-muted-foreground font-mono">{log.time}</div>
                  <div className="text-foreground">
                    Agent <span className="text-primary-500 font-mono">{log.agent}</span>{' '}
                    {log.action} <span className="text-foreground font-mono">{log.location}</span>
                    {log.target && (
                      <span>
                        {' '}
                        with agent <span className="text-primary-500 font-mono">{log.target}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encrypted Chat Activity */}
        <Card className="lg:col-span-4 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">
              ENCRYPTED CHAT ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* Wireframe Sphere */}
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 border-2 border-foreground rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute inset-2 border border-foreground rounded-full opacity-40"></div>
              <div className="absolute inset-4 border border-foreground rounded-full opacity-20"></div>
              {/* Grid lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-foreground opacity-30"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-foreground opacity-30"></div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1 w-full font-mono">
              <div className="flex justify-between">
                <span># 2025-06-17 14:23 UTC</span>
              </div>
              <div className="text-foreground">
                {'> [AGT:gh0stfire] ::: INIT >> ^^^ loading secure channel'}
              </div>
              <div className="text-primary-500">{'> CH#2 | 1231.9082464.500...xR3'}</div>
              <div className="text-foreground">{'> KEY LOCKED'}</div>
              <div className="text-muted-foreground/70">
                {'> MSG >> "...mission override initiated... awaiting delta node clearance"'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Activity Chart */}
        <Card className="lg:col-span-8 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">
              MISSION ACTIVITY OVERVIEW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              {/* Chart Grid */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-border"></div>
                ))}
              </div>
              {/* Chart Line */}
              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points="0,120 50,100 100,110 150,90 200,95 250,85 300,100 350,80"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />
                <polyline
                  points="0,140 50,135 100,130 150,125 200,130 250,135 300,125 350,120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground -ml-5 font-mono">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
              </div>
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-muted-foreground -mb-6 font-mono">
                <span>Jan 28, 2025</span>
                <span>Feb 28, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Information */}
        <Card className="lg:col-span-4 bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wider">
              MISSION INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-status-success rounded-full"></div>
                  <span className="text-xs text-foreground font-medium">Successful Missions</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">High Risk Mission</span>
                    <span className="text-foreground font-bold font-mono">190</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Medium Risk Mission</span>
                    <span className="text-foreground font-bold font-mono">426</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Low Risk Mission</span>
                    <span className="text-foreground font-bold font-mono">920</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-status-error rounded-full"></div>
                  <span className="text-xs text-status-error font-medium">Failed Missions</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">High Risk Mission</span>
                    <span className="text-foreground font-bold font-mono">190</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Medium Risk Mission</span>
                    <span className="text-foreground font-bold font-mono">426</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Low Risk Mission</span>
                    <span className="text-foreground font-bold font-mono">920</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
