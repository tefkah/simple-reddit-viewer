import type { PostListing } from "types";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";

export function MediaThing({
	post,
}: {
	post: PostListing["data"]["children"][0]["data"];
}) {
	if (post.gallery_data) {
		return (
			<Carousel className="max-w-[80%] mx-auto">
				<CarouselContent>
					{Object.entries(post.media_metadata).map(([id, item]) => (
						<CarouselItem key={item.id}>
							<img
								height={item.s.y}
								width={item.s.x}
								className="object-contain max-h-[80vh]"
								src={item.s.u}
								alt={item.id.toString()}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious></CarouselPrevious>
				<CarouselNext></CarouselNext>
			</Carousel>
		);
	}

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
