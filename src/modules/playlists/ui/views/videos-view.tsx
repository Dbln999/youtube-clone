import { PlaylistHeaderSection } from "@/modules/playlists/ui/sections/playlist-header-section";
import { VideosSections } from "@/modules/playlists/ui/sections/videos-section";

interface VideosViewProps {
  playlistId: string;
}

export const VideosView = ({ playlistId }: VideosViewProps) => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideosSections playlistId={playlistId} />
    </div>
  );
};
