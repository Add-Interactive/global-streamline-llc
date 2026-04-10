import { useMemo, useState, type FormEvent } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Package,
  Plane,
  Radar,
  Shield,
  Ship,
  Truck,
} from 'lucide-react';
import './App.css';

const kpis = [
  { icon: Shield, label: 'Security Incidents', value: '0', detail: 'No active security events' },
  { icon: Radar, label: 'Route Signals', value: '412', detail: 'Predictive lane intelligence online' },
  { icon: Activity, label: 'Throughput', value: '11.2k/min', detail: 'Cross-network shipment activity' },
];

const logisticsServices = [
  {
    icon: Plane,
    title: 'Air Priority',
    sla: '12-24h',
    detail: 'Critical high-value cargo with chain-of-custody confirmation.',
  },
  {
    icon: Ship,
    title: 'Ocean Freight',
    sla: '5-14d',
    detail: 'FCL and LCL orchestration with customs pre-clearance.',
  },
  {
    icon: Truck,
    title: 'Ground Network',
    sla: 'Same Day',
    detail: 'Regional and cross-country dispatch with live rerouting.',
  },
  {
    icon: Package,
    title: 'Warehousing',
    sla: '99.2% Pick',
    detail: 'Inventory, cross-dock flow, and synchronized fulfillment.',
  },
];

const activeLanes = [
  { lane: 'LAX -> NRT', volume: '182 containers', status: 'Stable' },
  { lane: 'HAM -> JFK', volume: '74 pallets', status: 'Watch' },
  { lane: 'MIA -> BOG', volume: '219 parcels', status: 'Stable' },
  { lane: 'SIN -> DXB', volume: '98 units', status: 'Accelerated' },
];

const pipelineStages = ['Intake', 'Compliance', 'Sort', 'Transit', 'Final Mile'];

const shipmentQueue = [
  { id: 'GS-80241', mode: 'Air', route: 'SFO -> AMS', eta: '04h 10m', priority: 'Critical' },
  { id: 'GS-80267', mode: 'Ocean', route: 'LON -> NYC', eta: '2d 11h', priority: 'Standard' },
  { id: 'GS-80304', mode: 'Ground', route: 'DAL -> ATL', eta: '07h 22m', priority: 'Priority' },
  { id: 'GS-80319', mode: 'Ground', route: 'SEA -> DEN', eta: '11h 50m', priority: 'Standard' },
];

const slaAlerts = [
  { lane: 'HAM -> JFK', issue: 'Customs delay risk', level: 'Medium' },
  { lane: 'SIN -> DXB', issue: 'Capacity spike +14%', level: 'Low' },
  { lane: 'LAX -> NRT', issue: 'Weather reroute active', level: 'High' },
];

const requestTemplates = ['Air Priority', 'Ocean Freight', 'Ground Network', 'Warehousing'];

const servicePlaybooks = [
  { name: 'Cold Chain Recovery', owner: 'Operations Team', status: 'Armed' },
  { name: 'Port Congestion Reroute', owner: 'Route Intelligence', status: 'Active' },
  { name: 'Customs Hold Escalation', owner: 'Compliance', status: 'Standby' },
];

const clientSlaBoard = [
  { client: 'Helios Medical', contract: 'Platinum', onTime: '99.5%', risk: 'Low' },
  { client: 'Vertex Retail', contract: 'Priority', onTime: '96.8%', risk: 'Medium' },
  { client: 'Nova Industrial', contract: 'Standard', onTime: '95.9%', risk: 'Medium' },
  { client: 'Orion Energy', contract: 'Platinum', onTime: '99.1%', risk: 'Low' },
];

const fleetReadiness = [
  { asset: 'Air Fleet', ready: '14/16', health: '92%' },
  { asset: 'Ocean Containers', ready: '842/870', health: '96%' },
  { asset: 'Ground Vehicles', ready: '219/240', health: '91%' },
];

const commandList = ['help', 'scan --all', 'status --nodes', 'trace GS-90217', 'clear'];

