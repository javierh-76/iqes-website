'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, X, DollarSign, Check, AlertCircle, Search, Globe, Loader2, Sparkles, Database, Package } from 'lucide-react';
import { COLORS } from '@/lib/constants';

interface PriceItem {
  id: string;
  category: string;
  name: string;
  nameEs: string | null;
  description: string | null;
  descriptionEs: string | null;
  unit: string;
  unitLabel: string;
  unitLabelEs: string | null;
  priceMin: number;
  priceMax: number;
  priceAvg: number | null;
  notes: string | null;
  sortOrder: number;
  isActive: boolean;
  showInChat: boolean;
  showInQuote: boolean;
}

const CATEGORIES = [
  { value: 'fiber', label: 'Fiber Optic', labelEs: 'Fibra Óptica', icon: '📡' },
  { value: 'cctv', label: 'CCTV/Security', labelEs: 'CCTV/Seguridad', icon: '📹' },
  { value: 'access', label: 'Access Control', labelEs: 'Control de Acceso', icon: '🔐' },
  { value: 'cabling', label: 'Structured Cabling', labelEs: 'Cableado Estructurado', icon: '🔌' },
  { value: 'wifi', label: 'Networking & WiFi', labelEs: 'Redes y WiFi', icon: '📶' },
];

const UNITS = [
  { value: 'per_camera', label: 'Per Camera' },
  { value: 'per_point', label: 'Per Point/Drop' },
  { value: 'per_door', label: 'Per Door' },
  { value: 'per_splice', label: 'Per Splice' },
  { value: 'per_connector', label: 'Per Connector' },
  { value: 'per_link', label: 'Per Link' },
  { value: 'per_foot', label: 'Per Linear Foot' },
  { value: 'per_run', label: 'Per Run' },
  { value: 'per_unit', label: 'Per Unit' },
  { value: 'per_sqft', label: 'Per Square Foot' },
  { value: 'flat', label: 'Flat Rate' },
];

