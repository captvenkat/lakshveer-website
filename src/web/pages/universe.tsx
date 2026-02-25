import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SEO } from "@/components/seo";
import { 
  nodes as allNodes, 
  edges as allEdges, 
  UniverseNode, 
  UniverseEdge,
  NodeType,
  getConnectedNodes,
  getUniverseStats
} from "@/data/universe-data";

// ============================================
// FORCE SIMULATION - Pure canvas, no library
// ============================================

interface SimNode extends UniverseNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimEdge {
  source: SimNode;
  target: SimNode;
  relation: string;
  weight?: number;
}

// Colors for each node type
const nodeColors: Record<NodeType, string> = {
  core: '#22d3ee',      // Cyan - Lakshveer
  product: '#3b82f6',   // Blue
  project: '#10b981',   // Emerald
  skill: '#8b5cf6',     // Purple
  tool: '#f59e0b',      // Amber
  person: '#ec4899',    // Pink
  company: '#f97316',   // Orange
  event: '#06b6d4',     // Cyan-ish
  media: '#ef4444',     // Red
  achievement: '#fbbf24', // Yellow
  possibility: 'rgba(255,255,255,0.4)', // Ghost white
  concept: '#64748b',   // Slate
};

const nodeTypeLabels: Record<NodeType, string> = {
  core: 'Core',
  product: 'Products',
  project: 'Projects',
  skill: 'Skills',
  tool: 'Tools',
  person: 'People',
  company: 'Companies',
  event: 'Events',
  media: 'Media',
  achievement: 'Achievements',
  possibility: 'Possibilities',
  concept: 'Concepts',
};

