import React, { useState } from "react";
import type { Wallet, Transaction } from "../types";

interface GraphVisualizationProps {
  nodes: Wallet[];
  edges: Transaction[];
}

const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [hoveredWallet, setHoveredWallet] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const getRiskColor = (score: number) => {
    if (score >= 71) return "#ef4444";
    if (score >= 31) return "#eab308";
    return "#00ff88";
  };

  const getNodeSize = (wallet: Wallet) => {
    const volume = wallet.inflow + wallet.outflow;
    return Math.max(15, Math.min(40, 15 + volume / 100000));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.1, Math.min(5, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffsetX(e.clientX - dragStart.x);
      setOffsetY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const centerX = 300;
  const centerY = 250;

  return (
    <div className="relative w-full h-full bg-black/50 overflow-hidden rounded border border-gray-600">
      <svg
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g
          transform={`translate(${centerX + offsetX}, ${centerY + offsetY}) scale(${scale})`}
        >
          {/* Render edges */}
          {edges.map((tx) => {
            const from = nodes.find((w) => w.id === tx.from);
            const to = nodes.find((w) => w.id === tx.to);
            if (!from || !to) return null;

            const isActive =
              selectedWallet === tx.from ||
              selectedWallet === tx.to ||
              hoveredWallet === tx.from ||
              hoveredWallet === tx.to;

            return (
              <line
                key={tx.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? "#00ff88" : "#1a2f23"}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.3}
              />
            );
          })}

          {/* Render nodes */}
          {nodes.map((wallet) => {
            const isSelected = selectedWallet === wallet.id;
            const isHovered = hoveredWallet === wallet.id;
            const size = getNodeSize(wallet);
            const riskColor = getRiskColor(wallet.riskScore);

            return (
              <g
                key={wallet.id}
                transform={`translate(${wallet.x}, ${wallet.y})`}
                onMouseEnter={() => setHoveredWallet(wallet.id)}
                onMouseLeave={() => setHoveredWallet(null)}
                onClick={() => setSelectedWallet(wallet.id)}
                className="cursor-pointer"
              >
                {/* Glow effect for hovered */}
                {isHovered && (
                  <circle
                    r={size + 6}
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth={2}
                    opacity={0.4}
                  />
                )}

                {/* Outer ring for selected */}
                {isSelected && (
                  <circle
                    r={size + 4}
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth={2}
                    opacity={0.8}
                  />
                )}

                {/* Main node */}
                <circle
                  r={size}
                  fill="black"
                  stroke={riskColor}
                  strokeWidth={2}
                />

                {/* Risk indicator dot */}
                <circle
                  r={3}
                  fill={riskColor}
                  cx={size * 0.6}
                  cy={-size * 0.6}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredWallet && (
        <div className="absolute pointer-events-none bg-black/80 border border-green-400/30 rounded p-3 text-xs z-10 left-4 top-4">
          {(() => {
            const wallet = nodes.find((w) => w.id === hoveredWallet);
            if (!wallet) return null;
            return (
              <div className="space-y-1">
                <div className="font-mono text-green-400 truncate max-w-xs">
                  {wallet.hash.slice(0, 16)}...
                </div>
                <div className="text-gray-400">
                  In: {(wallet.inflow / 1e6).toFixed(2)}M
                </div>
                <div className="text-gray-400">
                  Out: {(wallet.outflow / 1e6).toFixed(2)}M
                </div>
                <div
                  className="font-semibold"
                  style={{ color: getRiskColor(wallet.riskScore) }}
                >
                  Risk: {wallet.riskScore}/100
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-black/60 border border-gray-600 rounded px-2 py-1 text-xs text-gray-400">
        Zoom: {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default GraphVisualization;
