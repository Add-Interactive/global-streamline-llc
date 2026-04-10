import { motion } from 'framer-motion';
import { 
  Truck, 
  Package, 
  Ship, 
  Plane, 
  Search, 
  Navigation, 
  Bell, 
  User,
  ArrowRight
} from 'lucide-react';
import './App.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">
      <img src="/logo.png" alt="Global Streamline Logo" className="logo-img" />
      <span>Global Streamline <span className="logo-llc">LLC</span></span>
    </div>
    <div className="nav-links">
      <a href="#track">Tracking</a>
      <a href="#shipping">Shipping</a>
      <a href="#services">Services</a>
      <a href="#dashboard">Dashboard</a>
    </div>
    <div className="nav-actions">
      <Bell size={20} />
      <div className="user-profile">
        <User size={20} />
      </div>
    </div>
  </nav>
);

const Hero = () => {
  return (
    <section className="hero">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src="/hero-animation.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Redefining Logistics <br />
          <span className="accent-text">Without Limits.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Modern global supply chain solutions at your fingertips.
        </motion.p>
        
        <motion.div 
          className="tracking-bar"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Search className="search-icon" />
          <input type="text" placeholder="Enter Tracking Number (e.g., GS-982341)" />
          <button>Track Package</button>
        </motion.div>
      </div>
    </section>
  );
};

const ActionGrid = () => (
  <section className="action-grid">
    {[
      { icon: Package, title: 'Ship Now', desc: 'Fast, secure & reliable' },
      { icon: Search, title: 'Track', desc: 'Real-time location data' },
      { icon: Navigation, title: 'Calculate', desc: 'Instant rate quotes' },
      { icon: Ship, title: 'Freight', desc: 'Bulk global cargo' }
    ].map((item, i) => (
      <motion.div 
        key={i}
        className="action-card"
        whileHover={{ y: -10 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1 }}
      >
        <div className="icon-wrapper"><item.icon size={28} /></div>
        <h3>{item.title}</h3>
        <p>{item.desc}</p>
        <ArrowRight size={18} className="arrow" />
      </motion.div>
    ))}
  </section>
);

const AnalyticsDashboard = () => (
  <section id="dashboard" className="dashboard-preview">
    <div className="dashboard-header">
      <h2>Your Logistics Dashboard</h2>
      <p>Performance at a glance</p>
    </div>
    <div className="dashboard-content">
      <div className="stats-panel">
        <div className="stat-card">
          <span className="label">Active Shipments</span>
          <span className="value">24</span>
          <div className="mini-chart blue"></div>
        </div>
        <div className="stat-card">
          <span className="label">On-Time Rate</span>
          <span className="value">99.4%</span>
          <div className="mini-chart gold"></div>
        </div>
        <div className="stat-card">
          <span className="label">Carbon Saved</span>
          <span className="value">1.2 Tons</span>
          <div className="mini-chart green"></div>
        </div>
      </div>
      <div className="shipment-status">
        <h3>Recent Shipments</h3>
        {[1, 2, 3].map(i => (
          <div key={i} className="shipment-row">
            <div className="status-dot online"></div>
            <div className="shipment-info">
              <span className="id">GS-10023{i}</span>
              <span className="route">LAX → LHR</span>
            </div>
            <div className="progress-track">
              <div className="progress-bar" style={{ width: `${30 * i}%` }}></div>
            </div>
            <span className="eta">ETA: 2h 40m</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ServicesParallax = () => (
  <section id="services" className="services-section">
    <div className="service-header">
      <h2>Global Reach, Local Touch</h2>
    </div>
    <div className="services-container">
      <div className="service-box sea">
        <Ship size={40} />
        <h3>Ocean Freight</h3>
        <p>Door-to-door global sea cargo solutions.</p>
      </div>
      <div className="service-box air">
        <Plane size={40} />
        <h3>Air Logistics</h3>
        <p>Next-day priority air transport worldwide.</p>
      </div>
      <div className="service-box ground">
        <Truck size={40} />
        <h3>Ground Network</h3>
        <p>Proprietary fleet covering 48 states.</p>
      </div>
    </div>
  </section>
);

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <main>
        <ActionGrid />
        <AnalyticsDashboard />
        <ServicesParallax />
      </main>
      <footer>
        <div className="footer-content">
          <div className="brand">Global Streamline LLC</div>
          <p>© 2026 Innovation in Motion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
