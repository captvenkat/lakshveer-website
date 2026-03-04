/**
 * Weekly Compression Engine
 * 
 * The mentor intelligence: Takes 23+ opportunities and compresses to 2-4 clear "next moves"
 * 
 * Key principles:
 * - Ranking model (not point accumulation) - ranks separately by leverage, urgency, fit
 * - Context-aware reasoning - pulls from actual recent activity
 * - Mentor tone - sounds like a human ("Apply to X because Y" not "Priority: 87")
 * - Energy-adjusted - different mixes for build/exposure/consolidation/recovery modes
 */

import type { D1Database } from '@cloudflare/workers-types';
import type { EnergyMode } from './energy-check';
import type { WeeklyOverride } from './human-override';
import { isCategoryPaused, isForceIncluded } from './human-override';

export interface WeeklyMove {
  id: string;
  title: string;
  reasoning: string; // One clear sentence explaining why
  actionType: 'apply' | 'connect' | 'build'; // Internal categorization
  actionUrl?: string; // Pre-filled form URL or relevant link
  deadline?: string; // ISO date if time-sensitive
  effort: 'low' | 'medium' | 'high'; // Time commitment estimate
  relatedNodes: string[]; // Node IDs this builds on
}

export interface WeeklyOutput {
  week: string; // ISO date of Monday
  moves: WeeklyMove[];
  energyMode: EnergyMode;
  overridesSummary: string[];
  generatedAt: string;
}

interface ScoredOpportunity {
  opportunity: any; // From opportunity-intelligence.ts
  ranks: {
    leverage: number;  // 1 = best
    urgency: number;   // 1 = most urgent
    fit: number;       // 1 = best fit with trajectory
  };
  composite: number; // 0-100, weighted average of ranks
  reasoning: string;
}

/**
 * Main compression function: 23+ opportunities → 2-4 moves
 */
export async function compressToWeeklyOS(
  db: D1Database,
  opportunities: any[], // From getIntelligentOpportunities()
  energyMode: EnergyMode,
  overrides: WeeklyOverride[]
): Promise<WeeklyMove[]> {
  
  // Step 1: Apply filters
  let filtered = opportunities.filter(opp => {
    // Remove if category is paused
    if (opp.category && isCategoryPaused(overrides, opp.category)) {
      return false;
    }
    return true;
  });
  
  // Step 2: Score and rank all opportunities
  const scored = await scoreOpportunities(db, filtered, energyMode);
  
  // Step 3: Select top opportunities based on energy mode
  const targetCount = getTargetCount(energyMode);
  const topScored = scored.slice(0, Math.min(targetCount * 2, scored.length)); // Get 2x for filtering
  
  // Step 4: Apply force-includes (override ranking)
  const forceIncluded = topScored.filter(s => 
    isForceIncluded(overrides, s.opportunity.id)
  );
  
  const regularPicks = topScored
    .filter(s => !isForceIncluded(overrides, s.opportunity.id))
    .slice(0, targetCount - forceIncluded.length);
  
  const finalPicks = [...forceIncluded, ...regularPicks].slice(0, targetCount);
  
  // Step 5: Convert to WeeklyMove format
  return finalPicks.map(scored => opportunityToMove(scored));
}

/**
 * Score opportunities using ranking model
 * Ranks separately by leverage, urgency, fit - then combines
 */
async function scoreOpportunities(
  db: D1Database,
  opportunities: any[],
  energyMode: EnergyMode
): Promise<ScoredOpportunity[]> {
  
  // Get recent activity for context-aware scoring
  const recentActivity = await getRecentActivity(db);
  
  // Rank by leverage (strategic value)
  const byLeverage = [...opportunities].sort((a, b) => 
    compareLeverage(b, a)
  );
  
  // Rank by urgency (deadline proximity)
  const byUrgency = [...opportunities].sort((a, b) =>
    compareUrgency(a, b)
  );
  
  // Rank by trajectory fit (builds on recent work)
  const byFit = [...opportunities].sort((a, b) =>
    compareFit(b, a, recentActivity)
  );
  
  // Calculate composite scores
  const N = opportunities.length;
  const scored: ScoredOpportunity[] = opportunities.map(opp => {
    const ranks = {
      leverage: byLeverage.indexOf(opp) + 1,
      urgency: byUrgency.indexOf(opp) + 1,
      fit: byFit.indexOf(opp) + 1
    };
    
    // Normalize ranks to 0-100 and apply weights
    const weights = getWeightsForEnergyMode(energyMode);
    const composite = 
      ((N - ranks.leverage) / N * 100 * weights.leverage) +
      ((N - ranks.urgency) / N * 100 * weights.urgency) +
      ((N - ranks.fit) / N * 100 * weights.fit);
    
    const reasoning = generateMentorReasoning(opp, recentActivity);
    
    return { opportunity: opp, ranks, composite, reasoning };
  });
  
  // Sort by composite score
  return scored.sort((a, b) => b.composite - a.composite);
}

/**
 * Compare opportunities by leverage (strategic value)
 */
function compareLeverage(a: any, b: any): number {
  const aLeverage = a.strategicValue?.leverage || 0;
  const bLeverage = b.strategicValue?.leverage || 0;
  
  // Higher leverage = better
  return bLeverage - aLeverage;
}

