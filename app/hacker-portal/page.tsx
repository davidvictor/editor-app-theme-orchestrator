"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import Editor, { Monaco } from "@monaco-editor/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Local storage keys
const STORAGE_KEYS = {
  LIGHT_THEME: "monaco-light-theme",
  DARK_THEME: "monaco-dark-theme",
  CONFIG: "monaco-editor-config",
  CODE: "monaco-editor-code"
}

// Available themes
const BUILT_IN_THEMES = [
  { value: "vs", label: "Visual Studio" },
  { value: "vs-dark", label: "Visual Studio Dark" },
  { value: "hc-black", label: "High Contrast Black" },
  { value: "hc-light", label: "High Contrast Light" }
]

const MONACO_THEMES = [
  { value: "Active4D", label: "Active4D" },
  { value: "All Hallows Eve", label: "All Hallows Eve" },
  { value: "Amy", label: "Amy" },
  { value: "Birds of Paradise", label: "Birds of Paradise" },
  { value: "Blackboard", label: "Blackboard" },
  { value: "Brilliance Black", label: "Brilliance Black" },
  { value: "Brilliance Dull", label: "Brilliance Dull" },
  { value: "Chrome DevTools", label: "Chrome DevTools" },
  { value: "Clouds", label: "Clouds" },
  { value: "Clouds Midnight", label: "Clouds Midnight" },
  { value: "Cobalt", label: "Cobalt" },
  { value: "Cobalt2", label: "Cobalt2" },
  { value: "Dawn", label: "Dawn" },
  { value: "Dracula", label: "Dracula" },
  { value: "Dreamweaver", label: "Dreamweaver" },
  { value: "Eiffel", label: "Eiffel" },
  { value: "Espresso Libre", label: "Espresso Libre" },
  { value: "GitHub", label: "GitHub" },
  { value: "GitHub Dark", label: "GitHub Dark" },
  { value: "GitHub Light", label: "GitHub Light" },
  { value: "IDLE", label: "IDLE" },
  { value: "Katzenmilch", label: "Katzenmilch" },
  { value: "Kuroir Theme", label: "Kuroir Theme" },
  { value: "LAZY", label: "LAZY" },
  { value: "MagicWB (Amiga)", label: "MagicWB (Amiga)" },
  { value: "Merbivore", label: "Merbivore" },
  { value: "Merbivore Soft", label: "Merbivore Soft" },
  { value: "Monokai", label: "Monokai" },
  { value: "Monokai Bright", label: "Monokai Bright" },
  { value: "Night Owl", label: "Night Owl" },
  { value: "Nord", label: "Nord" },
  { value: "Oceanic Next", label: "Oceanic Next" },
  { value: "Pastels on Dark", label: "Pastels on Dark" }
]

const ALL_THEMES = [...BUILT_IN_THEMES, ...MONACO_THEMES]

const DEFAULT_CONFIG = {
  fontSize: 14,
  fontFamily: "Consolas, 'Courier New', monospace",
  lineNumbers: "on",
  minimap: { enabled: true },
  wordWrap: "on",
  automaticLayout: true,
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on",
  autoClosingBrackets: "always",
  autoClosingQuotes: "always",
  autoIndent: "full",
  bracketPairColorization: { enabled: true },
  cursorBlinking: "blink",
  cursorStyle: "line",
  folding: true,
  formatOnPaste: true,
  formatOnType: true,
  tabSize: 2
}

