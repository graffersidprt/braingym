import { strings } from "../constants/strings";
import "../assets/css/dashboard.css"; //Dasboard CSS
import totalUsersImg from "../assets/images/total-users.svg";
import iconUnionImg from "../assets/images/icon-union.svg";
import iconEmployeeImg from "../assets/images/icon-employee.svg";
import iconCallSilentImg from "../assets/images/icon-call-silent.svg";
import iconEmailMessage from "../assets/images/icon-email.svg";
import { useGetUserSummaryMutation } from "../redux/api/userSummaryApi";
import { useEffect, useState } from "react";
import { ISummaryResponseData } from "../redux/api/types";
import { showServerError } from "../constants/utils";

const UserSummary = () => {
  const [getUserSummary, { isLoading, isError, error, isSuccess, data }] =
    useGetUserSummaryMutation();
  const [userSummary, setUserSummary] = useState<ISummaryResponseData>();

  useEffect(() => {
    getUserSummary("");
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setUserSummary(data?.data);
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <section className="Summary-section">
        <div className="row">
          <div className="col-lg-6 col-xl-7 mr-b-24">
            <div className="card scalable-counts">
              <div className="card-body">
                <div className="scalable-counts-total external-resources">
                  <img src={iconUnionImg} alt="icon" />

                  <h3 className="counting" data-count="50">
                    {userSummary?.totalUsers || "0"}
                  </h3>
                  <p>{strings.total_users}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="10">
                    {userSummary?.active || "0"}
                  </h3>
                  <p>{strings.active}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="15">
                    {userSummary?.engaged || "0"}
                  </h3>
                  <p>{strings.engaged}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="15">
                    {userSummary?.inActive || "0"}
                  </h3>
                  <p>{strings.inactive}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="10">
                    {userSummary?.neverEngaged || "0"}
                  </h3>
                  <p>{strings.low_engagement}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-5 mr-b-24">
            <div className="card scalable-counts">
              <div className="card-body">
                <div className="scalable-counts-total events-resources">
                  <img src={iconEmployeeImg} alt="icon" />
                  <h3 className="counting" data-count="30">
                    {userSummary?.employee || "0"}
                  </h3>
                  <p>{strings.total_employees || "0"}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="10">
                    {userSummary?.employeeAnalysis?.poor || "0"}
                  </h3>
                  <p>{strings.poor}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="15">
                    {userSummary?.employeeAnalysis?.ok || "0"}
                  </h3>
                  <p>{strings.ok}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="05">
                    {userSummary?.employeeAnalysis?.great || "0"}
                  </h3>
                  <p>{strings.great}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 mr-b-24">
            <div className="card scalable-counts">
              <div className="card-body">
                <div className="scalable-counts-total users-resources">
                  <img src={totalUsersImg} alt="icon" />
                  <h3 className="counting" data-count="200">
                    {userSummary?.coaches || "0"}
                  </h3>
                  <p>{strings.total_coaches}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="120">
                    {userSummary?.coachAnalysis?.average || "0"}
                  </h3>
                  <p>{strings.average}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="32">
                    {userSummary?.coachAnalysis?.good || "0"}
                  </h3>
                  <p>{strings.good}</p>
                </div>
                <div className="scalable-counts-items">
                  <h3 className="counting" data-count="48">
                    {userSummary?.coachAnalysis?.great || "0"}
                  </h3>
                  <p>{strings.great}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 mr-b-24">
            <div className="card scalable-counts">
              <div className="card-body">
                <div className="scalable-counts-total calls">
                  <img src={iconCallSilentImg} alt="icon" />
                  <h3 className="counting" data-count="200">
                    {userSummary?.callsAndMessages?.calls || "0"}
                  </h3>
                  <p>{strings.calls}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mr-b-24">
            <div className="card scalable-counts">
              <div className="card-body">
                <div className="scalable-counts-total messages">
                  <img src={iconEmailMessage} alt="icon" />
                  <h3 className="counting" data-count="200">
                    {userSummary?.callsAndMessages?.messages || "0"}
                  </h3>
                  <p>{strings.messages}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserSummary;
