import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { object, TypeOf } from "zod";
import backImg from "../assets/images/icon-arrow-left.svg";
import warningImg from "../assets/images/icon-warning.svg";
import logoImg from "../assets/images/logo-with-bottom-text.svg";
import PasswordInput from "../components/inputs/PasswordInput";
import LoginCheck from "../components/LoginCheck";
import { strings } from "../constants/strings";
import { createPasswordValidation } from "../constants/validations";
import { useChangePasswordMutation } from "../redux/api/authApi";
import { Alert, Typography } from "@mui/material";
import { showServerError } from "../constants/utils";
import LoaderFullPage from "../components/LoaderFullPage";

const passwordSchema = object({
  password: createPasswordValidation,
  confirmPassword: createPasswordValidation,
}).refine((data) => data.password === data.confirmPassword, {
  message: strings.password_not_match_error,
  path: ["confirmPassword"]
});

export type ForgetInput = TypeOf<typeof passwordSchema>;

const ConfirmPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if( typeof location.state === 'undefined' || location.state === null || typeof location.state.id === 'undefined' || location.state.id === null ){
      navigate("/forgot-password");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const methods = useForm<ForgetInput>({
    resolver: zodResolver(passwordSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid },
    setValue,
  } = methods;

  // ? API Verify Email Mutation
  const [changePassword, { isLoading, isError, error, isSuccess, data }] =
  useChangePasswordMutation();

  const onSubmitHandler: SubmitHandler<ForgetInput> = (values) => {
    const requestData = {
      id: location.state.id,
      userOTP: location.state.userOTP,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    changePassword(requestData);
    return false;
  };

  useEffect(() => {
    if (isSuccess) {
      if (data && data.success) {
       navigate("/password-update-success",{state: {}});
      }
    }
    if (isError) {
      showServerError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

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

      {isLoading && (
          <LoaderFullPage/>
        )}

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
              <div className="reset-password">
                <div className="logo text-center">
                  <img src={logoImg} alt="Brain Gym" />
                </div>
                <h2 className="text-center">{strings.reset_password}</h2>
                <div className="body-text-large text-dark-grey text-center">
                  {strings.reset_password_message}
                </div>

                {((isSuccess && !data?.success) || isError) && (
                <div>
                  <Typography textAlign="center" component="div" className="">
                    <Alert severity="error">
                      {isSuccess ? data?.message : error?.data?.title}
                    </Alert>
                  </Typography>
                </div>
              )}
                <div className="cmn-form login-form needs-validation">
                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmitHandler)} autoComplete="off" noValidate>
                    <div className="form-floating form-group">
                      <PasswordInput
                        name="password"
                        label={strings.set_password}
                        type="password"
                      />
                    </div>
                    <div className="form-floating form-group">
                      <PasswordInput
                        name="confirmPassword"
                        label={strings.confirm_password}
                        type="password"
                      />
                      <div className="feedback invalid-feedback">
                        <img src={warningImg} alt="alert" />
                        {strings.password_error_message}
                      </div>
                    </div>
                    <div className="form-action">
                      <button
                        id="reset-password"
                        className="btn btn-primary w-100"
                        type="submit"
                      >
                        {strings.reset_password}
                      </button>
                    </div>
                  </form>
                </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default ConfirmPasswordPage;
