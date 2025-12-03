import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import GovBondsDashboard from './GovBondsDashboard';

export default function GovBondsGrid() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch(import.meta.env.VITE_SERVER_ORIGIN+"/fetchGovBonds")
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
        <i class="fa-solid fa-landmark-dome"></i>Government Bonds
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid sx={{ width: "100%" }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress size="6rem" />
            </Box>
          ) : data.length > 0 ? (
            <GovBondsDashboard apiUrl={import.meta.env.VITE_SERVER_ORIGIN+"/fetchGovBonds"} data={data} />
          ) : (
            <Typography align="center" sx={{ width: '100%', py: 4 }}>
              No data available.
            </Typography>
          )}
        </Grid>
      </Grid>
      {/* <Copyright sx={{ my: 4 }} /> */}
    </Box>
  );
}