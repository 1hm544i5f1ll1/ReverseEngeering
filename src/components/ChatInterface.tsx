import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, Zap } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import MessageBubble from './MessageBubble';
import FileUpload from './FileUpload';
import PipelineStatus from './PipelineStatus';
import ResultsPanel from './ResultsPanel';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    filename?: string;
    fileSize?: string;
    pipelineStage?: string;
    results?: any;
  };
}

const ChatInterface: React.FC = () => {
  const { 
    currentAnalysis, 
    isProcessing: isAnalyzing, 
    startAnalysis, 
    sendChatMessage,
    generateIntegrationCode,
    error: analysisError 
  } = useAnalysis();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to ReversaAI! Upload a binary file or describe your reverse engineering task to get started.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAnalyzing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const aiResponse = await sendChatMessage(inputValue);
      const response: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      
      // Start analysis if it's a reverse engineering command
      if (inputValue.toLowerCase().includes('reverse-engineer') || 
          inputValue.toLowerCase().includes('analyze')) {
        await startAnalysis({
          command: inputValue,
          options: {
            decompiler: 'ghidra',
            enableAI: true,
            staticAnalysis: true,
            dynamicAnalysis: true,
            networkAnalysis: true
          }
        });
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleFileUpload = (file: File) => {
    const fileMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `File "${file.name}" uploaded successfully. Starting analysis pipeline...`,
      timestamp: new Date(),
      metadata: {
        filename: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      },
    };

    setMessages(prev => [...prev, fileMessage]);
    setShowUpload(false);
    
    // Start file analysis
    startAnalysis({
      file,
      command: `Analyze uploaded file: ${file.name}`,
      options: {
        decompiler: 'ghidra',
        enableAI: true,
        staticAnalysis: true,
        dynamicAnalysis: true,
        networkAnalysis: true
      }
    });
  };

  const handleGenerateCode = async () => {
    try {
      const code = await generateIntegrationCode();
      const codeMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Here's the auto-generated integration code based on the discovered API endpoints:\n\n\`\`\`typescript\n${code}\n\`\`\``,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, codeMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Error generating code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Show analysis error if any
  useEffect(() => {
    if (analysisError) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Analysis Error: ${analysisError}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [analysisError]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">ReversaAI</h1>
          <p className="text-sm text-gray-400 mt-1">AI-Powered Reverse Engineering</p>
        </div>
        
        <PipelineStatus currentStage={currentAnalysis?.stage || null} />
        <ResultsPanel results={currentAnalysis?.results} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">AI Assistant Active</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>Upload Binary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isAnalyzing && (
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm">AI is analyzing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your reverse engineering task..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                disabled={isAnalyzing}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                <button 
                  onClick={handleGenerateCode}
                  className="text-gray-400 hover:text-white p-1"
                  title="Generate Integration Code"
                >
                  <FileText size={18} />
                </button>
                <button className="text-gray-400 hover:text-white p-1">
                  <Zap size={18} />
                </button>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg px-6 py-3 font-medium transition-colors flex items-center space-x-2"
            >
              <Send size={18} />
            </button>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Reverse-engineer sample.exe: decompile, rename functions, map API calls, flag potential CVEs",
              "Analyze network traffic and extract API endpoints",
              "Unpack firmware and identify security vulnerabilities",
              "Generate integration code for discovered APIs"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputValue(suggestion)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-300 hover:text-white transition-colors"
              >
                {suggestion.length > 50 ? `${suggestion.substring(0, 50)}...` : suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      {showUpload && (
        <FileUpload
          onUpload={handleFileUpload}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;