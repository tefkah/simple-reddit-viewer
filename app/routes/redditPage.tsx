import type { PostListing, CommentListing } from 'types';
import { PostListing as PostListingComponent } from '../components/PostListing';
import { CommentListing as CommentSection } from '../components/CommentSection';
import type { Route } from './+types/redditPage';

export const meta: Route.MetaFunction = (args) => {
  const data = args?.data?.postListing?.data?.children[0]?.data;

  if (!data) {
    return [{ title: 'Reddit' }];
  }

  return [{ title: data.title }];
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const reddit = await fetch(
    `https://www.reddit.com/r/${params['*']}.json?raw_json=1&profile_img=true`
  );
  const result = await reddit.json();
  return {
    postListing: result[0] as PostListing,
    commentListing: result[1] as CommentListing,
    baseRedditUrl: `https://www.reddit.com/r/${params['*']}`,
  };
}

// export function HydrateFallback() {
//   return (
//     <div>
//       <PostSkeleton />
//       <div className="max-w-3xl mx-auto mt-4">
//         <CommentSkeleton />
//         <CommentSkeleton />
//         <CommentSkeleton />
//       </div>
//     </div>
//   );
// }

export default function RedditPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return <div>Error loading post</div>;
  }

  const { postListing, commentListing, baseRedditUrl } = loaderData;
  console.log(loaderData);

  if (!postListing || !commentListing) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <PostListingComponent data={postListing} />
      <CommentSection data={commentListing} baseRedditUrl={baseRedditUrl} />
    </div>
  );
}
