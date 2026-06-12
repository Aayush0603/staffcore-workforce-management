import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import { getDepartments } from "../../services/departmentService";
import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
} from "../../services/employeeService";

import {
  createPersonalDetails,
  getPersonalDetails,
  updatePersonalDetails,
} from "../../services/personalDetailsService";

import {
  createAddress,
  getAddress,
  updateAddress,
} from "../../services/employeeAddressService";

import {
  createEmploymentDetails,
  getEmploymentDetails,
  updateEmploymentDetails,
} from "../../services/employeeEmploymentService";

import {
  createBankDetails,
  getBankDetails,
  updateBankDetails,
} from "../../services/employeeBankService";

import {
  uploadJoiningLetter,
} from "../../services/uploadService";

const steps = [
  "Profile Information",
  "Personal Details",
  "Address Details",
  "Employment Details",
  "Bank Details",
  "Review & Save",
];
const AddEmployee = () => {
  const navigate = useNavigate();

   const { id } = useParams();

  const isEditMode = !!id;
 
  const [activeStep, setActiveStep] =
    useState(0);

const [employeeId, setEmployeeId] =
  useState<number | null>(null);

    const [departments, setDepartments] =
  useState<any[]>([]);

  const [
  selectedFile,
  setSelectedFile,
] = useState<File | null>(
  null
);

const [profileData, setProfileData] =
  useState({
    employee_code: "",
    full_name: "",
    email: "",
    phone: "",
    designation: "",
    department_id: 0,
    joining_date: "",
    leaving_date: "",
    joining_letter_url: "",
    status: "ACTIVE",
  });

  const [personalData, setPersonalData] =
  useState({
    gender: "",
    date_of_birth: "",
    blood_group: "",
    marital_status: "",
    father_name: "",
    mother_name: "",
    spouse_name: "",
    emergency_contact: "",
    physically_challenged: false,
  });

  const [addressData, setAddressData] =
  useState({
    current_address: "",
    current_city: "",
    current_state: "",
    current_pincode: "",

    permanent_address: "",
    permanent_city: "",
    permanent_state: "",
    permanent_pincode: "",
  });

  const [employmentData, setEmploymentData] =
  useState({
    uan_number: "",
    pan_number: "",
    aadhaar_number: "",
    pf_number: "",
    pf_joining_date: "",
    esi_number: "",
  });

  const [bankData, setBankData] =
  useState({
    bank_name: "",
    ifsc_code: "",
    account_number: "",
    confirm_account_number: "",
    account_holder_name: "",
    upi_id: "",
  });

 const handleNext = async () => {
if (
  activeStep ===
  steps.length - 1
) {

  alert(
    isEditMode
      ? "Employee updated successfully"
      : "Employee setup completed successfully"
  );

  navigate("/employees");

  return;
}

 if (
  profileData.phone.length !== 10
) {

  alert(
    "Phone number must be exactly 10 digits"
  );

  return;
}

        const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (
  !emailRegex.test(
    profileData.email
  )
) {

  alert(
    "Please enter a valid email address"
  );

  return;
}
  try {


  if (activeStep === 0) {

  let joiningLetterUrl =
    profileData.joining_letter_url;

  if (selectedFile) {

    const uploadResponse =
      await uploadJoiningLetter(
        selectedFile
      );

    joiningLetterUrl =
      uploadResponse.fileUrl;
  }

  const employeePayload = {
    employee_code:
      profileData.employee_code,

    full_name:
      profileData.full_name,

    email:
      profileData.email,

    phone:
      profileData.phone,

    department_id:
      profileData.department_id,

    designation:
      profileData.designation,

    joining_date:
      profileData.joining_date,

    leaving_date:
      profileData.leaving_date,

    joining_letter_url:
      joiningLetterUrl,

    status:
      profileData.status,
  };

  if (isEditMode && employeeId) {

    await updateEmployee(
      employeeId,
      employeePayload
    );

  } else if (
    employeeId === null
  ) {

    const response =
      await createEmployee(
        employeePayload
      );

    const newEmployeeId =
      response.data.id;

    setEmployeeId(
      newEmployeeId
    );
  }
}


if (
  activeStep === 1 &&
  employeeId
) {

  if (
    personalData.emergency_contact &&
    personalData.emergency_contact.length !== 10
  ) {

    alert(
      "Emergency contact must be exactly 10 digits"
    );

    return;
  }

  if (isEditMode) {

    const existingDetails =
      await getPersonalDetails(
        employeeId
      );

    if (
      existingDetails?.data
    ) {

      await updatePersonalDetails(
        employeeId,
        personalData
      );

    } else {

      await createPersonalDetails({
        employee_id:
          employeeId,

        ...personalData,
      });
    }

  } else {

    await createPersonalDetails({
      employee_id:
        employeeId,

      ...personalData,
    });
  }
}

if (
  activeStep === 2 &&
  employeeId
) {

  if (isEditMode) {

    await updateAddress(
      employeeId,
      {
        address_type:
          "CURRENT",

        address_line1:
          addressData.current_address,

        address_line2: "",

        city:
          addressData.current_city,

        state:
          addressData.current_state,

        pincode:
          addressData.current_pincode,
      }
    );

    await updateAddress(
      employeeId,
      {
        address_type:
          "PERMANENT",

        address_line1:
          addressData.permanent_address,

        address_line2: "",

        city:
          addressData.permanent_city,

        state:
          addressData.permanent_state,

        pincode:
          addressData.permanent_pincode,
      }
    );

  } else {

    await createAddress(
      employeeId,
      {
        address_type:
          "CURRENT",

        address_line1:
          addressData.current_address,

        address_line2: "",

        city:
          addressData.current_city,

        state:
          addressData.current_state,

        pincode:
          addressData.current_pincode,
      }
    );

    await createAddress(
      employeeId,
      {
        address_type:
          "PERMANENT",

        address_line1:
          addressData.permanent_address,

        address_line2: "",

        city:
          addressData.permanent_city,

        state:
          addressData.permanent_state,

        pincode:
          addressData.permanent_pincode,
      }
    );
  }
}

if (
  activeStep === 3 &&
  employeeId
) {

  if (isEditMode) {

    const existingEmployment =
      await getEmploymentDetails(
        employeeId
      );

    if (
      existingEmployment?.data
    ) {

      await updateEmploymentDetails(
        employeeId,
        employmentData
      );

    } else {

      await createEmploymentDetails(
        employeeId,
        employmentData
      );
    }

  } else {

    await createEmploymentDetails(
      employeeId,
      employmentData
    );
  }
}

if (
  activeStep === 4 &&
  employeeId
) {

  if (
    bankData.account_number !==
    bankData.confirm_account_number
  ) {

    alert(
      "Account numbers do not match"
    );

    return;
  }

  if (isEditMode) {

    const existingBank =
      await getBankDetails(
        employeeId
      );

    if (
      existingBank?.data
    ) {

      await updateBankDetails(
        employeeId,
        bankData
      )

    } else {

      await createBankDetails(
        employeeId,
        bankData
      );
    }

  } else {

    await createBankDetails(
      employeeId,
      bankData
    );
  }
}

    setActiveStep(
      (prev) => prev + 1
    );

  } catch (error: any) {

  console.error(error);

  alert(
    error?.response?.data?.message ||
    "Failed to save employee"
  );
}
};

  const handleBack = () => {
    setActiveStep(
      (prev) => prev - 1
    );
  };

  useEffect(() => {
  const fetchDepartments =
    async () => {
      try {
        const data =
          await getDepartments();

        setDepartments(
          data.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  fetchDepartments();
}, []);

useEffect(() => {

  if (!isEditMode) return;

  const fetchEmployee =
    async () => {

      try {

        const response =
          await getEmployeeById(
            Number(id)
          );

        const employee =
          response.data;

     setProfileData({
  employee_code:
    employee.employee_code || "",

  full_name:
    employee.full_name || "",

  email:
    employee.email || "",

  phone:
    employee.phone || "",

  designation:
    employee.designation || "",

  department_id:
    employee.department_id || 0,

  joining_date:
    employee.joining_date?.split("T")[0] || "",

  leaving_date:
    employee.leaving_date?.split("T")[0] || "",

  joining_letter_url:
    employee.joining_letter_url || "",

  status:
    employee.status || "ACTIVE",
});

        setEmployeeId(
          employee.id
        );
        try {

  const personalResponse =
    await getPersonalDetails(
      employee.id
    );

  if (
    personalResponse.data
  ) {

    setPersonalData({
      gender:
        personalResponse.data.gender || "",

      date_of_birth:
        personalResponse.data
          .date_of_birth
          ?.split("T")[0] || "",

      blood_group:
        personalResponse.data.blood_group || "",

      marital_status:
        personalResponse.data.marital_status || "",

      father_name:
        personalResponse.data.father_name || "",

      mother_name:
        personalResponse.data.mother_name || "",

      spouse_name:
        personalResponse.data.spouse_name || "",

      emergency_contact:
        personalResponse.data.emergency_contact || "",

      physically_challenged:
        personalResponse.data.physically_challenged || false,
    });
  }

  const addressResponse =
  await getAddress(
    employee.id
  );

if (
  addressResponse.data
) {

  const currentAddress =
    addressResponse.data.find(
      (address: any) =>
        address.address_type ===
        "CURRENT"
    );

  const permanentAddress =
    addressResponse.data.find(
      (address: any) =>
        address.address_type ===
        "PERMANENT"
    );

  setAddressData({
    current_address:
      currentAddress
        ?.address_line1 || "",

    current_city:
      currentAddress
        ?.city || "",

    current_state:
      currentAddress
        ?.state || "",

    current_pincode:
      currentAddress
        ?.pincode || "",

    permanent_address:
      permanentAddress
        ?.address_line1 || "",

    permanent_city:
      permanentAddress
        ?.city || "",

    permanent_state:
      permanentAddress
        ?.state || "",

    permanent_pincode:
      permanentAddress
        ?.pincode || "",
  });
}

const employmentResponse =
  await getEmploymentDetails(
    employee.id
  );

if (
  employmentResponse.data
) {

  setEmploymentData({
    uan_number:
      employmentResponse.data
        .uan_number || "",

    pan_number:
      employmentResponse.data
        .pan_number || "",

    aadhaar_number:
      employmentResponse.data
        .aadhaar_number || "",

    pf_number:
      employmentResponse.data
        .pf_number || "",

    pf_joining_date:
      employmentResponse.data
        .pf_joining_date
        ?.split("T")[0] || "",

    esi_number:
      employmentResponse.data
        .esi_number || "",
  });
}

const bankResponse =
  await getBankDetails(
    employee.id
  );

if (
  bankResponse.data
) {

  setBankData({
    bank_name:
      bankResponse.data
        .bank_name || "",

    ifsc_code:
      bankResponse.data
        .ifsc_code || "",

    account_number:
      bankResponse.data
        .account_number || "",

    confirm_account_number:
      bankResponse.data
        .account_number || "",

    account_holder_name:
      bankResponse.data
        .account_holder_name || "",

    upi_id:
      bankResponse.data
        .upi_id || "",
  });
}

} catch (error) {

  console.error(error);

}

      } catch (error) {
        console.error(error);
      }
    };

  fetchEmployee();

}, [id, isEditMode]);

  return (
  <AdminLayout>

    <Box
      sx={{
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        {isEditMode
          ? "Edit Employee"
          : "Add Employee"}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
      >
        Manage employee profile, personal,
        employment and banking details.
      </Typography>
    </Box>

    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        borderRadius: 4,
        border:
          "1px solid #E5E7EB",
      }}
    >

      <Box sx={{ mb: 3 }}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
      mb: 1,
    }}
  >
    Add Employee
  </Typography>

  <Typography
    color="text.secondary"
  >
    Create and manage employee records in StaffCore.
  </Typography>
</Box>

        <Stepper
  activeStep={activeStep}
  alternativeLabel
  sx={{
  mb: 3,
  "& .MuiStepLabel-label": {
    fontSize: "0.85rem",
  },
}}
>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>

          {activeStep === 0 && (
  <Box
    sx={{
      display: "grid",
      gap: 2,
     gridTemplateColumns: {
  xs: "1fr",
  md: "1fr 1fr",
},
    }}
  >
   <TextField
  size="small"
  label="Employee Code"
  fullWidth
  value={profileData.employee_code}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      employee_code: e.target.value,
    })
  }
/>

    <TextField
  size="small"
  label="Full Name"
  fullWidth
  value={profileData.full_name}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      full_name: e.target.value,
    })
  }
