import { Request, Response } from "express";
import pool from "../config/db";
import PDFDocument from "pdfkit";

export const downloadSalarySlip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
     SELECT
  p.*,

  e.employee_code,
  e.full_name,
  e.designation,
  e.joining_date,

  d.name AS department_name,

  eed.pan_number,
  eed.uan_number,
  eed.pf_number,

  ebd.bank_name,
  ebd.ifsc_code,
  ebd.account_number,
  ebd.account_holder_name

FROM payroll p

JOIN employees e
ON p.employee_id = e.id

LEFT JOIN departments d
ON e.department_id = d.id

LEFT JOIN employee_employment_details eed
ON e.id = eed.employee_id

LEFT JOIN employee_bank_details ebd
ON e.id = ebd.employee_id

WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Salary slip not found",
      });
      return;
    }

    const payroll = result.rows[0];

    const organizationResult =
  await pool.query(`
    SELECT *
    FROM organization_settings
    LIMIT 1
  `);

const organization =
  organizationResult.rows[0];

    const daysInMonth =
  new Date(
    payroll.payroll_year,
    payroll.payroll_month,
    0
  ).getDate();

const absentDays =
  daysInMonth -
  Number(payroll.present_days || 0)
  -
  Number(payroll.paid_leaves || 0)
  -
  (
    Number(payroll.half_days || 0) / 2
  );

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

