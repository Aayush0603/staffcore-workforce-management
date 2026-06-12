import pool from "../config/db";

export interface PayrollCalculationResult {
  grossSalary: number;
  payableDays: number;
  presentDays: number;
  halfDays: number;
  paidLeaves: number;
  fineMinutes: number;
  overtimeHours: number;

  basic: number;
  hra: number;
  otherAllowance: number;

  systemOvertime: number;

  bonus: number;
  specialAllowance: number;

  electricityBill: number;
  lic: number;
  pf: number;
  advanceAmount: number;
  pt: number;

  systemFine: number;

  totalEarnings: number;
  totalDeductions: number;

  netPayAmount: number;
  minusHra: number;
  plusOtDifference: number;
  netSalary: number;
}