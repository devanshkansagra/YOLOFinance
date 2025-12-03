import * as React from "react";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AppNavbar from "./components/AppNavbar.jsx";
import Header from "./components/Header.jsx";
import SideMenu from "./components/SideMenu.jsx";
import AppTheme from "../shared-theme/AppTheme";
import SIPReport from "./SIPReport.jsx";
import SWPReport from "./SWPReport.jsx";
import InsuranceReport from "./InsuranceReport.jsx";

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

export default function ReportsDashboard(props) {
    const [selectedReport, setSelectedReport] = useState("none");

        const ReportWrapper = ({ children }) => (
            <Stack spacing={2} alignItems="flex-start" sx={{ width: "100%" }}>
                <Paper
                    onClick={() => setSelectedReport("none")}
                    elevation={2}
                    sx={{
                        mb: 2,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "inline-block",
                        color: "primary.main",
                    }}
                >
                    ← Back to Reports
                </Paper>
                {children}
            </Stack>
        );

    const renderReport = () => {
        switch (selectedReport) {
            case "sip":
                return (
                    <ReportWrapper>
                        <SIPReport />
                    </ReportWrapper>
                );
            case "swp":
                return (
                    <ReportWrapper>
                        <SWPReport />
                    </ReportWrapper>
                );
            case "insurance":
                return (
                    <ReportWrapper>
                        <InsuranceReport />
                    </ReportWrapper>
                );
            default:
                return (
                    <Box sx={{ flexGrow: 1, mt: 4, px: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Choose a Report
                        </Typography>
                        <br /><br />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 3,
                                width: "100%",
                                mt: 2,
                            }}
                        >
                            {[
                                {
                                    key: "sip",
                                    label: "📈 SIP Report",
                                    color: "primary",
                                },
                                {
                                    key: "insurance",
                                    label: "🛡️ Insurance Report",
                                    color: "success",
                                },
                            ].map((item) => (
                                <Paper
                                    key={item.key}
                                    onClick={() => setSelectedReport(item.key)}
                                    elevation={4}
                                    sx={{
                                        width: "100%",
                                        height: 120,
                                        p: 3,
                                        borderRadius: 4,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "0.3s",
                                        backgroundColor: (theme) =>
                                            theme.palette[item.color].main + "22",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            backgroundColor: (theme) =>
                                                theme.palette[item.color].main + "44",
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        align="center"
                                        color={`${item.color}.main`}
                                    >
                                        {item.label}
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                );
        }
    };

    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: "flex" }}>
                <SideMenu />
                <AppNavbar />
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: theme.vars
                            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                            : alpha(theme.palette.background.default, 1),
                        overflow: "auto",
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: "center",
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                            width: "100%",
                        }}
                    >
                        <Header name="Reports" />
                        {renderReport()}
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}