const monthYear =
  `${monthNames[
    payroll.payroll_month
  ]} ${payroll.payroll_year}`;

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=SalarySlip_${payroll.employee_code}_${payroll.payroll_month}_${payroll.payroll_year}.pdf`
    );

    doc.pipe(res);

  const formatCurrency = (
  amount: number
) =>
  `Rs. ${Number(
    amount || 0
  ).toLocaleString(
    "en-IN",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

const formatDate = (
  date: string
) =>
  date
    ? new Date(date)
        .toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
    : "-";

    if (organization?.logo_url) {

  try {

    doc.image(
      `.${organization.logo_url}`,
      40,
      35,
      {
        fit: [70, 70],
      }
    );

  } catch (error) {

    console.error(
      "Logo not found"
    );

  }
}

doc
  .fontSize(22)
  .font("Helvetica-Bold")
  .text(
    organization?.organization_name ||
    "Hospital",
    {
      align: "center",
    }
  );

doc
  .fontSize(10)
  .font("Helvetica")
  .text(
    `${organization?.address || ""}`,
    {
      align: "center",
    }
  );

doc.text(
  `${organization?.city || ""}, ${organization?.state || ""} - ${organization?.pincode || ""}`,
  {
    align: "center",
  }
);

doc.text(
  `Phone: ${organization?.phone || "-"} | Email: ${organization?.email || "-"}`,
  {
    align: "center",
  }
);

doc.moveDown();

doc
  .fontSize(18)
  .font("Helvetica-Bold")
  .text(
    "SALARY SLIP",
    {
      align: "center",
    }
  );

doc
  .fontSize(12)
  .text(
    monthYear,
    {
      align: "center",
    }
  );

doc.moveDown();

doc.moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown();

doc
  .fillColor("#0F766E")
  .fontSize(14)
  .font("Helvetica-Bold")
  .text(
    "EMPLOYEE INFORMATION",
    {
      align: "center",
    }
  );

doc.fillColor("black");

doc.moveDown();

const infoLeftX = 50;
const infoValueX = 180;

doc.fontSize(11);

doc.text(
  `Employee Name :`,
  infoLeftX
);
doc.text(
  payroll.full_name || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `Employee Code :`,
  infoLeftX
);
doc.text(
  payroll.employee_code || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `Designation :`,
  infoLeftX
);
doc.text(
  payroll.designation || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `Department :`,
  infoLeftX
);
doc.text(
  payroll.department_name || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `Date Joined :`,
  infoLeftX
);
doc.text(
  formatDate(
    payroll.joining_date
  ),
  infoValueX,
  doc.y - 14
);

doc.moveDown();

doc.text(
  `PAN Number :`,
  infoLeftX
);
doc.text(
  payroll.pan_number || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `UAN Number :`,
  infoLeftX
);
doc.text(
  payroll.uan_number || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `PF Number :`,
  infoLeftX
);
doc.text(
  payroll.pf_number || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `Bank Name :`,
  infoLeftX
);
doc.text(
  payroll.bank_name || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `Account Number :`,
  infoLeftX
);
doc.text(
  payroll.account_number || "-",
  infoValueX,
  doc.y - 14
);

doc.text(
  `IFSC Code :`,
  infoLeftX
);
doc.text(
  payroll.ifsc_code || "-",
  infoValueX,
  doc.y - 14
);

doc.moveDown();

doc.moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown();

doc
  .fillColor("#0F766E")
  .fontSize(14)
  .font("Helvetica-Bold")
  .text(
    "ATTENDANCE SUMMARY",
    40,
    doc.y,
    {
      width: 515,
      align: "center",
    }
  );

doc.fillColor("black");

doc.moveDown();

doc.fontSize(11);

doc.text(
  "Present Days :",
  infoLeftX
);

doc.text(
  String(
    payroll.present_days || 0
  ),
  infoValueX,
  doc.y - 14
);

doc.text(
  "Half Days :",
  infoLeftX
);

doc.text(
  String(
    payroll.half_days || 0
  ),
  infoValueX,
  doc.y - 14
);

doc.text(
  "Paid Leaves :",
  infoLeftX
);

doc.text(
  String(
    payroll.paid_leaves || 0
  ),
  infoValueX,
  doc.y - 14
);

doc.text(
  "Absent Days :",
  infoLeftX
);

doc.text(
  String(absentDays),
  infoValueX,
  doc.y - 14
);

doc.text(
  "Overtime Hours :",
  infoLeftX
);

doc.text(
  String(
    payroll.overtime_hours || 0
  ),
  infoValueX,
  doc.y - 14
);

doc.text(
  "Fine Minutes :",
  infoLeftX
);

doc.text(
  String(
    payroll.fine_minutes || 0
  ),
  infoValueX,
  doc.y - 14
);

doc.moveDown();

doc.moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown();

doc
  .fillColor("#0F766E")
  .fontSize(14)
  .font("Helvetica-Bold")
  .text(
    "EARNINGS",
    40,
    doc.y,
    {
      width: 515,
      align: "center",
    }
  );

doc.fillColor("black");

doc.moveDown(1);

doc.fontSize(11);

doc.text(
  "Basic Earned :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.earned_basic || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "HRA Earned :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.earned_hra || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Allowance Earned :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.earned_allowance || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Bonus :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.bonus || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Special Allowance :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.special_allowance || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Overtime :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.system_overtime || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.moveDown();

doc
  .font("Helvetica-Bold")
  .text(
    "Total Earnings :",
    infoLeftX
  );

doc.text(
  formatCurrency(
    payroll.total_earnings || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.fontSize(12).font("Helvetica-Bold");

doc.moveDown();

doc.moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown();


doc
  .fillColor("#0F766E")
  .fontSize(14)
  .font("Helvetica-Bold")
  .text(
    "DEDUCTIONS",
    40,
    doc.y,
    {
      width: 515,
      align: "center",
    }
  );

doc.fillColor("black");

doc.moveDown();

doc
  .font("Helvetica-Bold")
  .fontSize(11);

doc.text(
  "PF :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.pf || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "PT :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.pt || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "LIC :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.lic || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Advance :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.advance_amount || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Electricity Bill :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.electricity_bill || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "Fixed Deduction :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.salary_structure_deduction || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.text(
  "System Fine :",
  infoLeftX
);

doc.text(
  formatCurrency(
    payroll.system_fine || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);

doc.moveDown();

doc
  .fontSize(12)
  .font("Helvetica-Bold")
  .text(
    "Total Deductions :",
    infoLeftX
  );

doc.text(
  formatCurrency(
    payroll.total_deductions || 0
  ),
  350,
  doc.y - 14,
  {
    width: 150,
    align: "right",
  }
);
doc.addPage();
doc.fillColor("black");
doc.font("Helvetica");

doc.moveDown();

doc.moveTo(40, doc.y)
   .lineTo(555, doc.y)
   .stroke();

doc.moveDown();

console.log(
  "Before Net Payable Y:",
  doc.y
);

/* ==========================
   NET PAYABLE PAGE
========================== */

doc
  .fontSize(24)
  .font("Helvetica-Bold")
  .fillColor("#0F766E")
  .text(
    "NET PAYABLE",
    {
      align: "center"
    }
  );

doc.moveDown(2);

doc
  .rect(
    80,
    200,
    430,
    150
  )
  .lineWidth(2)
  .stroke();

doc
  .fontSize(36)
  .font("Helvetica-Bold")
  .fillColor("black")
  .text(
    formatCurrency(
      payroll.net_salary || 0
    ),
    80,
    255,
    {
      width: 430,
      align: "center"
    }
  );

doc.moveDown(10);

const footerY = 700;

doc
  .moveTo(40, footerY)
  .lineTo(555, footerY)
  .stroke("#D1D5DB");

doc
  .fontSize(9)
  .fillColor("gray")
  .text(
    `Generated On: ${new Date().toLocaleDateString("en-GB")}`,
    40,
    footerY + 10,
    {
      width: 515,
      align: "center",
    }
  );

doc
  .text(
    "Generated electronically by StaffCore Workforce Management System",
    40,
    footerY + 25,
    {
      width: 515,
      align: "center",
    }
  );

doc.moveDown(3);

const signatureY = 620;

if (
  organization?.signature_url
) {

  try {

const signatureY = 620;

doc.image(
  `.${organization.signature_url}`,
  400,
  signatureY,
      {
        fit: [120, 60],
      }
    );

  } catch (error) {

    console.error(
      "Signature not found"
    );

  }
}

doc.moveDown(4);

doc
  .fontSize(11)
  .text(
    organization?.authorized_signatory ||
    "Authorized Signatory",
    380,
    signatureY + 70,
    {
      align: "center",
    }
  );

doc
  .fontSize(10)
  .text(
    organization?.authorized_designation ||
    "",
    380,
    signatureY + 90,
    {
      align: "center",
    }
  );

doc.end()

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to download salary slip",
    });

  }
};

export const getSalarySlips = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
  p.id,
  p.payroll_month,
  p.payroll_year,
  p.net_salary,
  e.employee_code,
  e.full_name,
  e.designation
FROM payroll p
JOIN employees e
  ON p.employee_id = e.id
ORDER BY p.id DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch salary slips"
    });
  }
};