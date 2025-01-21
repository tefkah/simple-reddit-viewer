'use client';

import type { CommentListing, ChildComment } from 'types';
import { decodeHtml } from '../../util';
import { useState } from 'react';

export function CommentListing({ data }: { data: CommentListing }) {
  return (
    <div className="max-w-3xl mx-auto mt-4">
      {data.data.children.map((comment) => (
        <Comment key={comment.data.id} comment={comment} />
      ))}
    </div>
  );
}

export function Comment({ comment }: { comment: ChildComment }) {
  const { data } = comment;
  const [isExpanded, setIsExpanded] = useState(!comment.data.collapsed);

  // Skip deleted/removed comments
  if (data.body === '[deleted]' || data.body === '[removed]') {
    return null;
  }

  const formatTimestamp = (timestamp: number, edited?: number | false) => {
    const date = new Date(timestamp * 1000);
    const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffSeconds = (Date.now() - date.getTime()) / 1000;

    if (diffSeconds < 60) return 'just now';
    if (diffSeconds < 3600)
      return timeAgo.format(-Math.floor(diffSeconds / 60), 'minute');
    if (diffSeconds < 86400)
      return timeAgo.format(-Math.floor(diffSeconds / 3600), 'hour');
    if (diffSeconds < 2592000)
      return timeAgo.format(-Math.floor(diffSeconds / 86400), 'day');
    return date.toLocaleDateString();
  };

  const renderGildings = () => {
    const awards = [];
    if (data.gilded > 0)
      awards.push(
        <span
          key="gold"
          className="inline-flex items-center text-yellow-500"
          title="Gold Award"
        >
          🏅 {data.gilded}
        </span>
      );
    return awards.length ? (
      <div className="inline-flex gap-2 ml-2">{awards}</div>
    ) : null;
  };
  if (data.author === 'Nice_Palpitation_133') {
    console.log(data);
  }

  return (
    <div
      className={`ml-4 mt-4  
      ${data.is_submitter ? 'highlight-op' : ''} flex gap-2`}
    >
      <button
        className="w-0.5 min-w-0.5 h-auto bg-gray-200 dark:bg-gray-400 mr-2 block"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? null : '+'}
      </button>
      <div className="w-full">
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 flex-wrap w-full">
          {/* <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-4 text-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label={isExpanded ? 'Collapse comment' : 'Expand comment'}
          >
            {isExpanded ? '−' : '+'}
          </button> */}

          {/* Author section */}
          <div className="flex items-center gap-2">
            <span
              className={`font-medium ${
                data.is_submitter ? 'text-blue-500 dark:text-blue-400' : ''
              }`}
            >
              {data.author}
            </span>
            {data.author_flair_text && (
              <span className="px-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                {data.author_flair_text}
              </span>
            )}
          </div>

          {/* Score and metadata */}
          <div className="flex items-center gap-2">
            <span>{data.score} points</span>
            <span>•</span>
            <span title={new Date(data.created_utc * 1000).toLocaleString()}>
              {formatTimestamp(data.created_utc)}
            </span>
            {data.edited && (
              <>
                <span>•</span>
                <span
                  className="italic"
                  title={new Date(data.edited * 1000).toLocaleString()}
                >
                  edited {formatTimestamp(data.edited)}
                </span>
              </>
            )}
            {renderGildings()}
          </div>
        </div>

        {data.body_html && (
          <>
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
              className="w-full relative text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded min-h-2"
            >
              {isExpanded ? (
                <div
                  className="mt-2 prose dark:prose-invert max-w-none text-sm
              prose-p:my-2 prose-code:px-1 prose-code:bg-gray-100 prose-code:dark:bg-gray-800 
              prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(data.body_html),
                  }}
                />
              ) : null}
            </button>

            {/* Comment actions */}
            {/* <div className="mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <button className="hover:text-gray-700 dark:hover:text-gray-300">
                Reply
              </button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">
                Share
              </button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">
                Report
              </button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">
                Save
              </button>
            </div> */}

            {/* Nested replies */}
            {data.replies && typeof data.replies !== 'string' && (
              <div className={`mt-2 ${isExpanded ? 'block' : 'hidden'}`}>
                {data.replies.data.children.map((reply) => (
                  <Comment key={reply.data.id} comment={reply} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// function Comment({ comment }: { comment: ChildComment }) {
//   const { data } = comment;
//   const [isExpanded, setIsExpanded] = useState(!comment.data.collapsed);

//   // Skip deleted/removed comments
//   if (data.body === '[deleted]' || data.body === '[removed]') {
//     return null;
//   }

//   return (
//     <div className="ml-4 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
//       <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//         <button
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="w-4 text-center"
//         >
//           {isExpanded ? '−' : '+'}
//         </button>
//         <span className="font-medium">{data.author}</span>
//         <span>•</span>
//         <span>{data.score} points</span>
//         <span>•</span>
//         <span>{new Date(data.created_utc * 1000).toLocaleDateString()}</span>
//       </div>

//       {isExpanded && (
//         <>
//           <div
//             className="mt-2 prose dark:prose-invert max-w-none text-sm"
//             dangerouslySetInnerHTML={{ __html: decodeHtml(data.body_html) }}
//           />

//           {data.replies && typeof data.replies !== 'string' && (
//             <div className="mt-2">
//               {data.replies.data.children.map((reply) => (
//                 <Comment key={reply.data.id} comment={reply} />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
