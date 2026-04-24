import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

function seedData() {
  // Check if data already exists
  const existingMembers = storage.getMembers();
  if (existingMembers.length > 0) return;

  // 팀 멤버 (placeholder)
  const memberData = [
    { name: "A", role: "대표이사 / 항공금융", avatar: "A" },
    { name: "B", role: "부대표 / 투자총괄", avatar: "B" },
    { name: "C", role: "이사 / 부동산", avatar: "C" },
    { name: "D", role: "팀장 / 관리·준법", avatar: "D" },
    { name: "E", role: "매니저 / 바이오PEF", avatar: "E" },
  ];
  memberData.forEach(m => storage.createMember(m));

  // 딜 파이프라인 - 다양한 카테고리/단계
  const dealData = [
    { name: "부동산 A", category: "부동산", stage: "실사", assignee: "C", amount: 150, description: "서울 오피스 빌딩 개발 사업", priority: "high", createdAt: "2026-03-15", updatedAt: "2026-04-08" },
    { name: "부동산 B", category: "부동산", stage: "소싱", assignee: "C", amount: 80, description: "물류센터 투자건", priority: "medium", createdAt: "2026-04-01", updatedAt: "2026-04-09" },
    { name: "항공 자문 A", category: "항공", stage: "검토", assignee: "A", amount: 200, description: "항공기 리스금융 자문", priority: "high", createdAt: "2026-03-20", updatedAt: "2026-04-07" },
    { name: "항공 자문 B", category: "항공", stage: "집행", assignee: "A", amount: 120, description: "중고항공기 매입 구조화", priority: "medium", createdAt: "2026-02-10", updatedAt: "2026-04-05" },
    { name: "바이오 PEF 신규", category: "PEF", stage: "투심", assignee: "E", amount: 50, description: "바이오 스타트업 시리즈B", priority: "high", createdAt: "2026-03-25", updatedAt: "2026-04-10" },
    { name: "바이오 후속투자", category: "PEF", stage: "모니터링", assignee: "E", amount: 30, description: "기투자 기업 후속 라운드", priority: "medium", createdAt: "2026-01-15", updatedAt: "2026-04-01" },
    { name: "바이아웃 A", category: "바이아웃", stage: "검토", assignee: "B", amount: 300, description: "중견기업 경영권 인수", priority: "high", createdAt: "2026-04-05", updatedAt: "2026-04-10" },
    { name: "매각자문 A", category: "매각자문", stage: "집행", assignee: "B", amount: 100, description: "포트폴리오 기업 매각 자문", priority: "medium", createdAt: "2026-02-20", updatedAt: "2026-04-09" },
    { name: "매각자문 B", category: "매각자문", stage: "소싱", assignee: "D", amount: 60, description: "구조조정 기업 M&A 자문", priority: "low", createdAt: "2026-04-08", updatedAt: "2026-04-10" },
    { name: "PEF Exit 검토", category: "PEF", stage: "Exit", assignee: "B", amount: 45, description: "기투자 기업 Exit 전략", priority: "high", createdAt: "2026-03-01", updatedAt: "2026-04-06" },
    { name: "부동산 C", category: "부동산", stage: "투심", assignee: "C", amount: 200, description: "복합개발 프로젝트", priority: "medium", createdAt: "2026-03-10", updatedAt: "2026-04-07" },
    { name: "기타 자문", category: "기타", stage: "검토", assignee: "D", amount: 20, description: "LP 대상 자문 용역", priority: "low", createdAt: "2026-04-02", updatedAt: "2026-04-09" },
  ];
  dealData.forEach(d => storage.createDeal(d));

  // 포트폴리오
  const portfolioData = [
    { fundName: "DSPE 1호", companyName: "베르티스", category: "PEF", investmentAmount: 30, currentValue: 42, investmentDate: "2024-06-15", status: "정상", irr: "18.5%", multiple: "1.4x", assignee: "E" },
    { fundName: "DSPE 1호", companyName: "퓨쳐메디신", category: "PEF", investmentAmount: 25, currentValue: 28, investmentDate: "2024-09-20", status: "정상", irr: "12.3%", multiple: "1.12x", assignee: "E" },
    { fundName: "DSPE 2호", companyName: "카이노스메드", category: "PEF", investmentAmount: 40, currentValue: 35, investmentDate: "2025-01-10", status: "주의", irr: "-8.2%", multiple: "0.88x", assignee: "B" },
    { fundName: "DSPE 2호", companyName: "엔솔바이오", category: "PEF", investmentAmount: 20, currentValue: 31, investmentDate: "2025-03-05", status: "정상", irr: "22.1%", multiple: "1.55x", assignee: "E" },
    { fundName: "DSPE 3호", companyName: "메디넥스트", category: "PEF", investmentAmount: 35, currentValue: 33, investmentDate: "2025-07-20", status: "정상", irr: "-3.1%", multiple: "0.94x", assignee: "B" },
    { fundName: "부동산 1호", companyName: "강남 오피스 A", category: "부동산", investmentAmount: 100, currentValue: 118, investmentDate: "2024-03-01", status: "정상", irr: "8.7%", multiple: "1.18x", assignee: "C" },
    { fundName: "부동산 1호", companyName: "판교 물류센터", category: "부동산", investmentAmount: 80, currentValue: 85, investmentDate: "2024-11-15", status: "정상", irr: "5.2%", multiple: "1.06x", assignee: "C" },
    { fundName: "항공금융", companyName: "B737-800 #1", category: "항공", investmentAmount: 150, currentValue: 160, investmentDate: "2023-09-01", status: "정상", irr: "6.8%", multiple: "1.07x", assignee: "A" },
    { fundName: "항공금융", companyName: "A320neo #2", category: "항공", investmentAmount: 200, currentValue: 210, investmentDate: "2024-05-10", status: "정상", irr: "5.1%", multiple: "1.05x", assignee: "A" },
  ];
  portfolioData.forEach(p => storage.createPortfolio(p));

  // 활동 로그
  const activityData = [
    { type: "deal_update", title: "부동산 A 실사 진행 시작", description: "법률실사 및 재무실사 킥오프", actor: "C", dealId: 1, createdAt: "2026-04-10T14:00:00" },
    { type: "meeting", title: "항공 자문 A 내부 검토회의", description: "딜 구조 및 리스크 사전 점검", actor: "A", dealId: 3, createdAt: "2026-04-10T11:00:00" },
    { type: "document", title: "바이오 PEF 투심보고서 초안 완료", description: "투자심의위원회 상정 예정", actor: "E", dealId: 5, createdAt: "2026-04-09T17:30:00" },
    { type: "comment", title: "바이아웃 A 초기 밸류에이션 공유", description: "EV/EBITDA 8-10x 범위 추정", actor: "B", dealId: 7, createdAt: "2026-04-09T15:00:00" },
    { type: "deal_update", title: "매각자문 A 바이어 LOI 접수", description: "3개 후보 바이어 중 1차 제안 접수", actor: "B", dealId: 8, createdAt: "2026-04-08T10:00:00" },
    { type: "meeting", title: "DSPE 2호 펀드 LP 정기보고", description: "분기 실적 및 포트폴리오 현황 보고", actor: "D", dealId: null, createdAt: "2026-04-07T14:00:00" },
    { type: "document", title: "PEF Exit 전략보고서 업데이트", description: "Exit 타임라인 및 밸류에이션 시나리오", actor: "B", dealId: 10, createdAt: "2026-04-06T16:00:00" },
    { type: "deal_update", title: "항공 자문 B 실행 완료 근접", description: "최종 클로징 서류 검토 중", actor: "A", dealId: 4, createdAt: "2026-04-05T09:00:00" },
  ];
  activityData.forEach(a => storage.createActivity(a));

  // 일정/마감일
  const deadlineData = [
    { title: "부동산 A 실사보고서 제출", date: "2026-04-18", dealId: 1, type: "deadline", assignee: "C" },
    { title: "바이오 PEF 투심위 상정", date: "2026-04-15", dealId: 5, type: "review", assignee: "E" },
    { title: "항공 자문 B 클로징", date: "2026-04-12", dealId: 4, type: "deadline", assignee: "A" },
    { title: "DSPE 3호 분기보고", date: "2026-04-20", dealId: null, type: "report", assignee: "D" },
    { title: "바이아웃 A 1차 미팅", date: "2026-04-14", dealId: 7, type: "meeting", assignee: "B" },
    { title: "매각자문 A 바이어 PT", date: "2026-04-17", dealId: 8, type: "meeting", assignee: "B" },
    { title: "LP 분기 리포트 발송", date: "2026-04-25", dealId: null, type: "report", assignee: "D" },
    { title: "부동산 C 투심위 준비", date: "2026-04-22", dealId: 11, type: "review", assignee: "C" },
  ];
  deadlineData.forEach(d => storage.createDeadline(d));
}

export async function registerRoutes(server: Server, app: Express) {
  // Seed data on startup
  seedData();

  // Members
  app.get("/api/members", (_req, res) => {
    res.json(storage.getMembers());
  });

  // Deals
  app.get("/api/deals", (_req, res) => {
    res.json(storage.getDeals());
  });

  app.get("/api/deals/:id", (req, res) => {
    const deal = storage.getDeal(Number(req.params.id));
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    res.json(deal);
  });

  app.post("/api/deals", (req, res) => {
    const deal = storage.createDeal(req.body);
    res.status(201).json(deal);
  });

  app.patch("/api/deals/:id", (req, res) => {
    const deal = storage.updateDeal(Number(req.params.id), req.body);
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    res.json(deal);
  });

  app.delete("/api/deals/:id", (req, res) => {
    storage.deleteDeal(Number(req.params.id));
    res.status(204).send();
  });

  // Portfolios
  app.get("/api/portfolios", (_req, res) => {
    res.json(storage.getPortfolios());
  });

  // Activities
  app.get("/api/activities", (_req, res) => {
    res.json(storage.getActivities());
  });

  app.post("/api/activities", (req, res) => {
    const activity = storage.createActivity(req.body);
    res.status(201).json(activity);
  });

  // Deadlines
  app.get("/api/deadlines", (_req, res) => {
    res.json(storage.getDeadlines());
  });

  // Dashboard summary
  app.get("/api/dashboard/summary", (_req, res) => {
    const allDeals = storage.getDeals();
    const allPortfolios = storage.getPortfolios();
    
    const totalDeals = allDeals.length;
    const activeDeals = allDeals.filter(d => !["Exit"].includes(d.stage)).length;
    const totalAUM = allPortfolios.reduce((sum, p) => sum + (p.currentValue || 0), 0);
    const totalInvested = allPortfolios.reduce((sum, p) => sum + (p.investmentAmount || 0), 0);
    
    const stageCount: Record<string, number> = {};
    allDeals.forEach(d => {
      stageCount[d.stage] = (stageCount[d.stage] || 0) + 1;
    });
    
    const categoryCount: Record<string, number> = {};
    allDeals.forEach(d => {
      categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });

    const highPriority = allDeals.filter(d => d.priority === "high").length;

    res.json({
      totalDeals,
      activeDeals,
      totalAUM,
      totalInvested,
      stageCount,
      categoryCount,
      highPriority,
      portfolioCount: allPortfolios.length,
    });
  });
}
