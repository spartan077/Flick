'use client'

interface ErrorDisplayProps {
  error: string
  onDismiss?: () => void
  type?: 'error' | 'warning' | 'success'
}

export default function ErrorDisplay({ 
  error, 
  onDismiss, 
  type = 'error' 
}: ErrorDisplayProps) {
  const bgColor = {
    error: 'bg-red-100/10',
    warning: 'bg-yellow-100/10',
    success: 'bg-green-100/10',
  }[type]

  const textColor = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
  }[type]

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg relative`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">{error}</p>
          {type === 'error' && (
            <p className="text-xs mt-1 opacity-75">
              Please try again or contact support if the problem persists.
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-sm opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
} 