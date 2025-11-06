import * as React from "react";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import StatCard from "./StatCard";
import NewsLetter from "../../Home/NewsLetter";
import MFGridTemp from "./MFGridTemp";
import InsuranceGridTemp from "../InsuranceGridTemp";
import FundDetailsDialog from "./FundDetailsDialog"; // ✅ import dialog

export default function MainGrid() {
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchFundData() {
      const schemeCodes = [
        { code: "102272", name: "Nifty Index Fund" },
        { code: "151724", name: "Nifty Midcap Mutual Fund" },
        { code: "118778", name: "Nippon India Small Cap Fund" },
        { code: "122639", name: "Parag Parikh Flexi Cap Fund" },
      ];

      try {
        const responses = await Promise.all(
          schemeCodes.map((f) =>
            fetch(`https://api.mfapi.in/mf/${f.code}`).then((res) => res.json())
          )
        );

        const formattedFunds = responses.map((json, idx) => {
          if (!json?.data) return null;

          const navEntries = json.data.slice(0, 3650).reverse();
          const navData = navEntries.map((d) => parseFloat(d.nav));
          const navDates = navEntries.map((d) => d.date);

          return {
            // ✅ required by FundDetailsDialog
            schemeCode: schemeCodes[idx].code,
            schemeName: json.meta?.scheme_name || schemeCodes[idx].name,
            isinGrowth: json.meta?.isin_growth || "N/A",
            isinReinv: json.meta?.isin_div_reinvestment || "N/A",
            dateText: navDates[navDates.length - 1],

            // ✅ extra fields for StatCard
            title: schemeCodes[idx].name,
            value: `₹${navData[navData.length - 1].toFixed(2)}`,
            interval: "Last 10 years",
            trend:
              navData[navData.length - 1] > navData[0]
                ? "up"
                : navData[navData.length - 1] < navData[0]
                ? "down"
                : "neutral",
            data: navData,
            labels: navDates,
          };
        });

        setFunds(formattedFunds.filter(Boolean));
      } catch (err) {
        console.error("Error fetching NAV data:", err);
      }
    }

    fetchFundData();
  }, []);

  const handleCardClick = (fund) => {
    setSelectedFund(fund);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFund(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        <i className="fa-solid fa-eye"></i>Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {funds.map((card, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, lg: 3 }}
            onClick={() => handleCardClick(card)} // ✅ make clickable
            sx={{ cursor: "pointer" }}
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        <i className="fa-solid fa-chart-line"></i>Your Investments
      </Typography>
      <Grid container spacing={2} columns={9}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <MFGridTemp />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 3 }}>
        <i className="fa-solid fa-shield-halved"></i>Your Insurances
      </Typography>
      <Grid container spacing={2} columns={9}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <InsuranceGridTemp />
        </Grid>
      </Grid>

      <Typography component="h2" variant="h6" sx={{ mt:2 }}>
        <i className="fa-solid fa-newspaper"></i>Latest News
      </Typography>

      <NewsLetter />
      <Copyright sx={{ my: 4 }} />

      {/* Fund details dialog */}
      <FundDetailsDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        rowData={selectedFund}
        onPurchase={(fund) => {
          console.log("Purchased Fund:", fund);
          // Later connect API to add purchased SIP
        }}
      />
    </Box>
  );
}
