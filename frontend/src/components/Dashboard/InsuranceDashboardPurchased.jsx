import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AppTheme from "../shared-theme/AppTheme";
import { useCartStore } from "../../store/useCartStore";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import axios from "axios";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function normalizeRow(raw) {
  return {
    id: raw._id, // ✅ unique ID for insurance
    policyId: raw._id,
    insurer: raw.insurer ?? "",
    planName: raw.planName ?? "",
    planType: raw.planType ?? "",
    premium: raw.premium ?? "",
    coverage: raw.coverage ?? "",
    claimRatio: raw.claimRatio ?? "",
  };
}

export default function InsuranceDashboardPurchased() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [cancelInput, setCancelInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cart = useCartStore((state) => state.cart);
  const accessToken = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          import.meta.env.VITE_SERVER_ORIGIN+"/api/insurance/fetchInsurance",
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            }
          },
          { withCredentials: true }
        );
        const arr = Array.isArray(res.data.insurances) ? res.data.insurances : [];
        const policies = arr.map((raw, idx) => normalizeRow(raw, idx));
        setRows(policies);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load insurance policies",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        (r.planName || "").toLowerCase().includes(q) ||
        (r.insurer || "").toLowerCase().includes(q) ||
        (r.policyId || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const handleCancelClick = (row) => {
    setSelectedRow(row);
    setCancelInput("");
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (cancelInput.toLowerCase() === "cancel" && selectedRow) {
      try {
        setLoading(true);
        const res = await axios.post(
          import.meta.env.VITE_SERVER_ORIGIN+"/api/insurance/cancel",
          { policyId: selectedRow.policyId },
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type" : "application/json"
            }
          },
          { withCredentials: true }
        );


        if (res.data.success) {
          setRows((prev) => prev.filter((r) => r.id !== selectedRow.id));

          setSnackbar({
            open: true,
            message: "Policy cancelled successfully",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: res.data.message || "Failed to cancel policy",
            severity: "error",
          });
        }
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Error cancelling policy",
          severity: "error",
        });
      } finally {
        setLoading(false);
        setOpenDialog(false);
        setSelectedRow(null);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "planName",
        headerName: "Plan Name",
        flex: 2,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "insurer",
        headerName: "Insurer",
        flex: 1.5,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "planType",
        headerName: "Type",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "premium",
        headerName: "Premium",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "coverage",
        headerName: "Coverage",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "claimRatio",
        headerName: "Claim Ratio",
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cancel",
        headerName: "Cancel Policy",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleCancelClick(params.row)}
          >
            Cancel
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <AppTheme theme={xThemeComponents}>
      <CssBaseline />

      <Box>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by plan, insurer or ID..."
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box sx={{ height: 640, width: "auto" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
                csvOptions: {
                  fileName: "insurance-dashboard",
                },
              },
            }}
            sx={{
              border: 0,
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: (t) => t.palette.action.hover,
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              borderRadius: 2,
            }}
          />
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredRows.length} of {rows.length} items
          </Typography>
        </Stack>
      </Box>

      {/* Cancel Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancel Policy</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            To confirm cancellation of{" "}
            <strong>{selectedRow?.planName}</strong>, type{" "}
            <strong>cancel</strong> below:
          </Typography>
          <TextField
            autoFocus
            fullWidth
            placeholder="Type cancel to confirm"
            value={cancelInput}
            onChange={(e) => setCancelInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button
            variant="contained"
            color="error"
            disabled={cancelInput.toLowerCase() !== "cancel"}
            onClick={handleConfirmCancel}
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
