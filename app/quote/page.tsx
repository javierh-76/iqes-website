'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS, CONTACT_METHODS, MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Checkbox Field Component - OUTSIDE main component to prevent re-creation
const CheckboxField = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange} 
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// Number Field Component - OUTSIDE main component to prevent re-creation on each render
const NumberField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  unit 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder?: string; 
  unit?: string;
}) => {
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="border-2 border-gray-200 rounded-xl p-3 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30"
      onClick={handleContainerClick}
    >
      <label className="text-xs font-medium text-gray-600 block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder || '0'}
          className="w-full bg-transparent border-0 p-0 text-base font-medium focus:ring-0 focus:outline-none placeholder:text-gray-400"
          autoComplete="off"
        />
        {unit && <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{unit}</span>}
      </div>
    </div>
  );
};

// Service definitions with sub-options
const serviceDefinitions = {
  fiber: {
    id: 'fiber',
    label: { en: 'Fiber Optic Installation & Splicing', es: 'Instalación y Fusión de Fibra Óptica' },
    color: '#3B82F6',
  },
  cctv: {
    id: 'cctv',
    label: { en: 'CCTV Systems', es: 'Sistemas CCTV' },
    color: '#EF4444',
  },
  cabling: {
    id: 'cabling',
    label: { en: 'Structured Cabling', es: 'Cableado Estructurado' },
    color: '#10B981',
  },
  access: {
    id: 'access',
    label: { en: 'Access Control', es: 'Control de Acceso' },
    color: '#F59E0B',
  },
  networking: {
    id: 'networking',
    label: { en: 'Networking Solutions', es: 'Soluciones de Red' },
    color: '#8B5CF6',
  },
};

