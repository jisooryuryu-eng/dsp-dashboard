import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import {
  members, deals, portfolios, activities, deadlines,
  type Member, type InsertMember,
  type Deal, type InsertDeal,
  type Portfolio, type InsertPortfolio,
  type Activity, type InsertActivity,
  type Deadline, type InsertDeadline,
} from "@shared/schema";

const sqlite = new Database("dsp.db");
export const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT
  );
  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stage TEXT NOT NULL,
    assignee TEXT NOT NULL,
    amount INTEGER,
    description TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fund_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    category TEXT NOT NULL,
    investment_amount INTEGER,
    current_value INTEGER,
    investment_date TEXT,
    status TEXT NOT NULL,
    irr TEXT,
    multiple TEXT,
    assignee TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    actor TEXT NOT NULL,
    deal_id INTEGER,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS deadlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    deal_id INTEGER,
    type TEXT NOT NULL,
    assignee TEXT
  );
`);

export interface IStorage {
  // Members
  getMembers(): Member[];
  getMember(id: number): Member | undefined;
  createMember(data: InsertMember): Member;

  // Deals
  getDeals(): Deal[];
  getDeal(id: number): Deal | undefined;
  createDeal(data: InsertDeal): Deal;
  updateDeal(id: number, data: Partial<InsertDeal>): Deal | undefined;
  deleteDeal(id: number): void;

  // Portfolios
  getPortfolios(): Portfolio[];
  getPortfolio(id: number): Portfolio | undefined;
  createPortfolio(data: InsertPortfolio): Portfolio;

  // Activities
  getActivities(): Activity[];
  createActivity(data: InsertActivity): Activity;

  // Deadlines
  getDeadlines(): Deadline[];
  createDeadline(data: InsertDeadline): Deadline;
}

export class DatabaseStorage implements IStorage {
  // Members
  getMembers(): Member[] {
    return db.select().from(members).all();
  }
  getMember(id: number): Member | undefined {
    return db.select().from(members).where(eq(members.id, id)).get();
  }
  createMember(data: InsertMember): Member {
    return db.insert(members).values(data).returning().get();
  }

  // Deals
  getDeals(): Deal[] {
    return db.select().from(deals).all();
  }
  getDeal(id: number): Deal | undefined {
    return db.select().from(deals).where(eq(deals.id, id)).get();
  }
  createDeal(data: InsertDeal): Deal {
    return db.insert(deals).values(data).returning().get();
  }
  updateDeal(id: number, data: Partial<InsertDeal>): Deal | undefined {
    const result = db.update(deals).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(deals.id, id)).returning().get();
    return result;
  }
  deleteDeal(id: number): void {
    db.delete(deals).where(eq(deals.id, id)).run();
  }

  // Portfolios
  getPortfolios(): Portfolio[] {
    return db.select().from(portfolios).all();
  }
  getPortfolio(id: number): Portfolio | undefined {
    return db.select().from(portfolios).where(eq(portfolios.id, id)).get();
  }
  createPortfolio(data: InsertPortfolio): Portfolio {
    return db.insert(portfolios).values(data).returning().get();
  }

  // Activities
  getActivities(): Activity[] {
    return db.select().from(activities).all();
  }
  createActivity(data: InsertActivity): Activity {
    return db.insert(activities).values(data).returning().get();
  }

  // Deadlines
  getDeadlines(): Deadline[] {
    return db.select().from(deadlines).all();
  }
  createDeadline(data: InsertDeadline): Deadline {
    return db.insert(deadlines).values(data).returning().get();
  }
}

export const storage = new DatabaseStorage();
