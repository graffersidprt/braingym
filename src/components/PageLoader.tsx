import { strings } from "../constants/strings";

const PageLoader = () => {
  return (
    <div className="spinner-container-profile data-loader profile">
      <div className="spinner-box">
        <div className="spinner"></div>
        <p>
          {strings.loading}
          <span>{strings.please_wait}</span>
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
