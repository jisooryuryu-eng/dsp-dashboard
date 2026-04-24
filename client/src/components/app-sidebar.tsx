import { LayoutDashboard, GitBranch, Briefcase, Activity, CalendarDays } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "대시보드", url: "/", icon: LayoutDashboard },
  { title: "딜 파이프라인", url: "/pipeline", icon: GitBranch },
  { title: "포트폴리오", url: "/portfolio", icon: Briefcase },
  { title: "활동 피드", url: "/activity", icon: Activity },
  { title: "일정·마감", url: "/calendar", icon: CalendarDays },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar data-testid="sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-label="DSP Logo">
            <rect width="32" height="32" rx="8" fill="hsl(var(--sidebar-primary))" />
            <path d="M8 10h6c4.4 0 8 2.7 8 6s-3.6 6-8 6H8V10z" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="22" cy="16" r="3" fill="white" fillOpacity="0.6" />
          </svg>
          <div>
            <div className="text-sm font-semibold text-sidebar-foreground">DSP</div>
            <div className="text-xs text-sidebar-foreground/60">Deal Tracker</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            메뉴
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url || (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`nav-${item.url.replace("/", "") || "home"}`}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/40">
          Dreamstone Partners
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
