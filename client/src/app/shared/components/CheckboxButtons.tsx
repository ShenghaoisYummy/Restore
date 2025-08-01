import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  items: string[];
  checked: string[];
  onChange: (item: string[]) => void;
}
function CheckboxButtons({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked);

  useEffect(() => {
    setCheckedItems(checked);
  }, [checked]);

  const handleToggle = (value: string) => {
    const updatedChecked = checkedItems?.includes(value)
      ? checkedItems.filter((item) => item !== value)
      : [...checkedItems, value];
    setCheckedItems(updatedChecked);
    onChange(updatedChecked);
  };

  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              color="secondary"
              sx={{ py: 0.7, fontSize: 40 }}
              checked={checkedItems.includes(item)}
              onClick={() => handleToggle(item)}
            />
          }
          label={item}
        />
      ))}
    </FormGroup>
  );
}
export default CheckboxButtons;
