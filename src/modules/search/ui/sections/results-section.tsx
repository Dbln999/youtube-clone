"use client";

import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";

import { DEFAULT_LIMIT } from "@/constants";
import { ErrorBoundary } from "react-error-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { trpc } from "@/trpc/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const ResultsSectionSkeleton = () => {
  return (
    <div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-4 p-4 gap-y-10 pt-6 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export const ResultsSection = ({ categoryId, query }: ResultsSectionProps) => {
  return (
    <Suspense
      key={`${query}-${categoryId}`}
      fallback={<ResultsSectionSkeleton />}
    >
      <ErrorBoundary fallback={<p>Error...</p>}>
        <ResultsSectionSuspense categoryId={categoryId} query={query} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResultsSectionSuspense = ({ categoryId, query }: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={resultQuery.hasNextPage}
        fetchNextPage={resultQuery.fetchNextPage}
        isFetchingNextPage={resultQuery.isFetchingNextPage}
      />
    </>
  );
};
