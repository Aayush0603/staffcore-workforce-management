import { Request, Response } from "express";
import pool from "../config/db";

export const getOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const result =
      await pool.query(`
        SELECT *
        FROM organization_settings
        LIMIT 1
      `);

    res.status(200).json({
      success: true,
      data:
        result.rows[0] || null,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch organization settings",
    });
  }
};

export const updateOrganization =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
  organization_name,
  address,
  city,
  state,
  pincode,
  phone,
  email,
  website,
  gst_number,
  pan_number,
  authorized_signatory,
  authorized_designation,
  logo_url,
  signature_url,
} = req.body;
      const result =
        await pool.query(
          `
          UPDATE organization_settings
          SET
            organization_name = $1,
            address = $2,
            city = $3,
            state = $4,
            pincode = $5,
            phone = $6,
            email = $7,
            website = $8,
            gst_number = $9,
            pan_number = $10,
            authorized_signatory = $11,
            authorized_designation = $12,
            logo_url = $13,
            signature_url = $14
          WHERE id = 1
          RETURNING *
          `,
          [
            organization_name,
            address,
            city,
            state,
            pincode,
            phone,
            email,
            website,
            gst_number,
            pan_number,
            authorized_signatory,
            authorized_designation,
            logo_url,
            signature_url,
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
          "Failed to update organization settings",
      });
    }
  };