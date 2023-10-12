import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
type IFormInputProps = {
  label: string;
  value: string;
  checked?: boolean;
  onChange: any;
};

export default function CheckboxLabels(props: IFormInputProps) {
  const { checked, label, value, onChange } = props;
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label={label}
        value={value}  
        onChange={() => onChange(checked)}
      />
    </FormGroup>
  );
}
