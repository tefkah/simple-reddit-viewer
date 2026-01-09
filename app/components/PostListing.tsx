import type { PostListing as PostListingType } from "types";
import { decodeHtml } from "../../util";
import { MediaThing } from "./MediaThing";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function PostListing({ data }: { data: PostListingType }) {
	const post = data.data.children[0].data;
	const selftText = post.selftext_html ? decodeHtml(post.selftext_html) : null;

	return (
		<Card>
			<CardHeader>
				<header className="mb-4">
					<div className="text-sm text-gray-600 dark:text-gray-400">
						<span className="font-medium">{post.subreddit_name_prefixed}</span>
						{" • "}
						<span>Posted by u/{post.author}</span>
						{" • "}
						<span>
							{new Date(post.created_utc * 1000).toLocaleDateString()}
						</span>
					</div>
					<CardTitle>
						<h1 className="text-xl font-bold mt-2 text-gray-900 dark:text-gray-100">
							{post.title}
						</h1>
					</CardTitle>
				</header>
			</CardHeader>
			<CardContent>
				{!post.is_self && <MediaThing post={post} />}

				{selftText && (
					<div
						className="prose dark:prose-invert max-w-none mb-4"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: you're not my boss
						dangerouslySetInnerHTML={{ __html: selftText }}
					/>
				)}
			</CardContent>

			<CardFooter>
				<div className="flex items-center gap-4">
					<span>↑ {post.ups} upvotes</span>
					<span>💬ᅠ{post.num_comments} comments</span>
					<span>{(post.upvote_ratio * 100).toFixed(0)}% upvoted</span>
				</div>
			</CardFooter>
		</Card>
	);
}
