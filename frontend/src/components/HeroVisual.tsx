
export const HeroVisual = () => {
  return (
    <div className="relative w-full max-w-lg aspect-square">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_0_30px_rgba(0,255,136,0.5)]"
      >
        {/* Background Circles - Dark Green/Black */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="#0a1a0f"
          strokeWidth="2"
        />
        <circle
          cx="200"
          cy="200"
          r="140"
          fill="none"
          stroke="#0f2a14"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke="#0f2a14"
          strokeWidth="1"
        />

        {/* Central Node */}
        <circle
          cx="200"
          cy="200"
          r="20"
          fill="black"
          stroke="#00ff88"
          strokeWidth="3"
        >
          <animate
            attributeName="r"
            values="20;22;20"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            values="1;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Orbiting Nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g key={i}>
            <line
              x1="200"
              y1="200"
              x2={200 + 120 * Math.cos((angle * Math.PI) / 180)}
              y2={200 + 120 * Math.sin((angle * Math.PI) / 180)}
              stroke="#0f2a14"
              strokeWidth="2"
            />
            <circle
              cx={200 + 120 * Math.cos((angle * Math.PI) / 180)}
              cy={200 + 120 * Math.sin((angle * Math.PI) / 180)}
              r="8"
              fill="black"
              stroke="#00ff88"
              strokeWidth="2"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.3;1;0.3"
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Scanning Ring */}
        <circle
          cx="200"
          cy="200"
          r="160"
          fill="none"
          stroke="#00ff88"
          strokeWidth="3"
          strokeDasharray="20 340"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 200 200"
            to="360 200 200"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Data Points */}
        {[...Array(8)].map((_, i) => {
          const angle = i * 45 * (Math.PI / 180);
          const r = 90 + Math.random() * 20;
          return (
            <circle
              key={i}
              cx={200 + r * Math.cos(angle)}
              cy={200 + r * Math.sin(angle)}
              r="3"
              fill="#00ff88"
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur={`${1.5 + Math.random()}s`}
                begin={`${i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>

      {/* Floating Cards - Black with Green Borders */}
      <div
        className="absolute top-10 right-0 bg-black border border-[#00ff88] p-4 rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.2)] backdrop-blur-sm animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <div className="text-xs text-[#00ff88]">Risk Score</div>
        <div className="text-xl font-bold text-red-500">98/100</div>
        <div className="text-xs text-red-400 mt-1">High Risk Detected</div>
      </div>

      <div
        className="absolute bottom-20 left-0 bg-black border border-[#00ff88] p-4 rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.2)] backdrop-blur-sm animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      >
        <div className="text-xs text-[#00ff88]">Flow Traced</div>
        <div className="text-xl font-bold text-[#00ff88]">$4.2M</div>
        <div className="text-xs text-gray-400 mt-1">12 Hops</div>
      </div>
    </div>
  );
};
