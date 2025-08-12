import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = [
    '.exe', '.dll', '.bin', '.elf', '.apk', '.ipa', '.so', '.dylib',
    '.img', '.zip', '.tar', '.gz', '.firmware'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upload Binary File</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-500 bg-opacity-10'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          
          {selectedFile ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <File size={20} />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <p className="text-sm text-gray-400">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white font-medium">Drop your binary file here</p>
              <p className="text-sm text-gray-400">or click to browse</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-start space-x-2 text-xs text-gray-400 mb-4">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Supported formats:</p>
              <p>Executables (.exe, .elf), Libraries (.dll, .so, .dylib), Mobile apps (.apk, .ipa), Firmware images, Archives (.zip, .tar, .gz)</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Start Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;