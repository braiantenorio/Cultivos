import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import * as AuthService from "../services/auth.service";

const AuthVerify = () => { //podemos cambiar ese any xd
  let location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = sessionStorage.getItem("user");

    if (userJson) {
      const user = JSON.parse(userJson);
      const decodedJwt =  JSON.parse(atob(user.accessToken.split(".")[1]));

      if (decodedJwt.exp * 1000 < Date.now()) {
        AuthService.logout()
        navigate("/login")
      }
    }
  }, [location]);

  return null;
};

export default AuthVerify;