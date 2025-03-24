"use client";

import {
  VideoPlayer,
  VideoPlayerSkeleton,
} from "@/modules/videos/ui/components/video-player";
import {
  VideoTopRow,
  VideoTopRowSkeleton,
} from "@/modules/videos/ui/components/video-top-row";

import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { VideoBanner } from "@/modules/videos/ui/components/video-banner";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";

interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId}></VideoSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const { isSignedIn } = useAuth();

  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId }); // refetch video
    },
  });

  const handlePlay = () => {
    if (!isSignedIn) {
      return;
    }

    createView.mutate({ videoId });
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay={true}
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video}></VideoTopRow>
    </>
  );
};
