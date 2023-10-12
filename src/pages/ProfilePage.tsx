import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { Alert, Typography } from "@mui/material";
import { strings } from "../constants/strings";
import backImg from "../assets/images/icon-arrow-left.svg";
import ProfileUserDetails from "../components/ProfileUserDetails";
import CustomerService from "../components/CustomerService";
import { Link } from "react-router-dom";
import { ALERT_DISMISS_TIME } from "../constants/values";

const ProfilePage = () => {
  const location = useLocation();
  const [toggleValue, setToggleValue] = useState(strings.profile);
  const [showUpdateMessage, setShowUpdateMessage] = useState<boolean>(false);

  useEffect (() =>{
    if(location.state !== null){
      setShowUpdateMessage(true);
      setTimeout(() => {
        closeAlertMessage();
      }, ALERT_DISMISS_TIME);
    }
  }, [])

  const closeAlertMessage = () =>{
    setShowUpdateMessage(false);
  location.state.showUpdateMessage = false
}

  return (
    <>
      <div className="bg-white">
        <div className="toasts-alert">
          <div id="liveAlert" className="live-alert"></div>
        </div>
        <Header />
        <main className=" ms-sm-auto after-login corporate-detail">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="go-back me-auto">
                {showUpdateMessage ? (
                    <Typography
                      textAlign="center"
                      component="div"
                      className="success-message"
                    >
                      <Alert
                        severity="success"
                        onClose={closeAlertMessage}
                      >
                        {strings.update_profile_success_message}
                      </Alert>
                    </Typography>
                  ) : (
                  <Link
                    to="/dashboard"
                    className="body-text text-black"
                  >
                    <img src={backImg} className="mr-r-4" alt="" />
                    {strings.back}
                  </Link>
                  )}
                </div>
                <div className="tab-content">
                  <div className="tab-container-one">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item active" role="presentation">
                        <Link
                          className="nav-link active"
                          to="/overview"
                          role="tab"
                          aria-controls="overview"
                          data-bs-toggle="tab"
                          aria-selected="false"
                          onClick={() => {
                            setToggleValue(strings.profile);
                          }}
                        >
                          <span> {strings.profile}</span>
                        </Link>
                      </li>
                      <li className="nav-item" role="presentation">
                        <Link
                          className="nav-link"
                          to="/team-members"
                          role="tab"
                          aria-controls="team-members"
                          data-bs-toggle="tab"
                          aria-selected="false"
                          onClick={() => {
                            setToggleValue(strings.customer_support);
                          }}
                        >
                          <span> {strings.customer_support}</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  {toggleValue === strings.profile ? (
                    <ProfileUserDetails />
                  ) : (
                    <CustomerService />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
