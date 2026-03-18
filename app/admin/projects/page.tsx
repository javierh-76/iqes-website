'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Plus, Pencil, Trash2, Save, X, Image as ImageIcon, 
  Check, AlertCircle, Upload, Eye, EyeOff, Star, Loader2,
  Camera, MapPin, Calendar, User
} from 'lucide-react';
import { COLORS } from '@/lib/constants';

interface Project {
  id: string;
  title: string;
  titleEs?: string;
  description: string;
  descriptionEs?: string;
  serviceType: string;
  location: string;
  featured: boolean;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  completedDate?: string;
  clientTestimonial?: string;
  clientTestimonialEs?: string;
  clientName?: string;
  published: boolean;
}

const serviceTypes = [
  { value: 'fiber', label: 'Fiber Optic', labelEs: 'Fibra Óptica' },
  { value: 'cctv', label: 'CCTV/Security', labelEs: 'CCTV/Seguridad' },
  { value: 'access', label: 'Access Control', labelEs: 'Control de Acceso' },
  { value: 'cabling', label: 'Structured Cabling', labelEs: 'Cableado Estructurado' },
  { value: 'wifi', label: 'Networking/WiFi', labelEs: 'Redes/WiFi' },
];

export default function AdminProjectsPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const emptyProject: Project = {
    id: '',
    title: '',
    titleEs: '',
    description: '',
    descriptionEs: '',
    serviceType: 'fiber',
    location: '',
    featured: false,
    images: [],
    beforeImage: '',
    afterImage: '',
    completedDate: new Date().toISOString().split('T')[0],
    clientTestimonial: '',
    clientTestimonialEs: '',
    clientName: '',
    published: true,
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      // Get presigned URL
      const presignedRes = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: true,
        }),
      });

      if (!presignedRes.ok) throw new Error('Failed to get upload URL');
      const { uploadUrl, cloud_storage_path, publicUrl } = await presignedRes.json();

      // Check if Content-Disposition is in signed headers
      const signedHeaders = new URL(uploadUrl).searchParams.get('X-Amz-SignedHeaders') || '';
      const needsContentDisposition = signedHeaders.includes('content-disposition');

      // Upload to S3
      const headers: Record<string, string> = {
        'Content-Type': file.type,
      };
      if (needsContentDisposition) {
        headers['Content-Disposition'] = 'attachment';
      }

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload file');

      return publicUrl || `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.amazonaws.com/${cloud_storage_path}`;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'before' | 'after') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }

    if (type === 'gallery') {
      setEditingProject({
        ...editingProject,
        images: [...editingProject.images, ...uploadedUrls],
      });
    } else if (type === 'before' && uploadedUrls[0]) {
      setEditingProject({ ...editingProject, beforeImage: uploadedUrls[0] });
    } else if (type === 'after' && uploadedUrls[0]) {
      setEditingProject({ ...editingProject, afterImage: uploadedUrls[0] });
    }

    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    if (!editingProject) return;
    const newImages = [...editingProject.images];
    newImages.splice(index, 1);
    setEditingProject({ ...editingProject, images: newImages });
  };

  const saveProject = async () => {
    if (!editingProject) return;
    setSaving(true);

    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: isNew ? 'Proyecto creado exitosamente' : 'Proyecto actualizado exitosamente' });
        setEditingProject(null);
        setIsCreating(false);
        fetchProjects();
      } else {
        setMessage({ type: 'error', text: 'Error al guardar el proyecto' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este proyecto?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Proyecto eliminado' });
        fetchProjects();
      } else {
        setMessage({ type: 'error', text: 'Error al eliminar' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 shadow-md" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Camera className="w-6 h-6" style={{ color: COLORS.orange }} />
              Gestión de Proyectos
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/prices')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-white/10 hover:bg-white/20 text-white"
            >
              💰 Precios
            </button>
            <button
              onClick={() => {
                setEditingProject({ ...emptyProject });
                setIsCreating(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
              style={{ backgroundColor: COLORS.orange }}
            >
              <Plus className="w-5 h-5" /> Nuevo Proyecto
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gray-200">
                {project.images[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" /> Destacado
                  </div>
                )}
                {!project.published && (
                  <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Oculto
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {project.images.length} fotos
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{project.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${COLORS.orange}20`, color: COLORS.orange }}>
                    {serviceTypes.find(s => s.value === project.serviceType)?.label || project.serviceType}
                  </span>
                  {project.completedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.completedDate).toLocaleDateString('en-US')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setIsCreating(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No hay proyectos. ¡Crea el primero!</p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-gray-800">
                  {isCreating ? 'Nuevo Proyecto' : 'Editar Proyecto'}
                </h2>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título (Inglés) *</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Project Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título (Español)</label>
                    <input
                      type="text"
                      value={editingProject.titleEs || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, titleEs: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Título del Proyecto"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio *</label>
                    <select
                      value={editingProject.serviceType}
                      onChange={(e) => setEditingProject({ ...editingProject, serviceType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {serviceTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label} / {type.labelEs}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Miami, FL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Finalización</label>
                    <input
                      type="date"
                      value={editingProject.completedDate?.split('T')[0] || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, completedDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Inglés) *</label>
                    <textarea
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Project description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Español)</label>
                    <textarea
                      value={editingProject.descriptionEs || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, descriptionEs: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Descripción del proyecto..."
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" style={{ color: COLORS.orange }} />
                    Galería de Fotos
                  </h3>
                  
                  {/* Gallery Images */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {editingProject.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                          src={img}
                          alt={`Foto ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {idx === 0 && (
                          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                            Principal
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Photo Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Agregar Fotos</span>
                        </>
                      )}
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    className="hidden"
                  />

                  {/* Before/After Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foto Antes</label>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        {editingProject.beforeImage ? (
                          <>
                            <Image
                              src={editingProject.beforeImage}
                              alt="Before"
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => setEditingProject({ ...editingProject, beforeImage: '' })}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => beforeInputRef.current?.click()}
                            className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Subir foto "Antes"</span>
                          </button>
                        )}
                      </div>
                      <input
                        ref={beforeInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'before')}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foto Después</label>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        {editingProject.afterImage ? (
                          <>
                            <Image
                              src={editingProject.afterImage}
                              alt="After"
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => setEditingProject({ ...editingProject, afterImage: '' })}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => afterInputRef.current?.click()}
                            className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">Subir foto "Después"</span>
                          </button>
                        )}
                      </div>
                      <input
                        ref={afterInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'after')}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Testimonial */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" style={{ color: COLORS.orange }} />
                    Testimonio del Cliente
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente</label>
                    <input
                      type="text"
                      value={editingProject.clientName || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Testimonio (Inglés)</label>
                      <textarea
                        value={editingProject.clientTestimonial || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, clientTestimonial: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Great work..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Testimonio (Español)</label>
                      <textarea
                        value={editingProject.clientTestimonialEs || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, clientTestimonialEs: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Excelente trabajo..."
                      />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="border-t pt-6">
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProject.featured}
                        onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" /> Proyecto Destacado
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProject.published}
                        onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-500" /> Publicado (Visible en web)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 rounded-b-2xl flex justify-end gap-3">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveProject}
                  disabled={saving || !editingProject.title || !editingProject.description || !editingProject.location}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: COLORS.orange }}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {isCreating ? 'Crear Proyecto' : 'Guardar Cambios'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
