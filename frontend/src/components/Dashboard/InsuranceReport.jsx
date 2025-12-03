import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const LOGO_URL = "/YOLO_Logo.png";

export default function InsuranceReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/insurance/fetchInsurance", { withCredentials: true });
        if (!mounted) return;
        const insurances = Array.isArray(res.data.insurances) ? res.data.insurances : [];
        setRows(insurances);
      } catch (err) {
        console.error("InsuranceReport: fetch error", err);
        setLastError(err?.response?.data ?? String(err));
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  function formatPremium(premium) {
    if (!premium) return "-";
    const cleaned = String(premium).replace(/[^0-9.,]/g, "");
    const match = cleaned.match(/[0-9,.]+/);
    if (!match) return premium;
    const num = parseFloat(match[0].replace(/,/g, ""));
    if (isNaN(num)) return premium;
    return `Rs. ${num.toLocaleString()}/mo`;
  }

  function formatCoverage(coverage) {
    if (!coverage) return "-";
    const cleaned = String(coverage).replace(/[^0-9.,]/g, "");
    const match = cleaned.match(/[0-9,.]+/);
    if (!match) return coverage;
    const num = parseFloat(match[0].replace(/,/g, ""));
    if (isNaN(num)) return coverage;
    if (num >= 10000000) return `Rs. ${(num / 10000000).toFixed(2)} CrL`;
    if (num >= 100000) return `Rs. ${(num / 100000).toFixed(2)} LakhsL`;
    return `Rs. ${num.toLocaleString()}L`;
  }

  const handleDownloadPDF = () => {
    if (!rows || rows.length === 0) return alert("No insurance data to export.");
    const doc = new jsPDF({ unit: "pt" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

    const addLogoAndHeader = async () => {
      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = LOGO_URL;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 300;
        const imgHeight = (img.height / img.width) * imgWidth || 95;
        doc.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, y, imgWidth, imgHeight);
        y += imgHeight + 60;
      } catch (err) {
        console.error("PDF logo error:", err);
        y += 180;
      }
      doc.setFontSize(36);
      doc.setTextColor(17, 80, 171);
      doc.text("Insurance Report", pageWidth / 2, y, { align: "center" });
      y += 40;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      y += 30;
    };

    addLogoAndHeader().then(() => {
      autoTable(doc, {
        startY: y + 10,
        head: [["Policy ID", "Plan Name", "Plan Type", "Insurer", "Premium", "Coverage", "Claim Ratio"]],
        body: rows.map(row => [
          row._id || row.policyId || "-",
          row.planName || "-",
          row.planType || "-",
          row.insurer || "-",
          formatPremium(row.premium),
          formatCoverage(row.coverage),
          row.claimRatio || "-"
        ]),
        styles: { fontSize: 10, halign: 'center', valign: 'middle' },
        headStyles: { fillColor: [25, 118, 210], halign: 'center', valign: 'middle' },
        margin: { left: 30, right: 30 },
        theme: "grid",
      });
      doc.save("InsuranceReport.pdf");
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
        <Box>
          <Typography variant="h4">Insurance Report</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Number of Insurances bought: <b>{rows.length}</b>
        </Typography>
        </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Policy ID</TableCell>
              <TableCell align="center">Plan Name</TableCell>
              <TableCell align="center">Plan Type</TableCell>
              <TableCell align="center">Insurer</TableCell>
              <TableCell align="center">Premium</TableCell>
              <TableCell align="center">Coverage</TableCell>
              <TableCell align="center">Claim Ratio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row._id || row.policyId || idx}>
                <TableCell align="center">{row._id || row.policyId || "-"}</TableCell>
                <TableCell align="center">{row.planName || "-"}</TableCell>
                <TableCell align="center">{row.planType || "-"}</TableCell>
                <TableCell align="center">{row.insurer || "-"}</TableCell>
                <TableCell align="center">{formatPremium(row.premium)}</TableCell>
                <TableCell align="center">{formatCoverage(row.coverage)}</TableCell>
                <TableCell align="center">{row.claimRatio || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button variant="contained" color="success" onClick={handleDownloadPDF} sx={{ mb: 3 }}>
        Download PDF
      </Button>
      {lastError && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error: {typeof lastError === "string" ? lastError : JSON.stringify(lastError)}
        </Typography>
      )}
    </Box>
  );
}
