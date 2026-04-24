import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, GripVertical, Filter } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Deal } from "@shared/schema";

const stages = ["소싱", "검토", "실사", "투심", "집행", "모니터링", "Exit"];

const stageColorBar: Record<string, string> = {
  "소싱": "border-l-slate-400",
  "검토": "border-l-blue-500",
  "실사": "border-l-amber-500",
  "투심": "border-l-orange-500",
  "집행": "border-l-emerald-500",
  "모니터링": "border-l-purple-500",
  "Exit": "border-l-rose-500",
};

const categoryBadgeColors: Record<string, string> = {
  "PEF": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "부동산": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "바이아웃": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "매각자문": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "항공": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "기타": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const priorityDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-slate-300 dark:bg-slate-600",
};

export default function Pipeline() {
  const [filterCategory, setFilterCategory] = useState("all");

  const { data: deals, isLoading } = useQuery<Deal[]>({
    queryKey: ["/api/deals"],
  });

  const moveDeal = useMutation({
    mutationFn: async ({ id, stage }: { id: number; stage: string }) => {
      await apiRequest("PATCH", `/api/deals/${id}`, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
    },
  });

  const filteredDeals = deals?.filter(d =>
    filterCategory === "all" || d.category === filterCategory
  );

  const categories = [...new Set(deals?.map(d => d.category) || [])];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-page-title">딜 파이프라인</h2>
          <p className="text-sm text-muted-foreground">단계별 딜 현황 · 좌우 이동으로 단계 변경</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px] h-8 text-xs" data-testid="select-category-filter">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 md:px-6 pb-6">
        <div className="flex gap-3 min-w-max pb-4">
          {stages.map(stage => {
            const stageDeals = filteredDeals?.filter(d => d.stage === stage) || [];
            return (
              <div key={stage} className="w-[240px] shrink-0" data-testid={`column-${stage}`}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${stageColorBar[stage]?.replace("border-l-", "bg-")}`} />
                  <span className="text-xs font-semibold uppercase tracking-wide">{stage}</span>
                  <span className="text-xs tabular-nums text-muted-foreground ml-auto">{stageDeals.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-md" />
                    ))
                  ) : stageDeals.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-8 border border-dashed rounded-md">
                      해당 단계 딜 없음
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <DealCard
                        key={deal.id}
                        deal={deal}
                        stage={stage}
                        onMoveLeft={() => {
                          const idx = stages.indexOf(stage);
                          if (idx > 0) moveDeal.mutate({ id: deal.id, stage: stages[idx - 1] });
                        }}
                        onMoveRight={() => {
                          const idx = stages.indexOf(stage);
                          if (idx < stages.length - 1) moveDeal.mutate({ id: deal.id, stage: stages[idx + 1] });
                        }}
                        canMoveLeft={stages.indexOf(stage) > 0}
                        canMoveRight={stages.indexOf(stage) < stages.length - 1}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function DealCard({
  deal,
  stage,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}: {
  deal: Deal;
  stage: string;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
}) {
  return (
    <Card className={`border-l-[3px] ${stageColorBar[stage]} hover:shadow-sm transition-shadow`} data-testid={`card-deal-${deal.id}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{deal.name}</div>
            {deal.description && (
              <div className="text-xs text-muted-foreground truncate mt-0.5">{deal.description}</div>
            )}
          </div>
          <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${priorityDot[deal.priority]}`} title={deal.priority} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${categoryBadgeColors[deal.category] || ""}`}>
            {deal.category}
          </Badge>
          {deal.amount && (
            <span className="text-xs tabular-nums text-muted-foreground">{deal.amount}억</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-primary">{deal.assignee}</span>
            </div>
            <span className="text-xs text-muted-foreground">{deal.assignee}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMoveLeft}
              disabled={!canMoveLeft}
              data-testid={`button-move-left-${deal.id}`}
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMoveRight}
              disabled={!canMoveRight}
              data-testid={`button-move-right-${deal.id}`}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
