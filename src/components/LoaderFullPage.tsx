import { strings } from "../constants/strings";

const LoaderFullPage = () => {
  return (
    <div className="spinner-container data-loader">
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

export default LoaderFullPage;
