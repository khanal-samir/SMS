'use client'

import { useState } from 'react'
import { Clock } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// ─── Preset definitions ──────────────────────────────────────────────────────

type PresetKey = 'now' | '2m' | '5m' | '15m' | '30m' | '1h' | '2h' | '6h' | '12h' | '24h' | 'custom'

interface Preset {
  value: PresetKey
  label: string
  /** null means "custom" — no automatic offset */
  offsetMs: number | null
}

const QUICK_PRESETS: Preset[] = [
  { value: 'now', label: 'Publish immediately', offsetMs: 0 },
  { value: '2m', label: 'In 2 minutes', offsetMs: 2 * 60_000 },
  { value: '5m', label: 'In 5 minutes', offsetMs: 5 * 60_000 },
  { value: '15m', label: 'In 15 minutes', offsetMs: 15 * 60_000 },
  { value: '30m', label: 'In 30 minutes', offsetMs: 30 * 60_000 },
]

const HOUR_PRESETS: Preset[] = [
  { value: '1h', label: 'In 1 hour', offsetMs: 60 * 60_000 },
  { value: '2h', label: 'In 2 hours', offsetMs: 2 * 60 * 60_000 },
  { value: '6h', label: 'In 6 hours', offsetMs: 6 * 60 * 60_000 },
  { value: '12h', label: 'In 12 hours', offsetMs: 12 * 60 * 60_000 },
  { value: '24h', label: 'In 24 hours', offsetMs: 24 * 60 * 60_000 },
]

const ALL_PRESETS: Preset[] = [...QUICK_PRESETS, ...HOUR_PRESETS]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert an ISO / server date string to the local "YYYY-MM-DDTHH:MM" format
 *  that datetime-local inputs expect. */
function toLocalDatetimeInput(isoString: string): string {
  const date = new Date(isoString)
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

/** Format a Date as a human-readable string, e.g. "Thu, Feb 21 · 4:05 PM" */
function formatPreview(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

interface SchedulePickerProps {
  /** ISO date string when a future date is set, or undefined = publish now */
  value: string | undefined
  onChange: (value: string | undefined) => void
  disabled?: boolean
  className?: string
}

function SchedulePicker({ value, onChange, disabled, className }: SchedulePickerProps) {
  // Initialise once from the external value (edit-mode hydration).
  // After that, all state is internal — we only emit upward via onChange.
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>(() => (value ? 'custom' : 'now'))
  const [customValue, setCustomValue] = useState<string>(() =>
    value ? toLocalDatetimeInput(value) : '',
  )

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handlePresetChange(key: PresetKey) {
    setSelectedPreset(key)

    if (key === 'now') {
      onChange(undefined)
      setCustomValue('')
      return
    }

    if (key === 'custom') {
      // Don't fire onChange yet — wait for the user to fill the datetime input
      return
    }

    // Relative preset — compute the target time and emit it
    const preset = ALL_PRESETS.find((p) => p.value === key)
    if (!preset || preset.offsetMs === null) return
    const target = new Date(Date.now() + preset.offsetMs)
    onChange(target.toISOString())
  }

  function handleCustomChange(raw: string) {
    setCustomValue(raw)
    onChange(raw || undefined)
  }

  // ── Preview text (shown under relative presets) ──────────────────────────────

  const activePreset = ALL_PRESETS.find((p) => p.value === selectedPreset)
  const showPreview =
    selectedPreset !== 'now' &&
    selectedPreset !== 'custom' &&
    activePreset?.offsetMs !== null &&
    activePreset?.offsetMs !== undefined

  const previewDate = showPreview ? new Date(Date.now() + (activePreset!.offsetMs as number)) : null

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={cn('space-y-2', className)}>
      {/* ── Preset select ──────────────────────────────────────────────────── */}
      <Select value={selectedPreset} onValueChange={handlePresetChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent>
          {/* Quick options */}
          <SelectGroup>
            <SelectLabel>Quick</SelectLabel>
            {QUICK_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectSeparator />

          {/* Hour options */}
          <SelectGroup>
            <SelectLabel>Hours</SelectLabel>
            {HOUR_PRESETS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectGroup>

          <SelectSeparator />

          {/* Custom */}
          <SelectGroup>
            <SelectItem value="custom">Custom date &amp; time…</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* ── Preview label for relative presets ────────────────────────────── */}
      {showPreview && previewDate && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          Will publish around{' '}
          <span className="font-medium text-foreground">{formatPreview(previewDate)}</span>
        </p>
      )}

      {/* ── Custom datetime input ──────────────────────────────────────────── */}
      {selectedPreset === 'custom' && (
        <Input
          type="datetime-local"
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          disabled={disabled}
          className="w-full"
        />
      )}
    </div>
  )
}

export { SchedulePicker }
