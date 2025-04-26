import { appUrlGoogle } from "./config";

export const authUrl = [
  `https://accounts.google.com/o/oauth2/v2/auth?`,
  `client_id=${process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID}`,
  `&redirect_uri=${encodeURIComponent(`${appUrlGoogle}/google/callback`)}`,
  `&response_type=token`,
  `&scope=${encodeURIComponent("openid email profile")}`,
  `&include_granted_scopes=true`,
  `&state=state_parameter_passthrough_value`,
].join("");
