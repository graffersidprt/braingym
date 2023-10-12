import { useEffect, useState } from "react";
import logoWithTextImg from "../assets/images/logo-with-text.svg";
import manageWidgetsImg from "../assets/images/manage-widgets.svg";
import {
  getCurrentUser,
  removeStorage,
  showServerError,
  getCurrentPageName,
} from "../constants/utils";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthVerify from "./AuthVerify";
import { useGetUserMutation } from "../redux/api/userApi";
import Skeleton from "@mui/lab/Skeleton"; //https://mui.com/material-ui/react-skeleton/
import { useLogoutUserMutation } from "../redux/api/authApi";
import { strings } from "../constants/strings";


interface Props {
  handleManageWidgetClick?: any;
}

const Header: React.FC<Props> = (props: Props) => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    imagePath: "",
    roleName: "",
  });

  const location = useLocation();
  const currentPageName = getCurrentPageName(location?.pathname);
  const user = getCurrentUser();
  const navigate = useNavigate();
  // ? API Get User Mutation
  const [getUser, { isLoading, isError, error, isSuccess, data }] =
    useGetUserMutation();

  // ? API Logout User Mutation
  const [
    logoutUser,
    {
      isLoading: logoutUserIsLoading,
      isError: logoutUserIsError,
      error: logoutUserError,
      isSuccess: logoutUserIsSuccess,
      data: logoutUserData,
    },
  ] = useLogoutUserMutation();

  useEffect(() => {
    if (user?.data) {
      getUser(user.data.id);
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setUserInfo({
        firstName: data?.data.firstName,
        lastName: data?.data.lastName,
        imagePath: data?.data.imagePath,
        roleName: data?.data.roleName,
      });
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const logout = () => {
    const requestData = {};
    logoutUser(requestData);
  };

  useEffect(() => {
    if (logoutUserIsSuccess) {
      if (logoutUserData && logoutUserData.success) {
        console.log("logout call");
        removeStorage("user");
        navigate("/login");
      }
    }
    if (logoutUserIsError) {
      showServerError(logoutUserError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutUserIsLoading]);

  return (
    <>
      <AuthVerify />
      <header className="header header-main">
        <nav className="navbar fixed-top flex-md-nowrap p-0">
          <Link
            className="navbar-brand col-md-3 col-lg-2 me-0 fs-6"
            to="/dashboard"
          >
            <img src={logoWithTextImg} alt="Brain Gym" />
          </Link>
          <div className="page-content-header">
            <div className="body-block mb-0">
              <h4>
                {strings.hello}{" "}
                {userInfo.firstName ? userInfo.firstName + "!" : ""}
              </h4>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    {currentPageName}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <ul className="navbar-nav ms-auto right-nav">
            <li className="nav-item menu-item d-md-none">
              <a
                href="#"
                className="nav-link"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasManageWidgets"
                aria-controls="offcanvasManageWidgets"
              >
                <img src={manageWidgetsImg} alt="manage-widgets" />
              </a>
            </li>
            {currentPageName === strings.dashboard && 
            <li className="nav-item menu-item d-none d-md-flex">
              <a
                href="#"
                className="nav-link manage-widgets-text"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasManageWidgets"
                aria-controls="offcanvasManageWidgets"
                onClick={()=>{props?.handleManageWidgetClick()}}
              >
                {strings.manage_widgets}
              </a>
            </li>
            }

            <li className="nav-item dropdown profile-dd">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {userInfo.imagePath ? (
                  <img src={userInfo.imagePath} alt="profile photo" />
                ) : (
                  <Skeleton variant="circular" width={50} height={40} />
                )}
                <div className="text-here">
                  <span>{userInfo.firstName + " " + userInfo.lastName}</span>
                  <span className="designation">{userInfo.roleName}</span>
                </div>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="icon-user"></i>
                    {strings.user_account}
                  </Link>
                </li>
                <li>
                  <span className="dropdown-item" onClick={logout}>
                    <i className="icon-logout"></i>
                    {strings.logout}
                  </span>
                </li>
              </ul>

              <li className="nav-item">
                <button
                  className="navbar-toggler  d-lg-none collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#sidebarMenu"
                  aria-controls="sidebarMenu"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              </li>
            </li>
          </ul>
        </nav>
        <div className="page-content-header">
          <div className="body-block mb-0">
            <h4>
              {strings.hello}{" "}
              {userInfo.firstName ? userInfo.firstName + "!" : ""}
            </h4>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  {strings.dashboard}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </header>
      <nav id="sidebarMenu" className=" d-lg-block sidebar collapse">
        <div className="position-sticky sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                className={
                  currentPageName === strings.dashboard ||
                  currentPageName === strings.user_account || 
                  currentPageName === strings.detail_page
                    ? "nav-link active"
                    : "nav-link"
                }
                aria-current="page"
                to="/dashboard"
              >
                <i className="icon-dashboard"></i>
                {strings.dashboard}
              </Link>
            </li>
            <li className="nav-item ">
              <Link
                className={
                  currentPageName === strings.organization
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/organizaion-details"
              >
                <i className="icon-building"></i>
                {strings.organization}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
