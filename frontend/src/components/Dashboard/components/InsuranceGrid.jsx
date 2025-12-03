import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import MutualFundDashboard from '../MutualFundDashboard';
import CircularProgress from '@mui/material/CircularProgress';
import InsuranceDashboard from '../InsuranceDashboard';

export default function InsuranceGrid() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_ORIGIN+"/fetchInsurance")
      .then(res => res.json())
      .then(data => {
        setData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
        <i class="fa-solid fa-user-shield"></i>Insurance
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid sx={{ width: "100%" }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress size="6rem" />
            </Box>
          ) : data.length > 0 ? (
            <InsuranceDashboard apiUrl={import.meta.env.VITE_SERVER_ORIGIN+"/fetchInsurance"} data={data} />
          ) : (
            <Typography align="center" sx={{ width: '100%', py: 4 }}>
              No data available.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}