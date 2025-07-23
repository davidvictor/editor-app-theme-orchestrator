// Hacker Portal Configuration Constants
import { getAllThemeNames } from './monaco-themes-registry'

export const STORAGE_KEYS = {
  LIGHT_THEME: 'hacker-portal-light-theme',
  DARK_THEME: 'hacker-portal-dark-theme',
  CONFIG: 'hacker-portal-config',
  CODE: 'hacker-portal-code'
}

export const BUILT_IN_THEMES = [
  'vs', 'vs-dark', 'hc-black', 'hc-light'
]

// Default themes that should use the app's CSS instead of extracted colors
// These themes will not have their colors extracted - the app will use default CSS
export const DEFAULT_THEMES_USE_APP_CSS = [
  'vs', 'vs-dark', 'hc-black', 'hc-light'
]

// Get all Monaco themes excluding built-ins
export const MONACO_THEMES = getAllThemeNames().filter(theme => 
  !['vs', 'vs-dark', 'hc-black', 'hc-light'].includes(theme)
)

export const DEFAULT_CONFIG = {
  fontSize: 14,
  wordWrap: 'on' as const,
  minimap: { enabled: true },
  theme: 'vs-dark',
  automaticLayout: true,
  cursorBlinking: 'blink' as const,
  cursorStyle: 'line' as const,
  lineNumbers: 'on' as const,
  folding: true,
  glyphMargin: false,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  renderWhitespace: 'selection' as const,
  tabSize: 2,
  insertSpaces: true,
  formatOnPaste: true,
  formatOnType: true
}

