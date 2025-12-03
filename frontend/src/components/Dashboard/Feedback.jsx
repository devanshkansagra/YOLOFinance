import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  Alert,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

import { TextareaAutosize } from "@mui/material";

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({
          open: true,
          type: "success",
          msg: "✅ Feedback sent successfully!",
        });
        setFormData({ name: "", email: "", message: "" }); // reset form
      } else {
        setAlert({
          open: true,
          type: "error",
          msg: "❌ Error: " + data.error,
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        open: true,
        type: "error",
        msg: "❌ Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            We Value Your Feedback
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your thoughts help us improve and make finance even simpler for you.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 4,
            backgroundColor: "background.paper",
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Your Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Your Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
            />

            <TextareaAutosize
              name="message"
              placeholder="Your Feedback..."
              minRows={6}
              maxRows={12}
              value={formData.message}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                resize: "vertical", // allows manual resize
                fontFamily: "inherit",
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ borderRadius: "30px" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Feedback"
              )}
            </Button>
          </Stack>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alert.type} variant="filled" sx={{ borderRadius: 2 }}>
            {alert.msg}
          </Alert>
        </Snackbar>
      </Container>
    </AppTheme>
  );
}
