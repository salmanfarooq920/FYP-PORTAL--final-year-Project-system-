import { useState, useEffect } from 'react';
import * as filesApi from '../../api/files';
import { DUMMY_DOCUMENTS, DOCUMENT_CATEGORIES } from '../../utils/constants';

const FILE_COLORS = {
  PDF: { bg: 'from-rose-500 to-red-600', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', ext: 'PDF' },
  Document: { bg: 'from-blue-500 to-indigo-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', ext: 'DOC' },
  Image: { bg: 'from-emerald-500 to-teal-600', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', ext: 'IMG' },
  Spreadsheet: { bg: 'from-amber-500 to-orange-600', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', ext: 'XLS' },
  default: { bg: 'from-slate-500 to-gray-600', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', ext: 'FILE' },
};

export default function StudentDocuments() {
  const [documents, setDocuments] = useState(DUMMY_DOCUMENTS);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [versionDoc, setVersionDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    filesApi.list()
      .then((r) => { setDocuments(r?.data?.length > 0 ? r.data : DUMMY_DOCUMENTS); })
      .catch(() => { setDocuments(DUMMY_DOCUMENTS); })
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc = {
      id: 'd' + Date.now(),
      name: file.name,
      type: file.type.split('/')[1]?.toUpperCase() || 'File',
      date: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedBy: 'You',
      category: 'Other',
      version: 1,
      versions: [{ version: 1, date: new Date().toISOString().split('T')[0], uploadedBy: 'You' }],
    };
    setDocuments([newDoc, ...documents]);
  };

  const toggleFileSelection = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getFileConfig = (type) => FILE_COLORS[type] || FILE_COLORS.default;

  const filteredDocs = documents
    .filter(d => categoryFilter === 'all' || (d.category || 'Other') === categoryFilter)
    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return parseFloat(a.size) - parseFloat(b.size);
      return 0;
    });

  const totalSize = documents.reduce((acc, d) => acc + parseFloat(d.size || 0), 0).toFixed(1);

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="flex items-center gap-3" style={{ color: '#1F2E5A' }}>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#E8ECF4', borderTopColor: '#F4B400' }}></div>
        Loading files...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      {/* Header - Dark Navy Blue with Shadow */}
      <div className="px-8 py-6" style={{ backgroundColor: '#1F2E5A', boxShadow: '0 4px 20px rgba(31, 46, 90, 0.3)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4B400' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Document Center</h1>
              <p className="text-sm text-white/70">Manage and organize your project files</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-[#F4B400]/50 transition w-72 bg-white/10 text-white placeholder-white/50 border border-white/20"
              />
            </div>
            
            <label className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium hover:brightness-110 transition cursor-pointer" style={{ backgroundColor: '#F4B400', color: '#1F2E5A', boxShadow: '0 4px 12px rgba(244, 180, 0, 0.4)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Row - Navy Blue Theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Documents', value: documents.length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { label: 'PDF Files', value: documents.filter(d => d.type === 'PDF').length, icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
            { label: 'Word Docs', value: documents.filter(d => d.type === 'Document').length, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { label: 'Storage Used', value: `${totalSize} MB`, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-lg p-5 flex items-center gap-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.08)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1F2E5A', boxShadow: '0 4px 12px rgba(31, 46, 90, 0.25)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1F2E5A' }}>{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="rounded-lg px-5 py-4 mb-6 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
          <div className="flex items-center gap-3">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-lg text-sm transition bg-white focus:ring-2 focus:ring-[#F4B400]/50"
              style={{ border: '1px solid #E8ECF4', color: '#1F2E5A' }}
            >
              <option value="all">All Categories</option>
              {DOCUMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-lg text-sm transition bg-white focus:ring-2 focus:ring-[#F4B400]/50"
              style={{ border: '1px solid #E8ECF4', color: '#1F2E5A' }}
            >
              <option value="date">Date Modified</option>
              <option value="name">Name</option>
              <option value="size">File Size</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {selectedFiles.length > 0 && (
              <span className="text-sm font-medium" style={{ color: '#F4B400' }}>{selectedFiles.length} selected</span>
            )}
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #E8ECF4' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition ${viewMode === 'grid' ? 'text-white' : 'bg-white hover:bg-gray-50'}`}
                style={{ backgroundColor: viewMode === 'grid' ? '#1F2E5A' : 'transparent' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: viewMode === 'grid' ? '#FFFFFF' : '#1F2E5A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition ${viewMode === 'list' ? 'text-white' : 'bg-white hover:bg-gray-50'}`}
                style={{ backgroundColor: viewMode === 'list' ? '#1F2E5A' : 'transparent' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: viewMode === 'list' ? '#FFFFFF' : '#1F2E5A' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Documents Grid - Navy Blue Theme */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredDocs.map((d) => {
              const config = getFileConfig(d.type);
              const isSelected = selectedFiles.includes(d.id);
              return (
                <div 
                  key={d.id} 
                  onClick={() => toggleFileSelection(d.id)}
                  className="group relative rounded-lg border transition cursor-pointer bg-white"
                  style={{ 
                    borderColor: isSelected ? '#1F2E5A' : '#E8ECF4',
                    boxShadow: isSelected ? '0 4px 16px rgba(31, 46, 90, 0.2)' : '0 2px 8px rgba(31, 46, 90, 0.06)'
                  }}
                >
                  {/* File Preview Area */}
                  <div className="aspect-[4/3] rounded-t-lg flex items-center justify-center border-b relative" style={{ backgroundColor: '#F8F9FC', borderColor: '#E8ECF4' }}>
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `linear-gradient(135deg, ${config.bg.includes('rose') ? '#F4B400' : config.bg.includes('blue') ? '#1F2E5A' : config.bg.includes('emerald') ? '#1F2E5A' : '#1F2E5A'}, ${config.bg.includes('rose') ? '#D4A017' : '#2A3F7A'})` }}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={config.icon} />
                      </svg>
                    </div>
                    
                    {/* Checkbox */}
                    <div className="absolute top-3 left-3 w-5 h-5 rounded border flex items-center justify-center transition bg-white"
                      style={{ 
                        borderColor: isSelected ? '#1F2E5A' : '#E8ECF4',
                        backgroundColor: isSelected ? '#1F2E5A' : '#FFFFFF',
                        opacity: isSelected ? 1 : 0
                      }}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Actions Overlay */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="p-1.5 rounded bg-white shadow-sm border transition hover:text-white"
                        style={{ borderColor: '#E8ECF4', color: '#1F2E5A' }}
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-sm truncate mb-1" style={{ color: '#1F2E5A' }} title={d.name}>{d.name}</h3>
                    <div className="flex items-center justify-between text-xs" style={{ color: '#6B7280' }}>
                      <span>{d.size}</span>
                      <span>{d.date}</span>
                    </div>
                    {d.category && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#F8F9FC', color: '#1F2E5A' }}>
                        {d.category}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View - Navy Blue Theme */
          <div className="rounded-lg border overflow-hidden bg-white" style={{ borderColor: '#E8ECF4', boxShadow: '0 2px 12px rgba(31, 46, 90, 0.08)' }}>
            <table className="min-w-full">
              <thead style={{ backgroundColor: '#F8F9FC', borderBottom: '1px solid #E8ECF4' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide w-12" style={{ color: '#1F2E5A' }}>
                    <input type="checkbox" className="rounded" style={{ borderColor: '#E8ECF4' }} />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#1F2E5A' }}>Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#1F2E5A' }}>Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#1F2E5A' }}>Size</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#1F2E5A' }}>Modified</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide" style={{ color: '#1F2E5A' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: '#E8ECF4' }}>
                {filteredDocs.map((d) => {
                  const config = getFileConfig(d.type);
                  return (
                    <tr key={d.id} className="transition group" style={{ borderBottom: '1px solid #E8ECF4' }}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedFiles.includes(d.id)}
                          onChange={() => toggleFileSelection(d.id)}
                          className="rounded"
                          style={{ borderColor: '#E8ECF4' }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${config.bg.includes('rose') ? '#F4B400' : '#1F2E5A'}, ${config.bg.includes('rose') ? '#D4A017' : '#2A3F7A'})` }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={config.icon} />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: '#1F2E5A' }}>{d.name}</p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>{d.type} · {d.uploadedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded text-xs" style={{ backgroundColor: '#F8F9FC', color: '#1F2E5A' }}>
                          {d.category || 'Other'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>{d.size}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>{d.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button type="button" className="p-2 rounded transition hover:text-white" style={{ color: '#1F2E5A' }} title="Download">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                          {d.versions?.length > 0 && (
                            <button type="button" onClick={() => setVersionDoc(d)} className="p-2 rounded transition" style={{ color: '#1F2E5A' }} title="History">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          <button type="button" className="p-2 rounded transition" style={{ color: '#DC2626' }} title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F8F9FC' }}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1F2E5A' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2E5A' }}>No documents found</h3>
            <p style={{ color: '#6B7280' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Version History Modal - Navy Blue Theme */}
      {versionDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(31, 46, 90, 0.5)' }} onClick={() => setVersionDoc(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #E8ECF4' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#1F2E5A' }}>Version History</h2>
              <button onClick={() => setVersionDoc(null)} style={{ color: '#6B7280' }} className="hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm mb-4 truncate" style={{ color: '#6B7280' }}>{versionDoc.name}</p>
              
              <div className="space-y-3">
                {(versionDoc.versions || []).map((v, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border" style={{ backgroundColor: '#F8F9FC', borderColor: '#E8ECF4' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#F4B400' }}>
                      v{v.version}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: '#1F2E5A' }}>Version {v.version}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{v.uploadedBy}</p>
                    </div>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{v.date}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 rounded-b-lg" style={{ backgroundColor: '#F8F9FC', borderTop: '1px solid #E8ECF4' }}>
              <button 
                type="button" 
                onClick={() => setVersionDoc(null)} 
                className="w-full px-4 py-2.5 rounded-lg font-medium transition hover:brightness-110"
                style={{ backgroundColor: '#1F2E5A', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(31, 46, 90, 0.3)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
