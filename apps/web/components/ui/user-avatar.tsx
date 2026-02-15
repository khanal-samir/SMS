'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface UserAvatarProps {
  name: string | null | undefined
  image?: string | null
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

function UserAvatar({ name, image, size = 'default', className }: UserAvatarProps) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const initials = getInitials(name)
  const avatarSrc = typeof image === 'string' && image.trim().length > 0 ? image : undefined
  const sizeConfig = {
    default: { className: 'size-8', px: 32 },
    sm: { className: 'size-6', px: 24 },
    lg: { className: 'size-10', px: 40 },
  }[size]
  const showFallback = !avatarSrc || hasError || !isLoaded

  React.useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [avatarSrc])

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-brand-accent text-brand-accent-foreground text-xs font-medium',
        sizeConfig.className,
        className,
      )}
    >
      {avatarSrc && (
        <Image
          src={avatarSrc}
          alt={name ?? 'User avatar'}
          fill
          sizes={`${sizeConfig.px}px`}
          className="object-cover"
          onLoadingComplete={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(false)
          }}
        />
      )}
      {showFallback && <span className="relative z-10">{initials}</span>}
    </div>
  )
}

export { UserAvatar, getInitials }
