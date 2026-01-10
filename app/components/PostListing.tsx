import type { PostListing as PostListingType } from "types";
import { ThemeToggle } from "~/root";
import { decodeHtml } from "../../util";
import { MediaThing } from "./MediaThing";

export function PostListing({ data }: { data: PostListingType }) {
	const post = data.data.children[0].data;
	const selftText = post.selftext_html ? decodeHtml(post.selftext_html) : null;

	return (
		<article className="border border-border bg-card text-card-foreground">
			<header className="border-b border-border px-3 py-2 flex items-center justify-between gap-2">
				<div className="text-sm text-muted-foreground flex items-center gap-1">
					<span className="font-medium text-foreground">
						{post.subreddit_name_prefixed}
					</span>
					<span>/</span>
					<span>u/{post.author}</span>
					<span>/</span>
					<span>{new Date(post.created_utc * 1000).toLocaleDateString()}</span>
				</div>
				<ThemeToggle />
			</header>
			<div className="px-3 py-2 border-b border-border">
				<h1 className="text-base font-medium text-foreground leading-tight">
					{post.title}
				</h1>
			</div>
			{!post.is_self && (
				<div className="border-b border-border">
					<MediaThing post={post} />
				</div>
			)}
			{selftText && (
				<div
					className="px-3 py-2 prose dark:prose-invert prose-sm max-w-none border-b border-border"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: you're not my boss
					dangerouslySetInnerHTML={{ __html: selftText }}
				/>
			)}
			<footer className="px-3 py-2 flex items-center gap-3 text-sm text-muted-foreground">
				<span>{post.ups} pts</span>
				<span>{post.num_comments} comments</span>
				<span>{(post.upvote_ratio * 100).toFixed(0)}%</span>
			</footer>
		</article>
	);
}
