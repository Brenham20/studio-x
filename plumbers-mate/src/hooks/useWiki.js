import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function formatRelativeTime(dateStr) {
  const diffDays = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return '1 month ago'
}

function toViewModel(entry) {
  return {
    id: entry.id,
    category: entry.category,
    title: entry.title,
    body: entry.content,
    tags: entry.tags || [],
    added: formatRelativeTime(entry.created_at),
    source: entry.source || 'text',
  }
}

export function useWiki() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('wiki_entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      setEntries((data || []).map(toViewModel))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addEntry = useCallback(async ({ title, content, category, source = 'text', tags = [] }) => {
    const { data, error: insertError } = await supabase
      .from('wiki_entries')
      .insert({ title, content, category, source, tags })
      .select()
      .single()

    if (insertError) throw insertError

    setEntries((prev) => [toViewModel(data), ...prev])
    return data
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  return { entries, loading, error, addEntry }
}
