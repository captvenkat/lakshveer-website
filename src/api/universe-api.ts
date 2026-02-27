// Universe V2 API - Neural Capability OS
// Handles all universe data operations with mode-based access

import { Hono } from 'hono';

interface Env {
  DB: D1Database;
}

type ViewMode = 'public' | 'private' | 'partner';

const universeApi = new Hono<{ Bindings: Env }>();

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
// GET /universe/nodes/:id - Get single node with full detail
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
    if (node.cluster_id) {
      cluster = await c.env.DB.prepare(
        `SELECT * FROM universe_clusters WHERE id = ?`
      ).bind(node.cluster_id).first();
    }
    
    // Get learning gaps related to this node (private mode only)
    let learningGaps = [];
    if (mode !== 'public') {
      const gaps = await c.env.DB.prepare(
        `SELECT * FROM learning_gaps WHERE suggested_collaborator = ? OR id IN (
          SELECT value FROM json_each(?)
        )`
      ).bind(id, node.learning_gaps || '[]').all();
      learningGaps = gaps.results || [];
    }
    
    // Partner mode: Get ways to help and collaboration context
    let partnerContext = null;
    if (mode === 'partner' && (node.type === 'person' || node.type === 'organization')) {
      partnerContext = {
        waysToHelp: JSON.parse(node.ways_to_help || '[]'),
        relevantBuilds: [], // TODO: Compute based on their domain
        connectionPath: [], // TODO: How Laksh is connected
      };
    }
    
    return c.json({
      success: true,
      mode,
      node: {
        ...node,
        evidence: JSON.parse(node.evidence || '[]'),
        what_it_unlocked: JSON.parse(node.what_it_unlocked || '[]'),
        what_it_enables: JSON.parse(node.what_it_enables || '[]'),
        learning_gaps: JSON.parse(node.learning_gaps || '[]'),
        ways_to_help: JSON.parse(node.ways_to_help || '[]'),
        meta: JSON.parse(node.meta || '{}'),
      },
      edges: edges.results || [],
      cluster,
      learningGaps,
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
// GET /universe/clusters - Get all clusters with stats
// ============================================
universeApi.get('/clusters', async (c) => {
  const mode = getMode(c);
  
  try {
    const clusters = await c.env.DB.prepare(
      `SELECT * FROM universe_clusters ORDER BY level DESC, momentum DESC`
    ).all();
    
    // Enrich with node counts
    const enrichedClusters = await Promise.all(
      (clusters.results || []).map(async (cluster: any) => {
        let countQuery = `SELECT COUNT(*) as count FROM universe_nodes WHERE cluster_id = ?`;
        if (mode === 'public') {
          countQuery += ` AND verification_status = 'verified'`;
        }
        const count = await c.env.DB.prepare(countQuery).bind(cluster.id).first();
        
        return {
          ...cluster,
          core_skills: JSON.parse(cluster.core_skills || '[]'),
          nodeCount: count?.count || 0,
        };
      })
    );
    
    return c.json({
      success: true,
      mode,
      clusters: enrichedClusters
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
// PRIVATE MODE ENDPOINTS
// ============================================

// GET /universe/verification-queue - Pending items for review
universeApi.get('/verification-queue', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const [pendingNodes, pendingEdges] = await Promise.all([
      c.env.DB.prepare(
        `SELECT * FROM universe_nodes WHERE verification_status = 'pending' ORDER BY created_at DESC`
      ).all(),
      c.env.DB.prepare(
        `SELECT e.*, sn.label as source_label, tn.label as target_label
         FROM universe_edges e
         LEFT JOIN universe_nodes sn ON e.source_id = sn.id
         LEFT JOIN universe_nodes tn ON e.target_id = tn.id
         WHERE e.verification_status = 'pending' OR e.verification_status = 'inferred'
         ORDER BY e.confidence_score DESC`
      ).all(),
    ]);
    
    return c.json({
      success: true,
      pendingNodes: pendingNodes.results || [],
      pendingEdges: pendingEdges.results || [],
    });
  } catch (error) {
    console.error('Get verification queue error:', error);
    return c.json({ success: false, error: 'Failed to fetch queue' }, 500);
  }
});

// POST /universe/verify - Approve or reject an item
universeApi.post('/verify', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const { entityType, entityId, action, reason } = await c.req.json();
    
    if (!entityType || !entityId || !action) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }
    
    const table = entityType === 'node' ? 'universe_nodes' : 'universe_edges';
    const newStatus = action === 'approve' ? 'verified' : 'rejected';
    
    // Get previous value for audit
    const previous = await c.env.DB.prepare(
      `SELECT * FROM ${table} WHERE id = ?`
    ).bind(entityId).first();
    
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
      JSON.stringify({ verification_status: newStatus }),
      reason || null,
      'admin'
    ).run();
    
    return c.json({ success: true, status: newStatus });
  } catch (error) {
    console.error('Verify error:', error);
    return c.json({ success: false, error: 'Failed to verify' }, 500);
  }
});

// GET /universe/learning-gaps - Get all learning gaps
universeApi.get('/learning-gaps', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const gaps = await c.env.DB.prepare(
      `SELECT g.*, c.label as cluster_label, c.color as cluster_color
       FROM learning_gaps g
       LEFT JOIN universe_clusters c ON g.cluster_id = c.id
       WHERE g.status = 'open'
       ORDER BY g.priority_score DESC, g.roi_score DESC`
    ).all();
    
    return c.json({
      success: true,
      gaps: gaps.results || []
    });
  } catch (error) {
    console.error('Get learning gaps error:', error);
    return c.json({ success: false, error: 'Failed to fetch gaps' }, 500);
  }
});

// GET /universe/opportunities - Get suggested opportunities
universeApi.get('/opportunities', async (c) => {
  const mode = getMode(c);
  
  if (mode === 'public') {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }
  
  try {
    const opportunities = await c.env.DB.prepare(
      `SELECT * FROM opportunities WHERE status = 'suggested' OR status = 'approved'
       ORDER BY confidence_score DESC`
    ).all();
    
    return c.json({
      success: true,
      opportunities: (opportunities.results || []).map((opp: any) => ({
        ...opp,
        related_nodes: JSON.parse(opp.related_nodes || '[]'),
        related_clusters: JSON.parse(opp.related_clusters || '[]'),
      }))
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    return c.json({ success: false, error: 'Failed to fetch opportunities' }, 500);
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