export default function QuotePage() {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceType: [] as string[],
    projectDetails: '',
    serviceArea: '',
    budgetEstimate: '',
    preferredContact: 'email',
  });

  // Service-specific details
  const [serviceDetails, setServiceDetails] = useState({
    fiber: {
      includeLabor: false,
      includeMaterials: false,
      fiberType: '', // singlemode, multimode
      strandCount: '',
      terminationType: [] as string[], // LC, FC, SC
      splicingQty: '',
      mechanicalConnectors: '',
      fiberLength: '',
      odfType: '',
    },
    cctv: {
      includeLabor: false,
      includeMaterials: false,
      nvrChannels: '',
      hddCapacity: '',
      analogCameras: '',
      ipCameras: '',
      resolution: '',
      workHeight: '',
      location: '', // interior, exterior, both
      cableType: '', // cat5, cat6, cat7
      conduitType: '', // pvc, emt, none
      needsConfig: false,
    },
    cabling: {
      includeLabor: false,
      includeMaterials: false,
      cat6Points: '',
      cat6aPoints: '',
      cat7Points: '',
      rackSize: '',
      rackUnits: '',
      pathway: '', // cablofil, emt, pvc
      projectType: '', // residential, commercial
      constructionType: '', // new, renovation
      needsUPS: false,
    },
    access: {
      includeLabor: false,
      includeMaterials: false,
      doorType: '',
      doorCount: '',
      cardReaders: '',
      magLocks: '',
      electricStrikes: '',
      doorSensors: '',
      exitButtons: '',
      doorContacts: '',
      needsConfig: false,
    },
    networking: {
      includeLabor: false,
      includeDevices: false,
      serviceType: [] as string[], // installation, design, config
      switchCount: '',
      switchPorts: '',
      firewallCount: '',
      routerCount: '',
      accessPoints: '',
      servers: '',
      computers: '',
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(serviceId)
        ? prev.serviceType.filter((t) => t !== serviceId)
        : [...prev.serviceType, serviceId],
    }));
    
    // Auto-expand when selected
    if (!formData.serviceType.includes(serviceId)) {
      setExpandedServices((prev) => [...prev, serviceId]);
    }
  };

  const toggleExpand = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const updateServiceDetail = (service: string, field: string, value: any) => {
    setServiceDetails((prev) => ({
      ...prev,
      [service]: { ...prev[service as keyof typeof prev], [field]: value },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isValidType = ACCEPTED_FILE_TYPES.some(type => 
        file.type.includes(type.split('/')[1]) || file.name.endsWith('.kmz') || file.name.endsWith('.dwg')
      );
      const isValidSize = file.size <= MAX_FILE_SIZE;
      return isValidType && isValidSize;
    });
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const response = await fetch('/api/upload/presigned', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, contentType: file.type, isPublic: false }),
    });
    if (!response.ok) throw new Error('Failed to get upload URL');
    const { uploadUrl, cloud_storage_path } = await response.json();
    const urlObj = new URL(uploadUrl);
    const signedHeaders = urlObj.searchParams.get('X-Amz-SignedHeaders');
    const needsContentDisposition = signedHeaders?.includes('content-disposition');
    const uploadHeaders: HeadersInit = { 'Content-Type': file.type };
    if (needsContentDisposition) uploadHeaders['Content-Disposition'] = 'attachment';
    const uploadResponse = await fetch(uploadUrl, { method: 'PUT', headers: uploadHeaders, body: file });
    if (!uploadResponse.ok) throw new Error('Failed to upload file');
    return cloud_storage_path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const paths: string[] = [];
      for (const file of files) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
        const path = await uploadFile(file);
        paths.push(path);
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      }

      // Build project details with service specifics
      let detailedDescription = formData.projectDetails + '\n\n--- SERVICE DETAILS ---\n';
      formData.serviceType.forEach((svc) => {
        const details = serviceDetails[svc as keyof typeof serviceDetails];
        detailedDescription += `\n[${serviceDefinitions[svc as keyof typeof serviceDefinitions].label.en}]\n`;
        Object.entries(details).forEach(([key, val]) => {
          if (val && (typeof val !== 'object' || (Array.isArray(val) && val.length > 0))) {
            detailedDescription += `  ${key}: ${Array.isArray(val) ? val.join(', ') : val}\n`;
          }
        });
      });

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectDetails: detailedDescription,
          attachments: paths,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit');
      }
      setSuccess(true);
      setTimeout(() => router.push('/'), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <CheckCircle className="h-20 w-20 mx-auto mb-4" style={{ color: COLORS.accent }} />
          <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {isEs ? '¡Solicitud enviada!' : 'Quote request submitted!'}
          </h2>
          <p style={{ color: COLORS.text.secondary }}>
            {isEs ? 'Responderemos en 24 horas.' : "We'll respond within 24 hours."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: `linear-gradient(135deg, ${COLORS.primary}08 0%, ${COLORS.accent}05 100%)` }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>
            {isEs ? 'Solicitar Cotización' : 'Request a Quote'}
          </h1>
          <p className="text-lg" style={{ color: COLORS.text.secondary }}>
            {isEs ? 'Complete el formulario con los detalles de su proyecto' : 'Fill out the form with your project details'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.orange }}>1</div>
              {isEs ? 'Información de Contacto' : 'Contact Information'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Nombre' : 'First Name'} *</Label>
                <Input 
                  required 
                  value={formData.firstName} 
                  onChange={(e) => handleChange('firstName', e.target.value)} 
                  className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  placeholder={isEs ? 'Ingrese su nombre' : 'Enter your first name'}
                />
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Apellido' : 'Last Name'} *</Label>
                <Input 
                  required 
                  value={formData.lastName} 
                  onChange={(e) => handleChange('lastName', e.target.value)} 
                  className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  placeholder={isEs ? 'Ingrese su apellido' : 'Enter your last name'}
                />
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Correo Electrónico' : 'Email'} *</Label>
                <Input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={(e) => handleChange('email', e.target.value)} 
                  className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  placeholder={isEs ? 'correo@ejemplo.com' : 'email@example.com'}
                />
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Teléfono' : 'Phone'} *</Label>
                <Input 
                  type="tel" 
                  required 
                  value={formData.phone} 
                  onChange={(e) => handleChange('phone', e.target.value)} 
                  className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  placeholder={isEs ? '(555) 123-4567' : '(555) 123-4567'}
                />
              </div>
              <div className="md:col-span-2 border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Nombre de Empresa (Opcional)' : 'Company Name (Optional)'}</Label>
                <Input 
                  value={formData.companyName} 
                  onChange={(e) => handleChange('companyName', e.target.value)} 
                  className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
                  placeholder={isEs ? 'Nombre de su empresa' : 'Your company name'}
                />
              </div>
            </div>
          </div>

          {/* Services Selection Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.orange }}>2</div>
              {isEs ? 'Seleccione los Servicios' : 'Select Services'} *
            </h2>
            
            <div className="space-y-3">
              {Object.values(serviceDefinitions).map((service) => {
                const isSelected = formData.serviceType.includes(service.id);
                const isExpanded = expandedServices.includes(service.id);
                
                return (
                  <div key={service.id} className={`border-2 rounded-xl overflow-hidden transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'}`}>
                    {/* Service Header */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium text-gray-800">{service.label[isEs ? 'es' : 'en']}</span>
                      </div>
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleExpand(service.id); }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      )}
                    </div>

                    {/* Service Details (Expandable) */}
                    <AnimatePresence>
                      {isSelected && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white">
                            {/* Fiber Optic Options */}
                            {service.id === 'fiber' && (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                  <CheckboxField label={isEs ? 'Incluir Mano de Obra' : 'Include Labor'} checked={serviceDetails.fiber.includeLabor} onChange={() => updateServiceDetail('fiber', 'includeLabor', !serviceDetails.fiber.includeLabor)} />
                                  <CheckboxField label={isEs ? 'Incluir Materiales' : 'Include Materials'} checked={serviceDetails.fiber.includeMaterials} onChange={() => updateServiceDetail('fiber', 'includeMaterials', !serviceDetails.fiber.includeMaterials)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">{isEs ? 'Tipo de Fibra' : 'Fiber Type'}</label>
                                    <div className="flex gap-2">
                                      <CheckboxField label="Single Mode" checked={serviceDetails.fiber.fiberType === 'singlemode'} onChange={() => updateServiceDetail('fiber', 'fiberType', 'singlemode')} />
                                      <CheckboxField label="Multi Mode" checked={serviceDetails.fiber.fiberType === 'multimode'} onChange={() => updateServiceDetail('fiber', 'fiberType', 'multimode')} />
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <NumberField label={isEs ? '# de Hilos' : 'Strand Count'} value={serviceDetails.fiber.strandCount} onChange={(v) => updateServiceDetail('fiber', 'strandCount', v)} />
                                  <NumberField label={isEs ? 'Cantidad Splicing' : 'Splicing Qty'} value={serviceDetails.fiber.splicingQty} onChange={(v) => updateServiceDetail('fiber', 'splicingQty', v)} />
                                  <NumberField label={isEs ? 'Conectores Mecánicos' : 'Mechanical Connectors'} value={serviceDetails.fiber.mechanicalConnectors} onChange={(v) => updateServiceDetail('fiber', 'mechanicalConnectors', v)} />
                                  <NumberField label={isEs ? 'Longitud de Fibra' : 'Fiber Length'} value={serviceDetails.fiber.fiberLength} onChange={(v) => updateServiceDetail('fiber', 'fiberLength', v)} unit="ft" />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Tipo de Terminación' : 'Termination Type'}</label>
                                  <div className="flex flex-wrap gap-3">
                                    {['LC', 'FC', 'SC', 'ST'].map((type) => (
                                      <CheckboxField
                                        key={type}
                                        label={type}
                                        checked={serviceDetails.fiber.terminationType.includes(type)}
                                        onChange={() => {
                                          const current = serviceDetails.fiber.terminationType;
                                          updateServiceDetail('fiber', 'terminationType', current.includes(type) ? current.filter((t) => t !== type) : [...current, type]);
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <NumberField label={isEs ? 'Tipo/Cantidad ODF' : 'ODF Type/Qty'} value={serviceDetails.fiber.odfType} onChange={(v) => updateServiceDetail('fiber', 'odfType', v)} />
                              </div>
                            )}

                            {/* CCTV Options */}
                            {service.id === 'cctv' && (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                  <CheckboxField label={isEs ? 'Incluir Mano de Obra' : 'Include Labor'} checked={serviceDetails.cctv.includeLabor} onChange={() => updateServiceDetail('cctv', 'includeLabor', !serviceDetails.cctv.includeLabor)} />
                                  <CheckboxField label={isEs ? 'Incluir Materiales' : 'Include Materials'} checked={serviceDetails.cctv.includeMaterials} onChange={() => updateServiceDetail('cctv', 'includeMaterials', !serviceDetails.cctv.includeMaterials)} />
                                  <CheckboxField label={isEs ? 'Necesita Configuración' : 'Needs Configuration'} checked={serviceDetails.cctv.needsConfig} onChange={() => updateServiceDetail('cctv', 'needsConfig', !serviceDetails.cctv.needsConfig)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <NumberField label={isEs ? 'Canales NVR' : 'NVR Channels'} value={serviceDetails.cctv.nvrChannels} onChange={(v) => updateServiceDetail('cctv', 'nvrChannels', v)} />
                                  <NumberField label={isEs ? 'Capacidad Disco' : 'HDD Capacity'} value={serviceDetails.cctv.hddCapacity} onChange={(v) => updateServiceDetail('cctv', 'hddCapacity', v)} unit="TB" />
                                  <NumberField label={isEs ? 'Cámaras Análogas' : 'Analog Cameras'} value={serviceDetails.cctv.analogCameras} onChange={(v) => updateServiceDetail('cctv', 'analogCameras', v)} />
                                  <NumberField label={isEs ? 'Cámaras IP' : 'IP Cameras'} value={serviceDetails.cctv.ipCameras} onChange={(v) => updateServiceDetail('cctv', 'ipCameras', v)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <NumberField label={isEs ? 'Resolución' : 'Resolution'} value={serviceDetails.cctv.resolution} onChange={(v) => updateServiceDetail('cctv', 'resolution', v)} placeholder="4K, 2K, 1080p" />
                                  <NumberField label={isEs ? 'Altura de Trabajo' : 'Work Height'} value={serviceDetails.cctv.workHeight} onChange={(v) => updateServiceDetail('cctv', 'workHeight', v)} unit="ft" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Ubicación' : 'Location'}</label>
                                    <div className="flex flex-wrap gap-2">
                                      {[{ v: 'interior', l: 'Interior' }, { v: 'exterior', l: 'Exterior' }, { v: 'both', l: isEs ? 'Ambos' : 'Both' }].map((opt) => (
                                        <CheckboxField key={opt.v} label={opt.l} checked={serviceDetails.cctv.location === opt.v} onChange={() => updateServiceDetail('cctv', 'location', opt.v)} />
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Tipo de Cable' : 'Cable Type'}</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Cat5e', 'Cat6', 'Cat6A'].map((type) => (
                                        <CheckboxField key={type} label={type} checked={serviceDetails.cctv.cableType === type.toLowerCase()} onChange={() => updateServiceDetail('cctv', 'cableType', type.toLowerCase())} />
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Tubería' : 'Conduit'}</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['PVC', 'EMT', isEs ? 'Ninguno' : 'None'].map((type) => (
                                        <CheckboxField key={type} label={type} checked={serviceDetails.cctv.conduitType === type.toLowerCase()} onChange={() => updateServiceDetail('cctv', 'conduitType', type.toLowerCase())} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Structured Cabling Options */}
                            {service.id === 'cabling' && (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                  <CheckboxField label={isEs ? 'Incluir Mano de Obra' : 'Include Labor'} checked={serviceDetails.cabling.includeLabor} onChange={() => updateServiceDetail('cabling', 'includeLabor', !serviceDetails.cabling.includeLabor)} />
                                  <CheckboxField label={isEs ? 'Incluir Materiales' : 'Include Materials'} checked={serviceDetails.cabling.includeMaterials} onChange={() => updateServiceDetail('cabling', 'includeMaterials', !serviceDetails.cabling.includeMaterials)} />
                                  <CheckboxField label={isEs ? 'Necesita UPS' : 'Needs UPS'} checked={serviceDetails.cabling.needsUPS} onChange={() => updateServiceDetail('cabling', 'needsUPS', !serviceDetails.cabling.needsUPS)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <NumberField label={isEs ? 'Puntos Cat6' : 'Cat6 Points'} value={serviceDetails.cabling.cat6Points} onChange={(v) => updateServiceDetail('cabling', 'cat6Points', v)} />
                                  <NumberField label={isEs ? 'Puntos Cat6A' : 'Cat6A Points'} value={serviceDetails.cabling.cat6aPoints} onChange={(v) => updateServiceDetail('cabling', 'cat6aPoints', v)} />
                                  <NumberField label={isEs ? 'Puntos Cat7' : 'Cat7 Points'} value={serviceDetails.cabling.cat7Points} onChange={(v) => updateServiceDetail('cabling', 'cat7Points', v)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <NumberField label={isEs ? 'Tamaño Rack' : 'Rack Size'} value={serviceDetails.cabling.rackSize} onChange={(v) => updateServiceDetail('cabling', 'rackSize', v)} placeholder="42U, 24U..." />
                                  <NumberField label={isEs ? 'Unidades de Rack' : 'Rack Units'} value={serviceDetails.cabling.rackUnits} onChange={(v) => updateServiceDetail('cabling', 'rackUnits', v)} unit="RU" />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Canalización' : 'Pathway'}</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Cablofil', 'EMT', 'PVC'].map((type) => (
                                        <CheckboxField key={type} label={type} checked={serviceDetails.cabling.pathway === type.toLowerCase()} onChange={() => updateServiceDetail('cabling', 'pathway', type.toLowerCase())} />
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Tipo de Proyecto' : 'Project Type'}</label>
                                    <div className="flex flex-wrap gap-2">
                                      {[{ v: 'residential', l: isEs ? 'Residencial' : 'Residential' }, { v: 'commercial', l: isEs ? 'Comercial' : 'Commercial' }].map((opt) => (
                                        <CheckboxField key={opt.v} label={opt.l} checked={serviceDetails.cabling.projectType === opt.v} onChange={() => updateServiceDetail('cabling', 'projectType', opt.v)} />
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Construcción' : 'Construction'}</label>
                                    <div className="flex flex-wrap gap-2">
                                      {[{ v: 'new', l: isEs ? 'Nueva' : 'New' }, { v: 'renovation', l: isEs ? 'Remodelación' : 'Renovation' }].map((opt) => (
                                        <CheckboxField key={opt.v} label={opt.l} checked={serviceDetails.cabling.constructionType === opt.v} onChange={() => updateServiceDetail('cabling', 'constructionType', opt.v)} />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Access Control Options */}
                            {service.id === 'access' && (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                  <CheckboxField label={isEs ? 'Incluir Mano de Obra' : 'Include Labor'} checked={serviceDetails.access.includeLabor} onChange={() => updateServiceDetail('access', 'includeLabor', !serviceDetails.access.includeLabor)} />
                                  <CheckboxField label={isEs ? 'Incluir Materiales' : 'Include Materials'} checked={serviceDetails.access.includeMaterials} onChange={() => updateServiceDetail('access', 'includeMaterials', !serviceDetails.access.includeMaterials)} />
                                  <CheckboxField label={isEs ? 'Necesita Configuración' : 'Needs Configuration'} checked={serviceDetails.access.needsConfig} onChange={() => updateServiceDetail('access', 'needsConfig', !serviceDetails.access.needsConfig)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <NumberField label={isEs ? 'Tipo de Puerta' : 'Door Type'} value={serviceDetails.access.doorType} onChange={(v) => updateServiceDetail('access', 'doorType', v)} placeholder={isEs ? 'Vidrio, Metal...' : 'Glass, Metal...'} />
                                  <NumberField label={isEs ? 'Cantidad de Puertas' : 'Door Count'} value={serviceDetails.access.doorCount} onChange={(v) => updateServiceDetail('access', 'doorCount', v)} />
                                  <NumberField label={isEs ? 'Lectores de Tarjeta' : 'Card Readers'} value={serviceDetails.access.cardReaders} onChange={(v) => updateServiceDetail('access', 'cardReaders', v)} />
                                  <NumberField label={isEs ? 'Electroimanes' : 'Mag Locks'} value={serviceDetails.access.magLocks} onChange={(v) => updateServiceDetail('access', 'magLocks', v)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <NumberField label={isEs ? 'Electro Chapas' : 'Electric Strikes'} value={serviceDetails.access.electricStrikes} onChange={(v) => updateServiceDetail('access', 'electricStrikes', v)} />
                                  <NumberField label={isEs ? 'Sensores de Apertura' : 'Door Sensors'} value={serviceDetails.access.doorSensors} onChange={(v) => updateServiceDetail('access', 'doorSensors', v)} />
                                  <NumberField label={isEs ? 'Botones de Salida' : 'Exit Buttons'} value={serviceDetails.access.exitButtons} onChange={(v) => updateServiceDetail('access', 'exitButtons', v)} />
                                  <NumberField label={isEs ? 'Contactos de Puerta' : 'Door Contacts'} value={serviceDetails.access.doorContacts} onChange={(v) => updateServiceDetail('access', 'doorContacts', v)} />
                                </div>
                              </div>
                            )}

                            {/* Networking Options */}
                            {service.id === 'networking' && (
                              <div className="space-y-4">
                                <div className="flex flex-wrap gap-4">
                                  <CheckboxField label={isEs ? 'Incluir Mano de Obra' : 'Include Labor'} checked={serviceDetails.networking.includeLabor} onChange={() => updateServiceDetail('networking', 'includeLabor', !serviceDetails.networking.includeLabor)} />
                                  <CheckboxField label={isEs ? 'Incluir Dispositivos' : 'Include Devices'} checked={serviceDetails.networking.includeDevices} onChange={() => updateServiceDetail('networking', 'includeDevices', !serviceDetails.networking.includeDevices)} />
                                </div>
                                <div>
                                  <label className="text-xs font-medium text-gray-600 mb-2 block">{isEs ? 'Tipo de Servicio' : 'Service Type'}</label>
                                  <div className="flex flex-wrap gap-3">
                                    {[
                                      { v: 'installation', l: isEs ? 'Instalación' : 'Installation' },
                                      { v: 'design', l: isEs ? 'Diseño de Red' : 'Network Design' },
                                      { v: 'config', l: isEs ? 'Configuración' : 'Configuration' },
                                    ].map((opt) => (
                                      <CheckboxField
                                        key={opt.v}
                                        label={opt.l}
                                        checked={serviceDetails.networking.serviceType.includes(opt.v)}
                                        onChange={() => {
                                          const current = serviceDetails.networking.serviceType;
                                          updateServiceDetail('networking', 'serviceType', current.includes(opt.v) ? current.filter((t) => t !== opt.v) : [...current, opt.v]);
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <NumberField label={isEs ? 'Cantidad Switches' : 'Switch Count'} value={serviceDetails.networking.switchCount} onChange={(v) => updateServiceDetail('networking', 'switchCount', v)} />
                                  <NumberField label={isEs ? 'Puertos por Switch' : 'Ports per Switch'} value={serviceDetails.networking.switchPorts} onChange={(v) => updateServiceDetail('networking', 'switchPorts', v)} />
                                  <NumberField label="Firewalls" value={serviceDetails.networking.firewallCount} onChange={(v) => updateServiceDetail('networking', 'firewallCount', v)} />
                                  <NumberField label="Routers" value={serviceDetails.networking.routerCount} onChange={(v) => updateServiceDetail('networking', 'routerCount', v)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <NumberField label={isEs ? 'Access Points (AP)' : 'Access Points (AP)'} value={serviceDetails.networking.accessPoints} onChange={(v) => updateServiceDetail('networking', 'accessPoints', v)} />
                                  <NumberField label={isEs ? 'Servidores' : 'Servers'} value={serviceDetails.networking.servers} onChange={(v) => updateServiceDetail('networking', 'servers', v)} />
                                  <NumberField label={isEs ? 'Computadores' : 'Computers'} value={serviceDetails.networking.computers} onChange={(v) => updateServiceDetail('networking', 'computers', v)} />
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.orange }}>3</div>
              {isEs ? 'Detalles del Proyecto' : 'Project Details'}
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Descripción del Proyecto' : 'Project Description'} *</Label>
                <Textarea
                  required
                  rows={4}
                  value={formData.projectDetails}
                  onChange={(e) => handleChange('projectDetails', e.target.value)}
                  placeholder={isEs ? 'Describa los requisitos de su proyecto...' : 'Describe your project requirements...'}
                  className="mt-1 border-0 bg-transparent p-0 text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                  <Label className="text-xs font-medium text-gray-600">{isEs ? 'Ciudad / Área de Servicio' : 'City / Service Area'} *</Label>
                  <Input
                    required
                    value={formData.serviceArea}
                    onChange={(e) => handleChange('serviceArea', e.target.value)}
                    placeholder={isEs ? 'Escriba la ciudad o área' : 'Enter city or area'}
                    className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                  <Label className="text-xs font-medium text-gray-600">{isEs ? 'Presupuesto Estimado' : 'Estimated Budget'}</Label>
                  <Input
                    value={formData.budgetEstimate}
                    onChange={(e) => handleChange('budgetEstimate', e.target.value)}
                    placeholder={isEs ? 'Ej: $5,000 - $10,000' : 'Ex: $5,000 - $10,000'}
                    className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-xl p-4 transition-all hover:border-blue-300 focus-within:border-blue-500 focus-within:bg-blue-50/30">
                <Label className="text-xs font-medium text-gray-600">{isEs ? 'Método de Contacto Preferido' : 'Preferred Contact Method'}</Label>
                <Select value={formData.preferredContact} onValueChange={(value) => handleChange('preferredContact', value)}>
                  <SelectTrigger className="mt-1 border-0 bg-transparent p-0 h-auto text-base font-medium focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.orange }}>4</div>
              {isEs ? 'Archivos Adjuntos' : 'Attachments'}
            </h2>
            
            <label
              htmlFor="files"
              className="flex items-center justify-center px-4 py-10 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: COLORS.accent }}
            >
              <div className="text-center">
                <Upload className="h-10 w-10 mx-auto mb-3" style={{ color: COLORS.accent }} />
                <p className="font-medium" style={{ color: COLORS.primary }}>
                  {isEs ? 'Haga clic para subir archivos' : 'Click to upload files'}
                </p>
                <p className="text-sm mt-1" style={{ color: COLORS.text.secondary }}>
                  PDF, Images, CAD, KMZ (max 100MB)
                </p>
              </div>
              <input id="files" type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.kmz,.dwg,.dxf" />
            </label>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm truncate">{file.name}</span>
                    {uploadProgress[file.name] !== undefined && <span className="text-sm text-green-600">{uploadProgress[file.name]}%</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {/* Payment Methods Section */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium mb-3 text-center" style={{ color: COLORS.text.secondary }}>
              {isEs ? 'Métodos de Pago Aceptados' : 'Accepted Payment Methods'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="h-8 w-auto relative">
                <img src="/payments/visa-logo.png" alt="Visa" className="h-8 w-auto object-contain" />
              </div>
              <div className="h-8 w-auto relative">
                <img src="/payments/mastercard-logo.png" alt="Mastercard" className="h-8 w-auto object-contain" />
              </div>
              <div className="h-6 w-auto relative">
                <img src="/payments/paypal-logo.png" alt="PayPal" className="h-6 w-auto object-contain" />
              </div>
              <div className="h-6 w-auto relative">
                <img src="/payments/zelle-logo.png" alt="Zelle" className="h-6 w-auto object-contain" />
              </div>
              <div className="h-5 w-auto relative">
                <img src="/payments/affirm-logo.png" alt="Affirm" className="h-5 w-auto object-contain" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || formData.serviceType.length === 0}
            className="w-full text-lg py-6 rounded-xl font-semibold"
            style={{ backgroundColor: COLORS.orange, color: COLORS.white }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isEs ? 'Enviando...' : 'Submitting...'}
              </>
            ) : (
              isEs ? 'Enviar Solicitud de Cotización' : 'Submit Quote Request'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
