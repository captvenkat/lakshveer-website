// Learning Gaps & Opportunities Panel - Phase 4
// Auto-detected gaps and opportunities from the capability engine

import { useState, useEffect, useCallback } from 'react';
import { isPrivateMode } from '@/hooks/useUniverseAPI';

interface LearningGap {
  id: string;
  type: string;
  label: string;
  description: string;
  priority_score: number;
  effort_score: number;
  roi_score: number;
  cluster_id?: string;
  cluster_label?: string;
  cluster_color?: string;
  related_nodes: string[];
  missing_sections?: string[];
  suggested_action?: string;
  is_auto_detected: boolean;
  status: string;
}

interface Opportunity {
  id: string;
  pattern_id?: string;
  label: string;
  description: string;
  reasoning: string;
  confidence_score: number;
  related_nodes: string[];
  related_clusters: string[];
  suggested_action?: string;
  timeframe?: string;
  is_auto_detected: boolean;
  status: string;
}

interface GapStats {
  total: number;
  manual: number;
  autoDetected: number;
  byType: Record<string, number>;
}

interface OppStats {
  total: number;
  manual: number;
  autoDetected: number;
  byPattern: Record<string, number>;
}

const API_BASE = '/api/universe';

function getAuthHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Universe-Auth': 'laksh-private-2026',
  };
}

const gapTypeColors: Record<string, string> = {
  incomplete_node: '#f59e0b',  // Amber
  weak_cluster: '#ef4444',     // Red
  missing_connection: '#8b5cf6', // Purple
  stale_project: '#6b7280',    // Gray
  missing_skill: '#3b82f6',    // Blue
};

const gapTypeIcons: Record<string, string> = {
  incomplete_node: '📝',
  weak_cluster: '📉',
  missing_connection: '🔗',
  stale_project: '⏸️',
  missing_skill: '🎯',
};

interface GapsOpportunitiesPanelProps {
  onClose?: () => void;
  onNodeSelect?: (nodeId: string) => void;
}