/**
 * Compare opportunities by urgency (deadline)
 */
function compareUrgency(a: any, b: any): number {
  if (!a.deadline && !b.deadline) return 0;
  if (!a.deadline) return 1; // a is less urgent
  if (!b.deadline) return -1; // b is less urgent
  
  const aDays = daysUntil(a.deadline);
  const bDays = daysUntil(b.deadline);
  
  // Closer deadline = more urgent
  return aDays - bDays;
}

/**
 * Compare opportunities by trajectory fit (builds on recent work)
 */
function compareFit(a: any, b: any, recentActivity: any[]): number {
  const aFit = calculateFitScore(a, recentActivity);
  const bFit = calculateFitScore(b, recentActivity);
  
  return bFit - aFit;
}

/**
 * Calculate how well opportunity fits current trajectory
 */
function calculateFitScore(opp: any, recentActivity: any[]): number {
  let score = 0;
  
  // Check if builds on recent projects
  if (opp.relatedNodes) {
    const recentNodeIds = recentActivity.map(n => n.id);
    const overlap = opp.relatedNodes.filter((id: string) => recentNodeIds.includes(id));
    score += overlap.length * 10;
  }
  
  // Check if matches recent themes
  if (opp.category && recentActivity.some(n => n.type === opp.category)) {
    score += 5;
  }
  
  return score;
}

/**
 * Get recent activity nodes (last 30 days)
 */
async function getRecentActivity(db: D1Database): Promise<any[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const result = await db.prepare(`
    SELECT * FROM nodes
    WHERE date(created_at) >= date(?)
    ORDER BY created_at DESC
    LIMIT 20
  `).bind(thirtyDaysAgo.toISOString().split('T')[0]).all();
  
  return result.results || [];
}

/**
 * Generate mentor-style reasoning (sounds human, not algorithmic)
 */
function generateMentorReasoning(opp: any, recentActivity: any[]): string {
  const reasons: string[] = [];
  
  // Deadline urgency
  if (opp.deadline) {
    const days = daysUntil(opp.deadline);
    if (days <= 7) {
      reasons.push(`Deadline in ${days} day${days === 1 ? '' : 's'}`);
    }
  }
  
  // Builds on recent work
  const relatedRecent = recentActivity.find(n => 
    opp.relatedNodes?.includes(n.id)
  );
  if (relatedRecent) {
    reasons.push(`Builds on your recent ${relatedRecent.label} work`);
  }
  
  // Strategic value (room elevation)
  if (opp.strategicValue?.opensRoom) {
    reasons.push(opp.strategicValue.opensRoom);
  }
  
  // Take max 2 reasons, natural combination
  if (reasons.length === 0) {
    return opp.reasoning || 'Strong strategic fit';
  }
  
  return reasons.slice(0, 2).join('. ') + '.';
}

/**
 * Calculate days until deadline
 */
function daysUntil(deadline: string): number {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get ranking weights based on energy mode
 */
function getWeightsForEnergyMode(mode: EnergyMode): { leverage: number; urgency: number; fit: number } {
  switch (mode) {
    case 'build':
      return { leverage: 0.5, urgency: 0.2, fit: 0.3 }; // Prioritize high-leverage builds
    case 'exposure':
      return { leverage: 0.4, urgency: 0.4, fit: 0.2 }; // Balance leverage and urgency
    case 'consolidation':
      return { leverage: 0.3, urgency: 0.5, fit: 0.2 }; // Focus on urgent/deadline items
    case 'recovery':
      return { leverage: 0.6, urgency: 0.1, fit: 0.3 }; // Only highest leverage, low urgency
    default:
      return { leverage: 0.4, urgency: 0.3, fit: 0.3 };
  }
}

/**
 * Get target number of moves based on energy mode
 */
function getTargetCount(mode: EnergyMode): number {
  switch (mode) {
    case 'recovery':
      return 2; // Minimal moves
    case 'build':
      return 3; // Standard cadence
    case 'exposure':
      return 4; // More engagement opportunities
    case 'consolidation':
      return 2; // Focus on wrapping up
    default:
      return 3;
  }
}

/**
 * Convert scored opportunity to WeeklyMove
 */
function opportunityToMove(scored: ScoredOpportunity): WeeklyMove {
  const opp = scored.opportunity;
  
  // Determine action type
  let actionType: WeeklyMove['actionType'] = 'build';
  if (opp.type === 'gap' || opp.category === 'application') actionType = 'apply';
  if (opp.type === 'connection' || opp.category === 'speaking') actionType = 'connect';
  
  // Estimate effort
  let effort: WeeklyMove['effort'] = 'medium';
  if (opp.category === 'application' || opp.category === 'grant') effort = 'high';
  if (opp.category === 'speaking' || opp.category === 'event') effort = 'low';
  
  return {
    id: opp.id,
    title: opp.title,
    reasoning: scored.reasoning,
    actionType,
    actionUrl: opp.actionUrl || opp.url,
    deadline: opp.deadline,
    effort,
    relatedNodes: opp.relatedNodes || []
  };
}
