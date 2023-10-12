import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../constants/utils";

const AuthVerify = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("user exist", user);
    } else {
      console.log("user not exist");
      navigate("/login");
    }
  }, []);

  return <div></div>;
};

export default AuthVerify;
