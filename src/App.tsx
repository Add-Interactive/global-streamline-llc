import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ChevronRight,
  Cpu,
  Radar,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';
import './App.css';

const matrixStreams = [
  '0101011010011101001011',
  'SYS:AUTH:OK:ROUTE:SYNC',
  'A7F45FE MAIN ORIGIN PUSH',
  'SCAN NODE VECTORS // LIVE',
  '0111010010111001010011',
  'TLS_HANDSHAKE ESTABLISHED',
  'BETA 0.0.1 DEPLOY STABLE',
  'SATCOM GRID LOCKED',
  'FREIGHT TELEMETRY 24/7',
  'COMMAND PIPELINE ACTIVE',
];

const terminalFeed = [
  '[22:14:01] uplink secure tunnel..............ok',
  '[22:14:04] packet stream from 17 corridors...stable',
  '[22:14:08] anomaly scan.......................none',
  '[22:14:12] cross-border lanes................armed',
  '[22:14:16] ai assistant protocol..............ready',
  '[22:14:21] enterprise dashboard...............online',
];

const commandHints = ['scan --all', 'status --nodes', 'trace GS-90217', 'help'];
const allCommands = [...commandHints, 'clear'];

const bootLines = [
  'booting enterprise command desktop...',
  'establishing encrypted channels...',
  'loading freight intelligence graph...',
  'arming autonomous defense fabric...',
  'synchronizing global sectors...',
  'system ready.',
];

const runMockCommand = (raw: string) => {
  const cmd = raw.trim().toLowerCase();

  if (!cmd) return 'no command entered';
  if (cmd === 'help') return 'available: scan --all | status --nodes | trace <id> | clear';
  if (cmd === 'scan --all') return 'scan complete: 0 threats, 12 warnings, perimeter stable';
  if (cmd === 'status --nodes') return 'nodes online: 64/64, avg latency 11ms, packet loss 0.02%';
  if (cmd.startsWith('trace ')) {
    const token = cmd.replace('trace ', '').toUpperCase();
    return `trace ${token}: corridor secure, eta 02h 18m, auth signature valid`;
  }
  if (cmd === 'clear') return '__clear__';

  return `unknown command: ${cmd} (type help)`;
};

const sectors = [
  { name: 'North Atlantic', health: '97%', state: 'Green' },
  { name: 'West Pacific', health: '93%', state: 'Green' },
  { name: 'South Corridor', health: '89%', state: 'Watch' },
  { name: 'Inland Mesh', health: '99%', state: 'Green' },
];

const commandCards = [
  {
    icon: Shield,
    title: 'Threat Surface',
    metric: '0 Critical',
    detail: 'Automated perimeter hardening active',
  },
  {
    icon: Radar,
    title: 'Route Intelligence',
    metric: '412 Signals',
    detail: 'Predictive route optimization in cycle',
  },
  {
    icon: Cpu,
    title: 'Neural Compute',
    metric: '84% Load',
    detail: 'Inference cluster processing manifests',
  },
  {
    icon: Activity,
    title: 'Live Throughput',
    metric: '11.2k/min',
    detail: 'Cross-region packet and shipment events',
  },
];

const useAudioPulse = () => {
  const [audioPulse, setAudioPulse] = useState(0.22);
  const [isReactive, setIsReactive] = useState(false);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<{
    ctx: AudioContext;
    analyser: AnalyserNode;
    oscillator: OscillatorNode;
    gain: GainNode;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (streamRef.current) {
        streamRef.current.oscillator.stop();
        streamRef.current.ctx.close();
      }
    };
  }, []);

  const startAudioPulse = () => {
    if (isReactive) return;

    try {
      const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) throw new Error('AudioContext unsupported');

      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const oscillator = ctx.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 66;

      const gain = ctx.createGain();
      gain.gain.value = 0.0001;

      oscillator.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();

      streamRef.current = { ctx, analyser, oscillator, gain };
      const bins = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(bins);
        const sum = bins.reduce((acc, v) => acc + v, 0);
        const next = Math.min(1, Math.max(0.12, sum / (bins.length * 150)));
        setAudioPulse(next);
        rafRef.current = requestAnimationFrame(tick);
      };

      setIsReactive(true);
      tick();
    } catch {
      setIsReactive(true);
      let phase = 0;
      const fakeTick = () => {
        phase += 0.05;
        setAudioPulse(0.28 + Math.sin(phase) * 0.16);
        rafRef.current = requestAnimationFrame(fakeTick);
      };
      fakeTick();
    }
  };

  return { audioPulse, isReactive, startAudioPulse };
};

