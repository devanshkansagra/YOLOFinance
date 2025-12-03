// import * as React from "react";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Stack from "@mui/material/Stack";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
// import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
// import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
// import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
// import { useNavigate } from "react-router-dom";

// const mainListItems = [
//     { text: "Dashboard", icon: <HomeRoundedIcon />, path: "/Dashboard" },
//     {
//         text: "Mutual Funds",
//         icon:  <i className="fa-solid fa-table-columns"></i>,
//         path: "/MutualFunds",
//     },
//     { text: "Insurance", icon: <AnalyticsRoundedIcon />, path: "/Insurance" },
//     {
//         text: "Govt. Bonds",
//         icon: <AnalyticsRoundedIcon />,
//         path: "/GoalDashboard",
//     },
//     { text: "SWP", icon: <AnalyticsRoundedIcon />, path: "/SWPDashboard" },
//     {
//         text: "Reports",
//         icon: <AnalyticsRoundedIcon />,
//         path: "/ReportsDashboard",
//     },
//     {
//         text: "Finance Calculators",
//         icon: <AnalyticsRoundedIcon />,
//         path: "/CalcDashboard",
//     },
// ];

// const secondaryListItems = [
//     { text: "Settings", icon: <SettingsRoundedIcon /> },
//     { text: "About", icon: <InfoRoundedIcon />, path: "/about" },
//     { text: "Feedback", icon: <HelpRoundedIcon />, path: "/feedback" },
// ];

// export default function MenuContent() {
//     const navigate = useNavigate();
//     return (
//         <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
//             <List dense>
//                 {mainListItems.map((item, index) => (
//                     <ListItem
//                         key={index}
//                         disablePadding
//                         sx={{ display: "block" }}
//                         onClick={() => navigate(item.path)}
//                     >
//                         <ListItemButton
//                             selected={index === mainListItems[index]}
//                         >
//                             <ListItemIcon>{item.icon}</ListItemIcon>
//                             <ListItemText primary={item.text} />
//                         </ListItemButton>
//                     </ListItem>
//                 ))}
//             </List>
//             <List dense>
//                 {secondaryListItems.map((item, index) => (
//                     <ListItem
//                         key={index}
//                         disablePadding
//                         sx={{ display: "block" }}
//                         onClick={() => navigate(item.path)}
//                     >
//                         <ListItemButton>
//                             <ListItemIcon>{item.icon}</ListItemIcon>
//                             <ListItemText primary={item.text} />
//                         </ListItemButton>
//                     </ListItem>
//                 ))}
//             </List>
//         </Stack>
//     );
// }

import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const mainListItems = [
    { text: "Dashboard", icon: "fa-solid fa-house", path: "/Dashboard" },
    {
        text: "Mutual Funds",
        icon: "fa-solid fa-chart-line",
        path: "/MutualFunds",
    },
    { text: "Insurance", icon: "fa-solid fa-shield-heart", path: "/Insurance" },
    {
        text: "Govt. Bonds",
        icon: "fa-solid fa-landmark",
        path: "/GovBonds",
    },
    // {
    //     text: "SWP",
    //     icon: "fa-solid fa-money-bill-transfer",
    //     path: "/SWPDashboard",
    // },
    {
        text: "Reports",
        icon: "fa-solid fa-file-lines",
        path: "/ReportsDashboard",
    },
    {
        text: "Finance Calculators",
        icon: "fa-solid fa-calculator",
        path: "/CalcDashboard",
    },
    {
        text: "Groups",
        icon: "fa-solid fa-user-group",
        path: "/groups"
    }
];

const secondaryListItems = [
    { text: "Settings", icon: "fa-solid fa-gear", path: "/settings" },
    { text: "About", icon: "fa-solid fa-circle-info", path: "/about" },
    { text: "Feedback", icon: "fa-solid fa-comments", path: "/feedback" },
];

export default function MenuContent() {
    const navigate = useNavigate();
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            {/* Main Menu */}
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <Box
                                    component="i"
                                    className={item.icon}
                                    sx={{ fontSize: 20, color: "text.primary" }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Secondary Menu */}
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <Box
                                    component="i"
                                    className={item.icon}
                                    sx={{ fontSize: 20, color: "text.primary" }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
