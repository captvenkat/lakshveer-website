// Universe API Hook
// Connects frontend to the Universe V2 API endpoints

import { useState, useCallback } from 'react';

const API_BASE = '/api/universe';

// Get auth header if in private mode
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Check for private mode (set via localStorage or URL param)
  const isPrivateMode = localStorage.getItem('universe-private-mode') === 'true' ||
    new URLSearchParams(window.location.search).get('mode') === 'private';
  
  if (isPrivateMode) {
    headers['X-Universe-Auth'] = 'laksh-private-2026';
  }
  
  return headers;
}

// Types
export interface NodeWorld {
  whatThisIs: string | null;
  whyItMatters: string | null;
  evidence: Evidence[];
  whatItUnlocked: UnlockedNode[];
  whatItEnablesNext: string[];
  connectedGaps: LearningGap[];
  waysToHelp: string[];
}

export interface Evidence {
  type: 'link' | 'video' | 'tweet' | 'image' | 'document';
  url: string;
  title?: string;
  date?: string;
}

export interface UnlockedNode {
  id: string;
  label: string;
  type: string;
  cluster_id?: string;
}

export interface LearningGap {
  id: string;
  label: string;
  description?: string;
  priority_score: number;
  roi_score: number;
  cluster_label?: string;
  cluster_color?: string;
}

export interface NodeCompleteness {
  score: number;
  filledSections: string[];
  missingSections: string[];
  isComplete: boolean;
}

export interface ClusterScore {
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
}

export interface EnrichedCluster {
  id: string;
  label: string;
  description?: string;
  color: string;
  icon?: string;
  level: number;
  momentum: number;
  growth_rate: number;
  project_count: number;
  skill_count: number;
  core_skills: string[];
  nodeCount: number;
  // Computed
  computedLevel: number;
  computedScore: number;
  growthVelocity: number;
  scoreComponents?: ClusterScore['components'];
  formula?: string;
}

export interface NodeDetailResponse {
  success: boolean;
  mode: 'public' | 'private' | 'partner';
  node: any;
  nodeWorld: NodeWorld;
  edges: any[];
  cluster: any | null;
  learningGaps: LearningGap[];
  completeness: NodeCompleteness | null;
  partnerContext: any | null;
}

export interface ScoringFormula {
  config: any;
  explanation: {
    complexity: string;
    crossCluster: string;
    recency: string;
    validation: string;
    depth: string;
    finalFormula: string;
    levels: string;
  };
}

// API Functions
export async function fetchNodeDetail(nodeId: string): Promise<NodeDetailResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/nodes/${nodeId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch node detail:', error);
    return null;
  }
}

export async function fetchClusters(): Promise<{ clusters: EnrichedCluster[]; scoringConfig?: any }> {
  try {
    const res = await fetch(`${API_BASE}/clusters`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return { clusters: [] };
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch clusters:', error);
    return { clusters: [] };
  }
}

export async function fetchScoringFormula(): Promise<ScoringFormula | null> {
  try {
    const res = await fetch(`${API_BASE}/scoring-formula`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch scoring formula:', error);
    return null;
  }
}

export async function fetchIncompleteNodes(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/incomplete-nodes`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.nodes || [];
  } catch (error) {
    console.error('Failed to fetch incomplete nodes:', error);
    return [];
  }
}

export async function generateOutreach(nodeId: string, context?: string, specificAsk?: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/generate-outreach`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ nodeId, context, specificAsk }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to generate outreach:', error);
    return null;
  }
}

// Hook for Node Detail with loading state
export function useNodeDetail() {
  const [loading, setLoading] = useState(false);
  const [nodeData, setNodeData] = useState<NodeDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadNode = useCallback(async (nodeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNodeDetail(nodeId);
      setNodeData(data);
      if (!data) {
        setError('Node not found');
      }
    } catch (e) {
      setError('Failed to load node');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearNode = useCallback(() => {
    setNodeData(null);
    setError(null);
  }, []);

  return { loading, nodeData, error, loadNode, clearNode };
}

// Hook for Clusters with computed scores
export function useClusters() {
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState<EnrichedCluster[]>([]);
  const [scoringConfig, setScoringConfig] = useState<any>(null);

  const loadClusters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClusters();
      setClusters(data.clusters || []);
      setScoringConfig(data.scoringConfig || null);
    } catch (e) {
      console.error('Failed to load clusters:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, clusters, scoringConfig, loadClusters };
}

// Check if private mode is enabled
export function isPrivateMode(): boolean {
  return localStorage.getItem('universe-private-mode') === 'true' ||
    new URLSearchParams(window.location.search).get('mode') === 'private';
}

// Toggle private mode
export function setPrivateMode(enabled: boolean): void {
  localStorage.setItem('universe-private-mode', enabled ? 'true' : 'false');
}
