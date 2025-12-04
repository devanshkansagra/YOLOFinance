import * as React from "react";
import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import CustomDatePicker from "./CustomDatePicker";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import { Avatar } from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Chip } from "@mui/material";

import Search from "./Search";
import OptionsMenu from "./OptionsMenu";

export default function Header({name}="Home") {
  const token = localStorage.getItem("id_token");
  const [details, setDetails] = React.useState({});

  React.useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setDetails(decoded);
    }
  }, [token]); //
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs navname={name}/>
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
        <Chip
          avatar={<Avatar alt={details.name} src={details?.avatar} />}
          label={details.name}
          variant="outlined"
          size="large"
        />
        <OptionsMenu />
      </Stack>
    </Stack>
  );
}
