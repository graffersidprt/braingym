import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, TypeOf } from "zod";
import logoImg from "../assets/images/logo-with-bottom-text.svg";
import FormInput from "../components/inputs/FormInput";
import PasswordInput from "../components/inputs/PasswordInput";
import LoginCheck from "../components/LoginCheck";
import { strings } from "../constants/strings";
import { setStorage, showServerError } from "../constants/utils";
import {
  emailValidation,
  loginPasswordValidation,
} from "../constants/validations";
import { useLoginUserMutation } from "../redux/api/authApi";
import LoaderFullPage from "../components/LoaderFullPage";

const loginSchema = object({
  email: emailValidation,
  password: loginPasswordValidation,
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const [email, setCurrentEmail] = useState("");
  const [autoFocusStatus, setAutoFocusStatus] = useState(false);

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // ? API Login Mutation
  const [loginUser, { isLoading, isError, error, isSuccess, data }] =
    useLoginUserMutation();

  const navigate = useNavigate();

  const {
    reset,
    formState: { isSubmitSuccessful, isValid },
    setValue,
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      if (data && data.success) {
        let userData = {
          accessToken: data.data.accessToke,
          email: data.data.email,
          data: data?.data,
        };
        setStorage("user", userData);
        toast.success(strings.logged_in_successfully);
        navigate("/dashboard");
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

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    setCurrentEmail(values.email);

    const requestData = {
      email: values.email,
      password: values.password,
      deviceId: "hjhjhjhjhj", //TODO: This needs to remove once backend API error will get fixed
    };
    // ? Executing the loginUser Mutation
    loginUser(requestData);
    return false;
  };

  const updateValue = () => {
    setAutoFocusStatus(true);
  };

  useEffect(() => {
    setTimeout(() => {
      var autofilled = document.querySelectorAll("input:-webkit-autofill");
      if (autofilled.length > 0) {
        var legend = document.querySelectorAll("legend");
        legend.forEach((legendItem) => {
          legendItem.classList.add("css-14lo706");
        });
        var label = document.querySelectorAll(".MuiFormLabel-root");
        label.forEach((labelItem) => {
          labelItem.classList.add(
            "css-1sumxir-MuiFormLabel-root-MuiInputLabel-root"
          );
        });
        updateValue();
      }
    }, 1500);
  }, []);

  /* The handleFocusChange function to set a new state for input */
  const handleFocusChange = () => {
    setAutoFocusStatus(false);
  };

  const isFormValid = () => {
    let status = false;
    if (autoFocusStatus) {
      status = true;
    } else if (!isValid) {
      status = false;
    } else if (autoFocusStatus && isValid) {
      status = true;
    } else if (!autoFocusStatus && isValid) {
      status = true;
    } else if (!autoFocusStatus && !isValid) {
      status = false;
    }
    return !status;
  };

  return (
    <>
      <LoginCheck />
      <div className="container-fluid">
        {isLoading && <LoaderFullPage />}
        <main role="main" className="login-wrapper">
          <div className="center-block">
            <div className="login-card bg-white cmn-shadow border-radius-24 ">
              <div className="logo text-center">
                <img src={logoImg} alt="Brain Gym" />
              </div>
              <h2 className="text-center">{strings.login}</h2>
              <div className="body-text-large text-dark-grey text-center">
                {strings.login_to_your_account}
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
                  <form
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                    autoComplete="off"
                    noValidate
                  >
                    <FormInput
                      name="email"
                      label={strings.email}
                      type="email"
                      id="someinput"
                      autoComplete="off"
                      onFocus={handleFocusChange}
                    />
                    <PasswordInput
                      name="password"
                      label={strings.password}
                      type="password"
                      autoComplete="current-password"
                      onFocus={handleFocusChange}
                    />
                    <div className="forgot-ps-link text-end ms-auto">
                      <Link className="ms-auto" to="/forgot-password">
                        {strings.forget_password}
                      </Link>
                    </div>
                    <div className="form-action ">
                      <button
                        className="btn btn-primary w-100"
                        disabled={isFormValid()}
                        type="submit"
                        id="submitBtn"
                      >
                        {strings.login}
                      </button>
                    </div>
                    <div className=" mt-3 text-center">
                      <div className="form-check d-inline-block m-0">
                        <label className=" lh-normal fs-12 lh-normal">
                          &nbsp;
                          <Link
                            to="/terms-conditions"
                            className="link fs-12 lh-normal"
                            target="_blank"
                          >
                            {strings.terms_of_services}
                          </Link>
                          &nbsp;&&nbsp;
                          <Link
                            to="/privacy-policy"
                            className="link fs-12 lh-normal"
                            target="_blank"
                          >
                            {strings.privacy_policy}
                          </Link>
                          &nbsp;
                        </label>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
