import {
  useController,
  UseControllerProps,
  FieldValues,
} from "react-hook-form";
import {
  SelectProps,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  FormHelperText,
} from "@mui/material";

type Props<T extends FieldValues> = {
  label: string;
  name: keyof T;
  items: string[];
} & UseControllerProps<T> &
  Partial<SelectProps>;

export default function AppSelectInput<T extends FieldValues>(props: Props<T>) {
  const { fieldState, field } = useController({ ...props });
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={field.value || ""}
        label={props.label}
        onChange={field.onChange}
      >
        {props.items.map((item, index) => (
          <MenuItem key={index} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
