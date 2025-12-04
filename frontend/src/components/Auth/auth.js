import Cookies from "js-cookie";

export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken") && !!localStorage.getItem("id_token");
};

