'use client'

import * as React from 'react'
import { Upload, X, FileText, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/formatters'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  selectedFile: File | null
  accept?: string
  maxSize?: number
  disabled?: boolean
  className?: string
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  accept,
  maxSize,
  disabled = false,
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (accept) {
      const acceptedTypes = accept.split(',').map((t) => t.trim())
      const isValid = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase())
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })
      if (!isValid) {
        return 'File type not supported'
      }
    }
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)} limit`
    }
    return null
  }

  const handleFile = (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    onFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemove = () => {
    setError(null)
    onFileSelect(null)
  }

  const isImage = selectedFile?.type.startsWith('image/')

  if (selectedFile) {
    return (
      <div className={cn('flex items-center gap-3 rounded-lg border bg-muted/50 p-3', className)}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background border">
          {isImage ? (
            <ImageIcon className="size-5 text-muted-foreground" />
          ) : (
            <FileText className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="shrink-0"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          error && 'border-destructive/50',
        )}
      >
        <Upload className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Drop your file here, or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {maxSize && `Max size: ${formatFileSize(maxSize)}`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
