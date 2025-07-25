import { debounce, TextField } from "@mui/material";
import { setSearchTerm } from "./catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { useEffect, useState } from "react";

export default function Search() {
  const { searchTerm } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  const [term, setTerm] = useState(searchTerm);
  useEffect(() => setTerm(searchTerm), [searchTerm]);

  const debouncedSearch = debounce((event) => {
    dispatch(setSearchTerm(event.target.value));
  }, 500);

  return (
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      value={term}
      onChange={(e) => {
        setTerm(e.target.value);
        debouncedSearch(e);
      }}
    />
  );
}