export function GapsOpportunitiesPanel({ onClose, onNodeSelect }: GapsOpportunitiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'gaps' | 'opportunities'>('gaps');
  const [loading, setLoading] = useState(true);
  
  // Gaps state
  const [gaps, setGaps] = useState<LearningGap[]>([]);
  const [gapStats, setGapStats] = useState<GapStats | null>(null);
  
  // Opportunities state
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [oppStats, setOppStats] = useState<OppStats | null>(null);
  
  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gapsRes, oppsRes] = await Promise.all([
        fetch(`${API_BASE}/learning-gaps`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/opportunities`, { headers: getAuthHeaders() }),
      ]);
      
      const gapsData = await gapsRes.json();
      const oppsData = await oppsRes.json();
      
      if (gapsData.success) {
        setGaps(gapsData.gaps || []);
        setGapStats(gapsData.stats);
      }
      
      if (oppsData.success) {
        setOpportunities(oppsData.opportunities || []);
        setOppStats(oppsData.stats);
      }
    } catch (error) {
      console.error('Failed to fetch gaps/opportunities:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Close a gap
  const closeGap = async (gapId: string) => {
    try {
      await fetch(`${API_BASE}/learning-gaps/${gapId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'closed' }),
      });
      setGaps(prev => prev.filter(g => g.id !== gapId));
    } catch (error) {
      console.error('Failed to close gap:', error);
    }
  };
  
  // Approve/reject opportunity
  const updateOpportunity = async (oppId: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`${API_BASE}/opportunities/${oppId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (status === 'rejected') {
        setOpportunities(prev => prev.filter(o => o.id !== oppId));
      } else {
        setOpportunities(prev => prev.map(o => 
          o.id === oppId ? { ...o, status: 'approved' } : o
        ));
      }
    } catch (error) {
      console.error('Failed to update opportunity:', error);
    }
  };
  
  if (!isPrivateMode()) {
    return (
      <div className="p-6 text-center text-white/50">
        This panel is only available in private mode.
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-semibold text-white">Gaps & Opportunities</h2>
          <p className="text-xs text-white/50">Auto-detected from your universe data</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded transition-colors">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('gaps')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'gaps'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Learning Gaps ({gaps.length})
        </button>
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'opportunities'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Opportunities ({opportunities.length})
        </button>
      </div>
      
      {/* Stats */}
      {activeTab === 'gaps' && gapStats && (
        <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-400">{gapStats.total}</div>
            <div className="text-xs text-white/40">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white/70">{gapStats.byType.incomplete_node || 0}</div>
            <div className="text-xs text-white/40">Incomplete</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white/70">{gapStats.byType.missing_connection || 0}</div>
            <div className="text-xs text-white/40">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white/70">{gapStats.byType.stale_project || 0}</div>
            <div className="text-xs text-white/40">Stale</div>
          </div>
        </div>
      )}
      
      {activeTab === 'opportunities' && oppStats && (
        <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{oppStats.total}</div>
            <div className="text-xs text-white/40">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{oppStats.autoDetected}</div>
            <div className="text-xs text-white/40">Auto-detected</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white/70">{oppStats.manual}</div>
            <div className="text-xs text-white/40">Manual</div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-white/50 py-8">Loading...</div>
        ) : activeTab === 'gaps' ? (
          gaps.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              No learning gaps detected. Your universe is well-documented.
            </div>
          ) : (
            gaps.map(gap => (
              <GapCard 
                key={gap.id} 
                gap={gap} 
                onClose={() => closeGap(gap.id)}
                onNodeSelect={onNodeSelect}
              />
            ))
          )
        ) : (
          opportunities.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              No opportunities detected yet. Keep building.
            </div>
          ) : (
            opportunities.map(opp => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onApprove={() => updateOpportunity(opp.id, 'approved')}
                onReject={() => updateOpportunity(opp.id, 'rejected')}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

// Gap Card Component
function GapCard({ 
  gap, 
  onClose, 
  onNodeSelect 
}: { 
  gap: LearningGap; 
  onClose: () => void;
  onNodeSelect?: (nodeId: string) => void;
}) {
  const color = gapTypeColors[gap.type] || '#6b7280';
  const icon = gapTypeIcons[gap.type] || '📋';
  
  return (
    <div className="p-4 rounded-lg border border-white/10 bg-white/5">
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">{gap.label}</span>
            {gap.is_auto_detected && (
              <span className="text-xs px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">Auto</span>
            )}
          </div>
          
          <p className="text-xs text-white/50 mb-2">{gap.description}</p>
          
          {/* Scores */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/40">Priority:</span>
              <span className="text-xs font-mono" style={{ color }}>{Math.round(gap.priority_score)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/40">Effort:</span>
              <span className="text-xs font-mono text-white/60">{gap.effort_score}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/40">ROI:</span>
              <span className="text-xs font-mono text-green-400">{Math.round(gap.roi_score)}%</span>
            </div>
          </div>
          
          {/* Cluster */}
          {gap.cluster_label && (
            <div 
              className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded mb-2"
              style={{ backgroundColor: `${gap.cluster_color}20`, color: gap.cluster_color }}
            >
              {gap.cluster_label}
            </div>
          )}
          
          {/* Related nodes */}
          {gap.related_nodes && gap.related_nodes.length > 0 && onNodeSelect && (
            <div className="flex flex-wrap gap-1">
              {gap.related_nodes.map(nodeId => (
                <button
                  key={nodeId}
                  onClick={() => onNodeSelect(nodeId)}
                  className="text-xs px-1.5 py-0.5 bg-white/5 hover:bg-white/10 rounded text-cyan-400 transition-colors"
                >
                  {nodeId}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/10 rounded text-white/40 hover:text-white/60 transition-colors"
          title="Mark as addressed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Opportunity Card Component
function OpportunityCard({
  opportunity,
  onApprove,
  onReject,
}: {
  opportunity: Opportunity;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isApproved = opportunity.status === 'approved';
  
  return (
    <div className={`p-4 rounded-lg border transition-colors ${
      isApproved ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5'
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-green-500/20">
          🎯
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">{opportunity.label}</span>
            {opportunity.is_auto_detected && (
              <span className="text-xs px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">Auto</span>
            )}
            {isApproved && (
              <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">Approved</span>
            )}
          </div>
          
          <p className="text-xs text-white/50 mb-2">{opportunity.description}</p>
          
          {/* Reasoning */}
          <div className="text-xs text-white/40 mb-2 p-2 bg-white/5 rounded">
            {opportunity.reasoning}
          </div>
          
          {/* Confidence and timeframe */}
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-white/40">Confidence:</span>
              <span className={`text-xs font-mono ${
                opportunity.confidence_score >= 80 ? 'text-green-400' :
                opportunity.confidence_score >= 60 ? 'text-amber-400' : 'text-white/60'
              }`}>{opportunity.confidence_score}%</span>
            </div>
            {opportunity.timeframe && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-white/40">Timeframe:</span>
                <span className="text-xs text-white/60">{opportunity.timeframe}</span>
              </div>
            )}
          </div>
          
          {/* Suggested action */}
          {opportunity.suggested_action && (
            <div className="text-xs text-cyan-400 mb-2">
              → {opportunity.suggested_action}
            </div>
          )}
        </div>
        
        {/* Actions */}
        {!isApproved && (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded transition-colors"
              title="Approve"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={onReject}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
              title="Reject"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GapsOpportunitiesPanel;
