import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";


// Reset Password Modal
function ResetPasswordDialog({ open, onClose, email }) {
  const [newPassword, setNewPassword] = React.useState("");

  async function handleReset() {
    const res = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/auth/reset-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Password reset successful!");
      onClose();
    } else {
      alert(data.message || "Failed to reset password.");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          component: "form",
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Set New Password</DialogTitle>
      <DialogContent>
        <OutlinedInput
          fullWidth
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleReset}>
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ResetPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

// Forgot Password Dialog
function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [otp, setOtp] = React.useState(Array(6).fill(""));
  const [showResetModal, setShowResetModal] = React.useState(false);
  const otpRefs = React.useRef([]);

  function handleOTPChange(e, index) {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOTPKeyDown(e, index) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleOTP() {
    const res = await fetch(+"/api/auth/otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });

    const data = await res.json();
    if (res.ok) {
      setResponse(data.message);
    } else {
      setErrorMsg(data.message);
    }
  }

  async function submitOTP() {
    const data = otp.join("");
    let resp;
    try {
      const res = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });

      resp = await res.json();

      if (res.ok) {
        setShowResetModal(true);
      }
    } catch (error) {
      setErrorMsg(resp.message);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            sx: { backgroundImage: "none" },
          },
        }}
      >
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you an
            OTP to reset your password.
          </DialogContentText>
          <OutlinedInput
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            placeholder="Email address"
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          {response ? (
            <>
              <DialogContentText style={{ textAlign: "center" }}>
                {response}
              </DialogContentText>
              <div
                style={{ display: "flex", gap: "2", justifyContent: "center" }}
              >
                {otp.map((digit, index) => (
                  <OutlinedInput
                    key={index}
                    inputRef={(el) => (otpRefs.current[index] = el)}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: "center",
                        fontSize: "1.5rem",
                        width: "1rem",
                      },
                    }}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleOTPKeyDown(e, index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <DialogContentText style={{ textAlign: "center" }}>
              {errorMsg}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={!response ? handleOTP : submitOTP}
          >
            {!response ? <>Continue</> : <>Submit</>}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset password modal */}
      <ResetPasswordDialog
        open={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          handleClose(); // optionally close parent modal too
        }}
        email={email}
      />
    </>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
