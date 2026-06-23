import React, { useState } from 'react';
import { VaultFile, Job } from '../types';
import { Image, FileText, Upload, Plus, Filter, Calendar, ExternalLink, Trash2 } from 'lucide-react';

interface VisualVaultProps {
  job: Job;
  files: VaultFile[];
  onAddFile: (newFile: Omit<VaultFile, 'id' | 'uploadedAt'>) => void;
  onDeleteFile: (fileId: string) => void;
}

const PRESET_MOCK_IMAGES = [
  { name: 'Tall Cabinet Detail.jpg', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop', type: 'photo' as const },
  { name: 'Island Quartz Waterfall Cantilever.jpg', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop', type: 'render' as const },
  { name: 'Integrated Under-lighting Spec.jpg', url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop', type: 'photo' as const },
  { name: 'Bespoke Oak Cutlery Drawer.jpg', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop', type: 'photo' as const },
];

export default function VisualVault({ job, files, onAddFile, onDeleteFile }: VisualVaultProps) {
  const [filter, setFilter] = useState<'all' | 'photo' | 'render' | 'document'>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [newFileType, setNewFileType] = useState<'photo' | 'render' | 'document'>('photo');
  const [newFileUrl, setNewFileUrl] = useState<string>('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  const filteredFiles = files.filter((f) => {
    if (filter === 'all') return true;
    return f.type === filter;
  });

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIndex(idx);
    setNewFileName(PRESET_MOCK_IMAGES[idx].name);
    setNewFileType(PRESET_MOCK_IMAGES[idx].type);
    setNewFileUrl(PRESET_MOCK_IMAGES[idx].url);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let url = newFileUrl.trim();
    if (!url) {
      // provide fallback
      url = newFileType === 'document' ? '#' : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop';
    }

    onAddFile({
      jobId: job.id,
      name: newFileName,
      type: newFileType,
      url: url,
    });

    // Reset Form
    setNewFileName('');
    setNewFileUrl('');
    setSelectedPresetIndex(null);
    setShowAddForm(false);
  };

  return (
    <div id={`visual-vault-${job.id}`} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-3">
        <div>
          <h2 className="text-xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Image className="h-5 w-5 text-emerald-600" />
            Visual Vault
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Signed quotas, blueprints, renders, and site inspections consolidated in one single dashboard.
          </p>
        </div>
        <button
          id={`vault-toggle-add-btn-${job.id}`}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Cancel Upload' : 'Upload Document/Photo'}
        </button>
      </div>

      {/* Dynamic Upload / Form Panel */}
      {showAddForm && (
        <form onSubmit={handleCustomSubmit} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Simulate File Upload & Association
          </h3>
          
          {/* Presets Option for quick beautiful items */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">
              Select Curated Pre-set Files (or type custom below)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_MOCK_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePresetSelect(idx)}
                  className={`bg-white border rounded-lg p-2 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between h-16 ${
                    selectedPresetIndex === idx ? 'border-red-600 ring-2 ring-slate-500/15 bg-red-50/10' : 'border-gray-200'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-gray-800 line-clamp-1">{preset.name}</span>
                  <span className="text-[9px] uppercase font-bold text-slate-500">{preset.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">File Display Name</label>
              <input
                id={`vault-input-name-${job.id}`}
                type="text"
                value={newFileName}
                onChange={(e) => {
                  setNewFileName(e.target.value);
                  setSelectedPresetIndex(null);
                }}
                required
                placeholder="e.g. Approved_Elevation_Render.jpg"
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">File Type Category</label>
              <select
                id={`vault-select-type-${job.id}`}
                value={newFileType}
                onChange={(e) => {
                  setNewFileType(e.target.value as any);
                  setSelectedPresetIndex(null);
                }}
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 cursor-pointer font-sans"
              >
                <option value="photo">📷 Site Photo</option>
                <option value="render">🎨 3D Design Render</option>
                <option value="document">📄 Signed Contract / PDF Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Image / Resource URL (Optional)</label>
              <input
                id={`vault-input-url-${job.id}`}
                type="text"
                value={newFileUrl}
                onChange={(e) => {
                  setNewFileUrl(e.target.value);
                  setSelectedPresetIndex(null);
                }}
                placeholder="Leave blank for automatic placeholder image"
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 font-sans"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              id={`vault-cancel-form-btn-${job.id}`}
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              id={`vault-submit-btn-${job.id}`}
              type="submit"
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              Attach to {job.id} Vault
            </button>
          </div>
        </form>
      )}

      {/* Filters Row */}
      <div className="flex items-center gap-1.5 mb-5 select-none overflow-x-auto pb-1">
        <span className="text-xs text-gray-400 font-semibold flex items-center gap-1 mr-2 shrink-0">
          <Filter className="h-3.5 w-3.5" /> Filter:
        </span>
        {[
          { key: 'all' as const, label: 'All Files' },
          { key: 'photo' as const, label: '📷 Site Photos' },
          { key: 'render' as const, label: '🎨 Renders' },
          { key: 'document' as const, label: '📄 Signed Docs' },
        ].map((item) => (
          <button
            key={item.key}
            id={`vault-filter-${item.key}`}
            onClick={() => setFilter(item.key)}
            className={`text-xs px-3 py-1.2 rounded-lg font-semibold shrink-0 cursor-pointer border transition-all ${
              filter === item.key
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Vault Grid */}
      {filteredFiles.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
          <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <h4 className="text-sm font-sans font-semibold text-gray-700">No matching files found</h4>
          <p className="text-xs text-gray-400 mt-1">Select empty filter or upload file to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              id={`vault-file-card-${file.id}`}
              className="group border border-gray-200/90 isSleekTheme ? 'hover:border-slate-600' : 'hover:border-slate-400'/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white relative flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden group border-b border-gray-100">
                  {file.type === 'document' || file.url === '#' ? (
                    <div className="bg-gradient-to-br from-gray-50 to-red-50/30 w-full h-full flex flex-col items-center justify-center p-3 text-center">
                      <FileText className="h-10 w-10 isSleekTheme ? 'text-slate-300' : 'text-slate-700' mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-semibold text-slate-900 uppercase">PDF Document</span>
                    </div>
                  ) : (
                    <img
                      src={file.url}
                      alt={file.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* File Type badge */}
                  <span className={`absolute top-2 left-2 text-[8px] font-sans font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    file.type === 'photo' ? 'bg-amber-100 text-amber-800' :
                    file.type === 'render' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {file.type}
                  </span>

                  {/* Quick Action Overlay on render/photo hover */}
                  {file.url !== '#' && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-x-0 bottom-0 top-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all"
                    >
                      <span className="bg-white/95 p-1.5 rounded-full shadow-md text-gray-800 hover:scale-110 transition-transform">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  )}
                </div>

                {/* Info block */}
                <div className="p-3">
                  <h4 className="text-xs font-sans font-bold text-gray-800 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>Added {new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Trash option */}
              <div className="px-3 pb-2 pt-1 border-t border-gray-50 flex justify-end">
                <button
                  id={`vault-delete-btn-${file.id}`}
                  onClick={() => onDeleteFile(file.id)}
                  className="p-1 hover:bg-rose-50 text-gray-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove file record"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
