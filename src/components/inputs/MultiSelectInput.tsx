import {
  Checkbox,
  TextField,
  Autocomplete,
  InputProps,
} from "@mui/material";
import React, { FC } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { strings } from "../../constants/strings";
type IFormInputProps = {
  name: string;
  label: any;
  type: string;
  data: any;
  handelChange: any;
  value: any;
} & InputProps;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MultiSelectInput: FC<IFormInputProps> = ({
  name,
  label,
  type,
  data,
  customError,
  handelChange,
  value,
  ...otherProps
}) => {
  return (
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
  );
};
export default MultiSelectInput;
