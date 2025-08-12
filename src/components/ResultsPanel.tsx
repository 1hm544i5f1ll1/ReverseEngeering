import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Bug, 
  Shield, 
  Code2, 
  Network,
  Download,
  Eye
} from 'lucide-react';
import { AnalysisResponse } from '../services/api';

interface ResultsPanelProps {
  results?: AnalysisResponse['results'];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['vulnerabilities']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Use provided results or show empty state
  const vulnerabilities = results?.vulnerabilities || [];
  const functions = results?.functions || [];
  const apiCalls = results?.apiCalls || [];
  const networkEndpoints = results?.networkEndpoints || [];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-600 bg-opacity-20';
      case 'medium': return 'text-yellow-400 bg-yellow-600 bg-opacity-20';
      case 'low': return 'text-green-400 bg-green-600 bg-opacity-20';
      default: return 'text-gray-400 bg-gray-600 bg-opacity-20';
    }
  };

  const sections = [
    {
      id: 'vulnerabilities',
      title: 'CVE Findings',
      icon: Bug,
      count: vulnerabilities.length,
      content: (
        <div className="space-y-2">
          {vulnerabilities.length > 0 ? vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="p-3 bg-gray-700 rounded border border-gray-600">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono text-blue-300">{vuln.id}</span>
                <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(vuln.severity)}`}>
                  {vuln.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-300">{vuln.description}</p>
            </div>
          )) : (
            <p className="text-xs text-gray-400 text-center py-4">No vulnerabilities found yet</p>
          )}
        </div>
      )
    },
    {
      id: 'functions',
      title: 'Named Functions',
      icon: Code2,
      count: functions.length,
      content: (
        <div className="space-y-2">
          {functions.length > 0 ? functions.map((func, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded border border-gray-600">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-mono text-green-300">{func.name || func.address}</span>
                <span className="text-xs text-blue-400">{(func.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-gray-400">{func.parameters}</p>
              {func.annotations && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {func.annotations.map((annotation, i) => (
                    <span key={i} className="text-xs bg-blue-600 bg-opacity-30 text-blue-300 px-1 rounded">
                      {annotation}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )) : (
            <p className="text-xs text-gray-400 text-center py-4">No functions analyzed yet</p>
          )}
        </div>
      )
    },
    {
      id: 'api-calls',
      title: 'API Calls',
      icon: Network,
      count: apiCalls.length,
      content: (
        <div className="space-y-2">
          {apiCalls.length > 0 ? apiCalls.map((api, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded border border-gray-600">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">
                  <span className="text-blue-300 font-mono">{api.method}</span>{' '}
                  <span className="text-gray-300">{api.endpoint}</span>
                </span>
                <span className="text-xs text-yellow-400">{api.frequency}x</span>
              </div>
              {api.parameters && (
                <p className="text-xs text-gray-400 mt-1">
                  Parameters: {api.parameters.join(', ')}
                </p>
              )}
            </div>
          )) : (
            <p className="text-xs text-gray-400 text-center py-4">No API calls discovered yet</p>
          )}
        </div>
      )
    },
    {
      id: 'endpoints',
      title: 'Network Endpoints',
      icon: Network,
      count: networkEndpoints.length,
      content: (
        <div className="space-y-2">
          {networkEndpoints.length > 0 ? networkEndpoints.map((endpoint, index) => (
            <div key={index} className="p-3 bg-gray-700 rounded border border-gray-600">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-300">{endpoint.url}</span>
                <span className="text-xs text-purple-400">{endpoint.protocol}</span>
              </div>
              <p className="text-xs text-gray-400">{endpoint.type}</p>
            </div>
          )) : (
            <p className="text-xs text-gray-400 text-center py-4">No network endpoints found yet</p>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="border-t border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Analysis Results</h3>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-white rounded">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-white rounded">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} className="border border-gray-600 rounded">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Icon size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-300">{section.title}</span>
                  {section.count > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                      {section.count}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="p-3 border-t border-gray-600 bg-gray-800">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPanel;