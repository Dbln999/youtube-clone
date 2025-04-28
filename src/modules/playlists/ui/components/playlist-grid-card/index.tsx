import {
  PlaylistInfo,
  PlaylistInfoSkeleton,
} from "@/modules/playlists/ui/components/playlist-grid-card/playlist-info";
import {
  PlaylistThumbnail,
  PlaylistThumbnailSkeleton,
} from "@/modules/playlists/ui/components/playlist-grid-card/playlist-thumbnail";

import Link from "next/link";
import { PlaylistGetManyOutput } from "@/modules/playlists/types";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full ">
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlist/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          imageUrl={"/placeholder.svg"}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};
