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

const SubscriptionsVideosSectionsSkeleton = () => {
  return (
    <div
      className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4
 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200)]:grid-cols-6"
    >
      {Array.from({ length: 18 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const SubscriptionsVideosSections = () => {
  return (
    <Suspense fallback={<SubscriptionsVideosSectionsSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SubscriptionsVideosSectionsSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const SubscriptionsVideosSectionsSuspense = () => {
  const [videos, query] =
    trpc.videos.getManySubscribed.useSuspenseInfiniteQuery(
      {
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
       [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200)]:grid-cols-6"
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
