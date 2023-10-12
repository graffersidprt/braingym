import { useEffect } from "react";
import smsImg from "../assets/images/sms.svg";
import { strings } from "../constants/strings";
import { useGetUserMutation } from "../redux/api/userApi";
import { getCurrentUser, showServerError } from "../constants/utils";
import PageLoader from "./PageLoader";

const CustomerService = () => {
  const user = getCurrentUser();
  const [getUser, { isLoading, isError, error, isSuccess, data }] =
    useGetUserMutation();

  useEffect(() => {
    getUser(user.data.id);
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
        <div className="user-top-head d-flex align-items-start align-items-md-center flex-column flex-md-row mr-t-20 mr-b-24">
          <div className="user-info-block  d-flex align-items-center">
            <div>
              <div className="d-flex align-items-center mr-b-8">
                <div className="body-text-emphasis mr-r-4">
                  {strings.customer_service_headline}
                </div>
              </div>
              <div className="block-action ms-auto mt-3 mt-md-0">
                <img src={smsImg} className="icon-edit fs-10" alt="" />
                <span className="text-black pd-l-4">
                  {data?.data.supportEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerService;
