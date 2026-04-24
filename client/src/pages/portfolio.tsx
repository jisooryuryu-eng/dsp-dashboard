import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, Filter } from "lucide-react";
import { useState } from "react";
import type { Portfolio } from "@shared/schema";

const statusColors: Record<string, string> = {
  "정상": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "주의": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "위험": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function PortfolioPage() {
  const [filterCategory, setFilterCategory] = useState("all");
  const { data: portfolios, isLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
  });

  const filtered = portfolios?.filter(p =>
    filterCategory === "all" || p.category === filterCategory
  );

  const categories = [...new Set(portfolios?.map(p => p.category) || [])];

  // Summary stats
  const totalInvested = filtered?.reduce((s, p) => s + (p.investmentAmount || 0), 0) || 0;
  const totalCurrent = filtered?.reduce((s, p) => s + (p.currentValue || 0), 0) || 0;
  const totalGain = totalCurrent - totalInvested;
  const avgMultiple = filtered?.length
    ? (filtered.reduce((s, p) => s + parseFloat(p.multiple?.replace("x", "") || "1"), 0) / filtered.length).toFixed(2)
    : "0";

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-page-title">포트폴리오</h2>
          <p className="text-sm text-muted-foreground">투자 현황 및 성과 모니터링</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[140px] h-8 text-xs" data-testid="select-portfolio-filter">
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

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">투자원금</div>
            <div className="text-xl font-bold tabular-nums">{totalInvested}억</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">현재가치</div>
            <div className="text-xl font-bold tabular-nums">{totalCurrent}억</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">평가손익</div>
            <div className={`text-xl font-bold tabular-nums flex items-center gap-1 ${totalGain >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {totalGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {totalGain >= 0 ? "+" : ""}{totalGain}억
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1">평균 멀티플</div>
            <div className="text-xl font-bold tabular-nums">{avgMultiple}x</div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">펀드</TableHead>
                    <TableHead className="text-xs">투자기업</TableHead>
                    <TableHead className="text-xs">카테고리</TableHead>
                    <TableHead className="text-xs text-right">투자금</TableHead>
                    <TableHead className="text-xs text-right">현재가치</TableHead>
                    <TableHead className="text-xs text-right">IRR</TableHead>
                    <TableHead className="text-xs text-right">멀티플</TableHead>
                    <TableHead className="text-xs">상태</TableHead>
                    <TableHead className="text-xs">담당</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered?.map(p => {
                    const gain = (p.currentValue || 0) - (p.investmentAmount || 0);
                    const irrVal = parseFloat(p.irr || "0");
                    return (
                      <TableRow key={p.id} data-testid={`row-portfolio-${p.id}`}>
                        <TableCell className="text-xs font-medium">{p.fundName}</TableCell>
                        <TableCell className="text-xs font-medium">{p.companyName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{p.investmentAmount}억</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{p.currentValue}억</TableCell>
                        <TableCell className={`text-xs text-right tabular-nums ${irrVal >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                          <span className="inline-flex items-center gap-0.5">
                            {irrVal > 0 ? <TrendingUp className="w-3 h-3" /> : irrVal < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {p.irr}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-right tabular-nums font-medium">{p.multiple}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`text-[10px] ${statusColors[p.status]}`}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-[10px] font-semibold text-primary">{p.assignee}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
