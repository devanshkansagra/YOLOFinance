import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import AddIcon from "@mui/icons-material/Add";
import { TextField } from "@mui/material";
function Invite() {
  const [email, setEmail] = React.useState("");

  async function handleSendInvite() {
    try {
      const response = await fetch(import.meta.env.VITE_SERVER_ORIGIN+"/api/invite/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            variant="contained"
            color="primary"
            fullWidth={true}
            {...bindTrigger(popupState)}
          >
            <AddIcon /> New Invite
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem>
              <TextField
                id="outlined-basic"
                label="Email Id"
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSendInvite}
                sx={{ margin: "5px" }}
              >
                Send Invite
              </Button>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

export default Invite;
