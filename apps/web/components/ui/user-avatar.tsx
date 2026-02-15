import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  const initials = getInitials(name)
  const avatarSrc = image ?? undefined

  return (
    <Avatar size={size} className={cn('rounded-lg', className)}>
      {avatarSrc ? <AvatarImage src={avatarSrc} alt={name ?? 'User avatar'} /> : null}
      <AvatarFallback className="rounded-lg bg-brand-accent text-brand-accent-foreground text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

export { UserAvatar, getInitials }
