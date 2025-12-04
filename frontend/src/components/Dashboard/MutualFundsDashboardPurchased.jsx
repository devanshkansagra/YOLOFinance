import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
    id: raw.schemeCode,
    schemeCode: raw.schemeCode,
    schemeName: raw.schemeName ?? "",
    nav: raw.nav ?? 0,
    units: raw.units ?? 0,
    amount: raw.amount ?? 0,
    profit: raw.nav * raw.units - raw.amount,
  };
}

export default function MutualFundDashboardPurchased() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [cancelInput, setCancelInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [date, setDate] = useState(dayjs());
  const [refresh, setRefresh] = useState(false);

  const [updateDialog, setUpdateDialog] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const [editForm, setEditForm] = useState({
    schemeCode: "",
    schemeName: "",
    amount: "",
    date: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          import.meta.env.VITE_SERVER_ORIGIN + "/api/investments/mf-get",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
          { withCredentials: true }
        );

        const data = await axios.get(
          import.meta.env.VITE_SERVER_ORIGIN + "/fetch-mf-data",
          {
            withCredentials: true,
          }
        );

        const records = Array.isArray(data.data) ? data.data : [];
        const arr = Array.isArray(res.data.investments)
          ? res.data.investments
          : [];

        const investments = arr.map((raw) => {
          const res2 = records.find(
            (record) => raw._id === record["Scheme Code"]
          );

          const nav = res2["Net Asset Value"] ?? 0;
          return {
            id: raw.schemeCode,
            schemeCode: raw.schemeCode,
            schemeName: raw.schemeName ?? "",
            nav: nav ?? 0,
            units: (raw.amount / Number.parseInt(nav)).toFixed(3) ?? 0,
            amount: raw.amount ?? 0,
          };
        });
        setRows(investments);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load investments",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [refresh]);

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        (r.schemeName || "").toLowerCase().includes(q) ||
        (r.schemeCode || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  // ---- Cancel SIP ----
  const handleCancelClick = (row) => {
    setSelectedRow(row);
    setCancelInput("");
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (cancelInput.toLowerCase() === "cancel" && selectedRow) {
      try {
        setLoading(true);
        const res = await axios.post(
          import.meta.env.VITE_SERVER_ORIGIN + "/api/investments/mf-cancel",
          {
            schemeCode: selectedRow.schemeCode,
            schemeName: selectedRow.schemeName,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
          { withCredentials: true }
        );

        if (res.data.success) {
          setRows((prev) => prev.filter((r) => r.id !== selectedRow.id));
          setSnackbar({
            open: true,
            message: "SIP cancelled successfully",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: res.data.message || "Failed to cancel SIP",
            severity: "error",
          });
        }
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Error cancelling SIP",
          severity: "error",
        });
      } finally {
        setLoading(false);
        setOpenDialog(false);
        setSelectedRow(null);
      }
    }
  };

  // ---- Update Modal ----
  const handleRowClick = (params) => {
    setEditForm({
      schemeCode: params.row.schemeCode,
      schemeName: params.row.schemeName,
      amount: params.row.amount,
      nav: params.row.nav,
      units: params.row.units,
      date: date,
    });
    setUpdateDialog(true);
  };

  const handleUpdateChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateSave = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        import.meta.env.VITE_SERVER_ORIGIN + "/api/investments/mf-update",
        editForm,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update UI
        setRows((prev) =>
          prev.map((r) =>
            r.schemeCode === editForm.schemeCode ? normalizeRow(editForm) : r
          )
        );

        setSnackbar({
          open: true,
          message: "Investment updated successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: res.data.message || "Failed to update investment",
          severity: "error",
        });
      }
      setUpdateDialog(false);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error updating investment",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "schemeName",
        headerName: "Scheme Name",
        flex: 3,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "schemeCode",
        headerName: "Scheme Code",
        flex: 0.7,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "amount",
        headerName: "Investment",
        flex: 0.7,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "nav",
        headerName: "NAV",
        flex: 0.7,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "units",
        headerName: "Units",
        flex: 0.8,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cancel",
        headerName: "Cancel SIP",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Button
            variant="outlined"
            color="error"
            onClick={(e) => {
              e.stopPropagation(); // prevent row click event
              handleCancelClick(params.row);
            }}
          >
            Cancel SIP
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
            placeholder="Search by name, code or ISIN..."
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
            onRowClick={handleRowClick}
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
                  fileName: "mutual-fund-dashboard",
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
              // show pointer cursor when hovering rows or cells
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-cell:hover": {
                cursor: "pointer",
              },
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
        <DialogTitle>Cancel SIP</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            To confirm cancellation of{" "}
            <strong>{selectedRow?.schemeName}</strong>, type{" "}
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

      {/* ✅ Update Investment Modal */}
      <Dialog
        open={updateDialog}
        onClose={() => setUpdateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Mutual Fund</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 3 }}>
          <TextField
            label="Scheme Name"
            fullWidth
            value={editForm.schemeName}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            label="Scheme Code"
            fullWidth
            value={editForm.schemeCode}
            sx={{ mb: 2 }}
            disabled
          />
          <TextField
            label="Investment Amount"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            value={editForm.amount}
            onChange={(e) => handleUpdateChange("amount", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: "100%", mb: 2 }}
              label="Monthly"
              onChange={(newValue) => {
                setEditForm((prev) => ({
                  ...prev,
                  date: newValue,
                }));
              }}
              value={dayjs(editForm.date) || null}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ pb: 2 }}>
          <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdateSave}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
