import { useLocation } from "react-router-dom";
import { Card, Typography, Box, Button } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export function InsurancePaymentPage() {
  const location = useLocation();
  const {
    policyID,
    insurer,
    planType,
    planName,
    premium,
    coverage,
    claimRatio,
  } = location.state || {};

  const navigate = useNavigate();

  async function handlePurchase() {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );
    const data = {
      policyID,
      insurer,
      planType,
      planName,
      premium,
      coverage,
      claimRatio,
    };
    const res = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/insurance/buy-policy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const { id, url } = await res.json();
    const result = await stripe.redirectToCheckout({
      sessionId: id,
    });
    if (res.status === 201) {
      navigate("/Dashboard");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card sx={{ p: 4, minWidth: 350, textAlign: "center" }}>
        <PaymentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Confirm Payment
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          PolicyId: <b>{policyID}</b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Plan Name: {planName}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Insurer: {insurer}
        </Typography>
        <Typography variant="h6" sx={{ my: 2 }}>
          Premium: {premium}
        </Typography>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handlePurchase}
        >
          Pay Now
        </Button>
      </Card>
    </Box>
  );
}
export function PaymentPage() {
  const location = useLocation();
  const {
    amount,
    schemeName,
    schemeCode,
    startDate,
    nextPaymentDate,
    nav,
    units,
  } = location.state || {};

  const navigate = useNavigate();

  async function handlePurchase() {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );
    const data = {
      schemeCode: schemeCode,
      schemeName: schemeName,
      frequency: "MONTHLY",
      startDate: startDate,
      nextDate: nextPaymentDate,
      amount: amount,
      nav: nav,
      units: units,
    };
    const res = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/investments/mf-buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const session = await res.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Card sx={{ p: 4, minWidth: 350, textAlign: "center" }}>
        <PaymentIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Confirm Payment
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Scheme: <b>{schemeName}</b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Scheme Code: {schemeCode}
        </Typography>
        <Typography variant="h6" sx={{ my: 2 }}>
          Amount: ₹{amount}
        </Typography>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handlePurchase}
        >
          Pay Now
        </Button>
      </Card>
    </Box>
  );
}
