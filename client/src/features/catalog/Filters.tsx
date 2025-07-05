import { useFetchFiltersQuery } from "./catalogApi";
import {
  Box,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Checkbox,
  FormGroup,
} from "@mui/material";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to Low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Filters() {
  const { data } = useFetchFiltersQuery();
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Paper>
        <TextField label="Search" variant="outlined" fullWidth />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <FormControl>
          {sortOptions.map(({ value, label }) => (
            <FormControlLabel
              key={label}
              control={<Radio sx={{ py: 0.7 }} />}
              label={label}
              value={value}
            />
          ))}
        </FormControl>
      </Paper>
      <Paper sx={{ p: 3 }}>
          <FormGroup>
            {data && data.brands.map(item =>(
                <FormControlLabel
                key={item}
                control={<Checkbox color = "secondary" sx={{py: 0.7, fontSize: 40}}/>}
                label={item}
            />
          ))}
        </FormGroup>
      </Paper>
    </Box>
  );
}
