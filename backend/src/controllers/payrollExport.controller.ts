import { Request, Response } from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import pool from "../config/db";

export const downloadPayrollExcel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { month, year } = req.query;

    const result = await pool.query(
  `
  SELECT
    p.*,
    e.employee_code,
    e.full_name,
    pa.remarks
  FROM payroll p

  LEFT JOIN employees e
  ON p.employee_id = e.id

  LEFT JOIN payroll_adjustments pa
  ON pa.employee_id = p.employee_id
  AND pa.payroll_month = p.payroll_month
  AND pa.payroll_year = p.payroll_year

  WHERE p.payroll_month = $1
  AND p.payroll_year = $2

  ORDER BY e.full_name
  `,
  [month, year]
);

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        `Payroll ${month}-${year}`
      );

    worksheet.columns = [
      {
        header: "Employee",
        key: "full_name",
        width: 25,
      },
      {
        header: "Employee Code",
        key: "employee_code",
        width: 18,
      },
      {
        header: "Gross Salary",
        key: "gross_salary",
        width: 15,
      },
      {
        header: "Payable Days",
        key: "payable_days",
        width: 15,
      },
      {
        header: "Basic",
        key: "basic",
        width: 15,
      },
      {
        header: "HRA",
        key: "hra",
        width: 15,
      },
      {
        header: "Fixed Allowance",
        key: "other_allowance",
        width: 18,
      },
      {
        header: "OT Hours",
        key: "overtime_hours",
        width: 15,
      },
      {
        header: "System OT",
        key: "system_overtime",
        width: 15,
      },
      {
        header: "Bonus",
        key: "bonus",
        width: 15,
      },
      {
        header: "Electricity",
        key: "electricity_bill",
        width: 15,
      },
      {
        header: "Advance",
        key: "advance_amount",
        width: 15,
      },
      {
        header: "System Fine",
        key: "system_fine",
        width: 15,
      },
      {
        header: "Total Earnings",
        key: "total_earnings",
        width: 18,
      },
      {
        header: "Total Deductions",
        key: "total_deductions",
        width: 18,
      },
      {
        header: "Net Salary",
        key: "net_salary",
        width: 18,
      },
      {
        header: "Remarks",
        key: "remarks",
        width: 30,
       },
    ];

    result.rows.forEach(
      (row) => {
        worksheet.addRow(row);
      }
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Payroll_${month}_${year}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to export Excel",
    });

  }
};

export const downloadPayrollPdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { month, year } = req.query;

    const result = await pool.query(
      `
      SELECT
        p.*,
        e.employee_code,
        e.full_name,
        pa.remarks
      FROM payroll p

      LEFT JOIN employees e
      ON p.employee_id = e.id

      LEFT JOIN payroll_adjustments pa
      ON pa.employee_id = p.employee_id
      AND pa.payroll_month = p.payroll_month
      AND pa.payroll_year = p.payroll_year

      WHERE p.payroll_month = $1
      AND p.payroll_year = $2

      ORDER BY e.full_name
      `,
      [month, year]
    );

    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Payroll_${month}_${year}.pdf`
    );

    doc.pipe(res);

    const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

    doc
  .fontSize(20)
  .text(
    "HOSPITAL MANAGEMENT SYSTEM",
    {
      align: "center",
    }
  );

doc
  .fontSize(16)
  .text(
    "PAYROLL REPORT",
    {
      align: "center",
    }
  );

doc.moveDown();

doc
  .fontSize(11)
  .text(
    `Month: ${
      monthNames[Number(month)]
    } ${year}`
  );

doc.text(
  `Generated On: ${new Date().toLocaleDateString()}`
);

doc.moveDown();

let y = doc.y;

const drawTableHeader = () => {

  doc
    .fontSize(10)
    .font("Helvetica-Bold");

  doc.text(
    "Employee Name",
    30,
    y
  );

  doc.text(
    "Code",
    180,
    y
  );

  doc.text(
    "Days",
    240,
    y
  );

  doc.text(
    "Bonus",
    290,
    y
  );

  doc.text(
    "Earnings",
    350,
    y
  );

  doc.text(
    "Deductions",
    430,
    y
  );

  doc.text(
    "Net Salary",
    500,
    y
  );

  y += 20;

  doc.moveTo(
    30,
    y - 5
  )
  .lineTo(
    580,
    y - 5
  )
  .stroke();

  doc.font("Helvetica");
};

drawTableHeader();

let totalNetSalary = 0;
let totalEarnings = 0;
let totalDeductions = 0;

for (const row of result.rows) {

  if (y > 730) {

    doc.addPage();

    y = 40;

    drawTableHeader();
  }

  totalNetSalary +=
    Number(
      row.net_salary || 0
    );

  totalEarnings +=
    Number(
      row.total_earnings || 0
    );

  totalDeductions +=
    Number(
      row.total_deductions || 0
    );

  doc.text(
    row.full_name || "-",
    30,
    y,
    {
      width: 140,
    }
  );

  doc.text(
    row.employee_code || "-",
    180,
    y
  );

  doc.text(
    String(
      row.payable_days || 0
    ),
    240,
    y
  );

  doc.text(
  `Rs. ${Number(
    row.bonus || 0
  ).toFixed(2)}`,
  290,
  y
);

  doc.text(
  `Rs. ${Number(
    row.total_earnings || 0
  ).toFixed(2)}`,
  350,
  y
);


  doc.text(
  `Rs. ${Number(
    row.total_deductions || 0
  ).toFixed(2)}`,
  430,
  y
);

  doc.text(
  `Rs. ${Number(
    row.net_salary || 0
  ).toFixed(2)}`,
  500,
  y
);

  y += 22;
}

y += 20;

doc.moveTo(
  30,
  y
)
.lineTo(
  580,
  y
)
.stroke();

y += 20;

doc
  .fontSize(14)
  .font("Helvetica-Bold")
  .text(
    "Payroll Summary",
    30,
    y
  );

y += 30;

doc
  .fontSize(11)
  .font("Helvetica");

doc.text(
  `Total Employees: ${result.rows.length}`,
  30,
  y
);

y += 20;

doc.text(
  `Total Earnings: Rs. ${totalEarnings.toFixed(2)}`,
  30,
  y
);

y += 20;

doc.text(
  `Total Deductions: Rs. ${totalDeductions.toFixed(2)}`,
  30,
  y
);

y += 20;

doc.text(
  `Total Net Salary: Rs. ${totalNetSalary.toFixed(2)}`,
  30,
  y
);

y += 40;

doc
  .fontSize(9)
  .fillColor("gray")
  .text(
    "Confidential Payroll Report - Generated by Hospital Management System",
    30,
    y
  );

doc.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to export PDF",
    });

  }
};