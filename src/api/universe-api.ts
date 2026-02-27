// Universe V2 API - Neural Capability OS
// Phase 2: Node=World System + Capability Engine with Real Scoring
// Phase 3: Verification Layer + Trust System
// Phase 4: Learning Gap + Opportunity Engines
// Handles all universe data operations with mode-based access

import { Hono } from 'hono';

interface Env {
  DB: D1Database;
}

type ViewMode = 'public' | 'private' | 'partner';

const universeApi = new Hono<{ Bindings: Env }>();

// ============================================
// CONFIDENCE SCORING: Configuration
// ============================================
const CONFIDENCE_CONFIG = {
  // Source reliability weights
  sourceReliability: {
    manual: 100,        // Manually entered = highest trust
    twitter: 70,        // Twitter mentions
    youtube: 75,        // YouTube content
    notes: 60,          // Handwritten notes
    inferred: 40,       // AI-inferred
  } as Record<string, number>,
  
  // Edge type base confidence
  edgeTypeConfidence: {
    BUILT_WITH: 90,       // Direct creation link
    SUPPORTED_BY: 85,     // Support/sponsorship
    WON_AT: 95,           // Award/win - very verifiable
    PRESENTED_AT: 90,     // Presentation - verifiable
    LEARNED_FROM: 70,     // Learning - subjective
    ENABLED_BY: 65,       // Enablement - inference
    EVOLVED_INTO: 80,     // Evolution - traceable
    CROSS_POLLINATED: 60, // Cross-pollination - inference
    ENDORSED_BY: 85,      // Endorsement - verifiable
    USES: 75,             // Usage - observable
    UNLOCKS: 50,          // Potential - speculative
    MENTORED_BY: 70,      // Mentorship - subjective
  } as Record<string, number>,
  
  // Evidence boost (per evidence link)
  evidenceBoost: 10,      // +10 per evidence link (max +30)
  maxEvidenceBoost: 30,
  
  // Co-occurrence boost
  coOccurrenceBoost: 5,   // +5 per related edge
  maxCoOccurrenceBoost: 15,
};

/**
 * Calculate confidence score for an edge
 */
async function calculateEdgeConfidence(
  db: D1Database,
  edge: any
): Promise<{ score: number; breakdown: any }> {
  // 1. Source reliability
  const sourceScore = CONFIDENCE_CONFIG.sourceReliability[edge.source] || 50;
  
  // 2. Edge type base confidence
  const typeScore = CONFIDENCE_CONFIG.edgeTypeConfidence[edge.type] || 60;
  
  // 3. Evidence boost
  let evidenceCount = 0;
  try {
    const evidence = JSON.parse(edge.evidence || '[]');
    evidenceCount = Array.isArray(evidence) ? evidence.length : 0;
  } catch {}
  const evidenceBoost = Math.min(
    evidenceCount * CONFIDENCE_CONFIG.evidenceBoost,
    CONFIDENCE_CONFIG.maxEvidenceBoost
  );
  
  // 4. Co-occurrence boost (how many other edges connect same nodes)
  const coOccurrence = await db.prepare(
    `SELECT COUNT(*) as count FROM universe_edges 
     WHERE (source_id = ? OR target_id = ? OR source_id = ? OR target_id = ?)
     AND id != ?`
  ).bind(edge.source_id, edge.source_id, edge.target_id, edge.target_id, edge.id).first();
  const coOccurrenceBoost = Math.min(
    ((coOccurrence?.count as number) || 0) * CONFIDENCE_CONFIG.coOccurrenceBoost,
    CONFIDENCE_CONFIG.maxCoOccurrenceBoost
  );
  
  // Calculate weighted score
  const rawScore = (sourceScore * 0.3) + (typeScore * 0.4) + (evidenceBoost * 0.2) + (coOccurrenceBoost * 0.1);
  const finalScore = Math.min(100, Math.round(rawScore));
  
  return {
    score: finalScore,
    breakdown: {
      sourceReliability: sourceScore,
      edgeTypeBase: typeScore,
      evidenceBoost,
      coOccurrenceBoost,
      formula: '0.3×Source + 0.4×EdgeType + 0.2×Evidence + 0.1×CoOccurrence',
    },
  };
}

// ============================================
// CAPABILITY ENGINE: Scoring Configuration
// ============================================
const SCORING_CONFIG = {
  // Project Complexity Weights (by type)
  projectComplexity: {
    product: 1.0,       // Full product = highest complexity
    project: 0.75,      // Projects = high
    skill: 0.5,         // Skills = medium
    technology: 0.4,    // Tools/tech = lower
    tool: 0.4,
    event: 0.6,         // Events (hackathons, demos)
    award: 0.8,         // Awards = high validation
    endorsement: 0.7,   // Endorsements = strong signal
    person: 0.3,        // People/orgs = connectors
    organization: 0.3,
    trip: 0.2,
    note: 0.1,
    capability: 0.5,
    potential: 0.2,
    influence: 0.3,
    cluster: 0.0,
  } as Record<string, number>,
  
  // Recency decay (months)
  recencyHalfLife: 6,   // Score halves every 6 months for recency component
  
  // Weights for final score
  weights: {
    complexity: 0.25,
    crossCluster: 0.20,
    recency: 0.20,
    validation: 0.20,
    depth: 0.15,
  },
  
  // Validation multipliers
  validationMultipliers: {
    hackathon_win: 2.0,
    hackathon_participant: 1.5,
    award: 1.8,
    grant: 1.7,
    endorsement: 1.4,
    demo: 1.3,
    sale: 1.6,
  } as Record<string, number>,
  
  // Level thresholds (0-100 score)
  levelThresholds: [0, 20, 40, 60, 80], // Level 1-5
};

// ============================================
// PHASE 4: LEARNING GAP ENGINE - Configuration
// ============================================
const GAP_ENGINE_CONFIG = {
  // Gap types with base priority
  gapTypes: {
    missing_skill: { priority: 80, effort: 60, label: 'Missing Skill' },
    incomplete_node: { priority: 60, effort: 30, label: 'Incomplete Documentation' },
    weak_cluster: { priority: 70, effort: 50, label: 'Weak Cluster' },
    missing_connection: { priority: 50, effort: 40, label: 'Missing Connection' },
    stale_project: { priority: 40, effort: 20, label: 'Stale Project' },
  } as Record<string, { priority: number; effort: number; label: string }>,
  
  // Skill prerequisites for common patterns
  skillPrerequisites: {
    'machine-learning': ['python', 'tensorflow'],
    'computer-vision': ['python', 'opencv'],
    'robotics': ['electronics', 'arduino', 'cpp'],
    'iot': ['electronics', 'esp32', 'python'],
    'drone-tech': ['electronics', 'robotics'],
  } as Record<string, string[]>,
  
  // ROI multipliers based on what gap blocks
  blockingMultipliers: {
    blocks_product: 2.0,     // Gap blocks a potential product
    blocks_hackathon: 1.8,   // Gap blocks hackathon participation  
    blocks_grant: 1.7,       // Gap blocks grant application
    blocks_next_level: 1.5,  // Gap blocks cluster level-up
  } as Record<string, number>,
};

