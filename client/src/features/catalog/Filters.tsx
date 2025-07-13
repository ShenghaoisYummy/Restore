import { useFetchFiltersQuery } from "./catalogApi";
import {
  Box,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  Checkbox,
  FormGroup,
} from "@mui/material";
import Search from "./Search";
import { useAppSelector, useAppDispatch } from "../../app/store/store";
import RadioButtonGroup from "../../app/shared/RadioButtonGroup";
import { setOrderBy } from "./catalogSlice";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to Low" },
  { value: "price", label: "Price - Low to High" },
];

export default function Filters() {
  const { data } = useFetchFiltersQuery();
  const { orderBy } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Paper>
        <Search />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <RadioButtonGroup
          options={sortOptions}
          onChange={(e) => dispatch(setOrderBy(e.target.value))}
          selectedValue={orderBy}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <FormGroup>
          {data &&
            data.brands.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox color="secondary" sx={{ py: 0.7, fontSize: 40 }} />
                }
                label={item}
              />
            ))}
        </FormGroup>
      </Paper>
    </Box>
  );
}