/>
    <TextField
  size="small"
  label="Email"
  fullWidth
  value={profileData.email}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      email: e.target.value,
    })
  }
/>

  <TextField
  size="small"
  label="Phone"
  fullWidth
  value={profileData.phone}
  error={
    profileData.phone.length > 0 &&
    profileData.phone.length !== 10
  }
  helperText={
    profileData.phone.length > 0 &&
    profileData.phone.length !== 10
      ? "Phone number must be 10 digits"
      : ""
  }
  onChange={(e) => {

    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );

    if (value.length <= 10) {
      setProfileData({
        ...profileData,
        phone: value,
      });
    }
  }}
/>

    <TextField
  size="small"
  select
  label="Designation"
  fullWidth
  value={profileData.designation}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      designation: e.target.value,
    })
  }
>
  <MenuItem value="RMO">RMO</MenuItem>

  <MenuItem value="Chief Accountant">
    Chief Accountant
  </MenuItem>

  <MenuItem value="Coordinator">
    Coordinator
  </MenuItem>

  <MenuItem value="Superviser">
    Superviser
  </MenuItem>

  <MenuItem value="Cashier">
    Cashier
  </MenuItem>

  <MenuItem value="Clerk">
    Clerk
  </MenuItem>

  <MenuItem value="Nurse">
    Nurse
  </MenuItem>

  <MenuItem value="Aaya">
    Aaya
  </MenuItem>

  <MenuItem value="Lab Technician">
    Lab Technician
  </MenuItem>

  <MenuItem value="Xray Technician">
    Xray Technician
  </MenuItem>

  <MenuItem value="Watch">
    Watch
  </MenuItem>

  <MenuItem value="Gardener">
    Gardener
  </MenuItem>

  <MenuItem value="Store Keeper">
    Store Keeper
  </MenuItem>

  <MenuItem value="Admin Staff">
    Admin Staff
  </MenuItem>

  <MenuItem value="Medical Officer">
    Medical Officer
  </MenuItem>
