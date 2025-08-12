import React from 'react';
import { 
  FileText, 
  Brain, 
  Search, 
  Network, 
  Code, 
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface PipelineStatusProps {
  currentStage: string | null;
}

const PipelineStatus: React.FC<PipelineStatusProps> = ({ currentStage }) => {
  const stages = [
    {
      id: 'load',
      name: 'Load & Decompile',
      description: 'Ghidra/Cutter/LLM4Decompile',
      icon: FileText,
      status: currentStage === 'load' ? 'active' : currentStage ? 'completed' : 'pending'
    },
    {
      id: 'ai-assist',
      name: 'AI Assist',
      description: 'ReVa, ReverserAI auto-naming',
      icon: Brain,
      status: currentStage === 'ai-assist' ? 'active' : 'pending'
    },
    {
      id: 'analysis',
      name: 'Static & Dynamic',
      description: 'Binwalk, x64dbg, Frida',
      icon: Search,
      status: currentStage === 'analysis' ? 'active' : 'pending'
    },
    {
      id: 'network',
      name: 'Network & Web',
      description: 'Wireshark/Burp endpoints',
      icon: Network,
      status: currentStage === 'network' ? 'active' : 'pending'
    },
    {
      id: 'integration',
      name: 'Integration',
      description: 'Integuru code generation',
      icon: Code,
      status: currentStage === 'integration' ? 'active' : 'pending'
    },
    {
      id: 'feedback',
      name: 'Community Feedback',
      description: 'Ranking & refinement',
      icon: Users,
      status: currentStage === 'feedback' ? 'active' : 'pending'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'active':
        return <Clock size={16} className="text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-600 rounded-full"></div>;
    }
  };

  return (
    <div className="flex-1 p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Pipeline Status</h3>
      
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = stage.status === 'active';
          const isCompleted = stage.status === 'completed';
          
          return (
            <div
              key={stage.id}
              className={`relative p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-blue-600 bg-opacity-20 border-blue-500'
                  : isCompleted
                  ? 'bg-green-600 bg-opacity-10 border-green-500'
                  : 'bg-gray-700 border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  isActive ? 'bg-blue-500' : isCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <Icon size={16} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      isActive ? 'text-blue-300' : isCompleted ? 'text-green-300' : 'text-gray-300'
                    }`}>
                      {stage.name}
                    </h4>
                    {getStatusIcon(stage.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{stage.description}</p>
                  
                  {isActive && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className={`absolute left-6 bottom-0 w-0.5 h-3 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-600'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineStatus;