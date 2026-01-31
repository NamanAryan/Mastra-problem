import { Shield, TrendingUp, Eye, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Footer } from "../components/Footer";
import { HeroVisual } from "../components/HeroVisual";

export function LandingPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#00ff88]/10 bg-black/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00ff88]/30 blur-md rounded-lg" />
              <div className="relative bg-[#00ff88] p-2 rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.5)]">
                <Shield className="w-5 h-5 text-black" />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight">
                CHAIN<span className="text-[#00ff88]">SLEUTH</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#00ff88]/60">
                Forensics Console
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#overview" className="hover:text-white transition-colors">
              Overview
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full border border-[#00ff88]/20 bg-[#0a0a12] text-xs text-gray-300">
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    "User"}
                </div>
                <button
                  onClick={async () => {
                    setLoggingOut(true);
                    try {
                      await signOut();
                      navigate("/login");
                    } catch (err) {
                      console.error("Logout error:", err);
                      setLoggingOut(false);
                    }
                  }}
                  disabled={loggingOut}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-black bg-[#00ff88] hover:bg-[#00cc6a] transition-colors shadow-[0_0_10px_rgba(0,255,136,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-black bg-[#00ff88] hover:bg-[#00cc6a] transition-colors shadow-[0_0_10px_rgba(0,255,136,0.3)]"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="overview" className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full text-sm text-[#00ff88] mb-8">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              Interactive Blockchain Forensics
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Detect Money Laundering
              <br />
              in{" "}
              <span className="bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
                Crypto Transactions
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-400 mb-12 max-w-2xl lg:mx-0 mx-auto">
              Visualize suspicious patterns in blockchain transaction networks.
              Identify fan-out, fan-in, and multi-hop laundering chains with
              graph-based analysis.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/projects")}
              className="group relative px-8 py-4 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-black font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Go to Projects
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl" />
            </button>
          </div>

          {/* Hero Visual */}
          <div className="flex justify-center lg:justify-end">
            <HeroVisual />
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00ff88] mb-2">
                99.2%
              </div>
              <div className="text-sm text-gray-500">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00ff88] mb-2">
                Real-time
              </div>
              <div className="text-sm text-gray-500">Analysis Speed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00ff88] mb-2">100%</div>
              <div className="text-sm text-gray-500">Explainable Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Graph Visualization</h3>
            <p className="text-gray-400 text-sm">
              Interactive force-directed graphs show money flow across wallets
              with real-time pattern detection.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Risk Scoring</h3>
            <p className="text-gray-400 text-sm">
              Each wallet receives a suspicion score based on structural
              position and transaction patterns.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-[#00ff88]/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#00ff88]" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rule-Based</h3>
            <p className="text-gray-400 text-sm">
              Explainable detection logic instead of black-box ML. Understand
              exactly why a wallet is flagged.
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div id="security" className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#00ff88]/10 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#00ff88]" />
            </div>
            <h3 className="text-2xl font-semibold">Security & Privacy</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Built for compliance-first investigations with least-privilege
            access, auditable actions, and encrypted data handling.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
              SOC-ready audit trails
            </div>
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
              Encrypted at rest & in transit
            </div>
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
              Role-based access control
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