// ============================================
// PHASE 4: OPPORTUNITY ENGINE - Configuration
// ============================================
const OPPORTUNITY_ENGINE_CONFIG = {
  // Opportunity types
  opportunityTypes: {
    hackathon: { baseConfidence: 70, label: 'Hackathon' },
    grant: { baseConfidence: 60, label: 'Grant Opportunity' },
    collaboration: { baseConfidence: 50, label: 'Collaboration' },
    media: { baseConfidence: 40, label: 'Media Feature' },
    speaking: { baseConfidence: 55, label: 'Speaking Opportunity' },
  } as Record<string, { baseConfidence: number; label: string }>,
  
  // Pattern matching for opportunities
  patterns: {
    hardware_hackathon: {
      requiredSkills: ['electronics', 'arduino'],
      optionalSkills: ['robotics', '3d-printing'],
      minClusterLevel: 3,
    },
    ai_hackathon: {
      requiredSkills: ['python', 'machine-learning'],
      optionalSkills: ['computer-vision', 'tensorflow'],
      minClusterLevel: 2,
    },
    robotics_competition: {
      requiredSkills: ['robotics', 'electronics'],
      optionalSkills: ['computer-vision', 'cpp'],
      minClusterLevel: 3,
    },
    maker_grant: {
      requiredProjects: 3,
      minImpactScore: 60,
      validationRequired: true,
    },
    tech_media: {
      minUniqueProjects: 5,
      recentActivity: true,
      minAwards: 1,
    },
  } as Record<string, any>,
};

/**
 * Detect learning gaps from universe data
 */
async function detectLearningGaps(db: D1Database): Promise<any[]> {
  const gaps: any[] = [];
  
  // 1. Find incomplete nodes (missing key sections)
  const incompleteNodes = await db.prepare(
    `SELECT n.*, c.label as cluster_label, c.color as cluster_color
     FROM universe_nodes n
     LEFT JOIN universe_clusters c ON n.cluster_id = c.id
     WHERE n.verification_status = 'verified'`
  ).all();
  
  for (const node of (incompleteNodes.results || []) as any[]) {
    const sections = ['description', 'why_it_matters'];
    const arraySections = ['evidence', 'what_it_unlocked', 'what_it_enables', 'ways_to_help'];
    let missingCount = 0;
    const missingSections: string[] = [];
    
    for (const s of sections) {
      if (!node[s] || (node[s] as string).trim().length === 0) {
        missingCount++;
        missingSections.push(s);
      }
    }
    for (const s of arraySections) {
      try {
        const arr = JSON.parse(node[s] || '[]');
        if (!Array.isArray(arr) || arr.length === 0) {
          missingCount++;
          missingSections.push(s);
        }
      } catch {
        missingCount++;
        missingSections.push(s);
      }
    }
    
    // If more than 4 sections missing, flag as gap
    if (missingCount >= 4 && node.type !== 'person') {
      const config = GAP_ENGINE_CONFIG.gapTypes.incomplete_node;
      gaps.push({
        id: `gap-incomplete-${node.id}`,
        type: 'incomplete_node',
        label: `Complete ${node.label} documentation`,
        description: `Node is missing: ${missingSections.join(', ')}`,
        priority_score: config.priority * (node.impact_score || 50) / 100,
        effort_score: config.effort,
        roi_score: (config.priority * (node.impact_score || 50) / 100) / config.effort * 100,
        cluster_id: node.cluster_id,
        related_nodes: [node.id],
        missing_sections: missingSections,
        status: 'open',
      });
    }
  }
  
  // 2. Find weak clusters (level 1-2 with potential)
  const clusters = await db.prepare(`SELECT * FROM universe_clusters`).all();
  for (const cluster of (clusters.results || []) as any[]) {
    if (cluster.level <= 2 && (cluster.momentum || 0) < 50) {
      const config = GAP_ENGINE_CONFIG.gapTypes.weak_cluster;
      gaps.push({
        id: `gap-cluster-${cluster.id}`,
        type: 'weak_cluster',
        label: `Strengthen ${cluster.label}`,
        description: `Cluster at level ${cluster.level} with low momentum. Add more projects or skills.`,
        priority_score: config.priority * (1 - (cluster.level || 1) / 5),
        effort_score: config.effort,
        roi_score: config.priority / config.effort * 100,
        cluster_id: cluster.id,
        related_nodes: [],
        status: 'open',
      });
    }
  }
  
  // 3. Find missing skill connections (skills without projects using them)
  const skills = await db.prepare(
    `SELECT * FROM universe_nodes WHERE type = 'skill' AND verification_status = 'verified'`
  ).all();
  
  for (const skill of (skills.results || []) as any[]) {
    const usageEdges = await db.prepare(
      `SELECT COUNT(*) as count FROM universe_edges 
       WHERE (source_id = ? OR target_id = ?) AND type = 'USES' AND verification_status = 'verified'`
    ).bind(skill.id, skill.id).first();
    
    if ((usageEdges?.count as number || 0) < 2) {
      const config = GAP_ENGINE_CONFIG.gapTypes.missing_connection;
      gaps.push({
        id: `gap-skill-usage-${skill.id}`,
        type: 'missing_connection',
        label: `Apply ${skill.label} to more projects`,
        description: `Skill has ${usageEdges?.count || 0} project connections. Build something new with it.`,
        priority_score: config.priority * (skill.impact_score || 50) / 100,
        effort_score: config.effort,
        roi_score: config.priority / config.effort * 100,
        cluster_id: skill.cluster_id,
        related_nodes: [skill.id],
        status: 'open',
      });
    }
  }
  
  // 4. Find stale projects (completed but no recent activity)
  const staleProjects = await db.prepare(
    `SELECT * FROM universe_nodes 
     WHERE type = 'project' 
     AND status = 'completed' 
     AND verification_status = 'verified'
     AND timestamp < ?`
  ).bind('2025-06').all();
  
  for (const project of (staleProjects.results || []) as any[]) {
    const config = GAP_ENGINE_CONFIG.gapTypes.stale_project;
    gaps.push({
      id: `gap-stale-${project.id}`,
      type: 'stale_project',
      label: `Revive or evolve ${project.label}`,
      description: `Project completed in ${project.timestamp}. Consider iterating or evolving it.`,
      priority_score: config.priority * (project.impact_score || 50) / 100,
      effort_score: config.effort,
      roi_score: config.priority / config.effort * 100,
      cluster_id: project.cluster_id,
      related_nodes: [project.id],
      suggested_action: 'EVOLVED_INTO',
      status: 'open',
    });
  }
  
  // Sort by ROI score
  gaps.sort((a, b) => b.roi_score - a.roi_score);
  
  return gaps.slice(0, 20); // Return top 20 gaps
}

/**
 * Detect opportunities based on current capabilities
 */
