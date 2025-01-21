export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
}

export function PostSkeleton() {
  return (
    <article className="max-w-3xl mx-auto p-4 bg-white dark:bg-black rounded-lg shadow dark:shadow-gray-800">
      <header className="mb-4">
        <div className="flex gap-2 items-center mb-2">
          <Skeleton className="h-4 w-24" />
          <span className="text-gray-400">•</span>
          <Skeleton className="h-4 w-32" />
          <span className="text-gray-400">•</span>
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-7 w-3/4 mt-2" />
      </header>

      {/* Possible media content */}
      <Skeleton className="w-full h-96 mb-4" />

      {/* Post content */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      <footer>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </footer>
    </article>
  );
}

export function CommentSkeleton({ depth = 0 }: { depth?: number }) {
  return (
    <div className={`ml-4 mt-4 flex gap-2`}>
      <div className="w-0.5 min-w-0.5 bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        {depth < 3 && (
          <div className="mt-4">
            <CommentSkeleton depth={depth + 1} />
            {depth === 0 && <CommentSkeleton depth={depth + 1} />}
          </div>
        )}
      </div>
    </div>
  );
}
