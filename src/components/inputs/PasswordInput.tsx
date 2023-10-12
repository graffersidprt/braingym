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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type IFormInputProps = {
  name: string;
  label: any;
  type: string;
} & InputProps;

const PasswordInput: FC<IFormInputProps> = ({
  name,
  label,
  type,
  ...otherProps
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<IFormInputProps>();

  const [showPassword, setShowPassword] = React.useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
              type={showPassword ? "password" : "text" }
              {...otherProps}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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

export default PasswordInput;