const MatrixRain = () => (
  <div className="matrix-bg" aria-hidden="true">
    {Array.from({ length: 32 }).map((_, idx) => {
      const style = {
        '--x': `${(idx / 32) * 100}%`,
        '--speed': `${9 + (idx % 8)}s`,
        '--delay': `${(idx % 6) * -1.3}s`,
        '--opacity': `${0.12 + (idx % 5) * 0.08}`,
      } as CSSProperties;

      return (
        <span
          key={idx}
          className="matrix-column"
          data-stream={matrixStreams[idx % matrixStreams.length]}
          style={style}
        />
      );
    })}
  </div>
);

const Header = () => (
  <header className="topbar">
    <div className="brand-mark">
      <img src="/logo.png" alt="Global Streamline logo" className="logo-img" />
      <div>
        <p className="eyebrow">Global Streamline LLC</p>
        <h1>Enterprise Command Desktop</h1>
      </div>
    </div>
    <div className="status-strip">
      <span className="dot pulse" />
      <span>Secure Session: ACTIVE</span>
      <span className="divider">|</span>
      <span>Latency: 11ms</span>
      <span className="divider">|</span>
      <span>Nodes: 64</span>
    </div>
  </header>
);

type HeroPanelProps = {
  onLaunch: () => void;
  isReactive: boolean;
};

const HeroPanel = ({ onLaunch, isReactive }: HeroPanelProps) => (
  <motion.section
    className="hero-panel glass"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <p className="eyebrow">Mission Console</p>
    <h2>
      Cyber Logistics Grid
      <span> cinematic realtime orchestration </span>
    </h2>
    <p className="hero-copy">
      A fortified enterprise cockpit for route intelligence, secure automation,
      and live shipment telemetry under one encrypted glass plane.
    </p>
    <div className="hero-actions">
      <button className="primary-btn" onClick={onLaunch}>
        Launch Control
        <ChevronRight size={16} />
      </button>
      <button className="ghost-btn">{isReactive ? 'Audio Link Active' : 'Inspect Logs'}</button>
    </div>
    <div className="hero-metrics">
      <article>
        <p>Global Sync</p>
        <strong>99.98%</strong>
      </article>
      <article>
        <p>Encrypted Events</p>
        <strong>8.2M</strong>
      </article>
      <article>
        <p>Active Corridors</p>
        <strong>142</strong>
      </article>
    </div>
  </motion.section>
);

