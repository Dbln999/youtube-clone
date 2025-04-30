import { HydrateClient, trpc } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";
import { VideosView } from "@/modules/playlists/ui/views/videos-view";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    playlistId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  console.log(playlistId);
  void trpc.playlists.getOne.prefetch({ id: playlistId });
  void trpc.playlists.getVideos.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    playlistId,
  });

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Page;
