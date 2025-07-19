import { Box, Button, Paper, Typography } from "@mui/material";
import Search from "./Search";
import { useAppSelector, useAppDispatch } from "../../app/store/store";
import RadioButtonGroup from "../../app/shared/RadioButtonGroup";
import { resetParams, setBrands, setOrderBy, setTypes } from "./catalogSlice";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to Low" },
  { value: "price", label: "Price - Low to High" },
];
interface Props {
  filtersData: {
    brands: string[];
    types: string[];
  };
}
export default function Filters({ filtersData }: Props) {
  const { orderBy, brands, types } = useAppSelector((state) => state.catalog);
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
        <CheckboxButtons
          items={filtersData.brands}
          checked={brands}
          onChange={(items: string[]) => dispatch(setBrands(items))}
        />
      </Paper>
      <Paper sx={{ p: 3 }}>
        <CheckboxButtons
          items={filtersData.types}
          checked={types}
          onChange={(items: string[]) => dispatch(setTypes(items))}
        />
      </Paper>
      <Button onClick={() => dispatch(resetParams())}>Reset</Button>
    </Box>
  );
}
