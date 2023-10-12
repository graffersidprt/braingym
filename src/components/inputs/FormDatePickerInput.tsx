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
} & InputProps;

const FormDatePickerInput: FC<IFormInputProps> = ({
  name,
  label,
  type,
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
              error={!!errors[name]}
              {...otherProps}
            />
          </Box>
          {errors?.[name] && (
            <FormHelperText component="div" className="error-text">
              <img src={iconWarningImg} alt="alert" />
              {errors[name]?.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default FormDatePickerInput;
