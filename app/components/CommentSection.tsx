"use client";

import { useState } from "react";
import type { ChildComment, CommentListing, More, Replies } from "types";
import { cn } from "~/lib/utils";
import { decodeHtml } from "../../util";

export function CommentListing({
	data,
	baseRedditUrl,
}: {
	data: CommentListing;
	baseRedditUrl: string;
}) {
	return (
		<div className="border-t-0 border-border  bg-card flex flex-col py-6 gap-3 p-3">
			{data.data.children.map((comment) => (
				<Comment
					key={comment.data.id}
					comment={comment}
					baseRedditUrl={baseRedditUrl}
				/>
			))}
		</div>
	);
}

export function Comment({
	comment,
	baseRedditUrl,
}: {
	comment: ChildComment;
	baseRedditUrl: string;
}) {
	const { data } = comment;
	const [isExpanded, setIsExpanded] = useState(!comment.data.collapsed);

	// Skip deleted/removed comments
	if (data.body === "[deleted]" || data.body === "[removed]") {
		return null;
	}

	const formatTimestamp = (timestamp: number, edited?: number | false) => {
		const date = new Date(timestamp * 1000);
		const timeAgo = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
		const diffSeconds = (Date.now() - date.getTime()) / 1000;

		if (diffSeconds < 60) return "just now";
		if (diffSeconds < 3600)
			return timeAgo.format(-Math.floor(diffSeconds / 60), "minute");
		if (diffSeconds < 86400)
			return timeAgo.format(-Math.floor(diffSeconds / 3600), "hour");
		if (diffSeconds < 2592000)
			return timeAgo.format(-Math.floor(diffSeconds / 86400), "day");
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
				</span>,
			);
		return awards.length ? (
			<div className="inline-flex gap-2 ml-2">{awards}</div>
		) : null;
	};

	return (
		<div className={cn("flex gap-2", data.is_submitter && "highlight-op")}>
			<div className="w-full flex flex-col gap-2 relative min-w-0">
				<div className="absolute left-2 top-8 w-px bottom-2 bg-border" />
				<div className="text-lg text-muted-foreground flex leading-5 items-center gap-2 flex-wrap font-pixel">
					<button type="button" onClick={() => setIsExpanded(!isExpanded)}>
						{data.profile_img ? (
							<img
								src={data.profile_img}
								alt={data.author}
								className="size-5 ring-1 ring-border"
								loading="lazy"
							/>
						) : (
							<div className="size-5 bg-muted-foreground" />
						)}
					</button>
					<span
						className={cn(
							"font-medium",
							data.is_submitter
								? "text-blue-500 dark:text-blue-400"
								: "text-foreground",
						)}
					>
						{data.author}
						{data.is_submitter && " (OP)"}
					</span>
					{data.author_flair_text && (
						<span className="px-1 bg-muted">{data.author_flair_text}</span>
					)}
					<span>/</span>
					<span>{data.score}pts</span>
					<span>/</span>
					<span title={new Date(data.created_utc * 1000).toLocaleString()}>
						{formatTimestamp(data.created_utc)}
					</span>
					{data.edited && (
						<>
							<span>/</span>
							<span
								className="italic"
								title={new Date(data.edited * 1000).toLocaleString()}
							>
								edited
							</span>
						</>
					)}
					{renderGildings()}
				</div>
				{data.body_html && isExpanded && (
					<div
						className="prose-sm dark:prose-invert max-w-none pl-4 ml-3  text-xs prose-p:my-1 prose-code:px-1 prose-code:bg-muted prose-code:before:content-none prose-code:after:content-none prose-a:text-blue-500 dark:prose-a:text-blue-400 hyphens-auto"
						dangerouslySetInnerHTML={{ __html: decodeHtml(data.body_html) }}
					/>
				)}
				{data.replies && typeof data.replies !== "string" && isExpanded && (
					<div className="flex flex-col ml-6 mt-2 gap-2">
						{data.replies.data.children.map((reply) =>
							reply.kind === "t1" ? (
								<Comment
									key={reply.data.id}
									comment={reply}
									baseRedditUrl={baseRedditUrl}
								/>
							) : (
								<MoreComments
									key={reply.data.id}
									comment={reply}
									baseRedditUrl={baseRedditUrl}
								/>
							),
						)}
					</div>
				)}
			</div>
		</div>
	);
}

function MoreComments({
	comment,
	baseRedditUrl,
}: {
	comment: More;
	baseRedditUrl: string;
}) {
	const [loading, setLoading] = useState(false);
	const [additionalComments, setAdditionalComments] = useState<Replies | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);

	const loadMoreComments = async () => {
		setLoading(true);
		setError(null);
		try {
			// Fetch additional comments using the children IDs
			const response = await fetch(
				`${baseRedditUrl}${comment.data.parent_id?.replace(
					"t1_",
					"",
				)}/.json?raw_json=1&profile_img=true`,
			);
			if (!response.ok) throw new Error("Failed to load comments");
			const data = await response.json();

			const commentListing = data[1] as CommentListing;

			const additionalComments = commentListing.data.children[0];
			// The response should contain an array of new comments
			if (additionalComments.kind === "t1") {
				const additionalReplies = additionalComments.data.replies as Replies;
				setAdditionalComments(additionalReplies);
			} else {
				setAdditionalComments(additionalComments.data.children);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load comments");
		} finally {
			setLoading(false);
		}
	};

	if (error) {
		return <div className="text-red-500 text-xs mt-1">error: {error}</div>;
	}

	return (
		<div className="mt-1 flex flex-col gap-2">
			{additionalComments ? (
				additionalComments.data.children
					.filter((reply) => comment.data.children.includes(reply.data.id))
					.map((c) =>
						c.kind === "t1" ? (
							<Comment
								key={c.data.id}
								comment={c}
								baseRedditUrl={baseRedditUrl}
							/>
						) : (
							<MoreComments
								key={c.data.id}
								comment={c}
								baseRedditUrl={baseRedditUrl}
							/>
						),
					)
			) : (
				<button
					type="button"
					onClick={loadMoreComments}
					disabled={loading}
					className="text-blue-500 dark:text-blue-400 text-xs hover:underline disabled:opacity-50"
				>
					{loading ? "loading..." : `+ ${comment.data.children.length} more`}
				</button>
			)}
		</div>
	);
}