async function detectOpportunities(db: D1Database): Promise<any[]> {
  const opportunities: any[] = [];
  
  // Get current skills and their levels
  const skills = await db.prepare(
    `SELECT * FROM universe_nodes WHERE type = 'skill' AND verification_status = 'verified'`
  ).all();
  const skillIds = (skills.results || []).map((s: any) => s.id);
  
  // Get cluster levels
  const clusters = await db.prepare(`SELECT * FROM universe_clusters`).all();
  const clusterLevels: Record<string, number> = {};
  for (const c of (clusters.results || []) as any[]) {
    clusterLevels[c.id] = c.level || 1;
  }
  
  // Get project count and awards
  const projectCount = await db.prepare(
    `SELECT COUNT(*) as count FROM universe_nodes WHERE type = 'project' AND verification_status = 'verified'`
  ).first();
  const awardCount = await db.prepare(
    `SELECT COUNT(*) as count FROM universe_nodes WHERE type = 'award' AND verification_status = 'verified'`
  ).first();
  
  // Check each opportunity pattern
  for (const [patternId, pattern] of Object.entries(OPPORTUNITY_ENGINE_CONFIG.patterns) as [string, any][]) {
    let confidence = 50;
    const reasoning: string[] = [];
    let qualifies = false;
    
    if (pattern.requiredSkills) {
      const hasRequired = pattern.requiredSkills.every((s: string) => skillIds.includes(s));
      const optionalCount = (pattern.optionalSkills || []).filter((s: string) => skillIds.includes(s)).length;
      
      if (hasRequired) {
        confidence += 25;
        reasoning.push(`Has required skills: ${pattern.requiredSkills.join(', ')}`);
        
        if (optionalCount > 0) {
          confidence += optionalCount * 5;
          reasoning.push(`Has ${optionalCount} bonus skills`);
        }
        
        // Check cluster level if required
        if (pattern.minClusterLevel) {
          const relevantCluster = Object.entries(clusterLevels).find(([_, level]) => level >= pattern.minClusterLevel);
          if (relevantCluster) {
            confidence += 10;
            reasoning.push(`Cluster level ${relevantCluster[1]} meets minimum ${pattern.minClusterLevel}`);
            qualifies = true;
          }
        } else {
          qualifies = true;
        }
      }
    }
    
    if (pattern.requiredProjects) {
      const count = (projectCount?.count as number) || 0;
      if (count >= pattern.requiredProjects) {
        confidence += 20;
        reasoning.push(`Has ${count} projects (needs ${pattern.requiredProjects})`);
        qualifies = true;
      }
    }
    
    if (pattern.minUniqueProjects) {
      const count = (projectCount?.count as number) || 0;
      if (count >= pattern.minUniqueProjects) {
        confidence += 15;
        reasoning.push(`Portfolio has ${count} projects`);
        if ((awardCount?.count as number || 0) >= (pattern.minAwards || 0)) {
          confidence += 15;
          reasoning.push(`Has ${awardCount?.count} awards/recognitions`);
          qualifies = true;
        }
      }
    }
    
    if (qualifies && confidence >= 60) {
      opportunities.push({
        id: `opp-${patternId}-${Date.now()}`,
        pattern_id: patternId,
        label: patternId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `Based on current skills and experience, Laksh qualifies for this opportunity type.`,
        reasoning: reasoning.join('. '),
        confidence_score: Math.min(100, confidence),
        related_nodes: skillIds.slice(0, 5),
        related_clusters: Object.keys(clusterLevels).slice(0, 3),
        suggested_action: `Research upcoming ${patternId.replace('_', ' ')} events`,
        timeframe: 'Next 3 months',
        status: 'suggested',
      });
    }
  }
  
  // Sort by confidence
  opportunities.sort((a, b) => b.confidence_score - a.confidence_score);
  
  return opportunities;
}

// ============================================
// CAPABILITY ENGINE: Scoring Functions
// ============================================

/**
 * Calculate weighted cluster score from its nodes
 */
async function calculateClusterScore(db: D1Database, clusterId: string): Promise<{
  level: number;
  score: number;
  components: {
    complexity: number;
    crossCluster: number;
    recency: number;
    validation: number;
    depth: number;
  };
  velocity: number;
  formula: string;
}> {
  // Get all nodes in cluster
  const nodesResult = await db.prepare(
    `SELECT * FROM universe_nodes WHERE cluster_id = ? AND verification_status = 'verified'`
  ).bind(clusterId).all();
  const nodes = nodesResult.results || [];
  
  // Get edges involving cluster nodes
  const nodeIds = nodes.map((n: any) => n.id);
  const edgesResult = await db.prepare(
    `SELECT * FROM universe_edges WHERE verification_status = 'verified'`
  ).all();
  const allEdges = edgesResult.results || [];
  
  if (nodes.length === 0) {
    return {
      level: 1,
      score: 0,
      components: { complexity: 0, crossCluster: 0, recency: 0, validation: 0, depth: 0 },
      velocity: 0,
      formula: 'No verified nodes in cluster',
    };
  }
  
  // 1. Project Complexity Score
  let complexitySum = 0;
  for (const node of nodes as any[]) {
    const typeWeight = SCORING_CONFIG.projectComplexity[node.type] || 0.3;
    const impactWeight = (node.impact_score || 50) / 100;
    complexitySum += typeWeight * impactWeight;
  }
  const complexity = Math.min(100, (complexitySum / nodes.length) * 100);
  
  // 2. Cross-Cluster Impact (edges connecting to other clusters)
  let crossClusterEdges = 0;
  for (const edge of allEdges as any[]) {
    const sourceNode = nodes.find((n: any) => n.id === edge.source_id);
    const targetNode = nodes.find((n: any) => n.id === edge.target_id);
    
    // Edge connects this cluster to another
    if ((sourceNode && !targetNode) || (!sourceNode && targetNode)) {
      crossClusterEdges++;
    }
  }
  const crossCluster = Math.min(100, (crossClusterEdges / Math.max(1, nodes.length)) * 50);
  
  // 3. Recency Score
  const now = new Date();
  let recencySum = 0;
  for (const node of nodes as any[]) {
    if (node.timestamp) {
      const [year, month] = node.timestamp.split('-').map(Number);
      const nodeDate = new Date(year, (month || 1) - 1);
      const monthsAgo = (now.getFullYear() - nodeDate.getFullYear()) * 12 + 
                        (now.getMonth() - nodeDate.getMonth());
      // Exponential decay
      const recencyWeight = Math.pow(0.5, monthsAgo / SCORING_CONFIG.recencyHalfLife);
      recencySum += recencyWeight;
    } else {
      recencySum += 0.5; // Default for undated
    }
  }
  const recency = Math.min(100, (recencySum / nodes.length) * 100);
  
  // 4. External Validation Score
  let validationScore = 0;
  for (const node of nodes as any[]) {
    if (node.type === 'award') validationScore += SCORING_CONFIG.validationMultipliers.award;
    if (node.type === 'event') validationScore += SCORING_CONFIG.validationMultipliers.hackathon_participant;
    if (node.type === 'endorsement') validationScore += SCORING_CONFIG.validationMultipliers.endorsement;
    
    // Check meta for additional validation
    try {
      const meta = JSON.parse(node.meta || '{}');
      if (meta.sales) validationScore += SCORING_CONFIG.validationMultipliers.sale;
      if (meta.grant) validationScore += SCORING_CONFIG.validationMultipliers.grant;
      if (meta.trademark) validationScore += SCORING_CONFIG.validationMultipliers.award * 0.5;
    } catch {}
  }
  const validation = Math.min(100, (validationScore / nodes.length) * 40);
  
  // 5. Repetition Depth (iteration maturity)
  // Count EVOLVED_INTO chains
  let maxChainLength = 0;
  for (const node of nodes as any[]) {
    let chainLength = 0;
    let currentId = node.id;
    const visited = new Set<string>();
    
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const evolvedEdge = (allEdges as any[]).find(
        e => e.target_id === currentId && e.type === 'EVOLVED_INTO'
      );
      if (evolvedEdge) {
        chainLength++;
        currentId = evolvedEdge.source_id;
      } else {
        break;
      }
    }
    maxChainLength = Math.max(maxChainLength, chainLength);
  }
  const depth = Math.min(100, maxChainLength * 25); // 4+ iterations = 100
  
  // Calculate weighted final score
  const { weights } = SCORING_CONFIG;
  const finalScore = 
    complexity * weights.complexity +
    crossCluster * weights.crossCluster +
    recency * weights.recency +
    validation * weights.validation +
    depth * weights.depth;
  
  // Determine level from score
  const level = SCORING_CONFIG.levelThresholds.reduce((lvl, threshold, idx) => 
    finalScore >= threshold ? idx + 1 : lvl, 1);
  
  // Calculate Growth Velocity (projects per month, weighted by complexity)
  const recentMonths = 3;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - recentMonths);
  
  let recentComplexitySum = 0;
  for (const node of nodes as any[]) {
    if (node.timestamp) {
      const [year, month] = node.timestamp.split('-').map(Number);
      const nodeDate = new Date(year, (month || 1) - 1);
      if (nodeDate >= cutoffDate) {
        const typeWeight = SCORING_CONFIG.projectComplexity[node.type] || 0.3;
        recentComplexitySum += typeWeight;
      }
    }
  }
  const velocity = recentComplexitySum / recentMonths;
  
  return {
    level,
    score: Math.round(finalScore * 10) / 10,
    components: {
      complexity: Math.round(complexity * 10) / 10,
      crossCluster: Math.round(crossCluster * 10) / 10,
      recency: Math.round(recency * 10) / 10,
      validation: Math.round(validation * 10) / 10,
      depth: Math.round(depth * 10) / 10,
    },
    velocity: Math.round(velocity * 100) / 100,
    formula: `Score = ${weights.complexity}×Complexity + ${weights.crossCluster}×CrossCluster + ${weights.recency}×Recency + ${weights.validation}×Validation + ${weights.depth}×Depth`,
  };
}