const JAVASCRIPT_TEMPLATE = `// Welcome to the Hacker Portal - JavaScript Environment
// This comprehensive example demonstrates various JavaScript features

// 1. Classes and OOP
class CyberSystem {
  #privateKey = 'SECURE_KEY_001';
  
  constructor(systemId, config = {}) {
    this.systemId = systemId;
    this.status = 'initializing';
    this.config = { ...this.defaultConfig, ...config };
    this.modules = new Map();
    this.eventListeners = [];
  }
  
  get defaultConfig() {
    return {
      securityLevel: 'HIGH',
      autoReconnect: true,
      maxRetries: 3,
      timeout: 5000
    };
  }
  
  async initialize() {
    try {
      await this.loadModules();
      await this.establishConnection();
      this.status = 'operational';
      this.emit('system:ready', { timestamp: Date.now() });
    } catch (error) {
      console.error('Initialization failed:', error);
      throw new SystemError('Failed to initialize system', error);
    }
  }
  
  emit(event, data) {
    this.eventListeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }
}

// 2. Custom Error Classes
class SystemError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'SystemError';
    this.cause = cause;
    this.timestamp = new Date().toISOString();
  }
}

// 3. Async/Await and Promises
async function performSecurityScan(targets) {
  const results = await Promise.allSettled(
    targets.map(async (target) => {
      const startTime = performance.now();
      
      try {
        const response = await fetch(\`/api/scan/\${target.id}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ depth: target.depth || 3 })
        });
        
        if (!response.ok) {
          throw new Error(\`Scan failed: \${response.statusText}\`);
        }
        
        const data = await response.json();
        return {
          ...data,
          duration: performance.now() - startTime,
          target: target.id
        };
      } catch (error) {
        return {
          error: error.message,
          target: target.id,
          duration: performance.now() - startTime
        };
      }
    })
  );
  
  return results.reduce((acc, result) => {
    if (result.status === 'fulfilled') {
      acc.successful.push(result.value);
    } else {
      acc.failed.push(result.reason);
    }
    return acc;
  }, { successful: [], failed: [] });
}

// 4. Generator Functions and Iterators
function* generateAccessCodes(prefix = 'ACC', count = 10) {
  let index = 0;
  
  while (index < count) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    yield \`\${prefix}-\${timestamp}-\${random}\`.toUpperCase();
    index++;
  }
}

// 5. Modern Array Methods and Functional Programming
const processAgentData = (agents) => {
  return agents
    .filter(agent => agent.status === 'active')
    .map(agent => ({
      ...agent,
      riskScore: calculateRiskScore(agent),
      lastSeenRelative: getRelativeTime(agent.lastSeen)
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .reduce((groups, agent) => {
      const category = agent.riskScore > 70 ? 'high' : 
                      agent.riskScore > 40 ? 'medium' : 'low';
      groups[category] = groups[category] || [];
      groups[category].push(agent);
      return groups;
    }, {});
};

// 6. Destructuring and Spread Operator
const enhanceOperation = ({ id, name, ...operationData }) => {
  const { agents = [], priority = 'normal', tags = [] } = operationData;
  
  return {
    id,
    name: name.toUpperCase(),
    ...operationData,
    agents: [...new Set(agents)], // Remove duplicates
    tags: ['auto-generated', ...tags],
    metadata: {
      created: new Date().toISOString(),
      version: '2.0',
      priority
    }
  };
};

// 7. Template Literals and Tagged Templates
const sql = (strings, ...values) => {
  return strings.reduce((query, str, i) => {
    return query + str + (values[i] ? \`'\${values[i]}'\` : '');
  }, '');
};

const query = sql\`
  SELECT * FROM agents 
  WHERE status = \${agentStatus} 
  AND last_seen > \${cutoffDate}
\`;

// 8. Symbols and WeakMaps for Private Data
const privateData = new WeakMap();
const SECURE_TOKEN = Symbol('secureToken');

class SecureVault {
  constructor(initialData) {
    privateData.set(this, {
      data: initialData,
      accessLog: []
    });
    this[SECURE_TOKEN] = crypto.randomUUID();
  }
  
  access(key) {
    const vault = privateData.get(this);
    vault.accessLog.push({
      key,
      timestamp: Date.now(),
      token: this[SECURE_TOKEN]
    });
    return vault.data[key];
  }
}

// 9. Proxy and Reflect
const createTrackedObject = (target) => {
  return new Proxy(target, {
    get(obj, prop) {
      console.log(\`Accessing property: \${String(prop)}\`);
      return Reflect.get(obj, prop);
    },
    set(obj, prop, value) {
      console.log(\`Setting property: \${String(prop)} = \${value}\`);
      return Reflect.set(obj, prop, value);
    },
    deleteProperty(obj, prop) {
      console.log(\`Deleting property: \${String(prop)}\`);
      return Reflect.deleteProperty(obj, prop);
    }
  });
};

// 10. Regular Expressions
const patterns = {
  agentId: /^[A-Z]{1,3}-\d{3}[A-Z]$/,
  ipAddress: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
  secureHash: /^[a-f0-9]{64}$/i,
  timestamp: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/
};

const validateInput = (input, type) => {
  return patterns[type]?.test(input) || false;
};

// 11. Module Pattern and IIFE
const SecurityModule = (() => {
  let instance;
  
  function createInstance() {
    const privateKey = crypto.randomUUID();
    
    return {
      encrypt: (data) => btoa(JSON.stringify(data)),
      decrypt: (data) => JSON.parse(atob(data)),
      getKey: () => privateKey
    };
  }
  
  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 12. Example Usage and Initialization
(async () => {
  console.log('🚀 Initializing Cyber Operations Dashboard...');
  
  try {
    // Initialize system
    const system = new CyberSystem('CYBER-001', {
      securityLevel: 'MAXIMUM',
      autoReconnect: false
    });
    
    // Generate access codes
    const codeGenerator = generateAccessCodes('SEC', 5);
    const codes = [...codeGenerator];
    console.log('Generated codes:', codes);
    
    // Process agent data
    const agents = [
      { id: 'A-001', status: 'active', lastSeen: Date.now() - 1000 },
      { id: 'A-002', status: 'active', lastSeen: Date.now() - 5000 },
      { id: 'A-003', status: 'inactive', lastSeen: Date.now() - 10000 }
    ];
    
    const processed = processAgentData(agents);
    console.log('Processed agents:', processed);
    
    // Validate inputs
    console.log('Valid agent ID:', validateInput('A-001X', 'agentId'));
    console.log('Valid IP:', validateInput('192.168.1.1', 'ipAddress'));
    
    // Initialize system
    await system.initialize();
    console.log('✅ System operational');
    
  } catch (error) {
    console.error('❌ System initialization failed:', error);
  }
})();

// Helper functions
function calculateRiskScore(agent) {
  const timeSinceLastSeen = Date.now() - agent.lastSeen;
  const baseScore = Math.random() * 50;
  const timeScore = Math.min(timeSinceLastSeen / 1000, 50);
  return Math.round(baseScore + timeScore);
}

function getRelativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return \`\${seconds}s ago\`;
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)}m ago\`;
  return \`\${Math.floor(seconds / 3600)}h ago\`;
}
`

