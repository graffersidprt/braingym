import React from "react";
import { Link } from "react-router-dom";
import successImg from "../assets/images/success.svg";
import LoginCheck from "../components/LoginCheck";
import { strings } from "../constants/strings";

const PasswordUpdateSuccessPage = () => {
  return (
    <React.Fragment>
      <LoginCheck />
      <div className="container-fluid">
        <main role="main" className="login-wrapper">
          <div className="center-block">
            <div className="login-card bg-white cmn-shadow border-radius-24 success text-center">
              <div className="success-icon mr-b-32">
                <div className="anim">
                  <img src={successImg} className="mr-r-4" alt="success" />
                </div>
              </div>
              <h3 className="text-center mr-b-32">
                {strings.password_success}
              </h3>
              <div className="form-action">
                <Link className="btn btn-primary w-100" to="/login">
                  {strings.login}
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default PasswordUpdateSuccessPage;
