import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Employees from "./pages/Employees/Employees";
import Attendance from "./pages/Attendance/Attendance";
import Payroll from "./pages/Payroll/Payroll";
import AddEmployee from"./pages/Employees/AddEmployee";
import SalarySlips from "./pages/SalarySlips/SalarySlips";
import ShiftManagement from "./pages/ShiftManagement/ShiftManagement";
import MonthlyAttendance from "./pages/Attendance/MonthlyAttendance";
import SalaryStructure from "./pages/SalaryStructure/SalaryStructure";
import OrganizationSettings from "./pages/OrganizationSettings/OrganizationSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
           }
         />

         <Route
  path="/shift-management"
  element={
    <ProtectedRoute>
      <ShiftManagement />
    </ProtectedRoute>
  }
/>

         <Route
  path="/attendance"
  element={
    <ProtectedRoute>
      <Attendance />
    </ProtectedRoute>
  }
/>

<Route
  path="/attendance/monthly"
  element={
    <ProtectedRoute>
      <MonthlyAttendance />
    </ProtectedRoute>
  }
/>

<Route
  path="/salary-structure"
  element={<SalaryStructure />}
/>

<Route
  path="/payroll"
  element={
    <ProtectedRoute>
      <Payroll />
    </ProtectedRoute>
  }
/>

<Route
  path="/salary-slips"
  element={
    <ProtectedRoute>
      <SalarySlips />
    </ProtectedRoute>
  }
/>

<Route
  path="/organization-settings"
  element={
    <ProtectedRoute>
      <OrganizationSettings />
    </ProtectedRoute>
  }
/>

    <Route
  path="/employees/add"
  element={<AddEmployee />}
/>

<Route
  path="/employees/edit/:id"
  element={<AddEmployee />}
 />

      </Routes>
    </BrowserRouter>
  );
}

export default App;