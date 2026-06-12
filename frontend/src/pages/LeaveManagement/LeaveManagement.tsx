import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";

import AdminLayout from "../../layouts/AdminLayout/AdminLayout";

import {
  getLeaveRequests,
  approveLeave,
  rejectLeave,
} from "../../services/leaveService";

interface LeaveRequest {
  id: number;
  employee_code: string;
  full_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>([]);

  const [filteredRequests, setFilteredRequests] =
    useState<LeaveRequest[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response =
        await getLeaveRequests();

      setLeaveRequests(
        response.data || []
      );

      setFilteredRequests(
        response.data || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered =
      leaveRequests.filter((item) =>
        item.full_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredRequests(filtered);
  }, [search, leaveRequests]);

  const handleApprove =
    async (id: number) => {
      try {
        await approveLeave(id);
        fetchLeaveRequests();
      } catch (error) {
        console.error(error);
      }
    };

  const handleReject =
    async (id: number) => {
      try {
        await rejectLeave(id);
        fetchLeaveRequests();
      } catch (error) {
        console.error(error);
      }
    };

  const totalRequests =
    leaveRequests.length;

  const approvedCount =
    leaveRequests.filter(
      (item) =>
        item.status ===
        "APPROVED"
    ).length;

  const rejectedCount =
    leaveRequests.filter(
      (item) =>
        item.status ===
        "REJECTED"
    ).length;

  const pendingCount =
    leaveRequests.filter(
      (item) =>
        item.status ===
        "PENDING"
    ).length;

  return (
    <AdminLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Leave Management
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          Manage employee leave
          requests
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography>
              Total Requests
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {totalRequests}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography>
              Pending
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {pendingCount}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography>
              Approved
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {approvedCount}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography>
              Rejected
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {rejectedCount}
            </Typography>
          </Paper>
        </Box>

        <Paper
          sx={{
            p: 3,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            label="Search Employee"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </Paper>

        <Paper sx={{ p: 2 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Employee
                  </TableCell>

                  <TableCell>
                    Leave Type
                  </TableCell>

                  <TableCell>
                    Start Date
                  </TableCell>

                  <TableCell>
                    End Date
                  </TableCell>

                  <TableCell>
                    Reason
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRequests.map(
                  (item) => (
                    <TableRow
                      key={item.id}
                    >
                      <TableCell>
                        {
                          item.full_name
                        }
                      </TableCell>

                      <TableCell>
                        {
                          item.leave_type
                        }
                      </TableCell>

                      <TableCell>
                        {
                          item.start_date
                        }
                      </TableCell>

                      <TableCell>
                        {item.end_date}
                      </TableCell>

                      <TableCell>
                        {item.reason}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={
                            item.status
                          }
                          color={
                            item.status ===
                            "APPROVED"
                              ? "success"
                              : item.status ===
                                "REJECTED"
                              ? "error"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {item.status ===
                          "PENDING" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleApprove(
                                  item.id
                                )
                              }
                              sx={{
                                mr: 1,
                              }}
                            >
                              Approve
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() =>
                                handleReject(
                                  item.id
                                )
                              }
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default LeaveManagement;