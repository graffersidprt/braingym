import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { object, TypeOf } from "zod";
import backImg from "../assets/images/icon-arrow-left.svg";
import logoImg from "../assets/images/logo-with-bottom-text.svg";
import FormInput from "../components/inputs/FormInput";
import LoginCheck from "../components/LoginCheck";
import { strings } from "../constants/strings";
import { emailValidation } from "../constants/validations";
import { useForgotPasswordMutation } from "../redux/api/authApi";
import { Alert, Typography } from "@mui/material";
import { showServerError } from "../constants/utils";
import LoaderFullPage from "../components/LoaderFullPage";

const forgetPasswordSchema = object({
  email: emailValidation,
});

export type ForgetInput = TypeOf<typeof forgetPasswordSchema>;

const ForgotPasswordPage = () => {
  const [email, setCurrentEmail] = useState("");
  const navigate = useNavigate();

  const methods = useForm<ForgetInput>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  // ? API Forgot Password Mutation
  const [forgotPassword, { isLoading, isError, error, isSuccess, data }] =
    useForgotPasswordMutation();

  const onSubmitHandler: SubmitHandler<ForgetInput> = (values) => {
    setCurrentEmail(values.email);
    const requestData = {
      email: values.email,
    };
    // ? Executing the forgotPassword Mutation
    forgotPassword(requestData);
    return false;
  };
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, isValid, errors },
    setValue,
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      if (data && data.success) {
        navigate("/otp", {
          state: { id: data.data.id, email: data.data.email },
        });
      } else {
        setValue("email", email);
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
        {isLoading && <LoaderFullPage />}

        <main role="main" className="login-wrapper">
          <div className="center-block">
            <div className="go-back mr-b-12 me-auto">
              <Link className="body-text-large text-black" to="/login">
                <img src={backImg} className="mr-r-4" alt="" />
                {strings.back}
              </Link>
            </div>
            <div className="login-card bg-white cmn-shadow border-radius-24 ">
              <div className="logo text-center">
                <img src={logoImg} alt="Brain Gym" />
              </div>
              <h2 className="text-center">{strings.forgot_password}</h2>
              <div className="body-text-large text-dark-grey text-center">
                {strings.forgot_password_message}
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
                      <FormInput
                        name="email"
                        label={strings.email}
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.email?.message}
                      </div>
                    </div>
                    <div className="form-action">
                      <button
                        className="btn btn-primary w-100"
                        disabled={!isValid}
                        type="submit"
                      >
                        {strings.send_otp}
                      </button>
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

export default ForgotPasswordPage;
