import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CssBaseline,
  InputAdornment,
  Stack,
  TextField,
  Typography,
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

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

function normalizeRow(raw) {
  return {
    id: raw._id,
    insurer: raw.insurer ?? "",
    planName: raw.planName ?? "",
    planType: raw.planType ?? "",
    premium: raw.premium ?? "",
    coverage: raw.coverage ?? "",
    claimRatio: raw.claimRatio ?? "",
  };
}

export default function GroupsInsuranceDashboard({userId}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_ORIGIN}/api/insurance/get/${userId}`,
          { withCredentials: true }
        );
        const arr = Array.isArray(res.data.data)
          ? res.data.data
          : [];
        const policies = arr.map((raw) => normalizeRow(raw));
        setRows(policies);
      } catch (err) {
        console.error(err);
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
        (r.insurer || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

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
            placeholder="Search by plan or insurer..."
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
                  fileName: "group-insurance-dashboard",
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
    </AppTheme>
  );
}
