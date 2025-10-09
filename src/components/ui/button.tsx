import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'py-2 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500'
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}