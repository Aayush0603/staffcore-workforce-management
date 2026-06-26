import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputLabel,
} from "@mui/material";

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

import {
  getOrganization,
  updateOrganization,
} from "../../services/organizationService";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

const glassmorphicStyle = {
  p: 3.5,
  borderRadius: 3,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const textFieldStyle = {
  '& .MuiOutlinedInput-root': { 
    borderRadius: 2, 
    backgroundColor: '#ffffff',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
  },
  '& input': {
    py: 1.2,
    color: '#374151',
    fontWeight: 500,
  }
};

const labelStyle = {
  fontWeight: 700,
  color: '#111827',
  mb: 0.8,
  fontSize: '0.85rem'
};

const OrganizationSettings = () => {
  const [formData, setFormData] = useState({
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
    const fetchData = async () => {
      try {
        const response = await getOrganization();
        if (response.data) {
          setFormData({
            organization_name: response.data.organization_name || "",
            address: response.data.address || "",
            city: response.data.city || "",
            state: response.data.state || "",
            pincode: response.data.pincode || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
            website: response.data.website || "",
            gst_number: response.data.gst_number || "",
            pan_number: response.data.pan_number || "",
            authorized_signatory: response.data.authorized_signatory || "",
            authorized_designation: response.data.authorized_designation || "",
            logo_url: response.data.logo_url || "",
            signature_url: response.data.signature_url || "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const uploadFile = async (file: File, type: "logo" | "signature") => {
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("file", file);

      const response = await fetch(`http://localhost:5000/api/upload/organization/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          [type === "logo" ? "logo_url" : "signature_url"]: result.fileUrl,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      await updateOrganization(formData);
      alert("Organization settings saved successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", pt: 1, pb: 6 }}>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", letterSpacing: '-0.5px' }}>
            Organization Settings
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280", mt: 0.5, fontWeight: 500 }}>
            Manage company profile and details.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3, mb: 3 }}>
          
          {/* Basic Information */}
          <Paper elevation={0} sx={glassmorphicStyle}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Basic Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <InputLabel sx={labelStyle}>Organization Name</InputLabel>
                <TextField
                  placeholder="Organization Name"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Website</InputLabel>
                <TextField
                  placeholder="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
            </Box>
          </Paper>

          {/* Contact Details */}
          <Paper elevation={0} sx={glassmorphicStyle}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Contact Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <InputLabel sx={labelStyle}>Phone Number</InputLabel>
                <TextField
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Email</InputLabel>
                <TextField
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <InputLabel sx={labelStyle}>Address</InputLabel>
                  <TextField
                    placeholder="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <InputLabel sx={labelStyle}>City</InputLabel>
                  <TextField
                    placeholder="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <InputLabel sx={labelStyle}>State</InputLabel>
                  <TextField
                    placeholder="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <InputLabel sx={labelStyle}>PIN Code</InputLabel>
                  <TextField
                    placeholder="PIN Code"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Tax & Statutory */}
          <Paper elevation={0} sx={glassmorphicStyle}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Tax & Statutory
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <InputLabel sx={labelStyle}>GST Number</InputLabel>
                <TextField
                  placeholder="GST Number"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>PAN Number</InputLabel>
                <TextField
                  placeholder="PAN Number"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Authorized Signatory</InputLabel>
                <TextField
                  placeholder="Authorized Signatory"
                  name="authorized_signatory"
                  value={formData.authorized_signatory}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
              <Box>
                <InputLabel sx={labelStyle}>Designation</InputLabel>
                <TextField
                  placeholder="Designation"
                  name="authorized_designation"
                  value={formData.authorized_designation}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle}
                />
              </Box>
            </Box>
          </Paper>

        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
          {/* Logo Upload */}
          <Paper elevation={0} sx={{ ...glassmorphicStyle, height: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Organization Logo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUploadOutlinedIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  color: '#3b82f6',
                  borderColor: '#bfdbfe',
                  backgroundColor: '#eff6ff',
                  '&:hover': {
                    backgroundColor: '#dbeafe',
                    borderColor: '#93c5fd'
                  }
                }}
              >
                File Upload
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file, "logo");
                  }}
                />
              </Button>
              <Box 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: 3, 
                  border: '2px dashed #e5e7eb', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  backgroundColor: '#f9fafb',
                  overflow: 'hidden'
                }}
              >
                {formData.logo_url ? (
                  <img
                    src={`http://localhost:5000${formData.logo_url}`}
                    alt="Logo"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: 'contain' }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 500 }}>
                    Preview
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Signature Upload */}
          <Paper elevation={0} sx={{ ...glassmorphicStyle, height: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
              Authorized Signature
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUploadOutlinedIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  color: '#3b82f6',
                  borderColor: '#bfdbfe',
                  backgroundColor: '#eff6ff',
                  '&:hover': {
                    backgroundColor: '#dbeafe',
                    borderColor: '#93c5fd'
                  }
                }}
              >
                File Upload
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file, "signature");
                  }}
                />
              </Button>
              <Box 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: 3, 
                  border: '2px dashed #e5e7eb', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  backgroundColor: '#f9fafb',
                  overflow: 'hidden'
                }}
              >
                {formData.signature_url ? (
                  <img
                    src={`http://localhost:5000${formData.signature_url}`}
                    alt="Signature"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: 'contain' }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 500 }}>
                    Preview
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2, 
            mt: 2,
            pt: 3,
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <Button 
            variant="outlined" 
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              color: '#4b5563', 
              borderColor: '#d1d5db',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#f9fafb',
                borderColor: '#9ca3af'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
              '&:hover': {
                backgroundColor: '#2563eb',
                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)',
              }
            }}
          >
            Save Changes
          </Button>
        </Box>

      </Box>
    </AdminLayout>
  );
};

export default OrganizationSettings;