import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

type IFormInputProps = {
  label: string;
  value: string;
  checked?: boolean;
  onChange: any;
};

export default function RadioBoxLabels(props: IFormInputProps) {
  const { checked, label, value, onChange } = props;

  return (
    <RadioGroup>
      <FormControlLabel
        control={<Radio checked={checked} />}
        label={label}
        value={value}
        onChange={() => onChange(checked)}
      />
    </RadioGroup>
  );
}
