import { useState, useEffect } from 'react';
import type { PostListing, CommentListing } from 'types';
import { PostListing as PostListingComponent } from '../components/PostListing';
import { CommentListing as CommentSection } from '../components/CommentSection';
import { useParams } from 'react-router';
import { PostSkeleton } from '~/components/Skeleton';
import { CommentSkeleton } from '~/components/Skeleton';
import type { Route } from './+types/redditPage';

export const meta: Route.MetaFunction = (args) => {
  return [{ title: args.data }];
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const reddit = await fetch(`https://www.reddit.com/r/${params['*']}.json`);
  const result = await reddit.json();
  return result;
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

  const [postListing, commentListing] = loaderData;

  return (
    <div>
      <PostListingComponent data={postListing} />
      <CommentSection data={commentListing} />
    </div>
  );
}
