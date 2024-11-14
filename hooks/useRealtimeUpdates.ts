import { useEffect } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase'

interface RealtimeOptions {
  event: 'INSERT' | 'UPDATE' | 'DELETE'
  schema?: string
  table: string
  onData: (payload: any) => void
}

export function useRealtimeUpdates({ event, schema = 'public', table, onData }: RealtimeOptions) {
  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtimeSubscription = async () => {
      channel = supabase.channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event,
            schema,
            table,
          },
          (payload) => {
            onData(payload)
          }
        )
        .subscribe()
    }

    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [event, schema, table, onData])
} 