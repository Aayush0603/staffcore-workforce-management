import { Request, Response } from "express";
import pool from "../config/db";


export const generatePayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { month, year } = req.body;

    const currentDate =
  new Date();

const currentMonth =
  currentDate.getMonth() + 1;

const currentYear =
  currentDate.getFullYear();

if (
  Number(year) > currentYear ||
  (
    Number(year) === currentYear &&
    Number(month) > currentMonth
  )
) {
  res.status(400).json({
    success: false,
    message:
      "Future payroll generation is not allowed",
  });
  return;
}

    const existingPayroll =
      await pool.query(
        `
        SELECT id
        FROM payroll
        WHERE payroll_month = $1
        AND payroll_year = $2
        LIMIT 1
        `,
        [month, year]
      );

    if (existingPayroll.rows.length > 0) {
      res.status(400).json({
        success: false,
        message:
          "Payroll already generated for this month",
      });
      return;
    }

    const employeesResult =
      await pool.query(`
        SELECT *
        FROM employees
        WHERE status = 'ACTIVE'
        ORDER BY full_name
      `);

    const employees =
      employeesResult.rows;

      let generatedCount = 0;

    for (const employee of employees) {

    const salaryResult = await pool.query(
    `
    SELECT *
    FROM salary_structures
    WHERE employee_id = $1
    AND effective_from <=
(
  MAKE_DATE(
    $2::int,
    $3::int,
    1
  )
  + INTERVAL '1 month'
  - INTERVAL '1 day'
)
    ORDER BY effective_from DESC
    LIMIT 1
    `,
    [
      employee.id,
      Number(year),
      Number(month),
    ]
  );
      if (salaryResult.rows.length === 0) {

        continue;
      }

      const salary =
        salaryResult.rows[0];

        const adjustmentResult =
  await pool.query(
    `
    SELECT *
    FROM payroll_adjustments
    WHERE employee_id = $1
    AND payroll_month = $2
    AND payroll_year = $3
    ORDER BY id DESC
    LIMIT 1
    `,
    [
      employee.id,
      month,
      year,
    ]
  );

const adjustment =
  adjustmentResult.rows[0] || {};

      const attendanceResult =
        await pool.query(
          `
          SELECT

            COUNT(*) FILTER (
              WHERE status = 'PRESENT'
            ) AS present_days,

            COUNT(*) FILTER (
              WHERE status = 'HALF_DAY'
            ) AS half_days,

            COUNT(*) FILTER (
              WHERE status = 'PAID_LEAVE'
            ) AS paid_leaves,

            COALESCE(
              SUM(overtime_hours),
              0
            ) AS overtime_hours,

            COALESCE(
              SUM(fine_minutes),
              0
            ) AS fine_minutes

          FROM attendance

          WHERE employee_id = $1

          AND EXTRACT(
            MONTH FROM attendance_date
          ) = $2

          AND EXTRACT(
            YEAR FROM attendance_date
          ) = $3
          `,
          [
            employee.id,
            month,
            year,
          ]
        );

      const attendance =
        attendanceResult.rows[0];

        const totalDays =
  Number(attendance.present_days) +
  Number(attendance.half_days) +
  Number(attendance.paid_leaves);

if (totalDays === 0) {
  continue;
}

  const payableDays =
  Number(attendance.present_days) +
  Number(attendance.paid_leaves) +
  (
    Number(attendance.half_days) / 2
  );

const overtimeHours =
  Number(attendance.overtime_hours);

const basic =
  Number(
    salary.basic_salary
  );

const hra =
  Number(
    salary.hra || 0
  );

const otherAllowance =
  Number(
    salary.allowance || 0
  );

const daysInMonth =
  new Date(
    Number(year),
    Number(month),
    0
  ).getDate();

const grossSalary =
  basic +
  hra +
  otherAllowance;

const oneDaySalary =
  grossSalary /
  daysInMonth;

const earnedSalary =
  oneDaySalary *
  payableDays;

  const oneDayBasic =
  basic / daysInMonth;

const oneDayHra =
  hra / daysInMonth;

const oneDayAllowance =
  otherAllowance / daysInMonth;

const earnedBasic =
  Number(
    (oneDayBasic * payableDays).toFixed(2)
  );

const earnedHra =
  Number(
    (oneDayHra * payableDays).toFixed(2)
  );

const earnedAllowance =
  Number(
    (
      oneDayAllowance * payableDays
    ).toFixed(2)
  );

const systemOvertime =
  overtimeHours *
  Number(salary.overtime_rate);

const systemFine =
  Number(attendance.fine_minutes);

const electricityBill =
  Number(
    adjustment.electricity_bill || 0
  );

const advanceAmount =
  Number(
    adjustment.advance_amount || 0
  );

const bonus =
  Number(
    adjustment.bonus || 0
  );

const specialAllowance =
  Number(
    adjustment.special_allowance || 0
  );
const lic =
  Number(
    salary.lic || 0
  );
const pf =
  Number(
    salary.pf || 0
  );
const pt =
  Number(
    salary.pt || 0
  );

const totalEarnings =
  earnedSalary +
  systemOvertime +
  bonus +
  specialAllowance;

const salaryDeduction =
  Number(salary.deduction || 0);

  console.log(
  "Employee:",
  employee.full_name
);

console.log(
  "Salary Deduction:",
  salaryDeduction
);

const totalDeductions =
  electricityBill +
  lic +
  pf +
  advanceAmount +
  pt +
  systemFine +
  salaryDeduction;

const netPayAmount =
  totalEarnings -
  totalDeductions;

const minusHra = 0;
const plusOtDifference = 0;

const netSalary =
  netPayAmount -
  minusHra +
  plusOtDifference;

      await pool.query(
        
        `
        INSERT INTO payroll
        (
          employee_id,
          payroll_month,
          payroll_year,
          gross_salary,
          payable_days,
          present_days,
          half_days,
          paid_leaves,
          fine_minutes,
          overtime_hours,
          basic,
          hra,
          other_allowance,
          system_overtime,
          bonus,
          special_allowance,
          electricity_bill,
          lic,
          pf,
          advance_amount,
          pt,
          system_fine,
          salary_structure_deduction,
          total_earnings,
          total_deductions,
          net_pay_amount,
          minus_hra,
          plus_ot_difference,
          net_salary,
          earned_basic,
          earned_hra,
          earned_allowance
        )
        VALUES
(
  $1,$2,$3,$4,$5,
  $6,$7,$8,$9,$10,
  $11,$12,$13,$14,$15,
  $16,$17,$18,$19,$20,
  $21,$22,$23,$24,$25,
  $26,$27,$28,$29,$30,$31,$32
)
        `,
        [
  employee.id,
  month,
  year,
  grossSalary,
  payableDays,

  Number(attendance.present_days),
  Number(attendance.half_days),
  Number(attendance.paid_leaves),
  Number(attendance.fine_minutes),

  overtimeHours,
  basic,
  hra,
  otherAllowance,
  systemOvertime,
  bonus,
  specialAllowance,
  electricityBill,
  lic,
  pf,
  advanceAmount,
  pt,
  systemFine,
  salaryDeduction,
  totalEarnings,
  totalDeductions,
  netPayAmount,
  minusHra,
  plusOtDifference,
  netSalary,
  earnedBasic,
  earnedHra,
  earnedAllowance,
]
      );

generatedCount++;

    }
    
    if (generatedCount === 0) {
  res.status(400).json({
    success: false,
    message:
      "No attendance found for selected month",
  });
  return;
}