</TextField>

    <TextField
  size="small"
  select
  label="Department"
  fullWidth
  value={
  profileData.department_id || ""
}
  onChange={(e) =>
  setProfileData({
    ...profileData,
    department_id: Number(
      e.target.value
    ),
  })
}
>
  {departments.map(
    (department) => (
      <MenuItem
  key={department.id}
  value={department.id}
>
  {department.name}
</MenuItem>
    )
  )}
</TextField>

    <TextField
  size="small"
  label="Joining Date"
  type="date"
  fullWidth
  value={profileData.joining_date}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      joining_date: e.target.value,
    })
  }
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>

<TextField
  size="small"
  type="date"
  label="Leaving Date"
  fullWidth
  value={profileData.leaving_date}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      leaving_date: e.target.value,
    })
  }
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>

<Box>

  <Typography
    variant="body2"
    sx={{
      mb: 1,
      fontWeight: 500,
    }}
  >
    Upload Letter
  </Typography>

  <Button
    component="label"
    variant="outlined"
    size="small"
  >
    Choose File

    <input
  hidden
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={(e) => {

    if (
      e.target.files &&
      e.target.files[0]
    ) {

      setSelectedFile(
        e.target.files[0]
      );
    }
  }}
/>
  </Button>

  {selectedFile && (
  <Box
    sx={{
      mt: 1,
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Typography
      variant="body2"
      color="success.main"
    >
      {selectedFile.name}
    </Typography>

    <IconButton
      size="small"
      color="error"
      onClick={() =>
        setSelectedFile(null)
      }
    >
      <CloseIcon />
    </IconButton>
  </Box>
)}

{profileData.joining_letter_url && (
  <Button
    variant="outlined"
    size="small"
    component="a"
    href={`http://localhost:5000${profileData.joining_letter_url}`}
    target="_blank"
  >
    View Letter
  </Button>
)}
</Box>

   <TextField
  size="small"
  select
  label="Status"
  fullWidth
  value={profileData.status}
  onChange={(e) =>
    setProfileData({
      ...profileData,
      status: e.target.value,
    })
  }
>
  <MenuItem value="ACTIVE">
    ACTIVE
  </MenuItem>

  <MenuItem value="INACTIVE">
    INACTIVE
  </MenuItem>
</TextField>

  </Box>
)}



          {activeStep === 1 && (
  <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 2,
  }}
