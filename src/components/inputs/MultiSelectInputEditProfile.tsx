import {
    FormHelperText,
    Checkbox,
    TextField,
    Autocomplete,
    Select,
    InputProps,
    FormControl,
  } from "@mui/material";
  import React, { FC } from "react";
  import { Controller, useFormContext } from "react-hook-form";
  import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
  import CheckBoxIcon from "@mui/icons-material/CheckBox";
  import iconWarningImg from "../../assets/images/icon-warning.svg";
  import { strings } from "../../constants/strings";
  type IFormInputProps = {
    name: string;
    label: any;
    type: string;
    data: any;
    handelChange: any;
    customError?: string;
    value: any;
  } & InputProps;
  
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  
  const MultiSelectInputEditProfile: FC<IFormInputProps> = ({
    name,
    label,
    type,
    data,
    customError,
    handelChange,
    value,
    ...otherProps
  }) => {
    const {
      control,
      formState: { errors },
    } = useFormContext<IFormInputProps>();
    return (
      <Controller
        control={control}
        defaultValue={""}
        name={name}
        render={({ field }) => (
          <FormControl className="form-input" fullWidth sx={{ mb: 2 }}>
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={data?.data || []}
              getOptionLabel={(option: any) => option?.name}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    error={customError || !!errors[name]}
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label={label} placeholder={label} />
              )}
              onChange={handelChange}
              value={value}
            />
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
  export default MultiSelectInputEditProfile;
  