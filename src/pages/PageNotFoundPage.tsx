import { useNavigate } from "react-router-dom";
import { strings } from "../constants/strings";
import page404Img from "../assets/images/404.svg";
import Header from "../components/Header";
import { getCurrentUser } from "../constants/utils";

const PageNotFoundPage = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const goBack = () => {
    navigate("");
  };

  return (
    <div className="bg-white">
      {user && <Header />}
      <div
        className={
          user
            ? "page-not-found-container-post-login"
            : "page-not-found-container"
        }
      >
        <div className="page-not-found">
          <img src={page404Img} alt="Brain Gym" />
        </div>
        <h1 className="page-not-found-heading">{strings.page_not_found}</h1>
        <div className="page-not-found-sub-heading">
          {strings.page_not_found_sorry_text}
        </div>
        <div className="page-not-found-btn">
          {!user && (
            <button onClick={goBack} className="btn btn-primary">
              {strings.go_back}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageNotFoundPage;
