'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisResult {
  success: boolean;
  analysis: string;
  fileName: string;
  fileType: string;
}

export default function DocumentAnalyzer() {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const translations = {
    en: {
      title: 'AI Document Analyzer',
      subtitle: 'Upload your plans, blueprints, or project images for instant analysis',
      dropzone: 'Drag & drop your file here, or click to browse',
      supported: 'Supported: PDF, Images (JPG, PNG)',
      analyzing: 'Analyzing your document with AI...',
      uploadNew: 'Upload Another File',
      analysis: 'Analysis Results',
      getQuote: 'Get a Quote Based on This Analysis',
      error: 'Error analyzing file. Please try again.',
      maxSize: 'Maximum file size: 10MB',
    },
    es: {
      title: 'Analizador de Documentos con IA',
      subtitle: 'Sube tus planos, blueprints o imágenes del proyecto para análisis instantáneo',
      dropzone: 'Arrastra tu archivo aquí, o haz clic para buscar',
      supported: 'Soportados: PDF, Imágenes (JPG, PNG)',
      analyzing: 'Analizando tu documento con IA...',
      uploadNew: 'Subir Otro Archivo',
      analysis: 'Resultados del Análisis',
      getQuote: 'Solicitar Cotización Basada en Este Análisis',
      error: 'Error al analizar el archivo. Por favor intente de nuevo.',
      maxSize: 'Tamaño máximo: 10MB',
    },
  };

  const t = translations[language as 'en' | 'es'] || translations['en'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    // Validate file
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF or image.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
    setResult(null);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', 'blueprint');
      formData.append('language', language);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || t.error);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(t.error);
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#003366]/10 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-[#00A651]" />
          <span className="text-[#003366] font-semibold">AI Powered</span>
        </div>
        <h2 className="text-3xl font-bold text-[#003366] mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Upload Zone */}
      {!file && !result && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-[#00A651] bg-[#00A651]/5'
              : 'border-gray-300 hover:border-[#003366] hover:bg-gray-50'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#003366]" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">{t.dropzone}</p>
              <p className="text-sm text-gray-500 mt-1">{t.supported}</p>
              <p className="text-xs text-gray-400 mt-1">{t.maxSize}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing State */}
      {analyzing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#003366] to-[#00A651] flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Loader2 className="w-5 h-5 text-[#00A651] animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-[#003366]">{t.analyzing}</p>
              <p className="text-sm text-gray-500 mt-1">{file?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700">{error}</p>
          <Button onClick={reset} variant="outline" className="mt-4">
            {t.uploadNew}
          </Button>
        </div>
      )}

      {/* Results */}
      {result && !analyzing && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* File Info */}
          <div className="bg-[#003366] text-white p-4 flex items-center gap-3">
            {result.fileType.startsWith('image/') ? (
              <Image className="w-6 h-6" />
            ) : (
              <FileText className="w-6 h-6" />
            )}
            <div>
              <p className="font-medium">{result.fileName}</p>
              <p className="text-sm opacity-75">{t.analysis}</p>
            </div>
            <CheckCircle className="w-6 h-6 ml-auto text-[#00A651]" />
          </div>

          {/* Analysis Content */}
          <div className="p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {result.analysis}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-4 flex gap-3">
            <Button onClick={reset} variant="outline" className="flex-1">
              {t.uploadNew}
            </Button>
            <Button
              onClick={() => window.location.href = '/quote'}
              className="flex-1 bg-[#00A651] hover:bg-[#008c44]"
            >
              {t.getQuote}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
