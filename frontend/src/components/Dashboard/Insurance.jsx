import * as React from "react";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar.jsx";
import Header from "./components/Header.jsx";
import MainGrid from "./components/MainGrid.jsx";
import SideMenu from "./components/SideMenu.jsx";
import AppTheme from "../shared-theme/AppTheme";
import MutualFundDashboard from "./MutualFundDashboard.jsx";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import MFGrid from "./components/MFGrid.jsx";
import axios from "axios";
import InsuranceGrid from "./components/InsuranceGrid.jsx";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Insurance(props) {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(import.meta.env.VITE_SERVER_ORIGIN+"/fetchInsurance", {
        withCredentials: true,
      })
      setData(res.data)
    };

    fetchData();
  }, []);
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
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
            }}
          >
            <Header name="Insurance"/>
            <InsuranceGrid data={data} />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
