import { useState, useMemo } from 'react'
import './index.css'
import { useDashboard } from './hooks/useDashboard'
import { useWiki } from './hooks/useWiki'

// ─── Category config (IDs match the database) ────────────────────────────────

const wikiCategories = [
  { id: 'fault_diagnosis',  label: 'Fault Diagnosis',   icon: '🔍' },
  { id: 'pricing_quoting',  label: 'Pricing & Quoting', icon: '💷' },
  { id: 'client_notes',     label: 'Client Notes',      icon: '👤' },
  { id: 'parts_suppliers',  label: 'Parts & Suppliers', icon: '📦' },
  { id: 'tips_tricks',      label: 'Tips & Tricks',     icon: '💡' },
]

// ─── Quick actions (static) ───────────────────────────────────────────────────

const quickActions = [
  { id: 'log',      icon: '🔧', label: 'Log a new job',         sub: 'Voice or type' },
  { id: 'quote',    icon: '📋', label: 'Create a quote',        sub: 'Fast & professional' },
  { id: 'chase',    icon: '💬', label: 'Chase unpaid invoices', sub: '3 outstanding' },
  { id: 'schedule', icon: '📅', label: "This week's schedule",  sub: '6 jobs booked' },
  { id: 'summary',  icon: '📊', label: "How's business going?", sub: 'Plain English summary' },
]

// Pre-canned voice note that appears after the mic "records"
const DEMO_TRANSCRIPT =
  "Ideal Logic boiler — if you get an F1 fault, check the pressure first, always. Nine times out of ten it just needs topping up to 1.5 bar. Two minutes, saves you diagnosing a sensor."

// ─── Icons ────────────────────────────────────────────────────────────────────

function MicIcon({ size = 20, color = 'white' }) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="2" />
      <path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2" />
      <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ─── Dashboard — Insight card ─────────────────────────────────────────────────