/**
 * Check node completeness for Node=World system
 */
function calculateNodeCompleteness(node: any): {
  score: number;
  filledSections: string[];
  missingSections: string[];
  isComplete: boolean;
} {
  const sections = [
    { key: 'description', label: 'What this node is' },
    { key: 'why_it_matters', label: 'Why it matters' },
    { key: 'evidence', label: 'Evidence', isArray: true },
    { key: 'what_it_unlocked', label: 'What it unlocked', isArray: true },
    { key: 'what_it_enables', label: 'What it enables next', isArray: true },
    { key: 'learning_gaps', label: 'Learning gaps', isArray: true },
    { key: 'ways_to_help', label: 'Ways someone can help', isArray: true },
  ];
  
  const filled: string[] = [];
  const missing: string[] = [];
  
  for (const section of sections) {
    let hasContent = false;
    
    if (section.isArray) {
      try {
        const arr = JSON.parse(node[section.key] || '[]');
        hasContent = Array.isArray(arr) && arr.length > 0;
      } catch {
        hasContent = false;
      }
    } else {
      hasContent = !!node[section.key] && node[section.key].trim().length > 0;
    }
    
    if (hasContent) {
      filled.push(section.label);
    } else {
      missing.push(section.label);
    }
  }
  
  return {
    score: Math.round((filled.length / sections.length) * 100),
    filledSections: filled,
    missingSections: missing,
    isComplete: filled.length >= 5,
  };
}

// ============================================
// HELPER: Get mode from request
// ============================================
function getMode(c: any): ViewMode {
  const authHeader = c.req.header('X-Universe-Auth');
  const modeParam = c.req.query('mode');
  
  // Check for private mode auth
  if (authHeader === process.env.UNIVERSE_PRIVATE_KEY || authHeader === 'laksh-private-2026') {
    return modeParam === 'partner' ? 'partner' : 'private';
  }
  
  return 'public';
}

// ============================================
// HELPER: Filter data based on mode
// ============================================
function filterByMode(data: any[], mode: ViewMode, field = 'verification_status') {
  if (mode === 'public') {
    return data.filter(item => item[field] === 'verified');
  }
  return data; // Private and partner see everything
}

// ============================================
// GET /universe/nodes - Get all nodes
// ============================================
universeApi.get('/nodes', async (c) => {
  const mode = getMode(c);
  const clusterId = c.req.query('cluster');
  const type = c.req.query('type');
  const search = c.req.query('search');
  
  try {
    let query = `SELECT * FROM universe_nodes WHERE 1=1`;
    const params: any[] = [];
    
    if (mode === 'public') {
      query += ` AND verification_status = 'verified'`;
    }
    
    if (clusterId) {
      query += ` AND cluster_id = ?`;
      params.push(clusterId);
    }
    
    if (type) {
      query += ` AND type = ?`;
      params.push(type);
    }
    
    if (search) {
      query += ` AND (label LIKE ? OR description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY momentum DESC, impact_score DESC`;
    
    const result = await c.env.DB.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      mode,
      count: result.results?.length || 0,
      nodes: result.results || []
    });
  } catch (error) {
    console.error('Get nodes error:', error);
    return c.json({ success: false, error: 'Failed to fetch nodes' }, 500);
  }
});

// ============================================
// GET /universe/nodes/:id - Node=World Full Detail
// ============================================
universeApi.get('/nodes/:id', async (c) => {
  const mode = getMode(c);
  const { id } = c.req.param();
  
  try {
    // Get node
    let nodeQuery = `SELECT * FROM universe_nodes WHERE id = ?`;
    if (mode === 'public') {
      nodeQuery += ` AND verification_status = 'verified'`;
    }
    
    const node = await c.env.DB.prepare(nodeQuery).bind(id).first();
    
    if (!node) {
      return c.json({ success: false, error: 'Node not found' }, 404);
    }
    
    // Get connected edges
    let edgesQuery = `
      SELECT e.*, 
        sn.label as source_label, sn.type as source_type,
        tn.label as target_label, tn.type as target_type
      FROM universe_edges e
      LEFT JOIN universe_nodes sn ON e.source_id = sn.id
      LEFT JOIN universe_nodes tn ON e.target_id = tn.id
      WHERE (e.source_id = ? OR e.target_id = ?)
    `;
    if (mode === 'public') {
      edgesQuery += ` AND e.verification_status = 'verified'`;
    }
    
    const edges = await c.env.DB.prepare(edgesQuery).bind(id, id).all();
    
    // Get cluster info if assigned
    let cluster = null;
    if ((node as any).cluster_id) {
      cluster = await c.env.DB.prepare(
        `SELECT * FROM universe_clusters WHERE id = ?`
      ).bind((node as any).cluster_id).first();
    }
    
    // Get learning gaps related to this node (private mode only)
    let learningGaps: any[] = [];
    if (mode !== 'public') {
      const gaps = await c.env.DB.prepare(
        `SELECT * FROM learning_gaps WHERE status = 'open'`
      ).all();
      
      // Filter gaps related to this node
      const nodeGapIds = JSON.parse((node as any).learning_gaps || '[]');
      learningGaps = (gaps.results || []).filter((g: any) => 
        nodeGapIds.includes(g.id) || g.suggested_collaborator === id
      );
    }
    
    // Parse JSON fields for node
    const parsedNode = {
      ...(node as any),
      evidence: JSON.parse((node as any).evidence || '[]'),
      what_it_unlocked: JSON.parse((node as any).what_it_unlocked || '[]'),
      what_it_enables: JSON.parse((node as any).what_it_enables || '[]'),
      learning_gaps: JSON.parse((node as any).learning_gaps || '[]'),
      ways_to_help: JSON.parse((node as any).ways_to_help || '[]'),
      meta: JSON.parse((node as any).meta || '{}'),
    };
    
    // NODE=WORLD: Build full context
    const nodeWorld = {
      whatThisIs: parsedNode.description,
      whyItMatters: parsedNode.why_it_matters,
      evidence: parsedNode.evidence,
      whatItUnlocked: [] as any[],
      whatItEnablesNext: parsedNode.what_it_enables,
      connectedGaps: learningGaps,
      waysToHelp: parsedNode.ways_to_help,
    };
    
    // Resolve whatItUnlocked node references
    if (parsedNode.what_it_unlocked.length > 0) {
      const unlockedIds = parsedNode.what_it_unlocked;
      const unlockedNodes = await c.env.DB.prepare(
        `SELECT id, label, type, cluster_id FROM universe_nodes WHERE id IN (${unlockedIds.map(() => '?').join(',')})`
      ).bind(...unlockedIds).all();
      nodeWorld.whatItUnlocked = unlockedNodes.results || [];
    }
    
    // Also include skills/capabilities gained from edges
    const unlockedFromEdges = (edges.results || [])
      .filter((e: any) => e.source_id === id && e.type === 'UNLOCKS')
      .map((e: any) => ({ id: e.target_id, label: e.target_label, type: e.target_type }));
    nodeWorld.whatItUnlocked = [...nodeWorld.whatItUnlocked, ...unlockedFromEdges];
    
    // Compute completeness (private mode only)
    let completeness = null;
    if (mode !== 'public') {
      completeness = calculateNodeCompleteness(node);
    }
    
    // Partner mode: Get ways to help and collaboration context
    let partnerContext = null;
    if (mode === 'partner' && ((node as any).type === 'person' || (node as any).type === 'organization')) {
      partnerContext = {
        waysToHelp: parsedNode.ways_to_help,
        relevantBuilds: [], // TODO: Compute based on their domain
        connectionPath: [], // TODO: How Laksh is connected
      };
    }
    
    return c.json({
      success: true,
      mode,
      node: parsedNode,
      nodeWorld,
      edges: edges.results || [],
      cluster,
      learningGaps,
      completeness,
      partnerContext,
    });
  } catch (error) {
    console.error('Get node error:', error);
    return c.json({ success: false, error: 'Failed to fetch node' }, 500);
  }
});

