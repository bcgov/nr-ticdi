import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Roles from "../roles";
import LandingPage from "../content/pages/LandingPage";

export const ProtectedRoutes: FC<{ roles: Array<Roles> }> = () => {
    let auth = { token: true }
    return auth.token ? (
        <LandingPage />
    ) : (
        <Navigate to="/not-authorized" />
    )
}