import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, AlertCircle, FileText, Users, CheckCircle } from "lucide-react";
import type { Deadline } from "@shared/schema";

const typeConfig: Record<string, { icon: typeof CalendarDays; label: string; color: string }> = {
  meeting: { icon: Users, label: "미팅", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
  deadline: { icon: AlertCircle, label: "마감", color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" },
  report: { icon: FileText, label: "보고", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
  review: { icon: CheckCircle, label: "검토", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" },
};

export default function CalendarPage() {
  const { data: deadlines, isLoading } = useQuery<Deadline[]>({
    queryKey: ["/api/deadlines"],
  });

  const sorted = deadlines?.sort((a, b) => a.date.localeCompare(b.date));

  const today = new Date().toISOString().split("T")[0];

  // Group by week
  const upcoming = sorted?.filter(d => d.date >= today);
  const past = sorted?.filter(d => d.date < today);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[900px]">
      <div>
        <h2 className="text-lg font-semibold" data-testid="text-page-title">일정 · 마감</h2>
        <p className="text-sm text-muted-foreground">다가오는 일정과 마감일 관리</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : (
        <>
          {/* Upcoming */}
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              다가오는 일정
              {upcoming && <Badge variant="secondary" className="text-xs">{upcoming.length}건</Badge>}
            </h3>
            <div className="space-y-2">
              {upcoming?.map(dl => {
                const config = typeConfig[dl.type] || typeConfig.meeting;
                const Icon = config.icon;
                const daysUntil = Math.ceil((new Date(dl.date).getTime() - new Date(today).getTime()) / 86400000);
                const isUrgent = daysUntil <= 3;

                return (
                  <Card key={dl.id} className={isUrgent ? "border-l-[3px] border-l-red-500" : ""} data-testid={`card-deadline-${dl.id}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 text-center shrink-0">
                        <div className="text-[10px] text-muted-foreground uppercase">
                          {new Date(dl.date).toLocaleDateString("ko-KR", { month: "short" })}
                        </div>
                        <div className="text-lg font-bold tabular-nums leading-tight">
                          {new Date(dl.date).getDate()}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(dl.date).toLocaleDateString("ko-KR", { weekday: "short" })}
                        </div>
                      </div>
                      <div className="w-px h-10 bg-border shrink-0" />
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{dl.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {dl.assignee && (
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-[9px] font-semibold text-primary">{dl.assignee}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{dl.assignee}</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-[10px] h-4">{config.label}</Badge>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {isUrgent ? (
                          <Badge variant="destructive" className="text-[10px]">
                            {daysUntil === 0 ? "오늘" : `D-${daysUntil}`}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground tabular-nums">D-{daysUntil}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {(!upcoming || upcoming.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">예정된 일정이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Past */}
          {past && past.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">지난 일정</h3>
              <div className="space-y-2 opacity-60">
                {past.map(dl => {
                  const config = typeConfig[dl.type] || typeConfig.meeting;
                  const Icon = config.icon;
                  return (
                    <Card key={dl.id} data-testid={`card-past-deadline-${dl.id}`}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className="w-10 text-center shrink-0">
                          <div className="text-xs text-muted-foreground">{new Date(dl.date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}</div>
                        </div>
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${config.color}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-muted-foreground line-through">{dl.title}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
