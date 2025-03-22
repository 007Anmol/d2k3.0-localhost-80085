// src/components/common/LoadingSpinner.tsx
export default function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
    const sizeClasses = {
      small: 'w-4 h-4 border-2',
      medium: 'w-8 h-8 border-3',
      large: 'w-12 h-12 border-4',
    };
  
    return (
      <div className="flex justify-center items-center p-4">
        <div
          className={`${sizeClasses[size]} rounded-full animate-spin border-primary-500 border-t-transparent`}
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }