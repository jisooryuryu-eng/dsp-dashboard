import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 팀 멤버
export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar"), // initials-based
});

// 딜 파이프라인
export const deals = sqliteTable("deals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(), // PEF, 부동산, 바이아웃, 매각자문, 항공, 기타
  stage: text("stage").notNull(), // 소싱, 검토, 실사, 투심, 집행, 모니터링, Exit
  assignee: text("assignee").notNull(), // member name
  amount: integer("amount"), // 억원 단위
  description: text("description"),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// 포트폴리오 (투자 완료건)
export const portfolios = sqliteTable("portfolios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fundName: text("fund_name").notNull(),
  companyName: text("company_name").notNull(),
  category: text("category").notNull(),
  investmentAmount: integer("investment_amount"), // 억원
  currentValue: integer("current_value"), // 억원
  investmentDate: text("investment_date"),
  status: text("status").notNull(), // 정상, 주의, 위험
  irr: text("irr"),
  multiple: text("multiple"),
  assignee: text("assignee").notNull(),
});

// 활동 로그
export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // deal_update, meeting, document, comment
  title: text("title").notNull(),
  description: text("description"),
  actor: text("actor").notNull(),
  dealId: integer("deal_id"),
  createdAt: text("created_at").notNull(),
});

// 일정/마감일
export const deadlines = sqliteTable("deadlines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  date: text("date").notNull(),
  dealId: integer("deal_id"),
  type: text("type").notNull(), // meeting, deadline, report, review
  assignee: text("assignee"),
});

// Insert schemas
export const insertMemberSchema = createInsertSchema(members).omit({ id: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true });
export const insertPortfolioSchema = createInsertSchema(portfolios).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertDeadlineSchema = createInsertSchema(deadlines).omit({ id: true });

// Types
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertDeadline = z.infer<typeof insertDeadlineSchema>;
export type Deadline = typeof deadlines.$inferSelect;