>
   <TextField
  size="small"
  select
  label="Gender"
  fullWidth
  value={personalData.gender}
  onChange={(e) =>
    setPersonalData({
      ...personalData,
      gender: e.target.value,
    })
  }
>
  <MenuItem value="Male">
    Male
  </MenuItem>

  <MenuItem value="Female">
    Female
  </MenuItem>

  <MenuItem value="Other">
    Other
  </MenuItem>
</TextField>

    <TextField
      size="small"
      label="Date Of Birth"
      type="date"
      fullWidth
      value={personalData.date_of_birth}
      onChange={(e) =>
        setPersonalData({
          ...personalData,
          date_of_birth:
            e.target.value,
        })
      }
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
    />

    <TextField
  size="small"
  select
  label="Blood Group"
  fullWidth
  value={personalData.blood_group}
  onChange={(e) =>
    setPersonalData({
      ...personalData,
      blood_group: e.target.value,
    })
  }
>
  <MenuItem value="A+">A+</MenuItem>
  <MenuItem value="A-">A-</MenuItem>
  <MenuItem value="B+">B+</MenuItem>
  <MenuItem value="B-">B-</MenuItem>
  <MenuItem value="AB+">AB+</MenuItem>
  <MenuItem value="AB-">AB-</MenuItem>
  <MenuItem value="O+">O+</MenuItem>
  <MenuItem value="O-">O-</MenuItem>