res.status(201).json({
  success: true,
  message:
    `Payroll generated for ${generatedCount} employees`,
});
  } catch (error: any) {

  console.error(
    "Payroll Generation Error:",
    error
  );

  res.status(500).json({
    success: false,
    message:
      error?.message ||
      "Payroll generation failed",
  });

}
};

export const updatePayrollForEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      employee_id,
      month,
      year
    } = req.body;

    const payrollResult =
      await pool.query(
        `
        SELECT *
        FROM payroll
        WHERE employee_id = $1
        AND payroll_month = $2
        AND payroll_year = $3
        LIMIT 1
        `,
        [
          employee_id,
          month,
          year
        ]
      );

    if (payrollResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Payroll record not found"
      });
      return;
    }

    const payroll =
      payrollResult.rows[0];

    const adjustmentResult =
      await pool.query(
        `
        SELECT *
        FROM payroll_adjustments
        WHERE employee_id = $1
        AND payroll_month = $2
        AND payroll_year = $3
        LIMIT 1
        `,
        [
          employee_id,
          month,
          year
        ]
      );

    const adjustment =
      adjustmentResult.rows[0] || {};

    const bonus =
      Number(
        adjustment.bonus || 0
      );

    const specialAllowance =
      Number(
        adjustment.special_allowance || 0
      );

    const electricityBill =
      Number(
        adjustment.electricity_bill || 0
      );

    const advanceAmount =
      Number(
        adjustment.advance_amount || 0
      );

    const totalEarnings =
      (
        Number(payroll.total_earnings)
        -
        Number(payroll.bonus || 0)
        -
        Number(payroll.special_allowance || 0)
      )
      +
      bonus
      +
      specialAllowance;

    const totalDeductions =
      (
        Number(payroll.total_deductions)
        -
        Number(payroll.electricity_bill || 0)
        -
        Number(payroll.advance_amount || 0)
      )
      +
      electricityBill
      +
      advanceAmount;

    const netPayAmount =
      totalEarnings -
      totalDeductions;

    const netSalary =
  netPayAmount
  -
  Number(payroll.minus_hra || 0)
  +
  Number(payroll.plus_ot_difference || 0);
  
    await pool.query(
      `
      UPDATE payroll
      SET
        bonus = $1,
        special_allowance = $2,
        electricity_bill = $3,
        advance_amount = $4,
        total_earnings = $5,
        total_deductions = $6,
        net_pay_amount = $7,
        net_salary = $8,
        updated_at = NOW()
      WHERE employee_id = $9
      AND payroll_month = $10
      AND payroll_year = $11
      `,
      [
        bonus,
        specialAllowance,
        electricityBill,
        advanceAmount,
        totalEarnings,
        totalDeductions,
        netPayAmount,
        netSalary,
        employee_id,
        month,
        year
      ]
    );

    res.status(200).json({
      success: true,
      message:
        "Payroll recalculated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to recalculate payroll"
    });

  }
};

export const getPayrolls = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      month,
      year
    } = req.query;

    if (!month || !year) {
  res.status(400).json({
    success: false,
    message:
      "Month and year are required",
  });
  return;
}

    const result = await pool.query(
      `
     SELECT
  p.*,
  e.employee_code,
  e.full_name
FROM payroll p
LEFT JOIN employees e
ON p.employee_id = e.id

WHERE
  p.payroll_month = $1
AND
  p.payroll_year = $2

ORDER BY p.id DESC
      `,
      [
        month,
        year
      ]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch payroll"
    });

  }
};