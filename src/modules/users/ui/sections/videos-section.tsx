"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";

import { DEFAULT_LIMIT } from "@/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { trpc } from "@/trpc/client";

interface VideosSectionsProps {
  userId: string;
}

const VideosSectionsSkeleton = () => {
  return (
    <div
      className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
       [@media(min-width:1920px)]:grid-cols-4 [@media(min-width:2200)]:grid-cols-4"
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const VideosSections = ({ userId }: VideosSectionsProps) => {
  return (
    <Suspense fallback={<VideosSectionsSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideosSectionsSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const VideosSectionsSuspense = ({ userId }: VideosSectionsProps) => {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    {
      userId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div
        className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
       [@media(min-width:1920px)]:grid-cols-4 [@media(min-width:2200)]:grid-cols-4"
      >
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
};
