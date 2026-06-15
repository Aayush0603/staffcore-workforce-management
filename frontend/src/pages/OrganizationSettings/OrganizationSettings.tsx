import {
  useState,
  useEffect,
} from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import {
  getOrganization,
  updateOrganization,
} from "../../services/organizationService";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

const OrganizationSettings = () => {

  const [formData, setFormData] =
    useState({
      organization_name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      website: "",
      gst_number: "",
      pan_number: "",
      authorized_signatory: "",
      authorized_designation: "",
      logo_url: "",
      signature_url: "",
    });

   useEffect(() => {

  const fetchData =
    async () => {

      try {

        const response =
          await getOrganization();

        if (
          response.data
        ) {

          setFormData({
            organization_name:
              response.data.organization_name || "",
            address:
              response.data.address || "",
            city:
              response.data.city || "",
            state:
              response.data.state || "",
            pincode:
              response.data.pincode || "",
            phone:
              response.data.phone || "",
            email:
              response.data.email || "",
            website:
              response.data.website || "",
            gst_number:
              response.data.gst_number || "",
            pan_number:
              response.data.pan_number || "",
            authorized_signatory:
              response.data.authorized_signatory || "",
            authorized_designation:
              response.data.authorized_designation || "",
            logo_url:
              response.data.logo_url || "",
            signature_url:
               response.data.signature_url || "",
          });

        }

      } catch (error) {

        console.error(error);

      }
    };

  fetchData();

}, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  const uploadFile = async (
  file: File,
  type: "logo" | "signature"
) => {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const data =
      new FormData();

    data.append(
      "file",
      file
    );

    const response =
      await fetch(
        `http://localhost:5000/api/upload/organization/${type}`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: data,
        }
      );

    const result =
      await response.json();

    if (
      result.success
    ) {

      setFormData(
        (prev) => ({
          ...prev,

          [type === "logo"
            ? "logo_url"
            : "signature_url"]:
            result.fileUrl,
        })
      );
    }

  } catch (error) {

    console.error(error);

  }
};

  const handleSave = async () => {

  try {

    await updateOrganization(
      formData
    );

    alert(
      "Organization settings saved successfully"
    );

  } catch (error) {

    console.error(error);

  }
};

  return (
    <AdminLayout>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Organization Settings
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          border:
            "1px solid #E5E7EB",
        }}
      >

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 3,
          }}
        >

          <TextField
            label="Organization Name"
            name="organization_name"
            value={
              formData.organization_name
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={
              formData.phone
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={
              formData.email
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Website"
            name="website"
            value={
              formData.website
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="City"
            name="city"
            value={
              formData.city
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="State"
            name="state"
            value={
              formData.state
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="PIN Code"
            name="pincode"
            value={
              formData.pincode
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="GST Number"
            name="gst_number"
            value={
              formData.gst_number
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="PAN Number"
            name="pan_number"
            value={
              formData.pan_number
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Authorized Signatory"
            name="authorized_signatory"
            value={
              formData.authorized_signatory
            }
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Designation"
            name="authorized_designation"
            value={
              formData.authorized_designation
            }
            onChange={handleChange}
            fullWidth
          />

        </Box>

        <TextField
          label="Address"
          name="address"
          value={
            formData.address
          }
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 3 }}
        />

        {/* Logo Upload */}

        <Box sx={{ mt: 3 }}>

          <Typography
            sx={{
              mb: 1,
              fontWeight: 600,
            }}
          >
            Organization Logo
          </Typography>

          <Button
  variant="outlined"
  component="label"
>
  Upload Logo

  <input
    hidden
    type="file"
    accept="image/*"
    onChange={(e) => {

      const file =
        e.target.files?.[0];

      if (file) {

        uploadFile(
          file,
          "logo"
        );

      }
    }}
  />
</Button>

{formData.logo_url && (

  <Box sx={{ mt: 2 }}>

    <img
      src={
        `http://localhost:5000${formData.logo_url}`
      }
      alt="Logo"
      style={{
        height: "100px",
      }}
    />

  </Box>

)}

        </Box>

        {/* Signature Upload */}

        <Box sx={{ mt: 3 }}>

          <Typography
            sx={{
              mb: 1,
              fontWeight: 600,
            }}
          >
            Authorized Signature
          </Typography>

          <Button
  variant="outlined"
  component="label"
>
  Upload Signature

  <input
    hidden
    type="file"
    accept="image/*"
    onChange={(e) => {

      const file =
        e.target.files?.[0];

      if (file) {

        uploadFile(
          file,
          "signature"
        );

      }
    }}
  />
</Button>

{formData.signature_url && (

  <Box sx={{ mt: 2 }}>

    <img
      src={
        `http://localhost:5000${formData.signature_url}`
      }
      alt="Signature"
      style={{
        height: "80px",
      }}
    />

  </Box>

)}

        </Box>

        <Button
          variant="contained"
          sx={{
            mt: 4,
            px: 5,
            py: 1.2,
            borderRadius: 2,
          }}
          onClick={handleSave}
        >
          Save Settings
        </Button>

      </Paper>

    </AdminLayout>
  );
};

export default OrganizationSettings;