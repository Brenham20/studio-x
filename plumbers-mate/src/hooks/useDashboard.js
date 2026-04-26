import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function formatGBP(amount) {
  return `£${Number(amount || 0).toLocaleString('en-GB')}`
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const diffMs = Date.now() - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  return `${Math.floor(diffDays / 7)} weeks ago`
}

const TYPE_ICONS = {
  quote_sent: '📋',
  invoice_paid: '✅',
  job_logged: '🔧',
  reminder_set: '📍',
  follow_up_sent: '✉️',
  wiki_entry_added: '📝',
}

export function useDashboard() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)

        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

        const [
          { data: paidInvoices },
          { data: outstandingInvoices },
          { count: jobsThisMonth },
          { count: openQuotes },
          { data: activityData },
          { data: staleQuotes },
        ] = await Promise.all([
          supabase
            .from('invoices')
            .select('amount')
            .eq('status', 'paid')
            .gte('paid_at', startOfMonth.toISOString()),
          supabase
            .from('invoices')
            .select('amount')
            .in('status', ['sent', 'overdue']),
          supabase
            .from('jobs')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'completed')
            .gte('created_at', startOfMonth.toISOString()),
          supabase
            .from('quotes')
            .select('id', { count: 'exact', head: true })
            .in('status', ['sent', 'draft']),
          supabase
            .from('activity_feed')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8),
          supabase
            .from('quotes')
            .select('id, total_amount, sent_at, clients(name), jobs(description)')
            .eq('status', 'sent')
            .is('responded_at', null)
            .lte('sent_at', threeDaysAgo)
            .limit(1),
        ])

        const monthRevenue = (paidInvoices || []).reduce((s, i) => s + Number(i.amount || 0), 0)
        const outstanding = (outstandingInvoices || []).reduce((s, i) => s + Number(i.amount || 0), 0)

        setStats({
          monthRevenue: formatGBP(monthRevenue),
          outstanding: formatGBP(outstanding),
          jobsThisMonth: jobsThisMonth || 0,
          openQuotes: openQuotes || 0,
        })

        setActivity(
          (activityData || []).map((item) => ({
            id: item.id,
            icon: TYPE_ICONS[item.type] || '📌',
            text: item.description,
            time: formatRelativeTime(item.created_at),
          }))
        )

        if (staleQuotes?.length > 0) {
          const q = staleQuotes[0]
          const daysSinceSent = Math.floor((Date.now() - new Date(q.sent_at)) / 86400000)
          setInsight({
            message: `${q.clients?.name} hasn't responded to your quote for the ${q.jobs?.description} in ${daysSinceSent} days. Want me to chase them?`,
            context: `Quote · £${Number(q.total_amount).toLocaleString('en-GB')}`,
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { stats, activity, insight, loading, error }
}
