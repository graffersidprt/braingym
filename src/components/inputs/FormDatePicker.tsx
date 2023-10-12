import { useState } from "react";
import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FormDatePicker = (props: any) => {
  const { label, value, onDateChange } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className="col-lg-6">
      <div className="form-floating w-100">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
           maxDate = {new Date()}
           open={open}
           onOpen={() => setOpen(true)}
           onClose={() => setOpen(false)}
            label={label}
            value={value}
            onChange={(newValue) => {
              onDateChange(newValue);
            }}
            renderInput={(params: any) => <TextField {...params} onClick={(e) => setOpen(true)} />}
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};
export default FormDatePicker;