</TextField>

    <TextField
  size="small"  
  select
  label="Marital Status"
  fullWidth
  value={personalData.marital_status}
  onChange={(e) =>
    setPersonalData({
      ...personalData,
      marital_status: e.target.value,
    })
  }
>
  <MenuItem value="Single">
    Single
  </MenuItem>

  <MenuItem value="Married">
    Married
  </MenuItem>

  <MenuItem value="Divorced">
    Divorced
  </MenuItem>

  <MenuItem value="Widowed">
    Widowed
  </MenuItem>
</TextField>

    <TextField
      size="small"
      label="Father Name"
      fullWidth
      value={personalData.father_name}
      onChange={(e) =>
        setPersonalData({
          ...personalData,
          father_name:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="Mother Name"
      fullWidth
      value={personalData.mother_name}
      onChange={(e) =>
        setPersonalData({
          ...personalData,
          mother_name:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="Spouse Name"
      fullWidth
      value={personalData.spouse_name}
      onChange={(e) =>
        setPersonalData({
          ...personalData,
          spouse_name:
            e.target.value,
        })
      }
    />

    <TextField
  size="small"
  label="Emergency Contact"
  fullWidth
  value={
    personalData.emergency_contact
  }
  error={
    personalData.emergency_contact.length > 0 &&
    personalData.emergency_contact.length !== 10
  }
  helperText={
    personalData.emergency_contact.length > 0 &&
    personalData.emergency_contact.length !== 10
      ? "Emergency contact must be 10 digits"
      : ""
  }
  onChange={(e) => {

    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );

    if (value.length <= 10) {
      setPersonalData({
        ...personalData,
        emergency_contact: value,
      });
    }
  }}
/>

    <TextField
  size="small"
  select
  label="Physically Challenged"
  fullWidth
  value={
    personalData.physically_challenged
      ? "Yes"
      : "No"
  }
  onChange={(e) =>
    setPersonalData({
      ...personalData,
      physically_challenged:
        e.target.value === "Yes",
    })
  }
>
  <MenuItem value="No">
    No
  </MenuItem>

  <MenuItem value="Yes">
    Yes
  </MenuItem>
</TextField>

  </Box>
)}



         {activeStep === 2 && (
  <Box>

    {/* Current Address Card */}

    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
        }}
      >
        Current Address
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <TextField
          size="small"
          label="Current Address"
          fullWidth
          value={addressData.current_address}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              current_address: e.target.value,
            })
          }
        />

        <TextField
          size="small"
          label="Current City"
          fullWidth
          value={addressData.current_city}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              current_city: e.target.value,
            })
          }
        />

        <TextField
          size="small"
          label="Current State"
          fullWidth
          value={addressData.current_state}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              current_state: e.target.value,
            })
          }
        />

        <TextField
          size="small"
          label="Current Pincode"
          fullWidth
          value={addressData.current_pincode}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              current_pincode: e.target.value,
            })
          }
        />
      </Box>
    </Paper>

    {/* Permanent Address Card */}

    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #E5E7EB",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
          }}
        >
          Permanent Address
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            setAddressData({
              ...addressData,
              permanent_address:
                addressData.current_address,
              permanent_city:
                addressData.current_city,
              permanent_state:
                addressData.current_state,
              permanent_pincode:
                addressData.current_pincode,
            })
          }
        >
          Use Current Address
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <TextField
          size="small"
          label="Permanent Address"
          fullWidth
          value={addressData.permanent_address}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              permanent_address:
                e.target.value,
            })
          }
        />

        <TextField
          size="small"
          label="Permanent City"
          fullWidth
          value={addressData.permanent_city}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              permanent_city:
                e.target.value,
            })
          }
        />

        <TextField
          size="small"
          label="Permanent State"
          fullWidth
          value={addressData.permanent_state}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              permanent_state:
                e.target.value,
            })
          }
        />

        <TextField
          size="small"
          label="Permanent Pincode"
          fullWidth
          value={addressData.permanent_pincode}
          onChange={(e) =>
            setAddressData({
              ...addressData,
              permanent_pincode:
                e.target.value,
            })
          }
        />
      </Box>
    </Paper>

  </Box>
)}


          {activeStep === 3 && (

  <Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 2,
  }}
