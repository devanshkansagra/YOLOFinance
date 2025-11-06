import { AUTH_URI } from "../constants/constants";

export function getAuthorizationURL() {
  const clientId = process.env.CLIENT_ID;

  const baseURL = AUTH_URI;
  const responseType = "code";
  const redirect_uri = `${process.env.SERVER_URL as string}/api/users/google-oauth-callback`;

  const scope = [
    "email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");
  const encodedScope = encodeURIComponent(scope);
  const accessType = "offline";
  const prompt = "consent";

  const url =
    `${baseURL}?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirect_uri}&` +
    `response_type=${responseType}&` +
    `scope=${encodedScope}&` +
    `access_type=${accessType}&` +
    `prompt=${prompt}`;

  return url;
}