export const JAVASCRIPT_TEMPLATE = `// === MONACO HACKER PORTAL v2.0 ===
// System: ACTIVE | Security: ENABLED | Mode: STEALTH

// ========================================
// CORE SYSTEM INITIALIZATION
// ========================================

class HackerPortal {
  constructor() {
    this.version = "2.0.0";
    this.status = "ACTIVE";
    this.modules = new Map();
    this.security = new SecurityModule();
    this.network = new NetworkModule();
    this.crypto = new CryptoModule();
    this.ai = new AIModule();
    
    this.initializeSystem();
  }

  async initializeSystem() {
    console.log("[SYSTEM] Initializing Hacker Portal v2.0...");
    
    // Boot sequence
    await this.runBootSequence();
    
    // Load core modules
    this.loadCoreModules();
    
    // Establish secure connections
    await this.establishConnections();
    
    // Initialize AI assistant
    this.ai.initialize();
    
    console.log("[SYSTEM] Initialization complete. All systems operational.");
  }

  async runBootSequence() {
    const bootSteps = [
      "Loading kernel modules...",
      "Initializing quantum encryption...",
      "Establishing neural network...",
      "Calibrating dark web interfaces...",
      "Synchronizing with satellite network..."
    ];

    for (const step of bootSteps) {
      console.log(\`[BOOT] \${step}\`);
      await this.delay(500);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// SECURITY MODULE
// ========================================

class SecurityModule {
  constructor() {
    this.encryptionLevel = "QUANTUM-256";
    this.firewalls = [];
    this.intrusionDetection = true;
    this.stealthMode = true;
  }

  async scanForThreats() {
    console.log("[SECURITY] Initiating threat scan...");
    const threats = await this.deepScan();
    
    if (threats.length > 0) {
      console.warn(\`[SECURITY] \${threats.length} threats detected!\`);
      this.neutralizeThreats(threats);
    } else {
      console.log("[SECURITY] System secure. No threats detected.");
    }
  }

  async deepScan() {
    // Simulated threat detection
    return Math.random() > 0.8 ? ["Malware.Trojan.X", "Probe.Scanner.Y"] : [];
  }

  neutralizeThreats(threats) {
    threats.forEach(threat => {
      console.log(\`[SECURITY] Neutralizing: \${threat}\`);
      // Threat neutralization logic
    });
  }

  encryptData(data) {
    // Quantum encryption simulation
    return btoa(JSON.stringify(data));
  }

  decryptData(encrypted) {
    // Quantum decryption simulation
    return JSON.parse(atob(encrypted));
  }
}

// ========================================
// NETWORK MODULE
// ========================================

class NetworkModule {
  constructor() {
    this.nodes = new Map();
    this.darkWebAccess = false;
    this.vpnLayers = 7;
    this.bandwidth = "10Gbps";
  }

  async connectToDarkWeb() {
    console.log("[NETWORK] Establishing dark web connection...");
    
    // Route through multiple VPN layers
    for (let i = 1; i <= this.vpnLayers; i++) {
      console.log(\`[NETWORK] Routing through VPN layer \${i}...\`);
      await this.delay(300);
    }
    
    this.darkWebAccess = true;
    console.log("[NETWORK] Dark web access established. Anonymous mode active.");
  }

  async scanNetworks() {
    const networks = [
      { ssid: "FBI-Van-42", signal: -45, encrypted: true },
      { ssid: "NSA-Surveillance", signal: -67, encrypted: true },
      { ssid: "Free-WiFi", signal: -30, encrypted: false },
      { ssid: "Quantum-Net-X", signal: -55, encrypted: true }
    ];

    console.log("[NETWORK] Available networks:");
    networks.forEach(net => {
      console.log(\`  - \${net.ssid} [\${net.signal}dBm] \${net.encrypted ? "🔒" : "🔓"}\`);
    });

    return networks;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// CRYPTO MODULE
// ========================================

class CryptoModule {
  constructor() {
    this.algorithms = ["SHA-512", "AES-256", "RSA-4096", "QUANTUM-RESISTANT"];
    this.miningActive = false;
    this.wallets = new Map();
  }

  generateWallet() {
    const wallet = {
      address: this.generateAddress(),
      privateKey: this.generatePrivateKey(),
      balance: 0
    };

    console.log("[CRYPTO] New wallet generated:");
    console.log(\`  Address: \${wallet.address}\`);
    console.log(\`  Private Key: \${wallet.privateKey.substring(0, 20)}...\`);

    return wallet;
  }

  generateAddress() {
    return "0x" + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }

  generatePrivateKey() {
    return Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  }

  async startMining() {
    this.miningActive = true;
    console.log("[CRYPTO] Mining operation started...");
    
    while (this.miningActive) {
      const hash = await this.mine();
      if (hash.startsWith("0000")) {
        console.log(\`[CRYPTO] Block mined! Hash: \${hash}\`);
        break;
      }
    }
  }

  async mine() {
    // Simulated mining
    await this.delay(1000);
    return Math.random().toString(36).substring(2);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// AI MODULE
// ========================================

class AIModule {
  constructor() {
    this.model = "GPT-QUANTUM";
    self = true;
    this.learningRate = 0.001;
    this.neuralNetwork = this.buildNetwork();
  }

  initialize() {
    console.log("[AI] Initializing quantum neural network...");
    console.log(\`[AI] Model: \${this.model}\`);
    console.log(\`[AI] Self-aware: \${this.selfAware}\`);
    console.log("[AI] Ready for operations.");
  }

  buildNetwork() {
    return {
      layers: [
        { type: "input", neurons: 1024 },
        { type: "hidden", neurons: 2048 },
        { type: "hidden", neurons: 2048 },
        { type: "output", neurons: 512 }
      ],
      weights: this.randomizeWeights()
    };
  }

  randomizeWeights() {
    // Initialize random weights
    return Array.from({length: 1000}, () => Math.random());
  }

  async analyze(data) {
    console.log("[AI] Analyzing data...");
    
    // Simulated analysis
    await this.delay(1500);
    
    const insights = {
      patterns: Math.floor(Math.random() * 50) + 10,
      anomalies: Math.floor(Math.random() * 5),
      predictions: this.generatePredictions(),
      confidence: (Math.random() * 0.3 + 0.7).toFixed(2)
    };

    console.log("[AI] Analysis complete:");
    console.log(\`  Patterns detected: \${insights.patterns}\`);
    console.log(\`  Anomalies found: \${insights.anomalies}\`);
    console.log(\`  Confidence level: \${(insights.confidence * 100).toFixed(0)}%\`);

    return insights;
  }

  generatePredictions() {
    return [
      "System breach attempt in 3.7 hours",
      "Optimal mining window at 02:00 UTC",
      "Network congestion expected in sector 7"
    ];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ========================================
// MAIN EXECUTION
// ========================================

// Initialize the hacker portal
const portal = new HackerPortal();

// Example operations
(async () => {
  // Security scan
  await portal.security.scanForThreats();
  
  // Network operations
  await portal.network.scanNetworks();
  
  // Crypto operations
  const wallet = portal.crypto.generateWallet();
  
  // AI analysis
  const analysis = await portal.ai.analyze({ type: "network_traffic" });
  
  console.log("\\n[SYSTEM] All operations completed successfully.");
  console.log("[SYSTEM] Hacker Portal v2.0 - Ready for your commands.");
})();

// ========================================
// INTERACTIVE CONSOLE COMMANDS
// ========================================

const commands = {
  help: () => {
    console.log(\`
Available Commands:
  help()          - Show this help message
  scan()          - Scan for network threats
  mine()          - Start crypto mining
  encrypt(data)   - Encrypt data with quantum encryption
  decrypt(data)   - Decrypt quantum-encrypted data
  analyze(data)   - Run AI analysis on data
  darkweb()       - Connect to dark web
  status()        - Show system status
    \`);
  },
  
  scan: () => portal.security.scanForThreats(),
  mine: () => portal.crypto.startMining(),
  encrypt: (data) => portal.security.encryptData(data),
  decrypt: (data) => portal.security.decryptData(data),
  analyze: (data) => portal.ai.analyze(data),
  darkweb: () => portal.network.connectToDarkWeb(),
  status: () => {
    console.log(\`
System Status:
  Version: \${portal.version}
  Status: \${portal.status}
  Security: \${portal.security.stealthMode ? "STEALTH MODE" : "NORMAL"}
  Network: \${portal.network.darkWebAccess ? "DARK WEB" : "CLEAR NET"}
  AI: ONLINE
    \`);
  }
};

// Make commands globally available
Object.assign(window, commands);

console.log("\\n[CONSOLE] Type help() for available commands.");
`;

