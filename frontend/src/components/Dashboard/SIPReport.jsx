import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

export default function SIPReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        // match MutualFundsDashboardPurchased endpoints
        const [mfRes, fetchRes] = await Promise.all([
          axios.get("http://localhost:4000/api/investments/mf-get", {
            withCredentials: true,
          }),
          axios.get("http://localhost:4000/fetch-mf-data", {
            withCredentials: true,
          }),
        ]);

        if (!mounted) return;

        const investments = Array.isArray(mfRes.data.investments)
          ? mfRes.data.investments
          : Array.isArray(mfRes.data)
          ? mfRes.data
          : [];

        const records = Array.isArray(fetchRes.data) ? fetchRes.data : Array.isArray(fetchRes.data.data) ? fetchRes.data.data : [];

        // build quick lookup by Scheme Code (the fetch-mf-data uses "Scheme Code" key)
        const navLookup = {};
        for (const rec of records) {
          const key = rec["Scheme Code"] ?? rec.schemeCode ?? rec.id;
          if (key != null) navLookup[String(key)] = rec["Net Asset Value"] ?? rec.nav ?? rec.netAssetValue ?? 0;
        }

        const mapped = investments.map((raw) => {
          const nav = navLookup[raw._id] ?? navLookup[raw.schemeCode] ?? 0;
          const navNum = Number(nav) || 0;
          const units = navNum > 0 ? Number((raw.amount / navNum).toFixed(3)) : 0;
          return {
            id: raw.schemeCode ?? raw._id ?? raw.id,
            schemeCode: raw.schemeCode ?? raw._id ?? "-",
            schemeName: raw.schemeName ?? raw.fundName ?? raw.name ?? "Unknown",
            nav: navNum,
            units,
            amount: raw.amount ?? raw.investedAmount ?? 0,
            raw,
          };
        });

        setRows(mapped);
      } catch (err) {
        console.error("SIPReport: fetch error", err);
        setLastError(err?.response?.data ?? String(err));
        setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);
  const handleDownloadPDF = async () => {
    if (!rows || rows.length === 0) return alert("No SIP data to export.");
    const doc = new jsPDF({ unit: "pt" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 40;

        // (i) Add logo at top center
        // Use public directory path for logo
        const logoUrl = "/YOLO_Logo.png";
        try {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.src = logoUrl;
          await new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });
          // Draw image to canvas to get data URL
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
          // If logo fails, just continue
          console.error("PDF logo error:", err);
          y += 180;
        }

    // (ii) Write SIP Report below logo
    doc.setFontSize(36);
    doc.setTextColor(17, 80, 171); // #1150AB
    doc.text("SIP Report", pageWidth / 2, y, { align: "center" });
    y += 40;

    // (iii) Place table below
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const body = rows.map((r) => [
      r.schemeName,
      r.schemeCode,
      r.nav != null ? Number(r.nav).toFixed(2) : "-",
      r.units != null ? String(r.units) : "0",
      r.amount != null ? Number(r.amount).toFixed(2) : "0.00",
    ]);
    autoTable(doc, {
      startY: y + 10,
      head: [["Scheme Name", "Scheme Code", "NAV", "Units", "Amount(Rs.)"]],
      body,
      styles: { fontSize: 12, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [17, 80, 171], textColor: 255, halign: 'center', valign: 'middle' },
      margin: { left: 30, right: 30 },
      theme: "grid",
    });

    doc.save("SIPReport.pdf");
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h4">SIP Report</Typography>
          <Typography variant="subtitle1">List of all bought SIPs.</Typography>
        </Box>

        <Box>
          <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </Box>
      </Box>

      {rows.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No SIP purchases found.</Typography>
          {lastError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Error: {typeof lastError === "string" ? lastError : JSON.stringify(lastError)}
            </Typography>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Scheme Name</TableCell>
                <TableCell>Scheme Code</TableCell>
                <TableCell>NAV</TableCell>
                <TableCell align="right">Units</TableCell>
                <TableCell align="right">Amount (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={row.id ?? idx}>
                  <TableCell>{row.schemeName}</TableCell>
                  <TableCell>{row.schemeCode}</TableCell>
                  <TableCell>{row.nav != null ? Number(row.nav).toFixed(2) : "-"}</TableCell>
                  <TableCell align="right">{row.units}</TableCell>
                  <TableCell align="right">{Number(row.amount || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}