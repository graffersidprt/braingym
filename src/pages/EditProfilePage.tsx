import { useEffect, useState, useRef } from "react";
import { Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import avatarMaleImg from "../assets/images/avtar-male.svg";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, TypeOf } from "zod";
import { Link } from "react-router-dom";
import editIconImg from "../assets/images/edit-icon2.svg";
import backImg from "../assets/images/icon-arrow-left.svg";
import { strings } from "../constants/strings";
import {
  aboutMeFieldValidation,
  departmentValidation,
  fistNameValidation,
  lastNameValidation,
  positionValidation,
  secLangValidation,
  countryValidation,
  cityValidation,
} from "../constants/validations";
import FormInput from "../components/inputs/FormInput";
import FormSelectInput from "../components/inputs/FormSelectInput";

import {
  filterArrayData,
  getBase64,
  getCurrentUser,
  getPronounsIds,
  showServerError,
} from "../constants/utils";
import {
  useGetCountryListMutation,
  useGetGenderListMutation,
  useGetLanguageListMutation,
  useGetStateListMutation,
  useGetCityListMutation,
  useGetPronounsListMutation,
} from "../redux/api/commonApi";
import {
  useGetUserMutation,
  useUpdateUserDetailsMutation,
} from "../redux/api/userApi";
import { useUploadImageMutation } from "../redux/api/userApi";
import PageLoader from "../components/PageLoader";
import { toast } from "react-toastify";
import MultiSelectInputEditProfile from "../components/inputs/MultiSelectInputEditProfile";
import { SELF_DESCRIBE_ID } from "../constants/values";

const editProfileSchema = object({
  firstName: fistNameValidation,
  lastName: lastNameValidation,
  department: departmentValidation,
  position: positionValidation,
  secondaryLanguage: secLangValidation,
  aboutMe: aboutMeFieldValidation,
  city: cityValidation,
});
export type EditProfileInput = TypeOf<typeof editProfileSchema>;