const SQL_TEMPLATE = `-- Welcome to the Hacker Portal - SQL Environment
-- This comprehensive example demonstrates various SQL features

-- 1. Database and Table Creation
CREATE DATABASE IF NOT EXISTS cyber_operations;
USE cyber_operations;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS agent_missions;
DROP TABLE IF EXISTS mission_logs;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS departments;

-- 2. Create Tables with Various Constraints
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL,
    security_level ENUM('LOW', 'MEDIUM', 'HIGH', 'MAXIMUM') DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_security_level (security_level)
);

CREATE TABLE agents (
    agent_id VARCHAR(20) PRIMARY KEY,
    codename VARCHAR(50) NOT NULL,
    real_name VARCHAR(100),
    department_id INT,
    status ENUM('ACTIVE', 'INACTIVE', 'COMPROMISED', 'TRAINING') DEFAULT 'TRAINING',
    clearance_level INT CHECK (clearance_level BETWEEN 1 AND 10),
    specialization JSON,
    hire_date DATE NOT NULL,
    last_seen DATETIME,
    performance_score DECIMAL(5,2),
    is_field_operative BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    INDEX idx_status (status),
    INDEX idx_department (department_id),
    FULLTEXT idx_name_search (codename, real_name)
);

CREATE TABLE missions (
    mission_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('LOW', 'NORMAL', 'HIGH', 'CRITICAL') DEFAULT 'NORMAL',
    status ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'FAILED', 'ABORTED') DEFAULT 'PLANNING',
    start_date DATETIME,
    end_date DATETIME,
    budget DECIMAL(15,2),
    location_data JSON,
    classification VARCHAR(50) DEFAULT 'CONFIDENTIAL',
    success_rate FLOAT,
    CHECK (end_date > start_date),
    CHECK (budget >= 0),
    INDEX idx_status_priority (status, priority)
);

CREATE TABLE agent_missions (
    agent_id VARCHAR(20),
    mission_id INT,
    role VARCHAR(100),
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    completion_date DATETIME,
    performance_rating INT CHECK (performance_rating BETWEEN 1 AND 5),
    notes TEXT,
    PRIMARY KEY (agent_id, mission_id),
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
        ON DELETE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES missions(mission_id)
        ON DELETE CASCADE
);

CREATE TABLE mission_logs (
    log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mission_id INT NOT NULL,
    agent_id VARCHAR(20),
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    log_level ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') DEFAULT 'INFO',
    message TEXT NOT NULL,
    metadata JSON,
    ip_address VARCHAR(45),
    FOREIGN KEY (mission_id) REFERENCES missions(mission_id)
        ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
        ON DELETE SET NULL,
    INDEX idx_timestamp (log_timestamp),
    INDEX idx_level_mission (log_level, mission_id)
);

-- 3. Insert Sample Data
INSERT INTO departments (name, code, security_level) VALUES
    ('Cyber Intelligence', 'CI', 'MAXIMUM'),
    ('Field Operations', 'FO', 'HIGH'),
    ('Research & Development', 'RD', 'HIGH'),
    ('Support Services', 'SS', 'MEDIUM'),
    ('Training Division', 'TD', 'LOW');

INSERT INTO agents (agent_id, codename, real_name, department_id, status, 
                   clearance_level, specialization, hire_date, last_seen, 
                   performance_score, is_field_operative) VALUES
    ('A-001X', 'SHADOW', 'John Doe', 1, 'ACTIVE', 9, 
     '{"primary": "infiltration", "secondary": ["cryptography", "surveillance"]}',
     '2020-03-15', '2024-01-15 14:30:00', 94.5, TRUE),
    ('A-002Y', 'PHOENIX', 'Jane Smith', 2, 'ACTIVE', 8,
     '{"primary": "combat", "secondary": ["extraction", "demolition"]}',
     '2019-07-22', '2024-01-15 13:45:00', 87.3, TRUE),
    ('A-003Z', 'CIPHER', 'Alice Johnson', 1, 'ACTIVE', 10,
     '{"primary": "cyber_warfare", "secondary": ["data_analysis"]}',
     '2018-01-10', '2024-01-15 15:00:00', 98.7, FALSE),
    ('A-004W', 'GHOST', 'Bob Wilson', 2, 'TRAINING', 5,
     '{"primary": "reconnaissance", "secondary": ["languages"]}',
     '2023-11-01', '2024-01-14 09:00:00', 76.2, TRUE),
    ('A-005V', 'RAVEN', 'Eve Brown', 3, 'INACTIVE', 7,
     '{"primary": "research", "secondary": ["weapons_tech"]}',
     '2021-05-30', '2023-12-01 16:20:00', 82.1, FALSE);

INSERT INTO missions (code, name, description, priority, status, 
                     start_date, end_date, budget, location_data, 
                     classification, success_rate) VALUES
    ('OP-OMEGA-001', 'Operation Omega', 
     'Infiltrate enemy cyber infrastructure and extract classified data',
     'CRITICAL', 'ACTIVE', '2024-01-10 00:00:00', '2024-02-10 23:59:59',
     2500000.00, '{"country": "Unknown", "coordinates": {"lat": 0, "lng": 0}}',
     'TOP SECRET', NULL),
    ('OP-DELTA-002', 'Operation Delta Shield',
     'Defend critical infrastructure against cyber attacks',
     'HIGH', 'COMPLETED', '2023-11-01 00:00:00', '2023-12-31 23:59:59',
     1800000.00, '{"country": "USA", "city": "Washington DC"}',
     'SECRET', 92.5),
    ('OP-ALPHA-003', 'Operation Alpha Strike',
     'Coordinated field operation for asset extraction',
     'HIGH', 'PLANNING', '2024-02-01 00:00:00', '2024-02-15 23:59:59',
     3200000.00, '{"country": "Classified", "region": "Eastern Europe"}',
     'TOP SECRET', NULL);

INSERT INTO agent_missions (agent_id, mission_id, role, performance_rating) VALUES
    ('A-001X', 1, 'Lead Infiltrator', NULL),
    ('A-003Z', 1, 'Cyber Specialist', NULL),
    ('A-001X', 2, 'Security Consultant', 5),
    ('A-002Y', 2, 'Field Coordinator', 4),
    ('A-003Z', 2, 'Technical Lead', 5);

-- 4. Complex Queries with CTEs and Window Functions
WITH agent_performance AS (
    SELECT 
        a.agent_id,
        a.codename,
        COUNT(DISTINCT am.mission_id) as total_missions,
        AVG(am.performance_rating) as avg_rating,
        MAX(m.priority = 'CRITICAL') as has_critical_mission
    FROM agents a
    LEFT JOIN agent_missions am ON a.agent_id = am.agent_id
    LEFT JOIN missions m ON am.mission_id = m.mission_id
    WHERE a.status = 'ACTIVE'
    GROUP BY a.agent_id, a.codename
),
ranked_agents AS (
    SELECT 
        *,
        RANK() OVER (ORDER BY avg_rating DESC NULLS LAST) as performance_rank,
        DENSE_RANK() OVER (ORDER BY total_missions DESC) as mission_rank
    FROM agent_performance
)
SELECT 
    agent_id,
    codename,
    total_missions,
    ROUND(avg_rating, 2) as avg_rating,
    performance_rank,
    mission_rank,
    CASE 
        WHEN has_critical_mission = 1 THEN 'CRITICAL CLEARANCE'
        WHEN total_missions > 3 THEN 'EXPERIENCED'
        ELSE 'STANDARD'
    END as agent_classification
FROM ranked_agents
ORDER BY performance_rank, mission_rank;

-- 5. Advanced JOIN Operations
SELECT 
    d.name as department,
    COUNT(DISTINCT a.agent_id) as total_agents,
    COUNT(DISTINCT CASE WHEN a.status = 'ACTIVE' THEN a.agent_id END) as active_agents,
    COUNT(DISTINCT am.mission_id) as unique_missions,
    COALESCE(SUM(m.budget), 0) as total_mission_budget,
    AVG(a.performance_score) as avg_performance,
    GROUP_CONCAT(DISTINCT a.codename ORDER BY a.performance_score DESC SEPARATOR ', ') as top_agents
FROM departments d
LEFT JOIN agents a ON d.department_id = a.department_id
LEFT JOIN agent_missions am ON a.agent_id = am.agent_id
LEFT JOIN missions m ON am.mission_id = m.mission_id
GROPY d.department_id, d.name
HAVING total_agents > 0
ORDER BY active_agents DESC, avg_performance DESC;

-- 6. Subqueries and EXISTS
SELECT 
    a.codename,
    a.clearance_level,
    (
        SELECT COUNT(*) 
        FROM mission_logs ml 
        WHERE ml.agent_id = a.agent_id 
        AND ml.log_level IN ('ERROR', 'CRITICAL')
    ) as error_count,
    EXISTS (
        SELECT 1 
        FROM agent_missions am 
        JOIN missions m ON am.mission_id = m.mission_id 
        WHERE am.agent_id = a.agent_id 
        AND m.status = 'ACTIVE'
    ) as has_active_mission
FROM agents a
WHERE a.status = 'ACTIVE'
AND a.clearance_level >= 7
AND NOT EXISTS (
    SELECT 1 
    FROM agent_missions am2 
    WHERE am2.agent_id = a.agent_id 
    AND am2.performance_rating < 3
);

-- 7. JSON Operations (MySQL 8.0+)
SELECT 
    agent_id,
    codename,
    JSON_EXTRACT(specialization, '$.primary') as primary_skill,
    JSON_LENGTH(JSON_EXTRACT(specialization, '$.secondary')) as secondary_skill_count,
    JSON_SEARCH(specialization, 'one', 'cryptography') IS NOT NULL as knows_crypto
FROM agents
WHERE JSON_CONTAINS(specialization, '"cyber_warfare"', '$.primary')
   OR JSON_CONTAINS(specialization, '"cryptography"', '$.secondary');

-- 8. Stored Procedures
DELIMITER //

CREATE PROCEDURE AssignAgentToMission(
    IN p_agent_id VARCHAR(20),
    IN p_mission_id INT,
    IN p_role VARCHAR(100)
)
BEGIN
    DECLARE v_agent_status VARCHAR(20);
    DECLARE v_mission_status VARCHAR(20);
    DECLARE v_error_message VARCHAR(200);
    
    -- Check agent status
    SELECT status INTO v_agent_status 
    FROM agents 
    WHERE agent_id = p_agent_id;
    
    -- Check mission status
    SELECT status INTO v_mission_status 
    FROM missions 
    WHERE mission_id = p_mission_id;
    
    -- Validate assignment
    IF v_agent_status != 'ACTIVE' THEN
        SET v_error_message = 'Agent is not active';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    IF v_mission_status NOT IN ('PLANNING', 'ACTIVE') THEN
        SET v_error_message = 'Mission is not accepting agents';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_error_message;
    END IF;
    
    -- Insert assignment
    INSERT INTO agent_missions (agent_id, mission_id, role)
    VALUES (p_agent_id, p_mission_id, p_role)
    ON DUPLICATE KEY UPDATE 
        role = p_role,
        assigned_date = CURRENT_TIMESTAMP;
    
    -- Log the assignment
    INSERT INTO mission_logs (mission_id, agent_id, log_level, message)
    VALUES (p_mission_id, p_agent_id, 'INFO', 
            CONCAT('Agent ', p_agent_id, ' assigned as ', p_role));
END//

DELIMITER ;

-- 9. Triggers
DELIMITER //

CREATE TRIGGER update_agent_last_seen
AFTER INSERT ON mission_logs
FOR EACH ROW
BEGIN
    IF NEW.agent_id IS NOT NULL THEN
        UPDATE agents 
        SET last_seen = NEW.log_timestamp 
        WHERE agent_id = NEW.agent_id
        AND (last_seen IS NULL OR last_seen < NEW.log_timestamp);
    END IF;
END//

DELIMITER ;

-- 10. Views
CREATE OR REPLACE VIEW active_operations AS
SELECT 
    m.mission_id,
    m.code,
    m.name,
    m.priority,
    m.status,
    m.start_date,
    COUNT(DISTINCT am.agent_id) as assigned_agents,
    GROUP_CONCAT(a.codename ORDER BY a.codename SEPARATOR ', ') as agent_list,
    DATEDIFF(CURRENT_DATE, m.start_date) as days_active
FROM missions m
LEFT JOIN agent_missions am ON m.mission_id = am.mission_id
LEFT JOIN agents a ON am.agent_id = a.agent_id
WHERE m.status IN ('ACTIVE', 'PLANNING')
GROUP BY m.mission_id, m.code, m.name, m.priority, m.status, m.start_date;

-- 11. Performance Analysis Query
SELECT 
    DATE_FORMAT(ml.log_timestamp, '%Y-%m-%d %H:00:00') as hour_bucket,
    ml.log_level,
    COUNT(*) as log_count,
    COUNT(DISTINCT ml.mission_id) as unique_missions,
    COUNT(DISTINCT ml.agent_id) as unique_agents,
    AVG(CASE WHEN ml.log_level = 'ERROR' THEN 1 ELSE 0 END) * 100 as error_rate
FROM mission_logs ml
WHERE ml.log_timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY hour_bucket, ml.log_level
WITH ROLLUP
HAVING hour_bucket IS NOT NULL OR ml.log_level IS NULL
ORDER BY hour_bucket DESC, log_count DESC;

-- 12. Recursive CTE for Hierarchy (MySQL 8.0+)
WITH RECURSIVE mission_timeline AS (
    -- Anchor: completed missions
    SELECT 
        mission_id,
        name,
        status,
        end_date as event_date,
        0 as days_offset,
        'COMPLETED' as timeline_status
    FROM missions
    WHERE status = 'COMPLETED'
    
    UNION ALL
    
    -- Recursive: project future missions
    SELECT 
        m.mission_id,
        m.name,
        m.status,
        DATE_ADD(mt.event_date, INTERVAL 30 DAY) as event_date,
        mt.days_offset + 30 as days_offset,
        'PROJECTED' as timeline_status
    FROM missions m
    JOIN mission_timeline mt ON m.mission_id != mt.mission_id
    WHERE mt.days_offset < 90
    AND m.status = 'PLANNING'
)
SELECT * FROM mission_timeline
ORDER BY event_date, mission_id;

-- 13. Analytical Functions and Reporting
SELECT 
    agent_id,
    codename,
    performance_score,
    NTILE(4) OVER (ORDER BY performance_score DESC) as performance_quartile,
    LAG(performance_score, 1) OVER (PARTITION BY department_id ORDER BY hire_date) as prev_agent_score,
    LEAD(performance_score, 1) OVER (PARTITION BY department_id ORDER BY hire_date) as next_agent_score,
    FIRST_VALUE(codename) OVER (PARTITION BY department_id ORDER BY performance_score DESC) as top_performer_in_dept,
    ROW_NUMBER() OVER (PARTITION BY status ORDER BY last_seen DESC) as recency_rank
FROM agents
WHERE status IN ('ACTIVE', 'TRAINING');

-- 14. Transaction Example
START TRANSACTION;

-- Deactivate compromised agent
UPDATE agents 
SET status = 'COMPROMISED', 
    last_seen = NOW() 
WHERE agent_id = 'A-004W';

-- Remove from active missions
UPDATE agent_missions 
SET completion_date = NOW(), 
    notes = 'Agent compromised - emergency removal' 
WHERE agent_id = 'A-004W' 
AND completion_date IS NULL;

-- Log the incident
INSERT INTO mission_logs (mission_id, agent_id, log_level, message, metadata)
SELECT 
    mission_id, 
    'A-004W', 
    'CRITICAL', 
    'Agent compromised and removed from mission',
    JSON_OBJECT('incident_time', NOW(), 'action_taken', 'emergency_extraction')
FROM agent_missions 
WHERE agent_id = 'A-004W' 
AND completion_date = NOW();

COMMIT;

-- 15. Index Analysis and Optimization
SHOW INDEX FROM agents;
EXPLAIN SELECT * FROM agents WHERE status = 'ACTIVE' AND clearance_level > 7;

-- Clean up (optional)
-- DROP DATABASE cyber_operations;
`