// ============================================
// GET /universe/edges - Get all edges
// ============================================
universeApi.get('/edges', async (c) => {
  const mode = getMode(c);
  const type = c.req.query('type');
  
  try {
    let query = `
      SELECT e.*, 
        sn.label as source_label, sn.type as source_type,
        tn.label as target_label, tn.type as target_type
      FROM universe_edges e
      LEFT JOIN universe_nodes sn ON e.source_id = sn.id
      LEFT JOIN universe_nodes tn ON e.target_id = tn.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (mode === 'public') {
      query += ` AND e.verification_status = 'verified'`;
    }
    
    if (type) {
      query += ` AND e.type = ?`;
      params.push(type);
    }
    
    query += ` ORDER BY e.weight DESC`;
    
    const result = await c.env.DB.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      mode,
      count: result.results?.length || 0,
      edges: result.results || []
    });
  } catch (error) {
    console.error('Get edges error:', error);
    return c.json({ success: false, error: 'Failed to fetch edges' }, 500);
  }
});

// ============================================
// GET /universe/clusters - Get all clusters with REAL scores
// ============================================
universeApi.get('/clusters', async (c) => {
  const mode = getMode(c);
  
  try {
    const clusters = await c.env.DB.prepare(
      `SELECT * FROM universe_clusters ORDER BY level DESC, momentum DESC`
    ).all();
    
    // Enrich with computed scores
    const enrichedClusters = await Promise.all(
      (clusters.results || []).map(async (cluster: any) => {
        // Get node count
        let countQuery = `SELECT COUNT(*) as count FROM universe_nodes WHERE cluster_id = ?`;
        if (mode === 'public') {
          countQuery += ` AND verification_status = 'verified'`;
        }
        const count = await c.env.DB.prepare(countQuery).bind(cluster.id).first();
        
        // Calculate real score (private mode shows formula)
        const scoring = await calculateClusterScore(c.env.DB, cluster.id);
        
        return {
          ...cluster,
          core_skills: JSON.parse(cluster.core_skills || '[]'),
          nodeCount: count?.count || 0,
          // Real computed values
          computedLevel: scoring.level,
          computedScore: scoring.score,
          growthVelocity: scoring.velocity,
          // Show formula in private mode
          ...(mode !== 'public' ? {
            scoreComponents: scoring.components,
            formula: scoring.formula,
          } : {}),
        };
      })
    );
    
    return c.json({
      success: true,
      mode,
      clusters: enrichedClusters,
      // Include scoring config in private mode for transparency
      ...(mode !== 'public' ? { scoringConfig: SCORING_CONFIG } : {}),
    });
  } catch (error) {
    console.error('Get clusters error:', error);
    return c.json({ success: false, error: 'Failed to fetch clusters' }, 500);
  }
});

// ============================================
// GET /universe/stats - Get universe statistics
// ============================================
universeApi.get('/stats', async (c) => {
  const mode = getMode(c);
  
  try {
    const verifiedFilter = mode === 'public' ? `WHERE verification_status = 'verified'` : '';
    
    const [nodes, edges, clusters] = await Promise.all([
      c.env.DB.prepare(`SELECT COUNT(*) as count, type FROM universe_nodes ${verifiedFilter} GROUP BY type`).all(),
      c.env.DB.prepare(`SELECT COUNT(*) as count FROM universe_edges ${verifiedFilter.replace('verification_status', 'verification_status')}`).first(),
      c.env.DB.prepare(`SELECT COUNT(*) as count FROM universe_clusters`).first(),
    ]);
    
    // Private mode: include pending counts
    let pendingStats = null;
    if (mode !== 'public') {
      const [pendingNodes, pendingEdges] = await Promise.all([
        c.env.DB.prepare(`SELECT COUNT(*) as count FROM universe_nodes WHERE verification_status = 'pending'`).first(),
        c.env.DB.prepare(`SELECT COUNT(*) as count FROM universe_edges WHERE verification_status = 'pending'`).first(),
      ]);
      pendingStats = {
        pendingNodes: pendingNodes?.count || 0,
        pendingEdges: pendingEdges?.count || 0,
      };
    }
    
    return c.json({
      success: true,
      mode,
      stats: {
        nodesByType: nodes.results || [],
        totalNodes: (nodes.results || []).reduce((sum: number, t: any) => sum + t.count, 0),
        totalEdges: edges?.count || 0,
        totalClusters: clusters?.count || 0,
        ...pendingStats,
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return c.json({ success: false, error: 'Failed to fetch stats' }, 500);
  }
});

// ============================================
// GET /universe/scoring-formula - Transparency endpoint
// ============================================
universeApi.get('/scoring-formula', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ 
      success: true,
      message: 'Cluster levels are calculated from project complexity, cross-cluster impact, recency, external validation, and iteration depth.',
    });
  }
  
  return c.json({
    success: true,
    config: SCORING_CONFIG,
    explanation: {
      complexity: 'Weighted by project type (products=1.0, projects=0.75, skills=0.5, etc.) × impact score',
      crossCluster: 'Number of edges connecting to other clusters / total nodes × 50',
      recency: 'Exponential decay with half-life of 6 months',
      validation: 'Multipliers for awards (1.8×), hackathons (1.5×), grants (1.7×), sales (1.6×), etc.',
      depth: 'Maximum EVOLVED_INTO chain length × 25 (capped at 100)',
      finalFormula: `Score = ${SCORING_CONFIG.weights.complexity}×Complexity + ${SCORING_CONFIG.weights.crossCluster}×CrossCluster + ${SCORING_CONFIG.weights.recency}×Recency + ${SCORING_CONFIG.weights.validation}×Validation + ${SCORING_CONFIG.weights.depth}×Depth`,
      levels: 'Level 1: 0-19, Level 2: 20-39, Level 3: 40-59, Level 4: 60-79, Level 5: 80-100',
    },
  });
});

// ============================================
// GET /universe/incomplete-nodes - Nodes needing more data
// ============================================
universeApi.get('/incomplete-nodes', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const nodes = await c.env.DB.prepare(
      `SELECT * FROM universe_nodes ORDER BY impact_score DESC`
    ).all();
    
    const incompleteNodes = (nodes.results || [])
      .map((node: any) => ({
        ...node,
        completeness: calculateNodeCompleteness(node),
      }))
      .filter((node: any) => !node.completeness.isComplete)
      .sort((a: any, b: any) => a.completeness.score - b.completeness.score);
    
    return c.json({
      success: true,
      count: incompleteNodes.length,
      nodes: incompleteNodes,
    });
  } catch (error) {
    console.error('Get incomplete nodes error:', error);
    return c.json({ success: false, error: 'Failed to fetch incomplete nodes' }, 500);
  }
});

// ============================================
// PRIVATE MODE ENDPOINTS
// ============================================
// PHASE 3: VERIFICATION + TRUST LAYER
// ============================================

// GET /universe/verification-queue - Enhanced with confidence scoring
universeApi.get('/verification-queue', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    // Get pending/inferred nodes
    const pendingNodes = await c.env.DB.prepare(
      `SELECT n.*, c.label as cluster_label, c.color as cluster_color
       FROM universe_nodes n
       LEFT JOIN universe_clusters c ON n.cluster_id = c.id
       WHERE n.verification_status IN ('pending', 'inferred')
       ORDER BY n.impact_score DESC, n.created_at DESC`
    ).all();
    
    // Get pending/inferred edges with confidence calculation
    const pendingEdgesRaw = await c.env.DB.prepare(
      `SELECT e.*, 
        sn.label as source_label, sn.type as source_type,
        tn.label as target_label, tn.type as target_type
       FROM universe_edges e
       LEFT JOIN universe_nodes sn ON e.source_id = sn.id
       LEFT JOIN universe_nodes tn ON e.target_id = tn.id
       WHERE e.verification_status IN ('pending', 'inferred')
       ORDER BY e.confidence_score DESC, e.created_at DESC`
    ).all();
    
    // Calculate confidence for each edge
    const pendingEdges = await Promise.all(
      (pendingEdgesRaw.results || []).map(async (edge: any) => {
        const confidence = await calculateEdgeConfidence(c.env.DB, edge);
        return {
          ...edge,
          calculatedConfidence: confidence.score,
          confidenceBreakdown: confidence.breakdown,
        };
      })
    );
    
    // Sort by calculated confidence
    pendingEdges.sort((a, b) => b.calculatedConfidence - a.calculatedConfidence);
    
    // Get stats
    const stats = {
      totalPendingNodes: (pendingNodes.results || []).length,
      totalPendingEdges: pendingEdges.length,
      highConfidenceEdges: pendingEdges.filter(e => e.calculatedConfidence >= 70).length,
      lowConfidenceEdges: pendingEdges.filter(e => e.calculatedConfidence < 50).length,
    };
    
    return c.json({
      success: true,
      pendingNodes: (pendingNodes.results || []).map((n: any) => ({
        ...n,
        evidence: JSON.parse(n.evidence || '[]'),
        meta: JSON.parse(n.meta || '{}'),
      })),
      pendingEdges,
      stats,
      confidenceConfig: CONFIDENCE_CONFIG,
    });
  } catch (error) {
    console.error('Get verification queue error:', error);
    return c.json({ success: false, error: 'Failed to fetch queue' }, 500);
  }
});

// POST /universe/verify - Enhanced with defer action and batch support
universeApi.post('/verify', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { entityType, entityId, action, reason, edits } = await c.req.json();
    
    if (!entityType || !entityId || !action) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const table = entityType === 'node' ? 'universe_nodes' : 'universe_edges';
    
    // Handle different actions
    let newStatus: string;
    switch (action) {
      case 'approve':
        newStatus = 'verified';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'defer':
        newStatus = 'pending'; // Keep as pending but log the defer
        break;
      default:
        return c.json({ success: false, error: 'Invalid action' }, 400);
    }
    
    // Get previous value for audit
    const previous = await c.env.DB.prepare(
      `SELECT * FROM ${table} WHERE id = ?`
    ).bind(entityId).first();
    
    if (!previous) {
      return c.json({ success: false, error: 'Entity not found' }, 404);
    }
    
    // Apply edits if provided (for edit action)
    if (edits && Object.keys(edits).length > 0) {
      const allowedFields = entityType === 'node' 
        ? ['label', 'description', 'why_it_matters', 'evidence', 'ways_to_help']
        : ['label', 'weight', 'evidence', 'inference_reason'];
      
      const updates: string[] = [];
      const params: any[] = [];
      
      for (const [key, value] of Object.entries(edits)) {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = ?`);
          params.push(typeof value === 'object' ? JSON.stringify(value) : value);
        }
      }
      
      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(entityId);
        await c.env.DB.prepare(
          `UPDATE ${table} SET ${updates.join(', ')} WHERE id = ?`
        ).bind(...params).run();
      }
    }
    
    // Update status
    await c.env.DB.prepare(
      `UPDATE ${table} SET verification_status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(newStatus, entityId).run();
    
    // Log to audit
    await c.env.DB.prepare(
      `INSERT INTO audit_log (id, action, entity_type, entity_id, previous_value, new_value, reason, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      `audit-${Date.now()}`,
      action,
      entityType,
      entityId,
      JSON.stringify(previous),
      JSON.stringify({ verification_status: newStatus, edits }),
      reason || null,
      'admin'
    ).run();
    
    return c.json({ success: true, status: newStatus, action });
  } catch (error) {
    console.error('Verify error:', error);
    return c.json({ success: false, error: 'Failed to verify' }, 500);
  }
});