export default function AdminPricesPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PriceItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PriceItem>>({
    category: 'fiber',
    name: '',
    nameEs: '',
    unit: 'per_unit',
    unitLabel: '',
    unitLabelEs: '',
    priceMin: 0,
    priceMax: 0,
    priceAvg: 0,
    sortOrder: 0,
    isActive: true,
    showInChat: true,
    showInQuote: true,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiSearching, setAiSearching] = useState(false);
  const [aiResults, setAiResults] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [savingItem, setSavingItem] = useState<string | null>(null);

  useEffect(() => {
    if (status && status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/admin/prices');
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (price: PriceItem) => {
    setEditingId(price.id);
    setEditForm({ ...price });
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/admin/prices/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Price updated successfully' });
        fetchPrices();
        setEditingId(null);
      } else {
        setMessage({ type: 'error', text: 'Failed to update price' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update price' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price item?')) return;
    try {
      const res = await fetch(`/api/admin/prices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Price deleted successfully' });
        fetchPrices();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete price' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete price' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Price added successfully' });
        fetchPrices();
        setIsAdding(false);
        setNewItem({
          category: 'fiber',
          name: '',
          nameEs: '',
          unit: 'per_unit',
          unitLabel: '',
          unitLabelEs: '',
          priceMin: 0,
          priceMax: 0,
          priceAvg: 0,
          sortOrder: 0,
          isActive: true,
          showInChat: true,
          showInQuote: true,
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to add price' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add price' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredPrices = prices.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchLower) ||
      (p.nameEs && p.nameEs.toLowerCase().includes(searchLower)) ||
      p.category.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower)) ||
      (p.unitLabel && p.unitLabel.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const searchWithAI = async () => {
    if (!searchQuery.trim()) return;
    setAiSearching(true);
    setAiResults(null);
    setAiSuggestions([]);
    setShowAiModal(true);
    
    try {
      const res = await fetch('/api/admin/prices/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setAiResults(data.result);
        setAiSuggestions(data.suggestions || []);
      } else {
        setAiResults('Error searching. Please try again.');
      }
    } catch (error) {
      setAiResults('Error connecting to AI service.');
    } finally {
      setAiSearching(false);
    }
  };

  const saveToDatabase = async (suggestion: any) => {
    setSavingItem(suggestion.name);
    try {
      const res = await fetch('/api/admin/prices/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', priceData: suggestion }),
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: `"${suggestion.name}" added to price list!` });
        fetchPrices(); // Refresh the list
        // Remove the saved item from suggestions
        setAiSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
      } else {
        setMessage({ type: 'error', text: 'Failed to save price' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving price' });
    } finally {
      setSavingItem(null);
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (!status || status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8" style={{ color: COLORS.orange }} />
            <h1 className="text-2xl font-bold" style={{ color: COLORS.primary }}>Price List Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin/projects')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300 hover:bg-gray-50"
              style={{ color: COLORS.primary }}
            >
              📷 Proyectos
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: COLORS.orange }}
            >
              <Plus className="w-5 h-5" /> Add Price
            </button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuery && filteredPrices.length === 0 && searchWithAI()}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={searchWithAI}
              disabled={!searchQuery.trim() || aiSearching}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              style={{ backgroundColor: '#10a37f' }}
              title="Search price references with AI"
            >
              {aiSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">AI Search</span>
            </button>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-3 mt-2">
              <p className="text-sm text-gray-500">
                Found {filteredPrices.length} result{filteredPrices.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </p>
              {filteredPrices.length === 0 && (
                <button
                  onClick={searchWithAI}
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
                >
                  <Globe className="w-4 h-4" /> Search online references
                </button>
              )}
            </div>
          )}
        </div>

        {/* AI Search Results Modal */}
        <AnimatePresence>
          {showAiModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAiModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6" style={{ color: '#10a37f' }} />
                    <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
                      AI Price Reference
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAiModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  Search: &quot;{searchQuery}&quot;
                </p>

                {aiSearching ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: '#10a37f' }} />
                    <p className="text-gray-500">Searching equipment & labor prices...</p>
                  </div>
                ) : aiResults ? (
                  <div className="space-y-4">
                    {/* AI Suggestions to Save */}
                    {aiSuggestions.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-800">Quick Add to Database</h3>
                        </div>
                        <div className="space-y-2">
                          {aiSuggestions.map((sug, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-100">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Package className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium text-sm">{sug.name}</span>
                                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{sug.category}</span>
                                  {sug.type && (
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                      sug.type === 'equipment' ? 'bg-blue-100 text-blue-700' : 
                                      sug.type === 'labor' ? 'bg-orange-100 text-orange-700' : 
                                      'bg-purple-100 text-purple-700'
                                    }`}>
                                      {sug.type}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  ${sug.priceMin} - ${sug.priceMax} <span className="text-gray-400">{sug.unitLabel}</span>
                                </p>
                              </div>
                              <button
                                onClick={() => saveToDatabase(sug)}
                                disabled={savingItem === sug.name}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                                style={{ backgroundColor: COLORS.orange }}
                              >
                                {savingItem === sug.name ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4" /> Add
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Response Text */}
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
                        {aiResults}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 italic">
                      * Prices are market references. Equipment prices vary by brand/supplier. Labor costs vary by complexity.
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === 'all'
                ? 'text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            style={activeCategory === 'all' ? { backgroundColor: COLORS.primary } : {}}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeCategory === cat.value
                  ? 'text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={activeCategory === cat.value ? { backgroundColor: COLORS.orange } : {}}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Add New Item Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsAdding(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.primary }}>Add New Price Item</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newItem.category}
                      onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                    <select
                      value={newItem.unit}
                      onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {UNITS.map(u => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                    <input
                      type="text"
                      value={newItem.name || ''}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., 4K IP Camera"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Spanish)</label>
                    <input
                      type="text"
                      value={newItem.nameEs || ''}
                      onChange={e => setNewItem({ ...newItem, nameEs: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., Cámara IP 4K"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Label (English)</label>
                    <input
                      type="text"
                      value={newItem.unitLabel || ''}
                      onChange={e => setNewItem({ ...newItem, unitLabel: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., per camera"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Label (Spanish)</label>
                    <input
                      type="text"
                      value={newItem.unitLabelEs || ''}
                      onChange={e => setNewItem({ ...newItem, unitLabelEs: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., por cámara"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
                    <input
                      type="number"
                      value={newItem.priceMin || 0}
                      onChange={e => setNewItem({ ...newItem, priceMin: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
                    <input
                      type="number"
                      value={newItem.priceMax || 0}
                      onChange={e => setNewItem({ ...newItem, priceMax: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Average Price ($)</label>
                    <input
                      type="number"
                      value={newItem.priceAvg || 0}
                      onChange={e => setNewItem({ ...newItem, priceAvg: parseFloat(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={newItem.sortOrder || 0}
                      onChange={e => setNewItem({ ...newItem, sortOrder: parseInt(e.target.value) })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newItem.isActive}
                      onChange={e => setNewItem({ ...newItem, isActive: e.target.checked })}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newItem.showInChat}
                      onChange={e => setNewItem({ ...newItem, showInChat: e.target.checked })}
                    />
                    Show in Chat
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newItem.showInQuote}
                      onChange={e => setNewItem({ ...newItem, showInQuote: e.target.checked })}
                    />
                    Show in Quotes
                  </label>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: COLORS.orange }}
                  >
                    Add Price
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Items Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b" style={{ backgroundColor: '#f8fafc' }}>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3 text-right">Min</th>
                <th className="px-4 py-3 text-right">Max</th>
                <th className="px-4 py-3 text-right">Avg</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPrices.map(price => (
                <tr key={price.id} className="hover:bg-gray-50">
                  {editingId === price.id ? (
                    // Edit mode
                    <>
                      <td className="px-4 py-3">
                        <select
                          value={editForm.category}
                          onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-full"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.unitLabel || ''}
                          onChange={e => setEditForm({ ...editForm, unitLabel: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editForm.priceMin || 0}
                          onChange={e => setEditForm({ ...editForm, priceMin: parseFloat(e.target.value) })}
                          className="border rounded px-2 py-1 text-sm w-20 text-right"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editForm.priceMax || 0}
                          onChange={e => setEditForm({ ...editForm, priceMax: parseFloat(e.target.value) })}
                          className="border rounded px-2 py-1 text-sm w-20 text-right"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editForm.priceAvg || 0}
                          onChange={e => setEditForm({ ...editForm, priceAvg: parseFloat(e.target.value) })}
                          className="border rounded px-2 py-1 text-sm w-20 text-right"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <label className="flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={editForm.isActive}
                            onChange={e => setEditForm({ ...editForm, isActive: e.target.checked })}
                          />
                          <span className="text-xs">Active</span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Save className="w-5 h-5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100">
                          {CATEGORIES.find(c => c.value === price.category)?.icon}
                          {CATEGORIES.find(c => c.value === price.category)?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{price.name}</div>
                        {price.nameEs && <div className="text-xs text-gray-500">{price.nameEs}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{price.unitLabel}</td>
                      <td className="px-4 py-3 text-right font-medium">${price.priceMin.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium">${price.priceMax.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-500">
                        {price.priceAvg ? `$${price.priceAvg.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          price.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {price.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(price)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(price.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPrices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No price items found. Click "Add Price" to create one.
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map(cat => {
            const catPrices = prices.filter(p => p.category === cat.value && p.isActive);
            return (
              <div key={cat.value} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-sm text-gray-500">{cat.label}</div>
                <div className="text-xl font-bold" style={{ color: COLORS.primary }}>
                  {catPrices.length} items
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