const TerminalPanel = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const hint = useMemo(() => {
    const idx = history.length % commandHints.length;
    return commandHints[idx];
  }, [history.length]);

  const suggestions = useMemo(() => {
    const query = input.trim().toLowerCase();
    if (!query) return allCommands.slice(0, 4);

    return allCommands.filter((cmd) => cmd.toLowerCase().startsWith(query)).slice(0, 4);
  }, [input]);

  useEffect(() => {
    if (suggestions.length === 0) {
      setActiveSuggestion(-1);
      return;
    }

    if (activeSuggestion >= suggestions.length) {
      setActiveSuggestion(0);
    }
  }, [activeSuggestion, suggestions]);

  const executeCommand = (value: string) => {
    const raw = value.trim();
    if (!raw) return;

    const response = runMockCommand(raw);
    if (response === '__clear__') {
      setHistory([]);
      setInput('');
      setActiveSuggestion(-1);
      return;
    }

    setHistory((prev) => [...prev, `> ${raw}`, response]);
    setInput('');
    setActiveSuggestion(-1);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    executeCommand(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSuggestion((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    }

    if ((event.key === 'Tab' || event.key === 'Enter') && activeSuggestion >= 0) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setInput(suggestions[activeSuggestion]);
      }
    }
  };

  return (
    <motion.section
      className="terminal-panel glass"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 }}
    >
      <header>
        <div className="terminal-title">
          <Terminal size={16} />
          <span>operator@globalstreamline:~</span>
        </div>
        <p className="terminal-state">streaming secure output</p>
      </header>
      <div className="terminal-body">
        {terminalFeed.map((line, idx) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.05 * idx }}
          >
            {line}
          </motion.p>
        ))}

        {history.map((line, idx) => (
          <motion.p
            key={`${line}-${idx}`}
            className={line.startsWith('>') ? 'cmd-line' : 'sys-line'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {line}
          </motion.p>
        ))}

        <form className="command-form" onSubmit={handleSubmit}>
          <label htmlFor="mock-command" className="visually-hidden">
            Command input
          </label>
          <span className="prompt">&gt;</span>
          <input
            id="mock-command"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`try: ${hint}`}
            autoComplete="off"
          />
          <button type="submit">Run</button>
        </form>

        {suggestions.length > 0 && (
          <div className="suggestions" role="listbox" aria-label="Command suggestions">
            {suggestions.map((cmd, idx) => (
              <button
                key={cmd}
                type="button"
                className={idx === activeSuggestion ? 'active' : ''}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => executeCommand(cmd)}
              >
                {cmd}
              </button>
            ))}
          </div>
        )}

        <p className="cursor-line">
          <span>&gt;</span> awaiting operator command
        </p>
      </div>
    </motion.section>
  );
};

const CommandCards = () => (
  <section className="card-grid">
    {commandCards.map((card, idx) => (
      <motion.article
        key={card.title}
        className="glass command-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: idx * 0.08 }}
        whileHover={{ y: -4 }}
      >
        <div className="card-head">
          <card.icon size={18} />
          <span>{card.title}</span>
        </div>
        <h3>{card.metric}</h3>
        <p>{card.detail}</p>
      </motion.article>
    ))}
  </section>
);

const SectorPanel = () => (
  <section className="glass sectors-panel">
    <div className="panel-title">
      <Zap size={16} />
      <h3>Regional Sector Health</h3>
    </div>
    <div className="sector-list">
      {sectors.map((sector) => (
        <article key={sector.name}>
          <div>
            <p>{sector.name}</p>
            <small>{sector.state}</small>
          </div>
          <strong>{sector.health}</strong>
        </article>
      ))}
    </div>
  </section>
);

const BootSequence = () => (
  <motion.div
    className="boot-sequence"
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="boot-console">
      <p className="boot-title">GLOBAL STREAMLINE // SYSTEM BOOT</p>
      <div className="boot-lines">
        {bootLines.map((line, idx) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.22, duration: 0.18 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
      <div className="boot-progress">
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  </motion.div>
);

function App() {
  const [bootDone, setBootDone] = useState(false);
  const { audioPulse, isReactive, startAudioPulse } = useAudioPulse();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBootDone(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, []);

  const style = {
    '--pulse-strength': `${audioPulse}`,
  } as CSSProperties;

  return (
    <div className="app-shell" style={style}>
      <MatrixRain />
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
      <div className="crt-flicker" aria-hidden="true" />
      {!bootDone && <BootSequence />}
      <Header />
      <main className="layout">
        <div className="left-col">
          <HeroPanel onLaunch={startAudioPulse} isReactive={isReactive} />
          <CommandCards />
        </div>
        <div className="right-col">
          <TerminalPanel />
          <SectorPanel />
        </div>
      </main>
      <footer className="footer-bar">
        <p>Global Streamline LLC // Enterprise Signal Network // 2026</p>
      </footer>
    </div>
  );
}

export default App;
