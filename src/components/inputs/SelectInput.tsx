import {
  Box, FormControl, InputLabel, InputProps, MenuItem, Select
} from "@mui/material";
import React, { FC } from "react";
import { strings } from "../../constants/strings";

type IFormInputProps = {
  name: string;
  label: any;
  type: string;
  data: any;
  handelChange: any;
  value: any;
} & InputProps;

const SelectInput: FC<IFormInputProps> = ({
  name,
  label,
  type,
  data,
  handelChange,
  value,
  ...otherProps
}) => {
  return (
    <FormControl className="form-input" fullWidth sx={{ mb: 2 }}>
      <Box component="div">
        <React.Fragment>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select label={label} fullWidth onChange={handelChange} value={value}>
          <MenuItem value="0">{strings.select}</MenuItem>
            {data?.data?.map((item: any) => (
              <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </React.Fragment>
      </Box>
    </FormControl>
  );
};

export default SelectInput;