>

    <TextField
      size="small"
      label="UAN Number"
      value={employmentData.uan_number}
      onChange={(e) =>
        setEmploymentData({
          ...employmentData,
          uan_number:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="PAN Number"
      value={employmentData.pan_number}
      onChange={(e) =>
        setEmploymentData({
          ...employmentData,
          pan_number:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="Aadhaar Number"
      value={employmentData.aadhaar_number}
      onChange={(e) =>
        setEmploymentData({
          ...employmentData,
          aadhaar_number:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="PF Number"
      value={employmentData.pf_number}
      onChange={(e) =>
        setEmploymentData({
          ...employmentData,
          pf_number:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="PF Joining Date"
      type="date"
      value={
        employmentData.pf_joining_date
      }
      onChange={(e) =>
        setEmploymentData({
          ...employmentData,
          pf_joining_date:
            e.target.value,
        })
      }
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
    />

    <TextField
      size="small"
      label="ESI Number"
      value={employmentData.esi_number}
      onChange={(e) =>
        setEmploymentData({
          ...employmentData,
          esi_number:
            e.target.value,
        })
      }
    />

  </Box>
  </Paper>
)}

         {activeStep === 4 && (
  <Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
    },
    gap: 2,
  }}
>

    <TextField
      size="small"
      label="Bank Name"
      value={bankData.bank_name}
      onChange={(e) =>
        setBankData({
          ...bankData,
          bank_name:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="IFSC Code"
      value={bankData.ifsc_code}
      onChange={(e) =>
        setBankData({
          ...bankData,
          ifsc_code:
            e.target.value
              .toUpperCase(),
        })
      }
    />

    <TextField
      size="small"
      label="Account Holder Name"
      value={
        bankData.account_holder_name
      }
      onChange={(e) =>
        setBankData({
          ...bankData,
          account_holder_name:
            e.target.value,
        })
      }
    />

    <TextField
      size="small"
      label="Account Number"
      value={
        bankData.account_number
      }
      onChange={(e) =>
        setBankData({
          ...bankData,
          account_number:
            e.target.value,
        })
      }
    />

    <TextField
  size="small"
  fullWidth
  label="Confirm Account Number"
  value={bankData.confirm_account_number}
  onChange={(e) =>
    setBankData({
      ...bankData,
      confirm_account_number: e.target.value,
    })
  }
  error={
    !!bankData.confirm_account_number &&
    bankData.account_number !==
      bankData.confirm_account_number
  }
  helperText={
    !!bankData.confirm_account_number &&
    bankData.account_number !==
      bankData.confirm_account_number
      ? "Account numbers do not match"
      : ""
  }
/>

    <TextField
      size="small"
      label="UPI ID"
      value={bankData.upi_id}
      onChange={(e) =>
        setBankData({
          ...bankData,
          upi_id:
            e.target.value,
        })
      }
    />

  </Box>
  </Paper>
)}

          {activeStep === 5 && (
  <Box>

   <Box sx={{ mb: 3 }}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: 700,
      mb: 1,
    }}
  >
    Review & Save
  </Typography>

  <Typography
    color="text.secondary"
  >
    Verify all employee information
    before completing the setup.
  </Typography>
</Box>

    <Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 2,
      fontWeight: 600,
    }}
  >
    Profile Information
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "1fr 1fr",
      },
      gap: 2,
    }}
  >
    <Typography>
      <strong>Employee Code:</strong>{" "}
      {profileData.employee_code}
    </Typography>

    <Typography>
      <strong>Full Name:</strong>{" "}
      {profileData.full_name}
    </Typography>

    <Typography>
      <strong>Email:</strong>{" "}
      {profileData.email}
    </Typography>

    <Typography>
      <strong>Phone:</strong>{" "}
      {profileData.phone}
    </Typography>

    <Typography>
      <strong>Department:</strong>{" "}
      {profileData.department_id}
    </Typography>
  </Box>
</Paper>

    <Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 2,
      fontWeight: 600,
    }}
  >
    Personal Details
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "1fr 1fr",
      },
      gap: 2,
    }}
  >
    <Typography>
      <strong>Gender:</strong>{" "}
      {personalData.gender || "-"}
    </Typography>

    <Typography>
      <strong>Blood Group:</strong>{" "}
      {personalData.blood_group || "-"}
    </Typography>

    <Typography>
      <strong>Marital Status:</strong>{" "}
      {personalData.marital_status || "-"}
    </Typography>

    <Typography>
      <strong>Date of Birth:</strong>{" "}
      {personalData.date_of_birth || "-"}
    </Typography>

    <Typography>
      <strong>Father Name:</strong>{" "}
      {personalData.father_name || "-"}
    </Typography>

    <Typography>
      <strong>Mother Name:</strong>{" "}
      {personalData.mother_name || "-"}
    </Typography>

    <Typography>
      <strong>Spouse Name:</strong>{" "}
      {personalData.spouse_name || "-"}
    </Typography>

    <Typography>
      <strong>Emergency Contact:</strong>{" "}
      {personalData.emergency_contact || "-"}
    </Typography>
  </Box>