function InsightCard({ insight, onYes, onLater, dismissed }) {
  if (dismissed || !insight) return null

  return (
    <div className="mx-4 mt-4 rounded-2xl overflow-hidden shadow-md">
      <div style={{ background: '#2C6E49' }} className="px-4 pt-3 pb-2 flex items-center justify-between">
        <span className="text-white text-[11px] font-semibold uppercase tracking-widest opacity-80">
          Heads up
        </span>
        <span className="text-lg">💡</span>
      </div>
      <div className="bg-white px-4 py-4">
        <p className="text-gray-800 text-[15px] leading-snug font-medium mb-1">
          {insight.message}
        </p>
        <p className="text-gray-400 text-[13px] mb-4">{insight.context}</p>
        <div className="flex gap-3">
          <button
            onClick={onYes}
            style={{ background: '#2C6E49' }}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-[15px] active:opacity-80 transition-opacity"
          >
            Yes, chase them
          </button>
          <button
            onClick={onLater}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-[15px] active:opacity-70 transition-opacity"
          >
            Not yet
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard — Stats row ────────────────────────────────────────────────────

function StatsRow({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm animate-pulse">
            <div className="h-2.5 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-7 w-24 bg-gray-200 rounded mb-1.5" />
            <div className="h-2 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">This month</p>
        <p className="text-gray-900 text-2xl font-bold leading-tight">{stats.monthRevenue}</p>
        <p className="text-gray-400 text-[12px] mt-0.5">{stats.jobsThisMonth} jobs completed</p>
      </div>
      {/* Warm amber — informative, not alarming */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-0.5">Outstanding</p>
        <p className="text-[#d97706] text-2xl font-bold leading-tight">{stats.outstanding}</p>
        <p className="text-gray-400 text-[12px] mt-0.5">{stats.openQuotes} open quotes</p>
      </div>
    </div>
  )
}

// ─── Dashboard — Quick actions ────────────────────────────────────────────────

function QuickActions({ onAction }) {
  return (
    <div className="mt-5 px-4">
      <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mb-3">
        Quick actions
      </p>
      <div className="flex flex-col gap-2">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3.5 shadow-sm active:scale-[0.98] transition-transform text-left"
          >
            <span className="text-2xl w-8 text-center shrink-0">{action.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-semibold text-[15px] leading-tight">{action.label}</p>
              <p className="text-gray-400 text-[13px] mt-0.5">{action.sub}</p>
            </div>
            <span className="text-gray-300 text-xl shrink-0">›</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Dashboard — Activity feed ────────────────────────────────────────────────

function ActivityFeed({ activity, loading }) {
  if (loading) {
    return (
      <div className="mt-6 px-4 mb-6">
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mb-3">Recent activity</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3.5 ${i < 4 ? 'border-b border-gray-100' : ''}`}>
              <div className="w-6 h-6 bg-gray-200 rounded-full mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-4/5 mb-2" />
                <div className="h-2 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!activity.length) {
    return (
      <div className="mt-6 px-4 mb-6">
        <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mb-3">Recent activity</p>
        <div className="bg-white rounded-2xl shadow-sm px-4 py-8 text-center">
          <p className="text-gray-400 text-[14px]">No activity yet — get started with a quick action above.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 px-4 mb-6">
      <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mb-3">
        Recent activity
      </p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {activity.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 px-4 py-3.5 ${
              i < activity.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="text-lg mt-0.5 shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 text-[14px] leading-snug">{item.text}</p>
              <p className="text-gray-400 text-[12px] mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Wiki — Add knowledge modal ───────────────────────────────────────────────

function AddKnowledgeModal({ onClose, onSaved }) {
  const [step, setStep] = useState('idle')   // idle | recording | done
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [saving, setSaving] = useState(false)

  const handleMicTap = () => {
    if (step !== 'idle') return
    setStep('recording')
    setTimeout(() => {
      setText(DEMO_TRANSCRIPT)
      setStep('done')
    }, 2000)
  }

  const handleSave = async () => {
    if (!text.trim() || saving) return
    setSaving(true)
    try {
      const trimmed = text.trim()
      const title = trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed
      await onSaved({
        title,
        content: trimmed,
        category: category || 'tips_tricks',
        source: step === 'done' ? 'voice' : 'text',
        tags: [],
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[390px] bg-white rounded-t-3xl px-4 pt-5 pb-10 z-50">
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

        <h2 className="text-gray-900 text-[18px] font-bold mb-1">Add knowledge</h2>
        <p className="text-gray-400 text-[13px] mb-5">
          Tap the mic and speak, or just type it out.
        </p>

        {/* Mic button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={handleMicTap}
            disabled={step === 'recording'}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md transition-all ${
              step === 'recording' ? 'animate-pulse scale-110' : 'active:scale-95'
            }`}
            style={{ background: step === 'recording' ? '#dc2626' : '#2C6E49' }}
          >
            <MicIcon size={32} />
          </button>
        </div>
        <p className={`text-center text-[12px] font-medium mb-4 h-4 ${
          step === 'recording' ? 'text-red-500' : 'text-gray-400'
        }`}>
          {step === 'recording' ? 'Listening...' : step === 'done' ? 'Got it — edit if needed' : 'Tap to record'}
        </p>

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Or type your note here..."
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-gray-700 resize-none outline-none transition-colors"
          style={{ borderColor: text ? '#2C6E49' : undefined }}
        />

        {/* Category pills */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {wikiCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id === category ? '' : cat.id)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors"
              style={
                category === cat.id
                  ? { background: '#2C6E49', color: 'white' }
                  : { background: '#f3f4f6', color: '#4b5563' }
              }
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || !text.trim()}
          className="mt-4 w-full py-3.5 rounded-xl text-white font-semibold text-[15px] transition-opacity active:opacity-80"
          style={{ background: '#2C6E49', opacity: text.trim() && !saving ? 1 : 0.4 }}
        >
          {saving ? 'Saving...' : 'Save to wiki'}
        </button>
      </div>
    </div>
  )
}

// ─── Wiki — Entry detail modal ────────────────────────────────────────────────

function EntryDetailModal({ entry, onClose }) {
  const cat = wikiCategories.find((c) => c.id === entry.category)

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[390px] bg-white rounded-t-3xl px-4 pt-5 pb-10 z-50 max-h-[85svh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />

        {/* Category badge */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-white mb-3"
          style={{ background: '#2C6E49' }}
        >
          {cat?.icon} {cat?.label}
        </span>

        <h2 className="text-gray-900 text-[18px] font-bold mb-3 leading-snug">{entry.title}</h2>
        <p className="text-gray-600 text-[15px] leading-relaxed mb-4">{entry.body}</p>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mb-4">
          {(entry.tags || []).map((tag) => (
            <span key={tag} className="px-2.5 py-1 bg-gray-100 rounded-full text-[12px] text-gray-500">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-[12px] mb-5">
          {entry.source === 'voice' ? '🎤 Voice note' : '✏️ Typed'} · Added {entry.added}
        </p>

        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-[14px] active:opacity-70 transition-opacity">
            Edit note
          </button>
          <button
            className="flex-1 py-3 rounded-xl text-white font-semibold text-[14px] active:opacity-80 transition-opacity"
            style={{ background: '#2C6E49' }}
          >
            Add to it
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Wiki screen ──────────────────────────────────────────────────────────────

function WikiScreen({ showToast }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const { entries, loading, error, addEntry } = useWiki()

  const categoryCounts = useMemo(() => {
    const counts = {}
    entries.forEach((e) => { counts[e.category] = (counts[e.category] || 0) + 1 })
    return counts
  }, [entries])

  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return entries.filter((entry) => {
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.body.toLowerCase().includes(q) ||
        (entry.tags || []).some((t) => t.toLowerCase().includes(q))
      const matchesCategory = !selectedCategory || entry.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [entries, searchQuery, selectedCategory])

  const handleSaved = async (entryData) => {
    try {
      await addEntry(entryData)
      setShowAddModal(false)
      showToast("Saved to your wiki. Nice one.")
    } catch {
      showToast("Couldn't save — check your connection.")
    }
  }

  return (
    <div>
      <div className="h-12" />

      {/* Header */}
      <div className="px-4 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold leading-tight tracking-tight m-0">Knowledge</h1>
          <p className="text-gray-400 text-[13px]">{entries.length} notes in your wiki</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[14px] font-semibold shadow-sm active:opacity-80 transition-opacity"
          style={{ background: '#2C6E49' }}
        >
          <MicIcon size={16} />
          Add note
        </button>
      </div>

      {/* Search bar */}
      <div className="mx-4 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search your knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-[15px] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 text-xl leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category filter — horizontal scroll */}
      {!searchQuery && (
        <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 px-4 pb-1" style={{ width: 'max-content' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className="shrink-0 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors"
              style={!selectedCategory ? { background: '#2C6E49', color: 'white' } : { background: 'white', color: '#4b5563' }}
            >
              All
            </button>
            {wikiCategories.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-colors shadow-sm"
                  style={isActive ? { background: '#2C6E49', color: 'white' } : { background: 'white', color: '#4b5563' }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {categoryCounts[cat.id] > 0 && (
                    <span style={{ opacity: 0.6, fontSize: '11px' }}>{categoryCounts[cat.id]}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Entry list */}
      <div className="px-4 flex flex-col gap-3 mb-6">
        {!searchQuery && !selectedCategory && (
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest">Recent entries</p>
        )}

        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl px-4 py-4 shadow-sm animate-pulse">
              <div className="h-3.5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-2.5 bg-gray-200 rounded w-full mb-1.5" />
              <div className="h-2.5 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="flex gap-2">
                <div className="h-4 w-20 bg-gray-200 rounded-full" />
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))
        ) : error ? (
          <p className="text-red-400 text-[14px] text-center py-10">
            Couldn't load your wiki — check your connection.
          </p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-gray-400 text-[14px] text-center py-10">
            {searchQuery
              ? `Nothing matching "${searchQuery}" yet`
              : 'No entries yet — tap Add note to get started.'}
          </p>
        ) : (
          filteredEntries.map((entry) => {
            const cat = wikiCategories.find((c) => c.id === entry.category)
            return (
              <button
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="bg-white rounded-2xl px-4 py-4 shadow-sm text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-gray-900 font-semibold text-[15px] leading-snug flex-1">{entry.title}</p>
                  <span className="text-gray-300 text-xl shrink-0 mt-0.5">›</span>
                </div>
                <p className="text-gray-500 text-[13px] leading-snug mb-3 line-clamp-2">{entry.body}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[11px] text-white px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#2C6E49' }}
                  >
                    {cat?.icon} {cat?.label}
                  </span>
                  <span className="text-gray-400 text-[11px]">{entry.added}</span>
                  {entry.source === 'voice' && <span className="text-gray-400 text-[11px]">🎤</span>}
                </div>
              </button>
            )
          })
        )}
      </div>

      {showAddModal && (
        <AddKnowledgeModal onClose={() => setShowAddModal(false)} onSaved={handleSaved} />
      )}
      {selectedEntry && (
        <EntryDetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </div>
  )
}

// ─── Bottom nav ───────────────────────────────────────────────────────────────

const NAV_TABS = [
  {
    id: 'home',
    label: 'Home',
    icon: ({ active }) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
          stroke={active ? '#2C6E49' : '#9ca3af'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: ({ active }) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="15" rx="2" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="12" x2="12" y2="17" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" />
        <line x1="9.5" y1="14.5" x2="14.5" y2="14.5" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'wiki',
    label: 'Wiki',
    icon: ({ active }) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'money',
    label: 'Money',
    icon: ({ active }) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" />
        <circle cx="12" cy="12" r="3" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" />
        <path d="M6 12h.01M18 12h.01" stroke={active ? '#2C6E49' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: ({ active }) => (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          stroke={active ? '#2C6E49' : '#9ca3af'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

function BottomNav({ active, onNav }) {
  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
    >
      <div className="flex">
        {NAV_TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNav(tab.id)}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors"
            >
              <tab.icon active={isActive} />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? '#2C6E49' : '#9ca3af' }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[calc(100%-32px)] max-w-[358px] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div
        className="rounded-2xl px-5 py-3.5 text-white text-[14px] leading-snug font-medium shadow-lg text-center"
        style={{ background: '#2C6E49' }}
      >
        {message}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('home')
  const [insightDismissed, setInsightDismissed] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const { stats, activity, insight, loading: dashboardLoading, error: dashboardError } = useDashboard()

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500)
  }

  const handleInsightYes = () => {
    setInsightDismissed(true)
    showToast("On it — chasing them now. I'll let you know when they reply.")
  }

  const handleInsightLater = () => {
    setInsightDismissed(true)
    showToast("No bother. I'll remind you again tomorrow.")
  }

  const handleQuickAction = (action) => {
    const responses = {
      log:      "What's the job? Speak or type and I'll log it.",
      quote:    "Who's the quote for and what are you doing?",
      chase:    "Chasing 3 unpaid invoices now — Mrs Jones (£480), Gary at No.6 (£215), Riverside Letting Co (£1,455).",
      schedule: "You've got 6 jobs this week. First up: 22 Brook Lane tomorrow at 8am.",
      summary:  stats
        ? `${stats.monthRevenue} in so far this month across ${stats.jobsThisMonth} jobs. ${stats.outstanding} still outstanding — want me to chase any of it?`
        : "Loading your summary...",
    }
    showToast(responses[action.id])
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-svh bg-[#f5f4f2]">
      <Toast message={toast.message} visible={toast.visible} />

      {activeNav === 'wiki' ? (
        // ── Wiki screen ──
        <WikiScreen showToast={showToast} />
      ) : (
        // ── Dashboard ──
        <>
          <div className="h-12" />

          {/* Personal header — "Morning, Steve" with app name below */}
          <div className="px-4 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 text-[26px] font-bold leading-tight tracking-tight m-0">
                Morning, Steve
              </h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Plumbers Mate</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0"
              style={{ background: '#2C6E49' }}
            >
              SB
            </div>
          </div>

          {/* Insight card — first thing visible, above stats */}
          <InsightCard
            insight={insight}
            onYes={handleInsightYes}
            onLater={handleInsightLater}
            dismissed={insightDismissed}
          />

          {dashboardError && (
            <div className="mx-4 mt-4 rounded-2xl bg-red-50 px-4 py-3">
              <p className="text-red-500 text-[13px]">Couldn't load dashboard data — check your Supabase connection.</p>
              <p className="text-red-400 text-[11px] mt-0.5 font-mono break-all">{dashboardError}</p>
            </div>
          )}
          <StatsRow stats={stats} loading={dashboardLoading} />
          <QuickActions onAction={handleQuickAction} />
          <ActivityFeed activity={activity} loading={dashboardLoading} />
        </>
      )}

      {/* Bottom nav clearance */}
      <div className="h-24" />

      <BottomNav active={activeNav} onNav={setActiveNav} />
    </div>
  )
}
