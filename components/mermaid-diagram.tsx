'use client';

import { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const uniqueId = useId();
  const renderIdRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#003366',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#003366',
        lineColor: '#003366',
        secondaryColor: '#E3F2FD',
        tertiaryColor: '#F5F5F5',
        fontFamily: 'Open Sans, sans-serif',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 15,
        nodeSpacing: 50,
        rankSpacing: 50,
      },
      securityLevel: 'loose',
    });

    const renderDiagram = async () => {
      try {
        renderIdRef.current += 1;
        const id = `mermaid-${uniqueId.replace(/:/g, '')}-${renderIdRef.current}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
        setError('');
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Error rendering diagram');
      }
    };

    renderDiagram();
  }, [chart, isMounted, uniqueId]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