</Paper>

    <Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 2,
      fontWeight: 600,
    }}
  >
    Address Details
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "1fr",
      },
      gap: 2,
    }}
  >
    <Typography>
  <strong>Current City:</strong>{" "}
  {addressData.current_city || "-"}
</Typography>

<Typography>
  <strong>Current State:</strong>{" "}
  {addressData.current_state || "-"}
</Typography>

<Typography>
  <strong>Current Pincode:</strong>{" "}
  {addressData.current_pincode || "-"}
</Typography>

<Typography>
  <strong>Permanent City:</strong>{" "}
  {addressData.permanent_city || "-"}
</Typography>

<Typography>
  <strong>Permanent State:</strong>{" "}
  {addressData.permanent_state || "-"}
</Typography>

<Typography>
  <strong>Permanent Pincode:</strong>{" "}
  {addressData.permanent_pincode || "-"}
</Typography>
  </Box>
</Paper>

 <Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 2,
      fontWeight: 600,
    }}
  >
    Employment Details
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "1fr 1fr",
      },
      gap: 2,
    }}
  >
    <Typography>
      <strong>UAN Number:</strong>{" "}
      {employmentData.uan_number || "-"}
    </Typography>

    <Typography>
      <strong>PAN Number:</strong>{" "}
      {employmentData.pan_number || "-"}
    </Typography>

    <Typography>
      <strong>Aadhaar Number:</strong>{" "}
      {employmentData.aadhaar_number || "-"}
    </Typography>

    <Typography>
      <strong>PF Number:</strong>{" "}
      {employmentData.pf_number || "-"}
    </Typography>

    <Typography>
      <strong>PF Joining Date:</strong>{" "}
      {employmentData.pf_joining_date || "-"}
    </Typography>

    <Typography>
      <strong>ESI Number:</strong>{" "}
      {employmentData.esi_number || "-"}
    </Typography>
  </Box>
