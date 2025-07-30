import { Navigate, Outlet } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi";

export default function RequireAuth() {
  // get the user info from the api
  const { data: user, isLoading } = useUserInfoQuery();

  // if the user is loading, show a loading message
  if (isLoading) return <div>Loading...</div>;

  // if the user is not found, redirect to the login page
  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
}
