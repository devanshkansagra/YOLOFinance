import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

function InvitePage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const handleResponse = async (response) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ORIGIN}/api/invite/recieve/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ response }),
          credentials: "include",
        }
      );
      if (res.ok) {
        setStatus(
          response === "accept" ? "Invite accepted ✅" : "Invite declined ❌"
        );
        navigate('/Dashboard');
      }
    } catch (err) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 3,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Group Invitation
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          You’ve received an invitation to join a group. Would you like to
          accept it?
        </Typography>

        {status ? (
          <Typography variant="subtitle1" color="primary" fontWeight="medium">
            {status}
          </Typography>
        ) : loading ? (
          <CircularProgress size={28} />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => handleResponse("accept")}
            >
              Accept
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelOutlinedIcon />}
              onClick={() => handleResponse("decline")}
            >
              Decline
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default InvitePage;