</Paper>

    <Paper
  elevation={0}
  sx={{
    p: 3,
    mb: 3,
    borderRadius: 4,
    border: "1px solid #E5E7EB",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 2,
      fontWeight: 600,
    }}
  >
    Bank Details
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "1fr 1fr",
      },
      gap: 2,
    }}
  >
    <Typography>
      <strong>Bank Name:</strong>{" "}
      {bankData.bank_name || "-"}
    </Typography>

    <Typography>
      <strong>IFSC Code:</strong>{" "}
      {bankData.ifsc_code || "-"}
    </Typography>

    <Typography>
      <strong>Account Number:</strong>{" "}
      {bankData.account_number || "-"}
    </Typography>

    <Typography>
      <strong>Account Holder:</strong>{" "}
      {bankData.account_holder_name || "-"}
    </Typography>

    <Typography>
      <strong>UPI ID:</strong>{" "}
      {bankData.upi_id || "-"}
    </Typography>
  </Box>
</Paper>

  </Box>
)}

  <Box
  sx={{
    mt: 5,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }}
>
  <Button
    variant="outlined"
    size="large"
    onClick={handleBack}
    disabled={activeStep === 0}
  >
    Back
  </Button>

  <Button
    variant="contained"
    size="large"
    onClick={handleNext}
  >
    {activeStep === steps.length - 1
      ? "Finish"
      : "Save & Continue"}
  </Button>
</Box>

        </Box>

      </Paper>
    </AdminLayout>
  );
};

export default AddEmployee;