import { Request, Response } from "express";
import pool from "../config/db";

export const checkIn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employee_id } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const existing = await pool.query(
      `
      SELECT *
      FROM attendance
      WHERE employee_id = $1
      AND attendance_date = $2
      `,
      [employee_id, today]
    );

    if (existing.rows.length > 0) {
      res.status(400).json({
        success: false,
        message: "Already checked in today",
      });
      return;
    }

    const result = await pool.query(
      `
      INSERT INTO attendance
      (
        employee_id,
        attendance_date,
        check_in
      )
      VALUES
      (
        $1,
        CURRENT_DATE,
        CURRENT_TIMESTAMP
      )
      RETURNING *
      `,
      [employee_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Check-in failed",
    });
  }
};

export const checkOut = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employee_id } = req.body;

    const today = new Date().toISOString().split("T")[0];

    const attendanceResult = await pool.query(
      `
      SELECT *
      FROM attendance
      WHERE employee_id = $1
      AND attendance_date = $2
      `,
      [employee_id, today]
    );

    if (attendanceResult.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No check-in found for today",
      });
      return;
    }

    const attendance = attendanceResult.rows[0];

    if (attendance.check_out) {
      res.status(400).json({
        success: false,
        message: "Already checked out",
      });
      return;
    }

    const checkInTime = new Date(attendance.check_in);
    const checkOutTime = new Date();

    const totalHours =
  (
    checkOutTime.getTime() -
    checkInTime.getTime()
  ) /
  (1000 * 60 * 60);

let status = "ABSENT";

if (totalHours >= 8) {

  status = "PRESENT";

} else if (
  totalHours >= 4
) {

  status = "HALF_DAY";
}

const overtimeHours =
  totalHours > 8
    ? totalHours - 8
    : 0;

    const result = await pool.query(
      `
      UPDATE attendance
SET
  check_out = CURRENT_TIMESTAMP,
  total_hours = $1,
  overtime_hours = $2,
  status = $3
WHERE id = $4
      RETURNING *
      `,
     [
  totalHours.toFixed(2),
  overtimeHours.toFixed(2),
  status,
  attendance.id,
]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Check-out failed",
    });
  }
};

export const getAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT
  a.id,
  a.attendance_date,
  a.check_in,
  a.check_out,
  a.total_hours,
  a.overtime_hours,
  a.fine_minutes,
  a.status,
  a.remarks,
  e.employee_code,
  e.full_name,
  d.name AS department_name
      FROM attendance a
      LEFT JOIN employees e
      ON a.employee_id = e.id
      LEFT JOIN departments d
      ON e.department_id = d.id
      ORDER BY a.attendance_date DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

export const getMonthlyAttendance =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        month,
        year
      } = req.query;

      const result =
        await pool.query(
          `
         SELECT
          a.*,
          e.employee_code,
          e.full_name,
          e.designation
          FROM attendance a
          JOIN employees e
          ON a.employee_id = e.id
          WHERE
            EXTRACT(
              MONTH
              FROM a.attendance_date
            ) = $1
          AND
            EXTRACT(
              YEAR
              FROM a.attendance_date
            ) = $2
          ORDER BY
            e.full_name
          `,
          [month, year]
        );

      res.status(200).json({
        success: true,
        data: result.rows,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch monthly attendance",
      });
    }
  };

  export const getAttendanceDashboard =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const result =
        await pool.query(`
          SELECT
            COUNT(*) FILTER (
              WHERE status = 'PRESENT'
            ) AS present,

            COUNT(*) FILTER (
              WHERE status = 'ABSENT'
            ) AS absent,

            COUNT(*) FILTER (
              WHERE status = 'HALF_DAY'
            ) AS half_day,

            COUNT(*) FILTER (
              WHERE status = 'PAID_LEAVE'
            ) AS paid_leave,

            COUNT(*) FILTER (
              WHERE status = 'UNMARKED'
            ) AS unmarked

          FROM attendance
          WHERE attendance_date =
          CURRENT_DATE
        `);

      res.status(200).json({
        success: true,
        data: result.rows[0],
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard summary",
      });
    }
  };


  export const updateAttendance =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const { id } = req.params;

      const {
  status,
  remarks,
  overtime_hours,
  fine_minutes
} = req.body;

      const result =
        await pool.query(
          `
          UPDATE attendance
SET
  status = $1,
  remarks = $2,
  overtime_hours = $3,
  fine_minutes = $4
WHERE id = $5
RETURNING *
          `,
          [
  status,
  remarks,
  overtime_hours,
  fine_minutes,
  id
]
        );

      res.status(200).json({
        success: true,
        data: result.rows[0],
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Attendance update failed",
      });
    }
  };

  export const bulkMarkAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const {
      attendance_date,
      records
    } = req.body;

    let insertedCount = 0;

    for (const record of records) {

      const existing =
        await pool.query(
          `
          SELECT id
          FROM attendance
          WHERE employee_id = $1
          AND attendance_date = $2
          `,
          [
            record.employee_id,
            attendance_date
          ]
        );

      if (
        existing.rows.length > 0
      ) {
        continue;
      }

      await pool.query(
        `
        INSERT INTO attendance
        (
          employee_id,
          attendance_date,
          status,
          overtime_hours,
          fine_minutes
        )
        VALUES
        (
          $1,
          $2,
          $3,
          0,
          0
        )
        `,
        [
          record.employee_id,
          attendance_date,
          record.status
        ]
      );

      insertedCount++;
    }

    res.status(201).json({
      success: true,
      message:
        `${insertedCount} attendance records saved`
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to save attendance"
    });

  }
};

export const deleteAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM attendance
      WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Attendance deleted"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });

  }
};