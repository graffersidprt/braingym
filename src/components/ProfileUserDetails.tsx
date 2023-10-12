import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import genderIconImg from "../assets/images/icon-gender.svg";
import languageIconImg from "../assets/images/icon-language.svg";
import countryIconImg from "../assets/images/icon-country.svg";
import stateIconImg from "../assets/images/icon-state.svg";
import cityIconImg from "../assets/images/icon-city.svg";
import pronounsIconImg from "../assets/images/icon-pronouns.svg";
import editIconImg from "../assets/images/icon-edit-profile.svg";
import { strings } from "../constants/strings";
import { useGetUserMutation } from "../redux/api/userApi";
import { getCurrentUser, showServerError } from "../constants/utils";
import PageLoader from "./PageLoader";

const ProfileDetailPage = () => {
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
        <>
          <div className="user-top-head d-flex align-items-start align-items-md-center flex-column flex-md-row mr-t-20 mr-b-24">
            <div className="user-info-block  d-flex align-items-center">
              <img
                src={data?.data.imagePath}
                className="avtar avtar-lg mr-r-12"
                alt=""
              />
              <div>
                <div className="d-flex align-items-center mr-b-8">
                  <div className="user-name">
                    {data?.data.firstName} {data?.data.lastName}
                  </div>
                </div>
                <div className="user-position">
                  {data?.data.position} ({data?.data.departmentValue})
                </div>
                <div className="user-email">{data?.data.email}</div>
              </div>
            </div>
            <div className="block-action ms-auto mt-3 mt-md-0">
              <Link
                className="min-w-inherit pd-all-16 mr-r-12 edit-profile-img"
                to="/edit-profile" state={{ from: "occupation" }}
              >
                <img src={editIconImg} className="" alt="" />
              </Link>
            </div>
          </div>
          <div className="other-detail-box border pd-all-28 pd-b-0 pe-md-0 mr-b-24 border-radius-12 border-light">
            <div className="row">
              <div className="col-md-6 col-lg-4 col-xl-4 ">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={genderIconImg}
                      className="icon-gender text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">
                      {strings.gender}
                    </div>
                    <div className="user-personal-detail">
                      {data?.data.genderValue}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-xl-4">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={languageIconImg}
                      className="icon-spoken-language text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">
                      {strings.primary_language}
                    </div>
                    <div className="user-personal-detail">
                      {data?.data.primaryLanguageValue}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-xl-4">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={languageIconImg}
                      className="icon-spoken-language text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">
                      {strings.secondary_language}
                    </div>
                    <div className="user-personal-detail">
                      {data?.data.secondaryLanguage}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-xl-4">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={countryIconImg}
                      className="icon-gender text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">
                      {strings.country}
                    </div>
                    <div className="user-personal-detail">
                      {data?.data.countryValue}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-xl-4">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={stateIconImg}
                      className="icon-gender text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">
                      {strings.state}
                    </div>
                    <div className="user-personal-detail">
                      {data?.data.stateValue}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-xl-4">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={cityIconImg}
                      className="icon-location text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">{strings.city}</div>
                    <div className="user-personal-detail">
                      {data?.data.cityValue}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-xl-4 ">
                <div className="feature-block">
                  <div className="icon-box">
                    <img
                      src={pronounsIconImg}
                      className="icon-pronouns text-dark-grey fs-20"
                      alt=""
                    />
                  </div>
                  <div className="feature-info">
                    <div className="user-description-label">
                      {strings.pronouns}
                    </div>
                    <div className="user-personal-detail">
                      {data?.data.pronounsValue}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="other-detail-box border pd-all-28 mr-b-12 border-radius-12 border-light">
            <div className="feature-info mr-b-24">
              <div className="user-description-label">{strings.about_me}</div>
              <div className=".user-personal-detail">{data?.data.bio}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileDetailPage;
