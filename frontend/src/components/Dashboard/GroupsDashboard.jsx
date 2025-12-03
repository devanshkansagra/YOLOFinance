import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CssBaseline,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import axios from "axios";
import {Grid} from "@mui/material";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function GroupsDashboard({ userId }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_ORIGIN}/api/investments/get/${userId}`,
          { withCredentials: true }
        );

        const data = Array.isArray(res.data.data) ? res.data.data : [];

        console.log(data);

        setRows(
          (Array.isArray(res.data.data) ? res.data.data : []).map(
            (g, index) => ({
              id: g._id || index,
              schemeName: g.schemeName || "Unnamed",
              schemeCode: g.schemeCode || "-",
              amount: g.amount || 0,
              nav: g.nav || "-",
              units: g.units || "-",
            })
          )
        );
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load groups",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [userId]);

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => (r.schemeName || "").toLowerCase().includes(q));
  }, [rows, query]);

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
    ],
    []
  );

  return (
    <AppTheme theme={xThemeComponents}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%", // ✅ Full width
          height: "100vh", // optional if you want it to fill viewport
          p: 3, // padding for breathing space
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            flex: 1, // ✅ allows DataGrid to expand fully
            width: "100%", // ✅ Full width
            "& .MuiDataGrid-root": {
              border: 0,
              borderRadius: 2,
            },
          }}
        >
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
                csvOptions: { fileName: "groups-dashboard" },
              },
            }}
            sx={{
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: (t) => t.palette.action.hover,
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              borderRadius: 2,
              "& .MuiDataGrid-row:hover": { cursor: "pointer" },
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
            Showing {filteredRows.length} of {rows.length} groups
          </Typography>
        </Stack>

        
      </Box>

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