const runCommand = (raw: string) => {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return 'No command entered.';
  if (cmd === 'help') return 'Available: scan --all | status --nodes | trace <id> | clear';
  if (cmd === 'scan --all') return 'Scan complete. 0 critical, 3 warnings, all systems operational.';
  if (cmd === 'status --nodes') return 'Nodes online: 64/64. Avg latency: 11ms. Packet loss: 0.02%.';
  if (cmd.startsWith('trace ')) return `Trace ${cmd.replace('trace ', '').toUpperCase()}: in transit, ETA 02h 18m.`;
  if (cmd === 'clear') return '__clear__';
  return `Unknown command: ${cmd}`;
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Operations log initialized.',
    'Telemetry stream connected.',
  ]);

  const [requestService, setRequestService] = useState(requestTemplates[0]);
  const [requestRoute, setRequestRoute] = useState('LAX -> FRA');
  const [submitted, setSubmitted] = useState(false);

  const suggestions = useMemo(() => {
    const query = input.trim().toLowerCase();
    if (!query) return commandList.slice(0, 4);
    return commandList.filter((cmd) => cmd.startsWith(query)).slice(0, 4);
  }, [input]);

  const executeCommand = (value: string) => {
    const response = runCommand(value);
    if (response === '__clear__') {
      setHistory([]);
      setInput('');
      return;
    }

    setHistory((prev) => [...prev, `> ${value.trim()}`, response]);
    setInput('');
  };

  const handleCommandSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 1800);
  };

  return (
    <div className="page">
      <header className="topbar card">
        <div>
          <p className="kicker">Global Streamline LLC</p>
          <h1>Logistics Operations Platform</h1>
        </div>
        <div className="status">
          <span className="status-dot" />
          <span>System Healthy</span>
          <span>Latency 11ms</span>
          <span>Nodes 64</span>
        </div>
      </header>

      <section className="hero card">
        <div>
          <p className="kicker">Overview</p>
          <h2>Secure, Scalable Logistics Execution</h2>
          <p>
            Unified visibility for shipping, fulfillment, risk monitoring, and client SLAs across air,
            ocean, and ground operations.
          </p>
        </div>
        <button className="primary">Create Shipment</button>
      </section>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="card kpi-card">
            <div className="kpi-head">
              <kpi.icon size={18} />
              <span>{kpi.label}</span>
            </div>
            <h3>{kpi.value}</h3>
            <p>{kpi.detail}</p>
          </article>
        ))}
      </section>

      <section className="services card">
        <div className="section-head">
          <h3>Logistics Services</h3>
          <p>Enterprise-grade service stack and operating lanes</p>
        </div>

        <div className="services-grid">
          {logisticsServices.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-icon">
                <service.icon size={18} />
              </div>
              <div>
                <h4>{service.title}</h4>
                <p>{service.detail}</p>
              </div>
              <span>{service.sla}</span>
            </article>
          ))}
        </div>

        <div className="services-lower">
          <div className="lane-list">
            <h4>Active Trade Lanes</h4>
            {activeLanes.map((lane) => (
              <article key={lane.lane}>
                <p>{lane.lane}</p>
                <small>{lane.volume}</small>
                <strong>{lane.status}</strong>
              </article>
            ))}
          </div>

          <div className="pipeline-view">
            <h4>Fulfillment Pipeline</h4>
            <div className="pipeline-track">
              {pipelineStages.map((stage, idx) => (
                <div key={stage} className="stage-node">
                  <span>{idx + 1}</span>
                  <p>{stage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ops-grid">
        <article className="card ops-panel">
          <h4>
            <Layers size={14} /> Shipment Queue
          </h4>
          <div className="queue-rows">
            {shipmentQueue.map((item) => (
              <article key={item.id}>
                <div>
                  <p>{item.id}</p>
                  <small>{item.route}</small>
                </div>
                <span className="pill">{item.mode}</span>
                <span className="pill">{item.eta}</span>
                <strong className="pill">{item.priority}</strong>
              </article>
            ))}
          </div>
        </article>

        <article className="card ops-panel">
          <h4>
            <AlertTriangle size={14} /> SLA Risk Monitor
          </h4>
          <div className="risk-list">
            {slaAlerts.map((alert) => (
              <article key={alert.lane}>
                <div>
                  <p>{alert.lane}</p>
                  <small>{alert.issue}</small>
                </div>
                <span>{alert.level}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="card ops-panel">
          <h4>
            <CheckCircle2 size={14} /> Service Request Intake
          </h4>
          <form className="request-form" onSubmit={submitRequest}>
            <label>
              Service
              <select value={requestService} onChange={(event) => setRequestService(event.target.value)}>
                {requestTemplates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Route
              <input value={requestRoute} onChange={(event) => setRequestRoute(event.target.value)} />
            </label>
            <button type="submit" className="primary">
              Submit Request
            </button>
            {submitted && <p className="ok">Request received by operations desk.</p>}
          </form>
        </article>
      </section>

      <section className="governance-grid">
        <article className="card gov-panel">
          <h4>Operations Playbooks</h4>
          <div className="list">
            {servicePlaybooks.map((item) => (
              <article key={item.name}>
                <div>
                  <p>{item.name}</p>
                  <small>{item.owner}</small>
                </div>
                <span>{item.status}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="card gov-panel">
          <h4>Client SLA Board</h4>
          <div className="list">
            {clientSlaBoard.map((client) => (
              <article key={client.client}>
                <div>
                  <p>{client.client}</p>
                  <small>{client.contract}</small>
                </div>
                <span>{client.onTime}</span>
                <strong>{client.risk}</strong>
              </article>
            ))}
          </div>
        </article>

        <article className="card gov-panel">
          <h4>Fleet Asset Readiness</h4>
          <div className="list">
            {fleetReadiness.map((fleet) => (
              <article key={fleet.asset}>
                <div>
                  <p>{fleet.asset}</p>
                  <small>ready {fleet.ready}</small>
                </div>
                <span>{fleet.health}</span>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="card terminal">
        <div className="section-head">
          <h3>Operations Log</h3>
          <p>Command mock for internal workflows</p>
        </div>

        <div className="log-lines">
          {history.map((line, idx) => (
            <p key={`${line}-${idx}`}>{line}</p>
          ))}
        </div>

        <form className="command-form" onSubmit={handleCommandSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter command (example: status --nodes)"
          />
          <button type="submit" className="primary">
            Run
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => executeCommand(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="card contact-assets">
        <div className="section-head">
          <h3>Contact Information</h3>
          <p>Official company contact details</p>
        </div>
        <div className="contact-grid">
          <article>
            <h4>Email Contacts</h4>
            <img src="/contact-email.jpg" alt="Global Streamline email contact details" />
          </article>
          <article>
            <h4>Phone Contacts</h4>
            <img src="/contact-phone.jpg" alt="Global Streamline phone contact details" />
          </article>
        </div>
      </section>
    </div>
  );
}

export default App;
