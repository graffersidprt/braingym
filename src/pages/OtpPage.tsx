import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { object, TypeOf } from "zod";
import backImg from "../assets/images/icon-arrow-left.svg";
import warningImg from "../assets/images/icon-warning.svg";
import logoImg from "../assets/images/logo-with-bottom-text.svg";
import LoginCheck from "../components/LoginCheck";
import OtpInput from "../components/inputs/OtpInput";
import { strings } from "../constants/strings";
import { otpValidation } from "../constants/validations";
import { useVerifyEmailMutation } from "../redux/api/authApi";
import { Alert, Typography } from "@mui/material";
import { useForgotPasswordMutation } from "../redux/api/authApi";
import $ from "jquery";
import { showServerError } from "../constants/utils";
import LoaderFullPage from "../components/LoaderFullPage";

const otpSchema = object({
  otp1: otpValidation,
  otp2: otpValidation,
  otp3: otpValidation,
  otp4: otpValidation,
});

export type OtpTypeInput = TypeOf<typeof otpSchema>;

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  if (location && !location.state.id) {
    navigate("/forgot-password");
  }
  const methods = useForm<OtpTypeInput>({
    resolver: zodResolver(otpSchema),
  });
  const [showResendOtpValidation, setShowResendOtpValidation] = useState(false);

  const autoTab = (e) => {
    let val = $(e.target).attr("id");
    const BACKSPACE_KEY = 8;
    const DELETE_KEY = 46;
    if (val <= 2 && e.keyCode !== BACKSPACE_KEY && e.keyCode !== DELETE_KEY) {
      let id = parseInt(val) + 1;
      let elem = $("#" + id);
      elem.focus();
    }
  };

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid },
    setValue,
  } = methods;

  // ? API Verify Email Mutation
  const [
    verifyEmail,
    {
      isLoading: verifyEmailIsLoading,
      IsError: verifyEmailIsError,
      error: verifyEmailError,
      isSuccess: verifyEmailIsSuccess,
      data: verifyEmailData,
    },
  ] = useVerifyEmailMutation();

  // ? API Resend OTP
  const [
    resendOtp,
    {
      isLoading: resendOtpIsLoading,
      IsError: resendOtpIsError,
      error: resendOtpError,
      isSuccess: resendOtpIsSuccess,
      data: resendOtpData,
    },
  ] = useForgotPasswordMutation();

  const onSubmitHandler: SubmitHandler<OtpTypeInput> = (values) => {
    const requestData = {
      id: location.state.id,
      userOTP: values.otp1 + values.otp2 + values.otp3 + values.otp4,
    };
    verifyEmail(requestData);
    return false;
  };

  const resendOtpRequest = (e) => {
    e.preventDefault();
    const requestData = {
      email: location.state.email,
    };
    resendOtp(requestData);
  };

  useEffect(() => {
    setShowResendOtpValidation(false);
    if (verifyEmailIsSuccess) {
      if (verifyEmailData && verifyEmailData.success) {
        navigate("/reset-password", {
          state: {
            id: verifyEmailData.data.id,
            userOTP: verifyEmailData.data.userOTP,
          },
        });
      }
    }
    if (verifyEmailIsError) {
      showServerError(verifyEmailError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyEmailIsLoading]);

  useEffect(() => {
    setShowResendOtpValidation(true);
    if (resendOtpIsSuccess) {
      if (resendOtpData && resendOtpData.success) {
      }
    }
    if (resendOtpIsError) {
      showServerError(resendOtpError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resendOtpIsLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  return (
    <React.Fragment>
      <LoginCheck />
      <div className="container-fluid">
        {(verifyEmailIsLoading || resendOtpIsLoading) && <LoaderFullPage />}

        <main role="main" className="login-wrapper">
          <div className="center-block">
            <div className="go-back mr-b-12 me-auto">
              <Link
                className="body-text-large text-black"
                to="/forgot-password"
              >
                <img src={backImg} className="mr-r-4" alt="" />
                {strings.back}
              </Link>
            </div>
            <div className="login-card bg-white cmn-shadow border-radius-24 ">
              <div className="logo text-center">
                <img src={logoImg} alt="Brain Gym" />
              </div>
              <h2 className="text-center">{strings.otp}</h2>
              <div className="body-text-large text-dark-grey text-center">
                {strings.otp_message}
              </div>

              {((verifyEmailIsSuccess &&
                !verifyEmailData?.success &&
                !showResendOtpValidation) ||
                verifyEmailIsError) && (
                <div>
                  <Typography textAlign="center" component="div" className="">
                    <Alert severity="error">
                      {verifyEmailIsSuccess
                        ? verifyEmailData?.message
                        : verifyEmailError?.verifyEmailData?.title}
                    </Alert>
                  </Typography>
                </div>
              )}
              {((resendOtpIsSuccess &&
                !resendOtpData?.success &&
                showResendOtpValidation) ||
                resendOtpIsError) && (
                <div>
                  <Typography textAlign="center" component="div" className="">
                    <Alert severity="error">
                      {resendOtpIsSuccess
                        ? resendOtpData?.message
                        : resendOtpError?.resendOtplData?.title}
                    </Alert>
                  </Typography>
                </div>
              )}
              {resendOtpIsSuccess &&
                resendOtpData?.success &&
                showResendOtpValidation && (
                  <div>
                    <Typography textAlign="center" component="div" className="">
                      <Alert severity="success">
                        {strings.otp_send_success_msg}
                      </Alert>
                    </Typography>
                  </div>
                )}
              <div className="cmn-form login-form needs-validation">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmitHandler)}>
                    <div className="px-3 otp-box">
                      <div className="form-group">
                        <OtpInput
                          name="otp1"
                          tabIndex={1}
                          onKeyUp={autoTab}
                          id="0"
                        />
                        <OtpInput
                          name="otp2"
                          tabIndex={2}
                          onKeyUp={autoTab}
                          id="1"
                        />
                        <OtpInput
                          name="otp3"
                          tabIndex={3}
                          onKeyUp={autoTab}
                          id="2"
                        />
                        <OtpInput
                          name="otp4"
                          tabIndex={4}
                          onKeyUp={autoTab}
                          id="3"
                        />
                        <div className="feedback invalid-feedback text-center mr-t-10">
                          <img src={warningImg} alt="alert" />
                          {strings.invalid_otp}
                        </div>
                      </div>
                    </div>
                    <div className="form-action text-center">
                      <button
                        className="btn btn-primary w-100 mr-b-32"
                        type="submit"
                        disabled={!isValid}
                      >
                        {strings.confirm}
                      </button>
                      <Link to="#" className="w-100" onClick={resendOtpRequest}>
                        {strings.resend_otp}
                      </Link>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default OtpPage;