function Universe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  
  // State
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<NodeType>>(new Set());
  const [showPossibilities, setShowPossibilities] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<SimNode | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  
  // Initialize nodes with positions
  const [simNodes, setSimNodes] = useState<SimNode[]>(() => {
    return allNodes.map((node, i) => {
      // Position core at center, others in a spiral
      const angle = (i / allNodes.length) * Math.PI * 2 * 3;
      const radius = node.type === 'core' ? 0 : 100 + i * 2;
      return {
        ...node,
        x: 400 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });
  });
  
  // Build edges with node references
  const simEdges = useMemo<SimEdge[]>(() => {
    return allEdges.map(edge => ({
      source: simNodes.find(n => n.id === edge.source)!,
      target: simNodes.find(n => n.id === edge.target)!,
      relation: edge.relation,
      weight: edge.weight,
    })).filter(e => e.source && e.target);
  }, [simNodes]);
  
  // Filter nodes based on active filters and search
  const filteredNodes = useMemo(() => {
    return simNodes.filter(node => {
      // Filter by type
      if (activeFilters.size > 0 && !activeFilters.has(node.type)) {
        // Always show core
        if (node.type !== 'core') return false;
      }
      // Filter possibilities
      if (!showPossibilities && node.type === 'possibility') return false;
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return node.label.toLowerCase().includes(query) || 
               node.description?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [simNodes, activeFilters, showPossibilities, searchQuery]);
  
  // Filter edges based on visible nodes
  const filteredEdges = useMemo(() => {
    const visibleIds = new Set(filteredNodes.map(n => n.id));
    return simEdges.filter(e => 
      visibleIds.has(e.source.id) && visibleIds.has(e.target.id)
    );
  }, [simEdges, filteredNodes]);
  
  // Stats
  const stats = useMemo(() => getUniverseStats(), []);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Force simulation
  useEffect(() => {
    let running = true;
    
    const simulate = () => {
      if (!running) return;
      
      setSimNodes(prevNodes => {
        const nodes = [...prevNodes];
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        
        // Apply forces
        nodes.forEach((node, i) => {
          if (node.fx != null) {
            node.x = node.fx;
            node.vx = 0;
          }
          if (node.fy != null) {
            node.y = node.fy;
            node.vy = 0;
          }
          
          // Skip fixed nodes
          if (node.fx != null || node.fy != null) return;
          
          // Center gravity (stronger for core)
          const gravityStrength = node.type === 'core' ? 0.05 : 0.002;
          node.vx += (centerX - node.x) * gravityStrength;
          node.vy += (centerY - node.y) * gravityStrength;
          
          // Repulsion from other nodes
          nodes.forEach((other, j) => {
            if (i === j) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = 50;
            if (dist < minDist * 3) {
              const force = (minDist * minDist) / (dist * dist) * 0.5;
              node.vx += (dx / dist) * force;
              node.vy += (dy / dist) * force;
            }
          });
        });
        
        // Edge attraction
        allEdges.forEach(edge => {
          const source = nodes.find(n => n.id === edge.source);
          const target = nodes.find(n => n.id === edge.target);
          if (!source || !target) return;
          
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const idealDist = 100 + (100 - (edge.weight || 50)) * 1.5;
          const force = (dist - idealDist) * 0.003;
          
          if (source.fx == null) {
            source.vx += (dx / dist) * force;
            source.vy += (dy / dist) * force;
          }
          if (target.fx == null) {
            target.vx -= (dx / dist) * force;
            target.vy -= (dy / dist) * force;
          }
        });
        
        // Apply velocity with damping
        nodes.forEach(node => {
          if (node.fx != null || node.fy != null) return;
          node.vx *= 0.9;
          node.vy *= 0.9;
          node.x += node.vx;
          node.y += node.vy;
          
          // Boundary constraints
          const padding = 50;
          node.x = Math.max(padding, Math.min(dimensions.width - padding, node.x));
          node.y = Math.max(padding, Math.min(dimensions.height - padding, node.y));
        });
        
        return nodes;
      });
      
      animationRef.current = requestAnimationFrame(simulate);
    };
    
    simulate();
    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions]);
  
  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Apply transform
    ctx.save();
    ctx.translate(pan.x + dimensions.width / 2, pan.y + dimensions.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-dimensions.width / 2, -dimensions.height / 2);
    
    // Draw stars background
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let i = 0; i < 100; i++) {
      const x = (Math.sin(i * 123.456) * 0.5 + 0.5) * dimensions.width;
      const y = (Math.cos(i * 789.012) * 0.5 + 0.5) * dimensions.height;
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Determine highlighted nodes
    const highlightedIds = new Set<string>();
    if (hoveredNode || selectedNode) {
      const focusNode = hoveredNode || selectedNode;
      if (focusNode) {
        highlightedIds.add(focusNode.id);
        filteredEdges.forEach(edge => {
          if (edge.source.id === focusNode.id) highlightedIds.add(edge.target.id);
          if (edge.target.id === focusNode.id) highlightedIds.add(edge.source.id);
        });
      }
    }
    
    // Draw edges
    filteredEdges.forEach(edge => {
      const isHighlighted = highlightedIds.size === 0 || 
        (highlightedIds.has(edge.source.id) && highlightedIds.has(edge.target.id));
      
      ctx.beginPath();
      ctx.moveTo(edge.source.x, edge.source.y);
      ctx.lineTo(edge.target.x, edge.target.y);
      
      const alpha = isHighlighted ? 0.4 : 0.08;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = isHighlighted ? 1.5 : 0.5;
      ctx.stroke();
    });
    
    // Draw nodes
    filteredNodes.forEach(node => {
      const isHighlighted = highlightedIds.size === 0 || highlightedIds.has(node.id);
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      
      // Size based on weight
      const baseSize = (node.weight || 30) / 10;
      const size = node.type === 'core' ? 20 : Math.max(4, Math.min(15, baseSize));
      
      // Alpha based on highlight state
      const alpha = isHighlighted ? 1 : 0.2;
      
      // Glow for highlighted/selected
      if (isSelected || isHovered || node.type === 'core') {
        const glowSize = isSelected ? 25 : isHovered ? 20 : 15;
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, size + glowSize
        );
        const color = nodeColors[node.type];
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace(')', ',0.3)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + glowSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
      
      // Possibility nodes are hollow
      if (node.type === 'possibility') {
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.1})`;
        ctx.fill();
      } else {
        const color = nodeColors[node.type];
        ctx.fillStyle = alpha < 1 ? 
          color.replace(')', `,${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace(/([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i, (_, r, g, b) => 
            `${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)},${alpha})`) 
          : color;
        ctx.fill();
      }
      
      // Label
      if (isHighlighted && (zoom > 0.7 || isSelected || isHovered || node.type === 'core')) {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.font = `${isSelected || isHovered || node.type === 'core' ? 'bold ' : ''}${Math.max(10, 12 / zoom)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + size + 4);
      }
    });
    
    ctx.restore();
    
  }, [simNodes, filteredNodes, filteredEdges, dimensions, zoom, pan, selectedNode, hoveredNode]);
  
  // Mouse handlers
  const getNodeAtPosition = useCallback((clientX: number, clientY: number): SimNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    // Transform mouse position to canvas coordinates
    const x = ((clientX - rect.left - pan.x - dimensions.width / 2) / zoom + dimensions.width / 2);
    const y = ((clientY - rect.top - pan.y - dimensions.height / 2) / zoom + dimensions.height / 2);
    
    // Find closest node within threshold
    let closest: SimNode | null = null;
    let closestDist = 20 / zoom; // Threshold
    
    filteredNodes.forEach(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closest = node;
        closestDist = dist;
      }
    });
    
    return closest;
  }, [filteredNodes, pan, zoom, dimensions]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      setLastMouse({ x: e.clientX, y: e.clientY });
      return;
    }
    
    if (draggedNode) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left - pan.x - dimensions.width / 2) / zoom + dimensions.width / 2);
      const y = ((e.clientY - rect.top - pan.y - dimensions.height / 2) / zoom + dimensions.height / 2);
      
      setSimNodes(nodes => nodes.map(n => 
        n.id === draggedNode.id ? { ...n, x, y, fx: x, fy: y } : n
      ));
      return;
    }
    
    const node = getNodeAtPosition(e.clientX, e.clientY);
    setHoveredNode(node);
  }, [isPanning, draggedNode, lastMouse, getNodeAtPosition, pan, zoom, dimensions]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      setDraggedNode(node);
      setIsDragging(true);
    } else {
      setIsPanning(true);
      setLastMouse({ x: e.clientX, y: e.clientY });
    }
  }, [getNodeAtPosition]);
  
  const handleMouseUp = useCallback(() => {
    if (draggedNode && !isDragging) {
      // It was a click, not a drag
      setSelectedNode(draggedNode);
    } else if (draggedNode) {
      // Release the node
      setSimNodes(nodes => nodes.map(n => 
        n.id === draggedNode.id ? { ...n, fx: null, fy: null } : n
      ));
    }
    setDraggedNode(null);
    setIsDragging(false);
    setIsPanning(false);
  }, [draggedNode, isDragging]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY);
    if (node) {
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  }, [getNodeAtPosition]);
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.3, Math.min(3, z * delta)));
  }, []);
  
  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const node = getNodeAtPosition(touch.clientX, touch.clientY);
      if (node) {
        setSelectedNode(node);
      } else {
        setIsPanning(true);
        setLastMouse({ x: touch.clientX, y: touch.clientY });
      }
    }
  }, [getNodeAtPosition]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastMouse.x;
      const dy = touch.clientY - lastMouse.y;
      setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      setLastMouse({ x: touch.clientX, y: touch.clientY });
    }
    // TODO: Pinch to zoom
  }, [isPanning, lastMouse]);
  
  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);
  
  // Reset view
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setActiveFilters(new Set());
    setSearchQuery('');
  }, []);
  
  // Toggle filter
  const toggleFilter = (type: NodeType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };
  
  // Get connected nodes for selected
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return [];
    return getConnectedNodes(selectedNode.id);
  }, [selectedNode]);

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-hidden">
      <SEO title="Universe | Lakshveer Rao" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#050508] to-transparent pointer-events-none">
        <div className="px-4 py-4 md:px-6 flex items-center justify-between pointer-events-auto">
          <div>
            <a href="/" className="text-lg font-semibold text-white/90 hover:text-white">
              ← Lakshveer
            </a>
            <h1 className="text-sm text-white/50">The Universe</h1>
          </div>
          
          {/* Search */}
          <div className="hidden md:block">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm w-64 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          
          {/* Stats */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-white/50">
            <span>{stats.totalNodes} nodes</span>
            <span>{stats.totalEdges} connections</span>
            <span>{(stats.totalReach / 1000).toFixed(0)}K+ reach</span>
          </div>
        </div>
      </header>
      
      {/* Main Canvas */}
      <div 
        ref={containerRef}
        className="fixed inset-0"
        style={{ cursor: isPanning ? 'grabbing' : hoveredNode ? 'pointer' : 'grab' }}
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        />
      </div>
      
      {/* Left Panel - Filters */}
      <div className="fixed left-4 top-20 z-10 hidden md:block">
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 w-48">
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">Filter by Type</h3>
          <div className="space-y-1">
            {Object.entries(nodeTypeLabels).map(([type, label]) => {
              const isActive = activeFilters.size === 0 || activeFilters.has(type as NodeType);
              const count = stats.nodesByType[type as NodeType] || 0;
              return (
                <button
                  key={type}
                  onClick={() => toggleFilter(type as NodeType)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs transition-all ${
                    isActive ? 'text-white' : 'text-white/30'
                  }`}
                >
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: isActive ? nodeColors[type as NodeType] : 'transparent',
                      border: `1px solid ${nodeColors[type as NodeType]}`
                    }}
                  />
                  <span className="flex-1 text-left">{label}</span>
                  <span className="text-white/40">{count}</span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
              <input
                type="checkbox"
                checked={showPossibilities}
                onChange={(e) => setShowPossibilities(e.target.checked)}
                className="rounded border-white/30"
              />
              Show Possibilities
            </label>
          </div>
          
          <button
            onClick={resetView}
            className="mt-4 w-full px-3 py-2 text-xs border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
          >
            Reset View
          </button>
        </div>
      </div>
      
      {/* Right Panel - Details */}
      {selectedNode && (
        <div className="fixed right-4 top-20 bottom-4 z-10 w-80 overflow-hidden">
          <div className="h-full bg-black/50 backdrop-blur-sm border border-white/10 p-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span 
                  className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider mb-2"
                  style={{ 
                    backgroundColor: nodeColors[selectedNode.type] + '20',
                    color: nodeColors[selectedNode.type]
                  }}
                >
                  {nodeTypeLabels[selectedNode.type]}
                </span>
                <h2 className="text-xl font-semibold">{selectedNode.label}</h2>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-white/50 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            {/* Description */}
            {selectedNode.description && (
              <p className="text-sm text-white/70 mb-4">{selectedNode.description}</p>
            )}
            
            {/* Metadata */}
            <div className="space-y-2 mb-6">
              {selectedNode.year && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Year</span>
                  <span>{selectedNode.year}</span>
                </div>
              )}
              {selectedNode.reach && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Potential Reach</span>
                  <span className="text-cyan-400">{(selectedNode.reach / 1000).toFixed(0)}K+</span>
                </div>
              )}
              {selectedNode.status && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Status</span>
                  <span className={selectedNode.status === 'live' ? 'text-green-400' : 'text-yellow-400'}>
                    {selectedNode.status}
                  </span>
                </div>
              )}
              {selectedNode.url && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Link</span>
                  <a 
                    href={selectedNode.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Visit ↗
                  </a>
                </div>
              )}
            </div>
            
            {/* Connected Nodes */}
            {connectedNodes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">
                  Connected ({connectedNodes.length})
                </h3>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {connectedNodes.map(({ node, edge }) => (
                    <button
                      key={node.id}
                      onClick={() => {
                        const simNode = simNodes.find(n => n.id === node.id);
                        if (simNode) setSelectedNode(simNode);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-white/5 transition-colors"
                    >
                      <span 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: nodeColors[node.type] }}
                      />
                      <span className="flex-1 truncate">{node.label}</span>
                      <span className="text-[10px] text-white/40">{edge.relation}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Possibility hint */}
            {selectedNode.type === 'possibility' && (
              <div className="mt-6 p-3 bg-cyan-500/10 border border-cyan-500/20 text-sm">
                <p className="text-cyan-400 font-medium mb-1">Future Possibility</p>
                <p className="text-white/60 text-xs">
                  This represents something Lakshveer could achieve based on his current skills and connections.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-gradient-to-t from-[#050508] to-transparent">
        <div className="p-4">
          {selectedNode ? (
            <div className="bg-black/80 backdrop-blur-sm border border-white/10 p-3">
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-xs uppercase"
                  style={{ color: nodeColors[selectedNode.type] }}
                >
                  {nodeTypeLabels[selectedNode.type]}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-white/50"
                >
                  ×
                </button>
              </div>
              <h3 className="font-semibold">{selectedNode.label}</h3>
              {selectedNode.description && (
                <p className="text-xs text-white/60 mt-1 line-clamp-2">{selectedNode.description}</p>
              )}
              {selectedNode.url && (
                <a 
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-cyan-400"
                >
                  Visit ↗
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm text-white/50">
              <span>{stats.totalNodes} nodes · {stats.totalEdges} connections</span>
              <button
                onClick={resetView}
                className="px-3 py-1 border border-white/20 text-xs"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Zoom Controls */}
      <div className="fixed bottom-4 left-4 z-10 hidden md:flex flex-col gap-1">
        <button
          onClick={() => setZoom(z => Math.min(3, z * 1.2))}
          className="w-8 h-8 bg-black/50 border border-white/10 text-white/70 hover:text-white flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.3, z / 1.2))}
          className="w-8 h-8 bg-black/50 border border-white/10 text-white/70 hover:text-white flex items-center justify-center"
        >
          −
        </button>
      </div>
      
      {/* Instructions */}
      <div className="fixed bottom-4 right-4 z-10 hidden lg:block text-xs text-white/30">
        Drag to pan · Scroll to zoom · Click nodes to explore
      </div>
    </div>
  );
}

export default Universe;