// POST /universe/verify-batch - Batch verification
universeApi.post('/verify-batch', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { items, action, reason } = await c.req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0 || !action) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const newStatus = action === 'approve' ? 'verified' : action === 'reject' ? 'rejected' : 'pending';
    const results: { id: string; success: boolean; error?: string }[] = [];
    
    for (const item of items) {
      try {
        const { entityType, entityId } = item;
        const table = entityType === 'node' ? 'universe_nodes' : 'universe_edges';
        
        // Get previous value
        const previous = await c.env.DB.prepare(
          `SELECT * FROM ${table} WHERE id = ?`
        ).bind(entityId).first();
        
        if (!previous) {
          results.push({ id: entityId, success: false, error: 'Not found' });
          continue;
        }
        
        // Update
        await c.env.DB.prepare(
          `UPDATE ${table} SET verification_status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?`
        ).bind(newStatus, entityId).run();
        
        // Audit
        await c.env.DB.prepare(
          `INSERT INTO audit_log (id, action, entity_type, entity_id, previous_value, new_value, reason, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          `audit-${Date.now()}-${entityId}`,
          action,
          entityType,
          entityId,
          JSON.stringify(previous),
          JSON.stringify({ verification_status: newStatus }),
          reason || `Batch ${action}`,
          'admin'
        ).run();
        
        results.push({ id: entityId, success: true });
      } catch (e) {
        results.push({ id: item.entityId, success: false, error: String(e) });
      }
    }
    
    return c.json({
      success: true,
      processed: results.length,
      succeeded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    });
  } catch (error) {
    console.error('Batch verify error:', error);
    return c.json({ success: false, error: 'Failed to batch verify' }, 500);
  }
});

// GET /universe/confidence-formula - Explain confidence scoring
universeApi.get('/confidence-formula', async (c) => {
  const mode = getMode(c);
  
  return c.json({
    success: true,
    config: mode !== 'public' ? CONFIDENCE_CONFIG : undefined,
    explanation: {
      overview: 'Edge confidence is calculated from source reliability, edge type, evidence, and co-occurrence',
      formula: '0.3×SourceReliability + 0.4×EdgeTypeBase + 0.2×EvidenceBoost + 0.1×CoOccurrence',
      sourceReliability: 'Manual=100, YouTube=75, Twitter=70, Notes=60, Inferred=40',
      edgeTypeConfidence: 'WON_AT=95 (verifiable), BUILT_WITH=90, UNLOCKS=50 (speculative)',
      evidenceBoost: '+10 per evidence link (max +30)',
      coOccurrenceBoost: '+5 per related edge (max +15)',
    },
  });
});

// GET /universe/audit-log - View verification history
universeApi.get('/audit-log', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const entityType = c.req.query('entity_type');
    const action = c.req.query('action');
    
    let query = `SELECT * FROM audit_log WHERE 1=1`;
    const params: any[] = [];
    
    if (entityType) {
      query += ` AND entity_type = ?`;
      params.push(entityType);
    }
    
    if (action) {
      query += ` AND action = ?`;
      params.push(action);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);
    
    const logs = await c.env.DB.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      logs: (logs.results || []).map((log: any) => ({
        ...log,
        previous_value: JSON.parse(log.previous_value || '{}'),
        new_value: JSON.parse(log.new_value || '{}'),
      })),
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    return c.json({ success: false, error: 'Failed to fetch audit log' }, 500);
  }
});

// ============================================
// PHASE 4: LEARNING GAP + OPPORTUNITY ENDPOINTS
// ============================================

// GET /universe/learning-gaps - Auto-detect learning gaps from universe data
universeApi.get('/learning-gaps', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    // First check for manually added gaps in DB
    const manualGaps = await c.env.DB.prepare(
      `SELECT g.*, c.label as cluster_label, c.color as cluster_color
       FROM learning_gaps g
       LEFT JOIN universe_clusters c ON g.cluster_id = c.id
       WHERE g.status = 'open'
       ORDER BY g.priority_score DESC, g.roi_score DESC`
    ).all();
    
    // Then auto-detect gaps
    const autoGaps = await detectLearningGaps(c.env.DB);
    
    // Combine, removing duplicates
    const manualIds = new Set((manualGaps.results || []).map((g: any) => g.id));
    const combinedGaps = [
      ...(manualGaps.results || []),
      ...autoGaps.filter(g => !manualIds.has(g.id)),
    ];
    
    // Get cluster colors for auto-detected gaps
    const clusters = await c.env.DB.prepare(`SELECT id, color, label FROM universe_clusters`).all();
    const clusterMap: Record<string, any> = {};
    for (const c of (clusters.results || []) as any[]) {
      clusterMap[c.id] = { color: c.color, label: c.label };
    }
    
    return c.json({
      success: true,
      gaps: combinedGaps.map((gap: any) => ({
        ...gap,
        cluster_label: gap.cluster_label || clusterMap[gap.cluster_id]?.label,
        cluster_color: gap.cluster_color || clusterMap[gap.cluster_id]?.color,
        is_auto_detected: !manualIds.has(gap.id),
      })),
      stats: {
        total: combinedGaps.length,
        manual: manualGaps.results?.length || 0,
        autoDetected: autoGaps.length,
        byType: {
          incomplete_node: autoGaps.filter(g => g.type === 'incomplete_node').length,
          weak_cluster: autoGaps.filter(g => g.type === 'weak_cluster').length,
          missing_connection: autoGaps.filter(g => g.type === 'missing_connection').length,
          stale_project: autoGaps.filter(g => g.type === 'stale_project').length,
        },
      },
      config: GAP_ENGINE_CONFIG,
    });
  } catch (error) {
    console.error('Get learning gaps error:', error);
    return c.json({ success: false, error: 'Failed to fetch gaps' }, 500);
  }
});

// POST /universe/learning-gaps - Add manual learning gap
universeApi.post('/learning-gaps', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const data = await c.req.json();
    const id = data.id || `gap-manual-${Date.now()}`;
    
    await c.env.DB.prepare(
      `INSERT INTO learning_gaps (id, type, label, description, priority_score, effort_score, roi_score, 
        cluster_id, related_nodes, suggested_action, suggested_collaborator, blocks_next_level, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      data.type || 'missing_skill',
      data.label,
      data.description || null,
      data.priority_score || 50,
      data.effort_score || 50,
      data.roi_score || ((data.priority_score || 50) / (data.effort_score || 50) * 100),
      data.cluster_id || null,
      JSON.stringify(data.related_nodes || []),
      data.suggested_action || null,
      data.suggested_collaborator || null,
      data.blocks_next_level || 0,
      'open'
    ).run();
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Create learning gap error:', error);
    return c.json({ success: false, error: 'Failed to create gap' }, 500);
  }
});

