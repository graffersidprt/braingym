import {
  FormHelperText,
  FormControl,
  TextField,
  InputProps,
  Box,
} from "@mui/material";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import iconWarningImg from "../../assets/images/icon-warning.svg";

type IFormInputProps = {
  name: string;
  label: any;
  type: string;
  customError?: string;
} & InputProps;

const FormInput: FC<IFormInputProps> = ({
  name,
  label,
  type,
  customError,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<IFormInputProps>();

  return (
    <Controller
      control={control}
      defaultValue={''}
      name={name}
      render={({ field }) => (
        <FormControl className="form-input" fullWidth sx={{ mb: 2 }}>
          <Box component="div">
            <TextField
              {...field}
              label={label}
              fullWidth
              sx={{ borderRadius: "1rem" }}
              error={customError || !!errors[name]}
              {...otherProps}
            />
          </Box>
          {errors?.[name] && (
            <FormHelperText component="div" className="error-text">
              <img src={iconWarningImg} alt="alert" />
              {errors[name]?.message}
            </FormHelperText>
          )}
          {customError && customError!=='' && (
            <FormHelperText component="div" className="error-text">
              <img src={iconWarningImg} alt="alert" />
              {customError}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormInput;
