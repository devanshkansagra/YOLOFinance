import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Invite from "./Invite";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";;
import MenuContent from "./MenuContent";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/YoloFinance_transparent-.png"; // Adjust path if needed
const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: "border-box",
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: "border-box",
    },
});
function GroupsMenu({ userId, setUserId }) {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(
        import.meta.env.VITE_SERVER_ORIGIN+"/api/users/connections/get",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data) {
        setGroups(data.data);
      }
    }
    fetchUsers();
  }, []);

  async function handleSelectUser(id) {
    setUserId(id);
  }
  return (
    <Box
      sx={{
        width: 250,
        left: 251,
        height: userId ? "auto" : "100vh",
        bgcolor: "background.paper",
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        display: { xs: "none", md: "block" },
        overflow: "auto",
      }}
    >
      <Typography sx={{p:1}} variant="h6" fontWeight="bold" gutterBottom>
        Connected Users
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <Invite/>
      </Box>
      <List>
        {groups.map((group) => (
          <ListItem
            key={group.id}
            button
            sx={{
              borderRadius: 1,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                cursor: "pointer"
              },
            }}
            onClick={() => handleSelectUser(group.id)}
          >
            <Avatar alt={group.name} src={group?.avatar} sx={{ width: 24, height: 24, mx: 1 }} />
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default GroupsMenu;
