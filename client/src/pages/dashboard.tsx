import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp, Briefcase, AlertTriangle, Target,
  ArrowRight, Clock
} from "lucide-react";
import { Link } from "wouter";
import type { Deal, Activity, Deadline } from "@shared/schema";

interface DashboardSummary {
  totalDeals: number;
  activeDeals: number;
  totalAUM: number;
  totalInvested: number;
  stageCount: Record<string, number>;
  categoryCount: Record<string, number>;
  highPriority: number;
  portfolioCount: number;
}

const stages = ["소싱", "검토", "실사", "투심", "집행", "모니터링", "Exit"];
const stageColors: Record<string, string> = {
  "소싱": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  "검토": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "실사": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "투심": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "집행": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "모니터링": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  "Exit": "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
};

const categoryColors: Record<string, string> = {
  "PEF": "bg-blue-500",
  "부동산": "bg-emerald-500",
  "바이아웃": "bg-amber-500",
  "매각자문": "bg-purple-500",
  "항공": "bg-sky-500",
  "기타": "bg-slate-400",
};

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery<DashboardSummary>({
    queryKey: ["/api/dashboard/summary"],
  });

  const { data: deals } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const { data: deadlines } = useQuery<Deadline[]>({
    queryKey: ["/api/deadlines"],
  });

  const upcomingDeadlines = deadlines
    ?.sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  const recentActivities = activities
    ?.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const highPriorityDeals = deals?.filter(d => d.priority === "high").slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-page-title">대시보드</h2>
          <p className="text-sm text-muted-foreground">딜 현황 및 포트폴리오 요약</p>
        </div>
        <Badge variant="outline" className="text-xs tabular-nums">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16" /></CardContent></Card>
          ))
        ) : summary ? (
          <>
            <KPICard icon={Briefcase} label="진행 중 딜" value={summary.activeDeals} sub={`전체 ${summary.totalDeals}건`} />
            <KPICard icon={TrendingUp} label="운용 자산" value={`${summary.totalAUM}억`} sub={`투자원금 ${summary.totalInvested}억`} />
            <KPICard icon={AlertTriangle} label="긴급 딜" value={summary.highPriority} sub="High priority" accent />
            <KPICard icon={Target} label="포트폴리오" value={summary.portfolioCount} sub="투자 기업 수" />
          </>
        ) : null}
      </div>

      {/* Pipeline mini-summary */}
      {summary && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium">파이프라인 현황</CardTitle>
              <Link href="/pipeline" className="text-xs text-primary hover:underline flex items-center gap-1" data-testid="link-pipeline">
                전체보기 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 flex-wrap">
              {stages.map(s => {
                const count = summary.stageCount[s] || 0;
                return (
                  <div key={s} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/50">
                    <span className={`inline-block w-2 h-2 rounded-full ${stageColors[s]?.split(" ")[0] || "bg-slate-300"}`} />
                    <span className="text-xs font-medium">{s}</span>
                    <span className="text-xs tabular-nums font-semibold text-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
            {/* Category breakdown */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {Object.entries(summary.categoryCount).map(([cat, cnt]) => (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${categoryColors[cat] || "bg-slate-400"}`} />
                  <span className="text-xs text-muted-foreground">{cat}</span>
                  <span className="text-xs tabular-nums font-medium">{cnt}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* High-priority deals */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              긴급 딜
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {highPriorityDeals?.map(deal => (
              <div key={deal.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors" data-testid={`card-deal-${deal.id}`}>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{deal.name}</div>
                  <div className="text-xs text-muted-foreground">{deal.category}</div>
                </div>
                <Badge variant="secondary" className={`text-xs shrink-0 ${stageColors[deal.stage]}`}>
                  {deal.stage}
                </Badge>
              </div>
            ))}
            {(!highPriorityDeals || highPriorityDeals.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">긴급 딜 없음</p>
            )}
          </CardContent>
        </Card>

        {/* Recent activities */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium">최근 활동</CardTitle>
              <Link href="/activity" className="text-xs text-primary hover:underline" data-testid="link-activity">
                전체보기
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivities?.map(act => (
              <div key={act.id} className="flex gap-2 p-2 rounded-md hover:bg-muted/30 transition-colors" data-testid={`card-activity-${act.id}`}>
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{act.actor}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm truncate">{act.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(act.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium">다가오는 일정</CardTitle>
              <Link href="/calendar" className="text-xs text-primary hover:underline" data-testid="link-calendar">
                전체보기
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingDeadlines?.map(dl => (
              <div key={dl.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/30 transition-colors" data-testid={`card-deadline-${dl.id}`}>
                <div className="w-10 text-center shrink-0">
                  <div className="text-xs text-muted-foreground">{new Date(dl.date).toLocaleDateString("ko-KR", { month: "short" })}</div>
                  <div className="text-sm font-semibold tabular-nums">{new Date(dl.date).getDate()}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm truncate">{dl.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dl.assignee} · {dl.type === "meeting" ? "미팅" : dl.type === "deadline" ? "마감" : dl.type === "report" ? "보고" : "검토"}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub, accent }: {
  icon: typeof Briefcase;
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-md ${accent ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10"}`}>
            <Icon className={`w-4 h-4 ${accent ? "text-amber-600 dark:text-amber-400" : "text-primary"}`} />
          </div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <div className={`text-xl font-bold tabular-nums ${accent ? "text-amber-600 dark:text-amber-400" : ""}`} data-testid={`kpi-${label}`}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}
