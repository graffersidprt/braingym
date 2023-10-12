import {
    FormHelperText,
    FormControl,
    InputProps,
    Box,
    InputLabel,
    Select,
    MenuItem
  } from "@mui/material";
  import React, { useEffect, useState, FC } from "react";
  import { Controller, useFormContext } from "react-hook-form";
  import iconWarningImg from "../../assets/images/icon-warning.svg";
  
  type IFormInputProps = {
    name: string;
    label: any;
    type: string;
    data: any;
    customError?: string;
  } & InputProps;
  
  const FormSelectInput: FC<IFormInputProps> = ({
    name,
    label,
    type,
    data,
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
            <>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
              {...field}
              label={label}
              fullWidth
              error={customError || !!errors[name]}
              {...otherProps}
            >
            {data?.data?.map((item) => (
              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
            ))}
            </Select>
            </>
            </Box>
            {customError && customError!=='' && (
              <FormHelperText component="div" className="error-text">
                <img src={iconWarningImg} alt="alert" />
                {customError}
              </FormHelperText>
            )}
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
  
  export default FormSelectInput;