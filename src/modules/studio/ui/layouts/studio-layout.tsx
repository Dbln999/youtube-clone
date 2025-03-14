import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudioSidebar } from "@/modules/studio/ui/components/studio-sidebar";
import { StudioNavbar } from "@/modules/studio/ui/components/studio-navbar";

interface StudioProps {
  children: ReactNode;
}

export const StudioLayout = ({ children }: StudioProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
