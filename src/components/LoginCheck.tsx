import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../constants/utils";

const LoginCheck = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("user exist", user);
      navigate("/dashboard");
    } else {
      console.log("user not exist");
    }
  }, []);

  return <div></div>;
};

export default LoginCheck;
