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
		<div className="border-x flex flex-col gap-4 p-4">
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
		<div
			className={`
      ${data.is_submitter ? "highlight-op" : ""} flex gap-2`}
		>
			<div className="flex items-center gap-3 flex-col">
				{data.profile_img ? (
					<img
						src={data.profile_img}
						alt={data.author}
						className="size-5 rounded-full ring-1 ring-foreground"
						loading="lazy"
					/>
				) : (
					<div className="size-5 rounded-full bg-muted-foreground" />
				)}
				<button
					className={cn(
						" w-px min-w-px h-full block after:content-[''] after:absolute after:top-0 after:-left-2 after:-right-2 after:w-4 after:bottom-0 after:block",
						isExpanded && "bg-muted-foreground/50",
					)}
					onClick={() => {
						setIsExpanded(!isExpanded);
					}}
					type="button"
				>
					{isExpanded ? null : "+"}
				</button>
			</div>
			<div className="w-full">
				<div className="text-sm  text-muted-foreground flex items-center gap-2 flex-wrap w-full">
					{/* Author section */}
					<div className="flex items-center gap-2">
						<span
							className={`font-medium ${
								data.is_submitter
									? "text-blue-500 dark:text-blue-400"
									: "text-foreground"
							}`}
						>
							{data.author}
							{data.is_submitter && <span className="text-xs"> (OP)</span>}
						</span>
						{data.author_flair_text && (
							<span className="px-1 bg-muted rounded text-xs">
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
						{isExpanded ? (
							<div
								className="prose mt-3 dark:prose-invert max-w-none text-sm
              prose-p:my-2 prose-code:px-1 prose-code:bg-muted prose-code:dark:bg-muted 
              prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-a:text-blue-500 prose-a:dark:text-blue-400"
								dangerouslySetInnerHTML={{
									__html: decodeHtml(data.body_html),
								}}
							/>
						) : null}

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
						{data.replies && typeof data.replies !== "string" && (
							<div className={`mt-2 ${isExpanded ? "block" : "hidden"}`}>
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
					</>
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
		return (
			<div className="text-red-500 text-sm ml-4 mt-2">
				Error loading comments: {error}
			</div>
		);
	}

	return (
		<div className="mt-2">
			{additionalComments ? (
				additionalComments.data.children
					.filter((reply) => comment.data.children.includes(reply.data.id))
					.map((comment) => {
						if (comment.kind === "t1") {
							return (
								<Comment
									key={comment.data.id}
									comment={comment}
									baseRedditUrl={baseRedditUrl}
								/>
							);
						}
						return (
							<MoreComments
								key={comment.data.id}
								comment={comment}
								baseRedditUrl={baseRedditUrl}
							/>
						);
					})
			) : (
				<button
					type="button"
					onClick={loadMoreComments}
					disabled={loading}
					className="text-blue-500 dark:text-blue-400 text-sm hover:underline disabled:opacity-50"
				>
					{loading
						? "Loading..."
						: `Load ${comment.data.children.length} more comments`}
				</button>
			)}
		</div>
	);
}
