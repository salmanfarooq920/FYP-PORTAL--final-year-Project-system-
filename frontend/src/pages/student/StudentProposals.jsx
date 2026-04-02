import { useState, useEffect } from 'react';
import * as projectsApi from '../../api/projects';
import { DUMMY_IDEAS } from '../../utils/constants';

const STATUS_CONFIG = { pending: { label: 'Pending', class: 'bg-amber-50 text-amber-700 border border-amber-200' }, approved: { label: 'Approved', class: 'bg-green-50 text-green-700 border border-green-200' }, rejected: { label: 'Rejected', class: 'bg-red-50 text-red-700 border border-red-200' } };

export default function StudentProposals() {
  const [ideas, setIdeas] = useState(DUMMY_IDEAS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [likePulseId, setLikePulseId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewIdea, setViewIdea] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);
  const [addTitle, setAddTitle] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addFile, setAddFile] = useState(null);

  useEffect(() => {
    projectsApi.getMyProposals()
      .then((r) => {
        if (Array.isArray(r?.data) && r.data.length > 0) {
          setIdeas(r.data.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            ideaBy: p.submittedBy?.name || 'Unknown',
            group: p.groupName || null,
            likes: p.likes ?? 0,
            liked: p.liked ?? false,
            source: p.source || 'student',
            status: p.status || 'pending',
            supervisorFeedback: p.supervisorFeedback ?? null,
            uniquenessScore: p.uniquenessScore ?? null,
            feasibilityScore: p.feasibilityScore ?? null,
            requiredSkills: p.requiredSkills ?? [],
            aiSuggestions: p.aiSuggestions ?? null,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredIdeas = ideas
    .filter((i) => {
      if (filter === 'student') return (i.source || 'student') === 'student';
      if (filter === 'faculty') return (i.source || 'student') === 'faculty';
      return true;
    })
    .filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.ideaBy || '').toLowerCase().includes(search.toLowerCase()));

  const toggleLike = (id) => {
    setLikePulseId(id);
    window.clearTimeout(toggleLike._t);
    toggleLike._t = window.setTimeout(() => setLikePulseId(null), 260);
    setIdeas((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, liked: !i.liked, likes: (i.likes || 0) + (i.liked ? -1 : 1) } : i
      )
    );
  };

  const handleAddIdea = (e) => {
    e.preventDefault();
    const newIdea = {
      id: 'i' + Date.now(),
      title: addTitle,
      description: addDescription,
      ideaBy: 'You',
      group: null,
      likes: 0,
      liked: false,
      source: 'student',
      status: 'pending',
      supervisorFeedback: null,
      uniquenessScore: 0.72,
      feasibilityScore: 0.85,
      requiredSkills: ['TBD'],
      aiSuggestions: 'Add more technical details for feasibility analysis.',
    };
    setIdeas([newIdea, ...ideas]);
    setAddTitle('');
    setAddDescription('');
    setAddFile(null);
    setShowAddModal(false);
  };

  const handleEditIdea = (idea, updates) => {
    setIdeas((prev) => prev.map((i) => (i.id === idea.id ? { ...i, ...updates } : i)));
    setEditingIdea(null);
  };

  const handleDeleteIdea = (id) => {
    if (window.confirm('Delete this idea? This cannot be undone.')) setIdeas((prev) => prev.filter((i) => i.id !== id));
    setViewIdea(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500 animate-fade-in">Loading...</div>;

  const totalIdeas = ideas.length;
  const pendingCount = ideas.filter((i) => (i.status || 'pending') === 'pending').length;
  const approvedCount = ideas.filter((i) => (i.status || 'pending') === 'approved').length;
  const totalLikes = ideas.reduce((sum, i) => sum + (i.likes || 0), 0);

  const featuredIdea = filteredIdeas[0] ?? null;
  const restIdeas = featuredIdea ? filteredIdeas.slice(1) : [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sticky side panel */}
        <aside className="xl:col-span-4">
          <div className="ideas-side p-5 sm:p-6 animate-fade-in-up xl:sticky xl:top-6">
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Ideas</h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Propose and manage project ideas with AI-powered analysis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4B400] text-white font-semibold shadow-sm hover:bg-[#E6A700] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Submit
                </button>
              </div>

              <div className="mt-5 ideas-side-glass rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{totalIdeas}</p>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Likes</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{totalLikes}</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending</p>
                    <p className="text-xl font-bold text-amber-800 mt-0.5">{pendingCount}</p>
                  </div>
                  <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Approved</p>
                    <p className="text-xl font-bold text-green-800 mt-0.5">{approvedCount}</p>
                  </div>
                </div>

                <div className="mt-4 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search ideas…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-base pl-10 rounded-xl border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                  />
                </div>

                <div className="mt-4 flex gap-1.5 p-1 bg-slate-100/80 rounded-xl w-fit">
                  {[{ key: 'all', label: 'All' }, { key: 'student', label: 'Students' }, { key: 'faculty', label: 'Faculty' }].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFilter(tab.key)}
                      className={`ideas-filter-tab px-4 py-2 rounded-lg text-sm font-semibold ${filter === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="xl:col-span-8 space-y-6">
          {/* Featured */}
          {featuredIdea && (
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-sm ideas-card-enter ideas-card-hover ideas-card-accent overflow-hidden animate-fade-in-up">
              <div className="p-6 pt-7">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Featured</p>
                    <button type="button" onClick={() => setViewIdea(featuredIdea)} className="text-left">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight hover:text-blue-600 transition-colors line-clamp-2">
                        {featuredIdea.title}
                      </h2>
                    </button>
                    {featuredIdea.description && (
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3">{featuredIdea.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${(STATUS_CONFIG[featuredIdea.status] || STATUS_CONFIG.pending).class}`}>
                      {(STATUS_CONFIG[featuredIdea.status] || STATUS_CONFIG.pending).label}
                    </span>
                    <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                      {(featuredIdea.source || 'student') === 'faculty' ? 'Faculty' : 'Student'}
                    </span>
                  </div>
                </div>

                {(featuredIdea.uniquenessScore != null || featuredIdea.feasibilityScore != null) && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {featuredIdea.uniquenessScore != null && (
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-medium">Uniqueness</span>
                          <span className="text-slate-900 font-semibold">{(featuredIdea.uniquenessScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="mt-2 h-2.5 bg-white rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(featuredIdea.uniquenessScore * 100).toFixed(0)}%` }} />
                        </div>
                      </div>
                    )}
                    {featuredIdea.feasibilityScore != null && (
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-medium">Feasibility</span>
                          <span className="text-slate-900 font-semibold">{(featuredIdea.feasibilityScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="mt-2 h-2.5 bg-white rounded-full overflow-hidden border border-slate-200">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${(featuredIdea.feasibilityScore * 100).toFixed(0)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{featuredIdea.ideaBy}</span> · {featuredIdea.group ?? 'No group'}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => toggleLike(featuredIdea.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95" title="Like">
                      {featuredIdea.liked ? (
                        <svg className={`w-5 h-5 text-red-500 ${likePulseId === featuredIdea.id ? 'ideas-like-pop' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      ) : (
                        <svg className={`w-5 h-5 ${likePulseId === featuredIdea.id ? 'ideas-like-pop' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      )}
                    </button>
                    <span className="text-sm font-semibold text-slate-700 mr-1">{featuredIdea.likes ?? 0}</span>
                    <button type="button" onClick={() => setViewIdea(featuredIdea)} className="px-3 py-2 rounded-xl bg-[#FFF4CC] text-[#B38600] font-semibold text-sm hover:bg-[#FFE999] transition-colors">
                      View details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* Card grid */}
      {filteredIdeas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center animate-fade-in-up">
          <svg className="ideas-empty-icon w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          <p className="text-slate-500 font-medium">No ideas found.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters, or submit a new idea.</p>
          <button type="button" onClick={() => setShowAddModal(true)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4B400] text-white font-semibold shadow-sm hover:bg-[#E6A700] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 mt-4">Submit idea</button>
        </div>
      ) : (
        <div className="ideas-masonry columns-1 md:columns-2 2xl:columns-3">
          {restIdeas.map((idea, index) => {
            const statusInfo = STATUS_CONFIG[idea.status] || STATUS_CONFIG.pending;
            return (
              <div
                key={idea.id}
                className="ideas-masonry-item group relative rounded-2xl border border-slate-200 bg-white shadow-sm ideas-card-enter ideas-card-hover ideas-card-accent ideas-card-shimmer"
                style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
              >
                <div className="p-5 sm:p-6 pt-7">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <button type="button" onClick={() => setViewIdea(idea)} className="text-left flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{idea.title}</h3>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>{statusInfo.label}</span>
                      <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {(idea.source || 'student') === 'faculty' ? 'Faculty' : 'Student'}
                      </span>
                    </div>
                  </div>
                  {idea.description && (
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{idea.description}</p>
                  )}
                  {Array.isArray(idea.requiredSkills) && idea.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {idea.requiredSkills.slice(0, 4).map((s) => (
                        <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {s}
                        </span>
                      ))}
                      {idea.requiredSkills.length > 4 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                          +{idea.requiredSkills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                  {(idea.uniquenessScore != null || idea.feasibilityScore != null) && (
                    <div className="flex gap-4 mb-4">
                      {idea.uniquenessScore != null && (
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-slate-500">Uniqueness</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(idea.uniquenessScore * 100).toFixed(0)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{(idea.uniquenessScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      )}
                      {idea.feasibilityScore != null && (
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-slate-500">Feasibility</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(idea.feasibilityScore * 100).toFixed(0)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-slate-700">{(idea.feasibilityScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{idea.ideaBy}</span>
                      <span>·</span>
                      <span>{idea.group ?? 'No group'}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button type="button" onClick={() => toggleLike(idea.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-110 active:scale-95" title="Like">
                        {idea.liked ? (
                          <svg className={`w-5 h-5 text-red-500 ${likePulseId === idea.id ? 'ideas-like-pop' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        ) : (
                          <svg className={`w-5 h-5 ${likePulseId === idea.id ? 'ideas-like-pop' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        )}
                      </button>
                      <span className="text-sm font-medium text-slate-600 mr-1">{idea.likes ?? 0}</span>
                      <button type="button" onClick={() => setViewIdea(idea)} className="p-2 rounded-lg text-slate-400 hover:text-[#F4B400] hover:bg-[#FFF4CC] transition-all duration-200 hover:scale-105 active:scale-95" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      {idea.status === 'pending' && (
                        <>
                          <button type="button" onClick={() => setEditingIdea(idea)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 hover:scale-105 active:scale-95" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button type="button" onClick={() => handleDeleteIdea(idea.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 hover:scale-105 active:scale-95" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

        </section>
      </div>

      {/* View idea modal: Supervisor feedback + AI analysis */}
      {viewIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setViewIdea(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200/80 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900 pr-4">{viewIdea.title}</h2>
              <button type="button" onClick={() => setViewIdea(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0">✕</button>
            </div>
            <div className="p-6 pt-4">
            {viewIdea.description && <p className="text-slate-600 text-sm leading-relaxed mb-5">{viewIdea.description}</p>}
            <div className="mb-4">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${(STATUS_CONFIG[viewIdea.status] || STATUS_CONFIG.pending).class}`}>
                {(STATUS_CONFIG[viewIdea.status] || STATUS_CONFIG.pending).label}
              </span>
            </div>
            {viewIdea.supervisorFeedback && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <h3 className="section-title mb-2">Supervisor feedback</h3>
                <p className="text-sm text-slate-700">{viewIdea.supervisorFeedback}</p>
              </div>
            )}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="section-title mb-3">AI analysis</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {viewIdea.uniquenessScore != null && (
                  <div>
                    <span className="text-slate-500">Uniqueness</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(viewIdea.uniquenessScore * 100).toFixed(0)}%` }} />
                      </div>
                      <span className="font-medium">{(viewIdea.uniquenessScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
                {viewIdea.feasibilityScore != null && (
                  <div>
                    <span className="text-slate-500">Feasibility</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(viewIdea.feasibilityScore * 100).toFixed(0)}%`}} />
                      </div>
                      <span className="font-medium">{(viewIdea.feasibilityScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )}
              </div>
              {Array.isArray(viewIdea.requiredSkills) && viewIdea.requiredSkills.length > 0 && (
                <div className="mt-3">
                  <span className="text-slate-500 text-sm">Required skills: </span>
                  <span className="text-slate-800 font-medium">{viewIdea.requiredSkills.join(', ')}</span>
                </div>
              )}
              {viewIdea.aiSuggestions && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                  <span className="text-sm font-medium text-amber-800">AI suggestions: </span>
                  <span className="text-sm text-amber-900">{viewIdea.aiSuggestions}</span>
                </div>
              )}
            </div>
            {viewIdea.status === 'pending' && (
              <div className="mt-6 flex gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => { setEditingIdea(viewIdea); setViewIdea(null); }} className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFF4CC] text-[#B38600] font-medium hover:bg-[#FFE999] transition-colors">Edit</button>
                <button type="button" onClick={() => handleDeleteIdea(viewIdea.id)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors">Delete</button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Edit idea modal */}
      {editingIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setEditingIdea(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200/80 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-blue-200 mb-4" aria-hidden />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Edit idea</h2>
            <form onSubmit={(e) => { e.preventDefault(); const t = e.target.title.value; const d = e.target.description?.value; handleEditIdea(editingIdea, { title: t, description: d }); }}>
              <div className="space-y-4">
                <div>
                  <label className="label">Title</label>
                  <input name="title" defaultValue={editingIdea.title} className="input-base" required />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea name="description" defaultValue={editingIdea.description} rows={4} className="input-base" />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button type="button" onClick={() => setEditingIdea(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4B400] text-white font-medium hover:bg-[#E6A700] transition-colors shadow-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add idea modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200/80 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="w-10 h-1 rounded-full bg-blue-200 mb-3" aria-hidden />
                <h2 className="text-xl font-bold text-slate-900">Submit new idea</h2>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">✕</button>
            </div>
            <form onSubmit={handleAddIdea} className="space-y-4">
              <div>
                <label className="label">Idea title *</label>
                <input type="text" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} placeholder="e.g. FYPConnect" className="input-base" required />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea value={addDescription} onChange={(e) => setAddDescription(e.target.value)} rows={4} placeholder="Describe your idea..." className="input-base" required />
              </div>
              <div>
                <label className="label">Attachments</label>
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition">
                  <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-sm text-slate-500">Click to upload (PDF, DOC, DOCX)</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => setAddFile(e.target.files?.[0])} />
                </label>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#F4B400] text-white font-semibold hover:bg-[#E6A700] transition-colors shadow-sm">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
