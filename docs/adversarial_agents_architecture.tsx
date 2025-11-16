import React, { useState } from 'react';
import { Box, Circle, ArrowRight, Zap, Shield, Scale, BookOpen, AlertTriangle } from 'lucide-react';

const ArchitectureDiagram = () => {
  const [activeAgent, setActiveAgent] = useState(null);

  const agents = [
    {
      id: 'advocate',
      name: 'Advocate Agent',
      icon: Shield,
      color: 'bg-blue-500',
      objective: 'Maximize Customer Satisfaction',
      strategy: 'Push for premium solutions, faster SLA',
      position: { top: '20%', left: '10%' }
    },
    {
      id: 'efficiency',
      name: 'Efficiency Agent',
      icon: Zap,
      color: 'bg-green-500',
      objective: 'Minimize Operational Costs',
      strategy: 'Suggest self-service, batch processing',
      position: { top: '20%', right: '10%' }
    },
    {
      id: 'mediator',
      name: 'Mediator Agent',
      icon: Scale,
      color: 'bg-purple-500',
      objective: 'Nash Equilibrium Optimizer',
      strategy: 'Game theory negotiation between agents',
      position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    },
    {
      id: 'knowledge',
      name: 'Knowledge Agent',
      icon: BookOpen,
      color: 'bg-orange-500',
      objective: 'Solution Discovery',
      strategy: 'RAG-based KB search, semantic matching',
      position: { bottom: '20%', left: '20%' }
    },
    {
      id: 'predictor',
      name: 'Escalation Predictor',
      icon: AlertTriangle,
      color: 'bg-red-500',
      objective: 'Risk Assessment',
      strategy: 'ML-based escalation probability',
      position: { bottom: '20%', right: '20%' }
    }
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Adversarial Multi-Agent Support System</h1>
        <p className="text-gray-400 mb-8">Game Theory-Based Enterprise Support Optimization</p>

        {/* Main Architecture Diagram */}
        <div className="relative bg-gray-800 rounded-lg p-8 mb-8 h-[600px] border border-gray-700">
          {/* Input Layer */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-700 rounded-lg p-4 border-2 border-yellow-500">
            <Box className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-white font-semibold text-center">Support Ticket</p>
            <p className="text-gray-400 text-xs text-center">Input Layer</p>
          </div>

          {/* Agents */}
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className={`absolute ${agent.color} rounded-lg p-4 cursor-pointer transition-all ${
                  activeAgent === agent.id ? 'scale-110 shadow-2xl' : 'hover:scale-105'
                }`}
                style={agent.position}
                onMouseEnter={() => setActiveAgent(agent.id)}
                onMouseLeave={() => setActiveAgent(null)}
              >
                <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-semibold text-sm text-center whitespace-nowrap">{agent.name}</p>
                {activeAgent === agent.id && (
                  <div className="absolute z-10 bg-gray-900 rounded-lg p-3 mt-2 w-64 border border-gray-600">
                    <p className="text-yellow-400 text-xs font-semibold mb-1">Objective:</p>
                    <p className="text-white text-xs mb-2">{agent.objective}</p>
                    <p className="text-yellow-400 text-xs font-semibold mb-1">Strategy:</p>
                    <p className="text-white text-xs">{agent.strategy}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Connection Lines */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
              </marker>
            </defs>
            {/* Ticket to Agents */}
            <line x1="50%" y1="15%" x2="20%" y2="25%" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="50%" y1="15%" x2="80%" y2="25%" stroke="#6366f1" strokeWidth="2" markerEnd="url(#arrowhead)" />
            
            {/* Agents to Mediator */}
            <line x1="25%" y1="30%" x2="48%" y2="48%" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
            <line x1="75%" y1="30%" x2="52%" y2="48%" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
            
            {/* Supporting Agents to Mediator */}
            <line x1="30%" y1="75%" x2="48%" y2="55%" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <line x1="70%" y1="75%" x2="52%" y2="55%" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </svg>

          {/* Output */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4">
            <Circle className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-white font-semibold text-center">Optimized Resolution</p>
            <p className="text-gray-200 text-xs text-center">Nash Equilibrium Output</p>
          </div>
        </div>

        {/* System Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Phase 1: Analysis</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Knowledge Agent searches KB</li>
              <li>• Predictor calculates escalation risk</li>
              <li>• Both agents provide data to negotiators</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Phase 2: Negotiation</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Advocate proposes high-satisfaction plan</li>
              <li>• Efficiency proposes cost-optimal plan</li>
              <li>• Agents argue and adjust positions</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-3">Phase 3: Resolution</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Mediator calculates Nash equilibrium</li>
              <li>• Optimal strategy balances objectives</li>
              <li>• System executes final decision</li>
            </ul>
          </div>
        </div>

        {/* Key Innovation */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6 border border-purple-500">
          <h3 className="text-2xl font-bold text-white mb-3">🎯 Key Innovation</h3>
          <p className="text-gray-200 mb-4">
            Unlike traditional cooperative multi-agent systems, this architecture introduces <span className="text-yellow-400 font-semibold">adversarial agents with competing objectives</span>. 
            The system models real business tensions between customer satisfaction and cost efficiency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-purple-300 font-semibold mb-2">Traditional Approach:</p>
              <p className="text-gray-300">All agents cooperate toward single goal → Ignores business trade-offs</p>
            </div>
            <div>
              <p className="text-pink-300 font-semibold mb-2">Our Approach:</p>
              <p className="text-gray-300">Agents negotiate competing objectives → Game theory finds optimal balance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