const EditProfilePage = () => {
  const hiddenFileInput = useRef<any>(null);
  const navigate = useNavigate();
  const [updateCountryValue, setUpdateCountryValue] = useState(0);
  const [updateStateValue, setUpdateStateValue] = useState(0);
  const [cityValue, setCityValue] = useState(0);
  const [priLanguageValue, setPriLanguageValue] = useState(0);
  const [genderDescriptionValue, setGenderDescriptionValue] = useState("");
  const [pronounsDescriptionValue, setPronounsDescriptionValue] = useState("");

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [showUpdateMessage, setShowUpdateMessage] = useState<boolean>(false);
  const [selectedPronounListData, setSelectedPronounListData] = useState<any[]>(
    []
  );
  const [selectedGenderId, setSelectedGenderId] = useState<number>(0);

  const user = getCurrentUser();
  const methods = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
  });
  const {
    handleSubmit,
    formState: { isValid },
    setValue,
  } = methods;

  // ? API Get User Mutation
  const [
    getUser,
    {
      isLoading: getUserIsLoading,
      isError: getUserIsError,
      error: getUserError,
      isSuccess: getUserIsSuccess,
      data: getUserData,
    },
  ] = useGetUserMutation();

  // ? API Get Gender List Mutation
  const [
    getGenderList,
    {
      isLoading: genderListIsLoading,
      isError: genderListIsError,
      error: genderListError,
      data: genderListData,
    },
  ] = useGetGenderListMutation();

  // ? API Get Country List Mutation
  const [
    getCountryList,
    {
      isLoading: countryListIsLoading,
      isError: countryListIsError,
      error: countryListError,
      data: countryListData,
    },
  ] = useGetCountryListMutation();

  // ? API Get Language List Mutation
  const [getLanguageList, { data: languageListData }] =
    useGetLanguageListMutation();

  // ? API Get Pronoun List Mutation
  const [
    getPronounList,
    {
      isLoading: pronounListIsLoading,
      isError: pronounListIsError,
      error: pronounListError,
      data: pronounListData,
      isSuccess: isSuccessPronounList,
    },
  ] = useGetPronounsListMutation();

  // ? API Get State List Mutation
  const [getStateListById, { data: stateListData }] = useGetStateListMutation();

  // ? API Get City List Mutation
  const [
    getCityListById,
    {
      isLoading: cityListIsLoading,
      isError: cityListIsError,
      error: cityListError,
      data: cityListData,
    },
  ] = useGetCityListMutation();

  // ? API Upload image Mutation
  const [
    uploadImage,
    {
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
      error: uploadImageError,
      isSuccess: uploadImageIsSuccess,
      data: uploadImageData,
    },
  ] = useUploadImageMutation();

  // ? API update user data Mutation
  const [
    updateUserDetails,
    {
      isLoading: updateUserDetailsIsLoading,
      isError: updateUserDetailsIsError,
      error: updateUserDetailsError,
      isSuccess: updateUserDetailsIsSuccess,
      data: updateUserDetailsData,
    },
  ] = useUpdateUserDetailsMutation();

  useEffect(() => {
    if (uploadImageIsSuccess) {
      if (uploadImageData && uploadImageData.success) {
        toast.success(uploadImageData.data.message);
      }
    }
    if (uploadImageIsError) {
      showServerError(uploadImageError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadImageIsLoading]);

  // This is for handle get user API response and set initial value
  useEffect(() => {
    if (getUserIsSuccess) {
      setValue("firstName", getUserData?.data.firstName);
      setValue("lastName", getUserData?.data.lastName);
      setValue("department", getUserData?.data.departmentValue);
      setValue("position", getUserData?.data.position);
      setSelectedGenderId(getUserData?.data.genderId);
      setPriLanguageValue(getUserData?.data.primaryLanguageId);
      setValue("secondaryLanguage", getUserData?.data.secondaryLanguage);
      setValue("city", getUserData?.data.cityId);
      setValue("aboutMe", getUserData?.data.bio);
      setGenderDescriptionValue(getUserData?.data.genderDescription || null);
      setPronounsDescriptionValue(
        getUserData?.data.pronounsDescription || null
      );
      setUpdateCountryValue(getUserData?.data.countryId);
      setUpdateStateValue(getUserData?.data.stateId);
      setCityValue(getUserData?.data.cityId);
      setSelectedImage(getUserData?.data.imagePath);
      getStateListById(getUserData?.data.countryId);
      getCityListById(getUserData?.data.stateId);
    }
    if (getUserIsError) {
      showServerError(getUserError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserIsLoading]);

  // This for call all initial API (getUser, getGenderList, getCountryList, getLanguageList, getPronounList)
  useEffect(() => {
    getUser(user.data.id).then(() => {
      getGenderList();
      getCountryList();
      getLanguageList();
      getPronounList();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //This function handel Api error
  useEffect(() => {
    if (genderListIsError) {
      showServerError(genderListError);
    }
    if (countryListIsError) {
      showServerError(countryListError);
    }
    if (pronounListIsError) {
      showServerError(pronounListError);
    }
    if (cityListIsError) {
      showServerError(cityListError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    genderListIsLoading,
    countryListIsLoading,
    pronounListIsLoading,
    cityListIsLoading,
  ]);

  const onGenderDescriptionChange = (e: any) => {
    setGenderDescriptionValue(e.target.value);
  };
  const onPronounsDescriptionChange = (e: any) => {
    setPronounsDescriptionValue(e.target.value);
  };

  useEffect(() => {
    if (isSuccessPronounList) {
      var filteredArray = pronounListData?.data.filter(function (
        arrayItem: any
      ) {
        return (
          getUserData?.data.pronounsId.filter(function (
            anotherArrayItem: number
          ) {
            return anotherArrayItem === arrayItem.id;
          }).length > 0
        );
      });
      setSelectedPronounListData(filteredArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronounListIsLoading]);
  const isPronounsDescribe = () => {
    const array = filterArrayData(selectedPronounListData, SELF_DESCRIBE_ID);
    return array?.length > 0 || false;
  };
  const isGenderDescribe = () => {
    return selectedGenderId == SELF_DESCRIBE_ID;
  };
  // This code will call user detail update api and update user detail
  const onSubmitHandler: SubmitHandler<EditProfileInput> = (values) => {
    const genderValue = filterArrayData(genderListData?.data, selectedGenderId);
    const primaryLanguageValue = filterArrayData(
      languageListData?.data,
      priLanguageValue
    );
    const countryValue = filterArrayData(countryListData?.data, updateCountryValue);
    const stateValue = filterArrayData(stateListData?.data, updateStateValue);
    const cityValue = filterArrayData(cityListData?.data, values.city);
    const pronounValue = getPronounsIds(selectedPronounListData);
    const requestData = {
      firstName: values.firstName,
      lastName: values.lastName,
      departmentValue: values.department,
      position: values.position,
      primaryLanguageId: primaryLanguageValue[0].id,
      primaryLanguageValue: primaryLanguageValue[0].name,
      secondaryLanguage: values.secondaryLanguage,
      genderId: genderValue[0].id,
      genderValue: genderValue[0].name,
      countryId: countryValue[0]?.id || 0,
      countryValue: countryValue[0]?.name,
      stateId: stateValue[0]?.id || 0,
      stateValue: stateValue[0]?.name,
      cityId: cityValue[0]?.id || 0,
      cityValue: cityValue[0]?.name,
      pronounsId: pronounValue,
      bio: values.aboutMe,
      genderDescription: genderDescriptionValue,
      pronounsDescription: pronounsDescriptionValue,
    };
    if (
      !isShowGenderError() &&
      !isShowPronounsError() &&
      !isShowCountryError() &&
      !isShowStateError() &&
      !isShowGenderSelectError() &&
      !isShowPrimaryLangSelectError() &&
      !isPronounError()
    )
      updateUserDetails(requestData);
  };

  // This code will handle update user detail API response
  useEffect(() => {
    if (updateUserDetailsIsSuccess) {
      navigate("/profile", {
        state: {
          showUpdateMessage: true,
        },
      });
    }
    if (updateUserDetailsIsError) {
      showServerError(updateUserDetailsError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUserDetailsIsLoading]);

  // handle onChange country select value
  const getStateList = (e: any) => {
    setUpdateCountryValue(e.target.value);
    getStateListById(e.target.value);
    setUpdateStateValue(0);
    setCityValue(0);
    getCityListById();
  };
  const onGenderChange = (e: any) => {
    setSelectedGenderId(e.target.value);
    if (e.target.value === SELF_DESCRIBE_ID) {
      setGenderDescriptionValue("");
    }
  };

  const onPrimaryLanguageChange = (e: any) => {
    setPriLanguageValue(e.target.value);
  };
  // handle onChange State select value
  const getCityList = (e: any) => {
    setUpdateStateValue(e.target.value);
    getCityListById(e.target.value);
  };

  // handle onChange City select value
  const cityValueHandleChange = (e: any) => {
    setCityValue(e.target.value);
    setValue("city", e.target.value);
  };

  //This code will handle image Url and covert in base64
  // and upload image in DB
  const handelChangeImage = (event: any) => {
    setSelectedImage(URL.createObjectURL(event.target.files[0]));
    getBase64(event.target.files[0])
      .then((result) => {
        const imageResponse = {
          entityId: 10,
          id: getUserData?.data.id,
          imageBase64: result,
          extention: "png",
        };
        uploadImage(imageResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onPronounChange = (event: any, value: any) => {
    setSelectedPronounListData(value);
    const selectedPronouns = filterArrayData(value, SELF_DESCRIBE_ID);
    if (selectedPronouns.length > 0) {
      setPronounsDescriptionValue("");
    }
  };
  // for open local images
  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };
  const isShowGenderError = () => {
    if (isGenderDescribe()) {
      if (!genderDescriptionValue || genderDescriptionValue === "") {
        return false;
      } else if (genderDescriptionValue.length > 100) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const isShowPronounsError = () => {
    if (isPronounsDescribe()) {
      if (
        pronounsDescriptionValue == null ||
        !pronounsDescriptionValue ||
        pronounsDescriptionValue === ""
      ) {
        return false;
      } else if (pronounsDescriptionValue.length > 100) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const isShowCountryError = () => {
    if (updateCountryValue == null || updateCountryValue === 0) {
      return true;
    } else {
      return false;
    }
  };
  const isShowStateError = () => {
    if (updateStateValue == null || updateStateValue === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isShowGenderSelectError = () => {
    if (selectedGenderId == null || selectedGenderId === 0) {
      return true;
    } else {
      return false;
    }
  };

  const isShowPrimaryLangSelectError = () => {
    if (priLanguageValue == null || priLanguageValue === 0) {
      return true;
    } else {
      return false;
    }
  };
  const isPronounError = () => {
    if (selectedPronounListData.length === 0 || selectedPronounListData == null) {
      return true;
    } else {
      return false;
    }
  };
  const getGenderError = () => {
    if (isGenderDescribe()) {
      if (
        genderDescriptionValue == null ||
        !genderDescriptionValue ||
        genderDescriptionValue === ""
      ) {
        return "";
      } else if (genderDescriptionValue.length > 100) {
        return strings.gender_description_max_msg;
      }
    } else {
      return "";
    }
  };
  const getPronounsError = () => {
    if (isPronounsDescribe()) {
      if (!pronounsDescriptionValue || pronounsDescriptionValue === "") {
        return "";
      } else if (pronounsDescriptionValue.length > 100) {
        return strings.pronouns_description_max_msg;
      }
    } else {
      return "";
    }
  };

  const getGenderSelectError = () => {
    if (selectedGenderId === 0 || selectedGenderId == null) {
      return strings.gender_is_required;
    }
  };

  const getPriLanguageSelectError = () => {
    if (priLanguageValue === 0 || priLanguageValue == null) {
      return strings.primary_language_is_required;
    }
  };

  const getCountryError = () => {
    if (updateCountryValue === 0 || updateCountryValue == null) {
      return strings.country_is_required;
    }
  };

  const getStateError = () => {
    if (updateStateValue === 0 || updateStateValue == null) {
      return strings.state_is_required;
    }
  };

  const getPronounsSelectError = () => {
    if (selectedPronounListData.length === 0 || selectedPronounListData == null) {
      return strings.pronouns_is_required;
    }
  }

  return (
    <div className="bg-white">
      <div className="toasts-alert">
        <div id="liveAlert" className="live-alert"></div>
      </div>
      <Header />
      <main className=" ms-sm-auto after-login corporate-detail">
        <div className="container-fluid">
          {getUserIsLoading || updateUserDetailsIsLoading ? (
            <PageLoader />
          ) : (
            <div className="row">
              <div className="col-md-12">
                {showUpdateMessage ? (
                  <Typography
                    textAlign="center"
                    component="div"
                    className="success-message"
                  >
                    <Alert
                      severity="success"
                      onClose={() => {
                        setShowUpdateMessage(false);
                      }}
                    >
                      {strings.update_profile_success_message}
                    </Alert>
                  </Typography>
                ) : (
                  <div className="go-back me-auto">
                    <Link to="/profile" className="body-text text-black">
                      <img src={backImg} className="mr-r-4" alt="" />
                      {strings.back}
                    </Link>
                  </div>
                )}
              </div>
              <div className="col-md-12">
                <div className="parent-circular--portrait">
                  <div className="circular--portrait">
                    <img
                      src={selectedImage ? selectedImage : avatarMaleImg}
                      className="image-box"
                      alt=""
                    />
                  </div>
                  <img
                    src={editIconImg}
                    onClick={handleClick}
                    className="edit-icon"
                    alt=""
                  />
                </div>
              </div>
              <input
                accept="image/*"
                type="file"
                id="select-image"
                name="profileImage"
                style={{ display: "none" }}
                ref={hiddenFileInput}
                onChange={handelChangeImage}
              />
              <p className="photo-label">{strings.profile_photo_text}</p>
              <div className="col-md-12">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
                    <div className="row">
                      <div className="col-xl-7 co-lg-12 col-md-12">
                        <div className="row">
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating">
                              <FormInput
                                name="firstName"
                                label="First name"
                                type="firstName"
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating">
                              <FormInput
                                name="lastName"
                                label="Last name"
                                type="name"
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating">
                              <FormInput
                                name="department"
                                label="Department"
                                type="name"
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating">
                              <FormInput
                                name="position"
                                label="Position"
                                type="name"
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating custom-dd-s">
                              <FormSelectInput
                                name="gender"
                                label="Gender"
                                type="dropdown"
                                value={selectedGenderId}
                                onChange={onGenderChange}
                                data={genderListData}
                                customError={getGenderSelectError()}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating custom-dd-s">
                              <FormSelectInput
                                name="priLanguage"
                                label="Primary Language"
                                type="dropdown"
                                value={priLanguageValue}
                                onChange={onPrimaryLanguageChange}
                                data={languageListData}
                                customError={getPriLanguageSelectError()}
                              />
                            </div>
                          </div>
                          {isGenderDescribe() && (
                            <div className="col-xl-12 col-lg-12">
                              <div className="form-floating">
                                <FormInput
                                  name="genderDescribe"
                                  label={strings.gender_description}
                                  type="genderDescribe"
                                  fullWidth
                                  onChange={onGenderDescriptionChange}
                                  value={genderDescriptionValue}
                                  customError={getGenderError()}
                                />
                              </div>
                            </div>
                          )}

                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating">
                              <FormInput
                                name="secondaryLanguage"
                                label="Secondary Language"
                                type="name"
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating custom-dd-s">
                              <FormSelectInput
                                name="country"
                                label="Country"
                                onChange={getStateList}
                                value={updateCountryValue}
                                data={countryListData}
                                type="country"
                                customError={getCountryError()}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating custom-dd-s">
                              <FormSelectInput
                                name="state"
                                label="State"
                                type="dropdown"
                                onChange={getCityList}
                                value={updateStateValue}
                                data={stateListData}
                                customError={getStateError()}
                              />
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="form-floating custom-dd-s">
                              <FormSelectInput
                                name="city"
                                label="City"
                                type="dropdown"
                                onChange={cityValueHandleChange}
                                value={cityValue}
                                data={cityListData}
                              />
                            </div>
                          </div>
                          <div className="col-xl-12 col-lg-12 col-md-12">
                            <div className="form-floating">
                              <MultiSelectInputEditProfile
                                name="pronouns"
                                label={strings.pronouns_description}
                                type="dropdown"
                                handelChange={onPronounChange}
                                data={pronounListData}
                                value={selectedPronounListData}
                                customError={getPronounsSelectError()}
                              />
                            </div>
                          </div>
                          {isPronounsDescribe() && (
                            <div className="col-xl-12 col-lg-12 col-md-12">
                              <div className="form-floating">
                                <FormInput
                                  name="pronounDescribe"
                                  label="Describe"
                                  type="pronounDescribe"
                                  onChange={onPronounsDescriptionChange}
                                  value={pronounsDescriptionValue}
                                  customError={getPronounsError()}
                                />
                              </div>
                            </div>
                          )}
                          <div className="col-xl-12 col-lg-12">
                            <div className="form-floating">
                              <FormInput
                                label="About me"
                                name="aboutMe"
                                multiline
                                fullWidth
                                rows={4}
                                type={""}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="co-lg-12 col-xl-12">
                        <hr className="m-0 mr-t-10 mr-b-24" />
                      </div>
                      <div className="co-lg-12 col-xl-12">
                        <div className="set-margin">
                          <div className="block-action text-end">
                            <Link
                              className="body-text-large text-black"
                              to="/profile"
                            >
                              <button className="btn btn-secondary mr-r-16">
                                {strings.cancel}
                              </button>
                            </Link>
                            <button
                              className="btn btn-primary"
                              type="submit"
                            >
                              {strings.update}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
