export const APP_NAME = "Polaris Pilot";

export const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email"
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/application-center", label: "Application Center" },
  { href: "/dashboard/rank-center", label: "Rank Center" },
  { href: "/dashboard/api-keys", label: "API Keys" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/settings", label: "Settings" }
];

export const DEFAULT_APP_STYLE = {
  primary_color: "#ff7e6d",
  secondary_color: "#102437"
};
