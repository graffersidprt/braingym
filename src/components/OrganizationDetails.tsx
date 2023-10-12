import { useEffect } from "react";
import { strings } from "../constants/strings";
import { showServerError, getFullDate } from "../constants/utils";
import { useGetOrganizationDetailsMutation } from "../redux/api/orgDetailsApi";
import PageLoader from "./PageLoader";

const OrganizationDetails = () => {
  console.log("org_data", useGetOrganizationDetailsMutation());
  const [
    getOrganizationDetails,
    { isLoading, data, isError, error, isSuccess },
  ] = useGetOrganizationDetailsMutation();

  useEffect(() => {
    getOrganizationDetails();
  }, []);

  useEffect(() => {
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      {isLoading && <PageLoader />}
      {isSuccess && (
        <>
          <div className="user-top-head d-flex flex-column flex-md-row mr-t-20 mr-b-24">
            <div className="user-info-block  d-flex align-items-center">
              <img
                src={data?.data.organizationImagePath}
                className="mr-r-12 events-detail-images"
                alt=" "
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12 col-xl-12 mb-0">
              <h2 className="mr-b-24">{data?.data.organizationName}</h2>
            </div>
          </div>
          <div className="other-detail-box border pd-all-28 pd-b-0 pe-md-0 mr-b-24 border-radius-12 border-light">
            <div className="row">
              <div className="col-md-6 col-lg-6 col-xl-3 mb-0">
                <div className="feature-block">
                  <div className="icon-box">
                    <i className="icon-calendar text-dark-grey fs-20"></i>
                  </div>
                  <div className="feature-info">
                    <div className="body-text-mini text-dark-grey lh-normal mr-b-6">
                      {strings.founded_on}
                    </div>
                    <div className="user-personal-detail fw-400">
                      {getFullDate(data?.data.foundedOn)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3 mb-0">
                <div className="feature-block">
                  <div className="icon-box">
                    <i className="icon-call text-dark-grey fs-20"></i>
                  </div>
                  <div className="feature-info">
                    <div className="body-text-mini text-dark-grey lh-normal mr-b-6">
                      {strings.phone_number}
                    </div>
                    <div className="user-personal-detail fw-400">
                      {data?.data.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3 mb-0">
                <div className="feature-block">
                  <div className="icon-box">
                    <i className="icon-email text-dark-grey fs-20"></i>
                  </div>
                  <div className="feature-info">
                    <div className="body-text-mini text-dark-grey lh-normal mr-b-6">
                      {strings.email}
                    </div>
                    <div className="user-personal-detail fw-400">
                      {data?.data.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3 mb-0">
                <div className="feature-block">
                  <div className="icon-box">
                    <i className="icon-location text-dark-grey fs-20"></i>
                  </div>
                  <div className="feature-info">
                    <div className="body-text-mini text-dark-grey lh-normal  mr-b-6">
                      {strings.address}
                    </div>
                    <div className="user-personal-detail fw-400">
                      {data?.data.address}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-xl-3 mb-0">
                <div className="feature-block">
                  <div className="icon-box">
                    <i className="icon-user-group text-dark-grey fs-20"></i>
                  </div>
                  <div className="feature-info">
                    <div className="body-text-mini text-dark-grey lh-normal  mr-b-6">
                      {strings.number_of_employees}
                    </div>
                    <div className="user-personal-detail fw-400">
                      {data?.data.numberOfEmployee}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="other-detail-box border pd-all-28 mr-b-24 border-radius-12 border-light">
            <div className="feature-info mr-b-24">
              <div className="body-text text-dark-grey lh-normal mr-b-12 ">
                {strings.description}
              </div>
              <div className="user-personal-detail lh-160pr mr-b-6 fw-500">
                {data?.data.description}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrganizationDetails;
