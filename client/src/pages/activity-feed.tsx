import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, MessageSquare, Users, GitBranch } from "lucide-react";
import type { Activity } from "@shared/schema";

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  deal_update: { icon: GitBranch, label: "딜 업데이트", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
  meeting: { icon: Users, label: "미팅", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
  document: { icon: FileText, label: "문서", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
  comment: { icon: MessageSquare, label: "코멘트", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" },
};

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const sorted = activities?.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Group by date
  const grouped = sorted?.reduce<Record<string, Activity[]>>((acc, act) => {
    const date = act.createdAt.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(act);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[900px]">
      <div>
        <h2 className="text-lg font-semibold" data-testid="text-page-title">활동 피드</h2>
        <p className="text-sm text-muted-foreground">팀 활동 및 딜 업데이트 타임라인</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : grouped && Object.keys(grouped).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date}>
              <div className="text-xs font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1">
                {formatDate(date)}
              </div>
              <div className="space-y-2">
                {acts.map(act => {
                  const config = typeConfig[act.type] || typeConfig.comment;
                  const Icon = config.icon;
                  return (
                    <Card key={act.id} data-testid={`card-activity-${act.id}`}>
                      <CardContent className="p-4 flex gap-3">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${config.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium">{act.title}</span>
                          </div>
                          {act.description && (
                            <p className="text-xs text-muted-foreground mb-1.5">{act.description}</p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[9px] font-semibold text-primary">{act.actor}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{act.actor}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {config.label}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                              {formatTime(act.createdAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">활동 기록이 없습니다.</p>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function formatTime(dateStr: string): string {
  if (!dateStr.includes("T")) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}