// Safe localStorage access
const safeGetItem = (key: string, defaultValue: string = "") => {
  if (typeof window === "undefined") return defaultValue
  try {
    return localStorage.getItem(key) || defaultValue
  } catch {
    return defaultValue
  }
}

const safeSetItem = (key: string, value: string) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export default function HackerPortalPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [lightTheme, setLightTheme] = useState("vs")
  const [darkTheme, setDarkTheme] = useState("vs-dark")
  const [editorOptions, setEditorOptions] = useState<any>(DEFAULT_CONFIG)
  const [activeTab, setActiveTab] = useState("javascript")
  const [javascriptCode, setJavascriptCode] = useState(JAVASCRIPT_TEMPLATE)
  const [sqlCode, setSqlCode] = useState(SQL_TEMPLATE)
  const [configText, setConfigText] = useState("")
  const [configError, setConfigError] = useState("")
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null)
  const editorRef = useRef<any>(null)
  const configEditorRef = useRef<any>(null)

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    setLightTheme(safeGetItem(STORAGE_KEYS.LIGHT_THEME, "vs"))
    setDarkTheme(safeGetItem(STORAGE_KEYS.DARK_THEME, "vs-dark"))
    
    const savedConfig = safeGetItem(STORAGE_KEYS.CONFIG)
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setEditorOptions(parsed)
        setConfigText(savedConfig)
      } catch {
        setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2))
      }
    } else {
      setConfigText(JSON.stringify(DEFAULT_CONFIG, null, 2))
    }
    
    const savedJsCode = safeGetItem(STORAGE_KEYS.CODE, JAVASCRIPT_TEMPLATE)
    setJavascriptCode(savedJsCode)
    const savedSqlCode = safeGetItem(STORAGE_KEYS.CODE + '_sql', SQL_TEMPLATE)
    setSqlCode(savedSqlCode)
  }, [])

  // Watch for theme changes and apply the appropriate Monaco theme
  useEffect(() => {
    if (!monacoInstance || !mounted) return
    
    const themeToApply = theme === "dark" ? darkTheme : lightTheme
    const themeId = getThemeId(themeToApply)
    
    // Load and apply the theme
    if (BUILT_IN_THEMES.some(t => t.value === themeToApply)) {
      monacoInstance.editor.setTheme(themeId)
    } else {
      loadCustomTheme(themeToApply, monacoInstance).then(loadedThemeId => {
        if (loadedThemeId) {
          monacoInstance.editor.setTheme(loadedThemeId)
        }
      })
    }
  }, [theme, lightTheme, darkTheme, monacoInstance, mounted])

  // Determine current theme
  const currentTheme = theme === "dark" ? darkTheme : lightTheme
  
  // Get the safe theme ID for Monaco
  const getThemeId = (themeName: string) => {
    if (BUILT_IN_THEMES.some(t => t.value === themeName)) {
      return themeName
    }
    return themeName.replace(/\s+/g, '-').toLowerCase()
  }
  
  // Function needs to be defined before useEffect that uses it
  const loadCustomTheme = async (themeName: string, monaco: Monaco) => {
    if (BUILT_IN_THEMES.some(t => t.value === themeName)) {
      return themeName // Built-in theme, no need to load
    }

    try {
      // Create a safe theme ID by replacing spaces with hyphens
      const themeId = themeName.replace(/\s+/g, '-').toLowerCase()
      const themeData = await import(`monaco-themes/themes/${themeName}.json`)
      monaco.editor.defineTheme(themeId, themeData)
      return themeId
    } catch (error) {
      console.error("Failed to load theme:", themeName, error)
      return null
    }
  }


  // Handle theme change
  const handleThemeChange = async (newTheme: string, isDark: boolean) => {
    if (!monacoInstance) return

    // Load theme and get the actual theme ID to use
    const themeIdToUse = await loadCustomTheme(newTheme, monacoInstance)
    if (!themeIdToUse) return // Failed to load theme
    
    if (isDark) {
      setDarkTheme(newTheme)
      safeSetItem(STORAGE_KEYS.DARK_THEME, newTheme)
    } else {
      setLightTheme(newTheme)
      safeSetItem(STORAGE_KEYS.LIGHT_THEME, newTheme)
    }
    
    // Apply theme if it's the current mode
    if ((theme === "dark" && isDark) || (theme === "light" && !isDark)) {
      monacoInstance.editor.setTheme(themeIdToUse)
    }
  }

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor
    setMonacoInstance(monaco)
    
    // Load current theme
    if (currentTheme && !BUILT_IN_THEMES.some(t => t.value === currentTheme)) {
      loadCustomTheme(currentTheme, monaco).then(themeId => {
        if (themeId) {
          monaco.editor.setTheme(themeId)
        }
      })
    }
  }

  // Handle config editor mount
  const handleConfigEditorDidMount = (editor: any) => {
    configEditorRef.current = editor
  }

  // Handle code change
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      if (activeTab === "javascript") {
        setJavascriptCode(value)
        safeSetItem(STORAGE_KEYS.CODE, value)
      } else {
        setSqlCode(value)
        safeSetItem(STORAGE_KEYS.CODE + '_sql', value)
      }
    }
  }
  
  // Get current code and language based on active tab
  const currentCode = activeTab === "javascript" ? javascriptCode : sqlCode
  const currentLanguage = activeTab === "javascript" ? "javascript" : "sql"

  // Handle config change
  const handleConfigChange = (value: string | undefined) => {
    if (value === undefined) return
    
    setConfigText(value)
    
    try {
      const newOptions = JSON.parse(value)
      editorRef.current?.updateOptions(newOptions)
      setEditorOptions(newOptions)
      safeSetItem(STORAGE_KEYS.CONFIG, value)
      setConfigError("")
    } catch (error) {
      setConfigError("Invalid JSON configuration")
    }
  }

  if (!mounted) {
    return null // Avoid hydration issues
  }

  return (
    <div className="h-screen p-6 flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Main Editor Card */}
        <Card className="lg:col-span-8 h-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-wider text-orange-500">CODE EDITOR</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-[400px] grid-cols-2">
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="sql">SQL</TabsTrigger>
              </TabsList>
              <TabsContent value="javascript" className="flex-1 mt-2">
                <Editor
                  height="100%"
                  language="javascript"
                  theme={getThemeId(currentTheme)}
                  value={javascriptCode}
                  options={editorOptions as any}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                />
              </TabsContent>
              <TabsContent value="sql" className="flex-1 mt-2">
                <Editor
                  height="100%"
                  language="sql"
                  theme={getThemeId(currentTheme)}
                  value={sqlCode}
                  options={editorOptions as any}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right Side Column */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Theme Selector Card */}
          <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-wider text-orange-500">THEME CONTROL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-400 uppercase tracking-wider">
                Current Mode: {theme === "dark" ? "DARK" : "LIGHT"}
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="light-theme" className="text-sm text-gray-400 uppercase tracking-wider">
                Light Theme
              </Label>
              <Select
                value={lightTheme}
                onValueChange={(value) => handleThemeChange(value, false)}
              >
                <SelectTrigger id="light-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_THEMES.map((themeOption) => (
                    <SelectItem key={themeOption.value} value={themeOption.value}>
                      {themeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dark-theme" className="text-sm text-gray-400 uppercase tracking-wider">
                Dark Theme
              </Label>
              <Select
                value={darkTheme}
                onValueChange={(value) => handleThemeChange(value, true)}
              >
                <SelectTrigger id="dark-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_THEMES.map((themeOption) => (
                    <SelectItem key={themeOption.value} value={themeOption.value}>
                      {themeOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

          {/* Configuration Editor Card */}
          <Card className="flex-1 min-h-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-wider text-orange-500">CONFIGURATION</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            {configError && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{configError}</AlertDescription>
              </Alert>
            )}
            <Editor
              height="100%"
              defaultLanguage="json"
              theme={getThemeId(currentTheme)}
              value={configText}
              options={{
                ...editorOptions,
                minimap: { enabled: false },
                lineNumbers: "on",
                fontSize: 12
              } as any}
              onChange={handleConfigChange}
              onMount={handleConfigEditorDidMount}
            />
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}