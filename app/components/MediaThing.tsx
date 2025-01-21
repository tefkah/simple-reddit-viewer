import type { PostListing } from 'types';

export function MediaThing({
  post,
}: {
  post: PostListing['data']['children'][0]['data'];
}) {
  return (
    <div className="mb-4">
      {
        post.media?.reddit_video ? (
          <video
            className="max-h-screen"
            controls={true}
            src={post.media.reddit_video.fallback_url}
            height={post.media.reddit_video.height}
            width={post.media.reddit_video.width}
          />
        ) : (
          post.url && (
            // <a href={post.url} target="_blank" rel="noopener noreferrer">
            <img
              // key={post.ima.source.url}
              src={post.url}
              alt={post.title}
              // width={post.}
              // width={image.source.width}
              // height={image.source.height}
              className="rounded"
            />
          )
        )
        // </a>
      }
      {/* <a
              href={post.url}
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.url}
            </a> */}
    </div>
  );
}