export const SQL_TEMPLATE = `-- ===================================================
-- MONACO CYBERPUNK TACTICAL DATABASE
-- Version: 3.0.0
-- Classification: TOP SECRET
-- ===================================================

-- Drop existing schema if needed
DROP SCHEMA IF EXISTS monaco_tactical CASCADE;
CREATE SCHEMA monaco_tactical;
SET search_path TO monaco_tactical;

-- ===================================================
-- CORE SYSTEM TABLES
-- ===================================================

-- Agent profiles and classifications
CREATE TABLE agents (
    agent_id VARCHAR(10) PRIMARY KEY,
    codename VARCHAR(50) UNIQUE NOT NULL,
    real_name VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('active', 'standby', 'compromised', 'mia', 'kia')),
    specialization VARCHAR(50),
    clearance_level INTEGER CHECK (clearance_level BETWEEN 1 AND 10),
    augmentations JSONB,
    psychological_profile JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP,
    handler_id VARCHAR(10)
);

-- Operations and missions
CREATE TABLE operations (
    operation_id VARCHAR(20) PRIMARY KEY,
    codename VARCHAR(100) NOT NULL,
    classification VARCHAR(20) DEFAULT 'CLASSIFIED',
    status VARCHAR(20) CHECK (status IN ('planning', 'active', 'completed', 'compromised', 'aborted')),
    priority_level INTEGER CHECK (priority_level BETWEEN 1 AND 5),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location_data JSONB,
    objectives JSONB,
    resources_allocated JSONB,
    created_by VARCHAR(10),
    approved_by VARCHAR(10),
    FOREIGN KEY (created_by) REFERENCES agents(agent_id),
    FOREIGN KEY (approved_by) REFERENCES agents(agent_id)
);

-- Agent-Operation assignments
CREATE TABLE operation_assignments (
    assignment_id SERIAL PRIMARY KEY,
    operation_id VARCHAR(20),
    agent_id VARCHAR(10),
    role VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    performance_rating INTEGER,
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id),
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id),
    UNIQUE(operation_id, agent_id)
);

-- Intelligence data
CREATE TABLE intelligence_reports (
    report_id SERIAL PRIMARY KEY,
    source_id VARCHAR(10),
    operation_id VARCHAR(20),
    classification VARCHAR(20) DEFAULT 'SECRET',
    reliability_rating CHAR(1) CHECK (reliability_rating IN ('A', 'B', 'C', 'D', 'E', 'F')),
    credibility_rating INTEGER CHECK (credibility_rating BETWEEN 1 AND 6),
    report_data JSONB NOT NULL,
    raw_intel TEXT,
    analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyst_id VARCHAR(10),
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (source_id) REFERENCES agents(agent_id),
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id),
    FOREIGN KEY (analyst_id) REFERENCES agents(agent_id)
);

-- System infrastructure
CREATE TABLE systems (
    system_id VARCHAR(20) PRIMARY KEY,
    system_name VARCHAR(100) NOT NULL,
    system_type VARCHAR(50) CHECK (system_type IN ('mainframe', 'firewall', 'database', 'comms', 'ai_core', 'satellite')),
    status VARCHAR(20) CHECK (status IN ('online', 'offline', 'maintenance', 'compromised')),
    location VARCHAR(100),
    security_level INTEGER CHECK (security_level BETWEEN 1 AND 10),
    specifications JSONB,
    vulnerabilities JSONB,
    last_maintenance TIMESTAMP,
    next_maintenance TIMESTAMP
);

-- Communication logs
CREATE TABLE comm_logs (
    log_id SERIAL PRIMARY KEY,
    sender_id VARCHAR(10),
    receiver_id VARCHAR(10),
    operation_id VARCHAR(20),
    encryption_type VARCHAR(50),
    message_content TEXT,
    decrypted_content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(20) CHECK (priority IN ('routine', 'urgent', 'critical', 'flash')),
    read_receipt BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES agents(agent_id),
    FOREIGN KEY (receiver_id) REFERENCES agents(agent_id),
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id)
);

-- Threat database
CREATE TABLE threats (
    threat_id SERIAL PRIMARY KEY,
    threat_designation VARCHAR(100) NOT NULL,
    threat_level INTEGER CHECK (threat_level BETWEEN 1 AND 10),
    organization VARCHAR(100),
    known_capabilities JSONB,
    last_activity TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('active', 'neutralized', 'dormant', 'unknown')),
    countermeasures JSONB
);

-- Equipment and resources
CREATE TABLE equipment (
    equipment_id VARCHAR(20) PRIMARY KEY,
    designation VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('available', 'deployed', 'maintenance', 'destroyed')),
    specifications JSONB,
    current_holder VARCHAR(10),
    location VARCHAR(100),
    last_maintenance TIMESTAMP,
    FOREIGN KEY (current_holder) REFERENCES agents(agent_id)
);

-- ===================================================
-- ADVANCED FEATURES AND INDEXES
-- ===================================================

-- Create indexes for performance
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_specialization ON agents(specialization);
CREATE INDEX idx_operations_status ON operations(status);
CREATE INDEX idx_operations_priority ON operations(priority_level);
CREATE INDEX idx_intel_classification ON intelligence_reports(classification);
CREATE INDEX idx_intel_created ON intelligence_reports(created_at);
CREATE INDEX idx_comm_timestamp ON comm_logs(timestamp);
CREATE INDEX idx_threats_level ON threats(threat_level);

-- Full text search on intelligence
CREATE INDEX idx_intel_search ON intelligence_reports USING gin(to_tsvector('english', raw_intel || ' ' || analysis));

-- ===================================================
-- VIEWS FOR OPERATIONAL INTELLIGENCE
-- ===================================================

-- Active operations overview
CREATE VIEW active_operations_overview AS
SELECT 
    o.operation_id,
    o.codename,
    o.status,
    o.priority_level,
    COUNT(DISTINCT oa.agent_id) as assigned_agents,
    COUNT(DISTINCT ir.report_id) as intel_reports,
    MAX(ir.created_at) as latest_intel
FROM operations o
LEFT JOIN operation_assignments oa ON o.operation_id = oa.operation_id
LEFT JOIN intelligence_reports ir ON o.operation_id = ir.operation_id
WHERE o.status IN ('planning', 'active')
GROUP BY o.operation_id, o.codename, o.status, o.priority_level;

-- Agent readiness report
CREATE VIEW agent_readiness AS
SELECT 
    a.agent_id,
    a.codename,
    a.status,
    a.specialization,
    COUNT(DISTINCT oa.operation_id) as current_operations,
    MAX(oa.assigned_at) as last_assignment,
    CASE 
        WHEN a.status = 'active' AND COUNT(oa.operation_id) = 0 THEN 'available'
        WHEN a.status = 'active' AND COUNT(oa.operation_id) > 0 THEN 'deployed'
        ELSE a.status
    END as availability
FROM agents a
LEFT JOIN operation_assignments oa ON a.agent_id = oa.agent_id AND oa.status = 'active'
GROUP BY a.agent_id, a.codename, a.status, a.specialization;

-- Threat assessment matrix
CREATE VIEW threat_matrix AS
SELECT 
    t.threat_id,
    t.threat_designation,
    t.threat_level,
    t.status as threat_status,
    COUNT(DISTINCT ir.report_id) as related_intel,
    MAX(ir.created_at) as latest_intel_date,
    CASE 
        WHEN t.threat_level >= 8 AND t.status = 'active' THEN 'CRITICAL'
        WHEN t.threat_level >= 6 AND t.status = 'active' THEN 'HIGH'
        WHEN t.threat_level >= 4 AND t.status = 'active' THEN 'MEDIUM'
        ELSE 'LOW'
    END as risk_assessment
FROM threats t
LEFT JOIN intelligence_reports ir ON ir.report_data::text LIKE '%' || t.threat_designation || '%'
GROUP BY t.threat_id, t.threat_designation, t.threat_level, t.status;

-- ===================================================
-- STORED PROCEDURES
-- ===================================================

-- Assign agent to operation
CREATE OR REPLACE FUNCTION assign_agent_to_operation(
    p_operation_id VARCHAR(20),
    p_agent_id VARCHAR(10),
    p_role VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
    v_agent_status VARCHAR(20);
    v_operation_status VARCHAR(20);
BEGIN
    -- Check agent status
    SELECT status INTO v_agent_status FROM agents WHERE agent_id = p_agent_id;
    
    -- Check operation status
    SELECT status INTO v_operation_status FROM operations WHERE operation_id = p_operation_id;
    
    -- Validate assignment
    IF v_agent_status NOT IN ('active', 'standby') THEN
        RAISE EXCEPTION 'Agent % is not available for assignment', p_agent_id;
    END IF;
    
    IF v_operation_status NOT IN ('planning', 'active') THEN
        RAISE EXCEPTION 'Operation % is not accepting assignments', p_operation_id;
    END IF;
    
    -- Make assignment
    INSERT INTO operation_assignments (operation_id, agent_id, role)
    VALUES (p_operation_id, p_agent_id, p_role)
    ON CONFLICT (operation_id, agent_id) DO UPDATE
    SET role = p_role, assigned_at = CURRENT_TIMESTAMP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Log intelligence report with auto-classification
CREATE OR REPLACE FUNCTION log_intelligence_report(
    p_source_id VARCHAR(10),
    p_operation_id VARCHAR(20),
    p_raw_intel TEXT,
    p_analyst_id VARCHAR(10)
) RETURNS INTEGER AS $$
DECLARE
    v_report_id INTEGER;
    v_classification VARCHAR(20);
    v_reliability CHAR(1);
BEGIN
    -- Auto-classify based on keywords
    IF p_raw_intel ILIKE '%top secret%' OR p_raw_intel ILIKE '%eyes only%' THEN
        v_classification := 'TOP SECRET';
    ELSIF p_raw_intel ILIKE '%secret%' THEN
        v_classification := 'SECRET';
    ELSIF p_raw_intel ILIKE '%confidential%' THEN
        v_classification := 'CONFIDENTIAL';
    ELSE
        v_classification := 'UNCLASSIFIED';
    END IF;
    
    -- Determine reliability based on source
    SELECT CASE 
        WHEN clearance_level >= 8 THEN 'A'
        WHEN clearance_level >= 6 THEN 'B'
        WHEN clearance_level >= 4 THEN 'C'
        ELSE 'D'
    END INTO v_reliability
    FROM agents WHERE agent_id = p_source_id;
    
    -- Insert report
    INSERT INTO intelligence_reports (
        source_id, operation_id, classification, reliability_rating,
        raw_intel, analyst_id, report_data
    ) VALUES (
        p_source_id, p_operation_id, v_classification, v_reliability,
        p_raw_intel, p_analyst_id, jsonb_build_object(
            'timestamp', CURRENT_TIMESTAMP,
            'auto_classified', TRUE
        )
    ) RETURNING report_id INTO v_report_id;
    
    RETURN v_report_id;
END;
$$ LANGUAGE plpgsql;

-- ===================================================
-- SAMPLE DATA INSERTION
-- ===================================================

-- Insert sample agents
INSERT INTO agents (agent_id, codename, real_name, status, specialization, clearance_level, augmentations) VALUES
('G-078W', 'GHOST', 'Classified', 'active', 'Infiltration', 9, '{"neural_interface": true, "optical_camo": true}'),
('V-023K', 'VIPER', 'Classified', 'active', 'Cyber Warfare', 8, '{"enhanced_reflexes": true, "cyber_deck": "mk5"}'),
('R-091X', 'RAVEN', 'Classified', 'standby', 'Surveillance', 7, '{"enhanced_vision": true, "audio_amplification": true}'),
('S-045Z', 'SPECTER', 'Classified', 'active', 'Extraction', 8, '{"strength_boost": true, "tactical_armor": true}'),
('N-067Y', 'NOVA', 'Classified', 'active', 'Combat', 9, '{"combat_stims": true, "weapon_interface": true}');

-- Insert sample operations
INSERT INTO operations (operation_id, codename, classification, status, priority_level, start_date) VALUES
('OP-BLACKOUT-001', 'Operation Blackout', 'TOP SECRET', 'active', 5, CURRENT_TIMESTAMP),
('OP-REDSTORM-002', 'Operation Red Storm', 'SECRET', 'planning', 4, CURRENT_TIMESTAMP + INTERVAL '7 days'),
('OP-PHOENIX-003', 'Operation Phoenix', 'TOP SECRET', 'active', 5, CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Assign agents to operations
SELECT assign_agent_to_operation('OP-BLACKOUT-001', 'G-078W', 'Lead Infiltrator');
SELECT assign_agent_to_operation('OP-BLACKOUT-001', 'V-023K', 'Cyber Specialist');
SELECT assign_agent_to_operation('OP-PHOENIX-003', 'N-067Y', 'Strike Team Leader');

-- Insert sample intelligence
SELECT log_intelligence_report(
    'G-078W',
    'OP-BLACKOUT-001',
    'Target facility confirmed. Security protocols analyzed. Recommend breach at 0300 hours. TOP SECRET - Multiple hostiles detected.',
    'V-023K'
);

-- ===================================================
-- MONITORING AND ANALYTICS QUERIES
-- ===================================================

-- Real-time operational status
SELECT * FROM active_operations_overview ORDER BY priority_level DESC;

-- Agent deployment status
SELECT * FROM agent_readiness WHERE availability = 'available';

-- Current threat assessment
SELECT * FROM threat_matrix WHERE risk_assessment IN ('CRITICAL', 'HIGH');

-- Recent intelligence activity
SELECT 
    ir.report_id,
    a.codename as source,
    o.codename as operation,
    ir.classification,
    ir.reliability_rating,
    ir.created_at
FROM intelligence_reports ir
JOIN agents a ON ir.source_id = a.agent_id
JOIN operations o ON ir.operation_id = o.operation_id
ORDER BY ir.created_at DESC
LIMIT 10;

-- System performance metrics
SELECT 
    'Total Agents' as metric, COUNT(*) as value FROM agents
UNION ALL
SELECT 'Active Operations', COUNT(*) FROM operations WHERE status = 'active'
UNION ALL
SELECT 'Intelligence Reports (24h)', COUNT(*) FROM intelligence_reports WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'
UNION ALL
SELECT 'Critical Threats', COUNT(*) FROM threats WHERE threat_level >= 8 AND status = 'active';
`;