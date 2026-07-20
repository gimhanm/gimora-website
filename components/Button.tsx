import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  onClick?: () => void
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
}: ButtonProps) {
  const baseStyles =
    'font-medium transition-all duration-200 inline-flex items-center justify-center rounded-full font-semibold'

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 active:scale-95 shadow-lg',
    secondary: 'bg-secondary text-primary hover:bg-secondary/80',
    outline: 'border-2 border-accent text-white hover:bg-accent/10',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