// PATCH /universe/learning-gaps/:id - Close or update a gap
universeApi.patch('/learning-gaps/:id', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { id } = c.req.param();
    const { status, notes } = await c.req.json();
    
    await c.env.DB.prepare(
      `UPDATE learning_gaps SET status = ?, closed_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(status || 'closed', id).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update learning gap error:', error);
    return c.json({ success: false, error: 'Failed to update gap' }, 500);
  }
});

// GET /universe/opportunities - Auto-detect opportunities based on capabilities
universeApi.get('/opportunities', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    // Get manual opportunities from DB
    const manualOpps = await c.env.DB.prepare(
      `SELECT * FROM opportunities WHERE status = 'suggested' OR status = 'approved'
       ORDER BY confidence_score DESC`
    ).all();
    
    // Auto-detect opportunities
    const autoOpps = await detectOpportunities(c.env.DB);
    
    // Combine
    const manualIds = new Set((manualOpps.results || []).map((o: any) => o.id));
    const combinedOpps = [
      ...(manualOpps.results || []).map((opp: any) => ({
        ...opp,
        related_nodes: JSON.parse(opp.related_nodes || '[]'),
        related_clusters: JSON.parse(opp.related_clusters || '[]'),
        is_auto_detected: false,
      })),
      ...autoOpps.filter(o => !manualIds.has(o.id)).map(o => ({
        ...o,
        is_auto_detected: true,
      })),
    ];
    
    return c.json({
      success: true,
      opportunities: combinedOpps,
      stats: {
        total: combinedOpps.length,
        manual: manualOpps.results?.length || 0,
        autoDetected: autoOpps.length,
        byPattern: autoOpps.reduce((acc, o) => {
          acc[o.pattern_id] = (acc[o.pattern_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      config: OPPORTUNITY_ENGINE_CONFIG,
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    return c.json({ success: false, error: 'Failed to fetch opportunities' }, 500);
  }
});

// POST /universe/opportunities - Add manual opportunity
universeApi.post('/opportunities', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const data = await c.req.json();
    const id = data.id || `opp-manual-${Date.now()}`;
    
    await c.env.DB.prepare(
      `INSERT INTO opportunities (id, label, description, reasoning, confidence_score, 
        related_nodes, related_clusters, suggested_action, timeframe, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      data.label,
      data.description || null,
      data.reasoning || 'Manually added',
      data.confidence_score || 70,
      JSON.stringify(data.related_nodes || []),
      JSON.stringify(data.related_clusters || []),
      data.suggested_action || null,
      data.timeframe || null,
      'suggested'
    ).run();
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Create opportunity error:', error);
    return c.json({ success: false, error: 'Failed to create opportunity' }, 500);
  }
});

