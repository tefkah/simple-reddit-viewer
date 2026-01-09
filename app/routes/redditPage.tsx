import type { CommentListing, PostListing } from "types";
import { Card } from "~/components/ui/card";
import { CommentListing as CommentSection } from "../components/CommentSection";
import { PostListing as PostListingComponent } from "../components/PostListing";
import type { Route } from "./+types/redditPage";

export const meta: Route.MetaFunction = (args) => {
	const data = args?.data?.postListing?.data?.children[0]?.data;

	if (!data) {
		return [{ title: "Reddit" }];
	}

	return [{ title: data.title }];
};

export async function loader({ params }: Route.LoaderArgs) {
	try {
		const reddit = await fetch(
			`https://www.reddit.com/r/${params["*"]}.json?raw_json=1&profile_img=true`,
		);

		const result = await reddit.json();

		const media = result[0].data.children[0].data;
		console.dir(media.media_metadata, { depth: null });

		// console.log(media);

		return {
			postListing: result[0] as PostListing,
			commentListing: result[1] as CommentListing,
			baseRedditUrl: `https://www.reddit.com/r/${params["*"]}`,
		};
	} catch (error) {
		return {
			error: "Failed to load post",
			errorMessage: error,
		};
	}
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
	if (loaderData.error) {
		return <div>Error loading post: {loaderData.errorMessage}</div>;
	}

	const { postListing, commentListing, baseRedditUrl } = loaderData;

	if (!postListing || !commentListing) {
		return <div>Post not found</div>;
	}

	return (
		<div className="container mx-auto font-mono">
			<header>
				<h1 className="text-2xl font-mono">tefkah.reddit</h1>
			</header>
			<PostListingComponent data={postListing} />
			<CommentSection data={commentListing} baseRedditUrl={baseRedditUrl} />
		</div>
	);
}
