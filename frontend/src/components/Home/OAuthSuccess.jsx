import React from "react";
import { useEffect } from "react";
function OAuthSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("access");
    const id = params.get("id");

    if (access) localStorage.setItem("accessToken", access);
    if (id) localStorage.setItem("id_token", id);

    window.location.href = "/Dashboard";
  }, []);
  return <></>;
}

export default OAuthSuccess;