// PATCH /universe/opportunities/:id - Approve or reject opportunity
universeApi.patch('/opportunities/:id', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { id } = c.req.param();
    const { status, rejected_reason } = await c.req.json();
    
    if (status === 'approved') {
      await c.env.DB.prepare(
        `UPDATE opportunities SET status = 'approved', approved_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(id).run();
    } else if (status === 'rejected') {
      await c.env.DB.prepare(
        `UPDATE opportunities SET status = 'rejected', rejected_reason = ? WHERE id = ?`
      ).bind(rejected_reason || null, id).run();
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update opportunity error:', error);
    return c.json({ success: false, error: 'Failed to update opportunity' }, 500);
  }
});

// GET /universe/outreach-queue - Get outreach drafts
universeApi.get('/outreach-queue', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const outreach = await c.env.DB.prepare(
      `SELECT o.*, n.label as target_node_label, n.type as target_node_type
       FROM outreach_queue o
       LEFT JOIN universe_nodes n ON o.target_node_id = n.id
       WHERE o.status IN ('draft', 'reviewed')
       ORDER BY o.created_at DESC`
    ).all();
    
    return c.json({
      success: true,
      outreach: (outreach.results || []).map((item: any) => ({
        ...item,
        proof_links: JSON.parse(item.proof_links || '[]'),
      }))
    });
  } catch (error) {
    console.error('Get outreach queue error:', error);
    return c.json({ success: false, error: 'Failed to fetch outreach' }, 500);
  }
});

// ============================================
// POST /universe/generate-outreach - Generate outreach draft for a node
// ============================================
universeApi.post('/generate-outreach', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { nodeId, context, specificAsk } = await c.req.json();
    
    // Get the target node
    const targetNode = await c.env.DB.prepare(
      `SELECT * FROM universe_nodes WHERE id = ?`
    ).bind(nodeId).first();
    
    if (!targetNode) {
      return c.json({ success: false, error: 'Node not found' }, 404);
    }
    
    // Get Laksh's connected achievements and projects
    const achievements = await c.env.DB.prepare(
      `SELECT n.* FROM universe_nodes n
       INNER JOIN universe_edges e ON n.id = e.target_id
       WHERE e.source_id = 'lakshveer' AND n.type IN ('award', 'event', 'project')
       ORDER BY n.impact_score DESC
       LIMIT 5`
    ).all();
    
    // Generate draft (simplified - in production would use AI)
    const proofLinks = (achievements.results || [])
      .filter((a: any) => a.url)
      .map((a: any) => a.url);
    
    const draft = {
      id: `outreach-${Date.now()}`,
      target_node_id: nodeId,
      target_name: (targetNode as any).label,
      target_contact: null, // Would be populated from meta
      trigger_type: 'manual',
      trigger_node_id: null,
      subject: `Connecting from an 8-year-old hardware builder`,
      draft: `Hi ${(targetNode as any).label},

I'm Laksh, an 8-year-old hardware and AI systems builder from Hyderabad. I've been building since I was 4.

${context || `I came across your work and thought there might be an opportunity to connect.`}

Some of my recent work:
${(achievements.results || []).slice(0, 3).map((a: any) => `• ${a.label}: ${a.description}`).join('\n')}

${specificAsk || `I'd love to connect and learn more about your work.`}

Best,
Laksh
(with help from Dad - @CaptVenk)`,
      context: context || null,
      specific_ask: specificAsk || null,
      proof_links: JSON.stringify(proofLinks),
      status: 'draft',
      created_at: new Date().toISOString(),
    };
    
    // Save to queue
    await c.env.DB.prepare(
      `INSERT INTO outreach_queue (id, target_node_id, target_name, trigger_type, subject, draft, context, specific_ask, proof_links, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      draft.id,
      draft.target_node_id,
      draft.target_name,
      draft.trigger_type,
      draft.subject,
      draft.draft,
      draft.context,
      draft.specific_ask,
      draft.proof_links,
      draft.status
    ).run();
    
    return c.json({ success: true, draft });
  } catch (error) {
    console.error('Generate outreach error:', error);
    return c.json({ success: false, error: 'Failed to generate outreach' }, 500);
  }
});

// ============================================
// CRUD OPERATIONS (Private mode only)
// ============================================

// POST /universe/nodes - Create node
universeApi.post('/nodes', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const data = await c.req.json();
    const id = data.id || `node-${Date.now()}`;
    
    await c.env.DB.prepare(
      `INSERT INTO universe_nodes (
        id, label, type, description, url, timestamp, year, cluster_id,
        growth_weight, impact_score, momentum, status, verification_status,
        confidence_score, evidence, why_it_matters, what_it_unlocked,
        what_it_enables, learning_gaps, ways_to_help, meta, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      data.label,
      data.type,
      data.description || null,
      data.url || null,
      data.timestamp || null,
      data.year || null,
      data.cluster_id || null,
      data.growth_weight || 0,
      data.impact_score || 0,
      data.momentum || 0,
      data.status || 'active',
      data.verification_status || 'pending',
      data.confidence_score || 0,
      JSON.stringify(data.evidence || []),
      data.why_it_matters || null,
      JSON.stringify(data.what_it_unlocked || []),
      JSON.stringify(data.what_it_enables || []),
      JSON.stringify(data.learning_gaps || []),
      JSON.stringify(data.ways_to_help || []),
      JSON.stringify(data.meta || {}),
      data.source || 'manual'
    ).run();
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Create node error:', error);
    return c.json({ success: false, error: 'Failed to create node' }, 500);
  }
});

// PUT /universe/nodes/:id - Update node
universeApi.put('/nodes/:id', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { id } = c.req.param();
    const data = await c.req.json();
    
    // Build update query dynamically
    const updateFields: string[] = [];
    const params: any[] = [];
    
    const allowedFields = [
      'label', 'type', 'description', 'url', 'timestamp', 'year', 'cluster_id',
      'growth_weight', 'impact_score', 'momentum', 'status', 'verification_status',
      'confidence_score', 'why_it_matters',
    ];
    
    const jsonFields = ['evidence', 'what_it_unlocked', 'what_it_enables', 'learning_gaps', 'ways_to_help', 'meta'];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(data[field]);
      }
    }
    
    for (const field of jsonFields) {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(JSON.stringify(data[field]));
      }
    }
    
    if (updateFields.length === 0) {
      return c.json({ success: false, error: 'No fields to update' }, 400);
    }
    
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    await c.env.DB.prepare(
      `UPDATE universe_nodes SET ${updateFields.join(', ')} WHERE id = ?`
    ).bind(...params).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update node error:', error);
    return c.json({ success: false, error: 'Failed to update node' }, 500);
  }
});

// POST /universe/edges - Create edge
universeApi.post('/edges', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const data = await c.req.json();
    const id = data.id || `edge-${Date.now()}`;
    
    await c.env.DB.prepare(
      `INSERT INTO universe_edges (
        id, source_id, target_id, type, label, weight, timestamp,
        verification_status, confidence_score, inference_reason, evidence, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      data.source_id,
      data.target_id,
      data.type,
      data.label || null,
      data.weight || 50,
      data.timestamp || null,
      data.verification_status || 'pending',
      data.confidence_score || 0,
      data.inference_reason || null,
      JSON.stringify(data.evidence || []),
      data.source || 'manual'
    ).run();
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Create edge error:', error);
    return c.json({ success: false, error: 'Failed to create edge' }, 500);
  }
});

export default universeApi;
