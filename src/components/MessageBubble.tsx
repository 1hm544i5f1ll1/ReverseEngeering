import React from 'react';
import { User, Bot, Settings, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

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

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`relative px-4 py-3 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white'
              : isSystem
              ? 'bg-gray-700 border border-gray-600'
              : 'bg-gray-750 border border-gray-600'
          }`}
        >
          {/* Avatar */}
          <div className={`absolute -top-2 ${isUser ? '-right-2' : '-left-2'} w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : isSystem ? 'bg-gray-600' : 'bg-green-600'
          }`}>
            {isUser ? (
              <User size={16} />
            ) : isSystem ? (
              <Settings size={16} />
            ) : (
              <Bot size={16} />
            )}
          </div>

          {/* Message Content */}
          <div className="pt-2">
            {message.metadata?.filename && (
              <div className="mb-2 p-2 bg-black bg-opacity-30 rounded text-xs">
                <div className="font-medium">{message.metadata.filename}</div>
                <div className="text-gray-300">{message.metadata.fileSize}</div>
              </div>
            )}
            
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            
            {/* Code blocks or results */}
            {message.content.includes('```') && (
              <div className="mt-2 bg-black bg-opacity-40 p-3 rounded text-xs font-mono overflow-x-auto">
                <pre className="text-green-300">{message.content.split('```')[1]}</pre>
              </div>
            )}
          </div>

          {/* Message Actions */}
          {!isUser && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-white p-1 rounded"
                  title="Copy message"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="text-gray-400 hover:text-green-400 p-1 rounded"
                  title="Good response"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  className="text-gray-400 hover:text-red-400 p-1 rounded"
                  title="Poor response"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
              <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            </div>
          )}
          
          {/* User message timestamp */}
          {isUser && (
            <div className="text-xs text-blue-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;