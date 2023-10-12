import { FormControl, TextField, InputProps, Box } from "@mui/material";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type IFormInputProps = {
  name: string;
  label?: any;
  type?: string;
} & InputProps;

const OtpInput: FC<IFormInputProps> = ({
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
        <FormControl className="form-control" sx={{ mb: 2 }}>
          <Box component="div" style={{ marginRight: -15 }}>
            <TextField
              {...field}
              sx={{ borderRadius: "1rem" }}
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center" },
              }}
              {...otherProps}
            />
          </Box>
        </FormControl>
      )}
    />
  );
};

export default OtpInput;
