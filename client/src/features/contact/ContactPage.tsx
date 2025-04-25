import { CounterState } from "./counterReducer";
import { Typography, Button } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../app/store/store";
import { increment, decrement } from "./counterReducer";

export default function ContactPage() {
  const { data } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography variant="h2">Contact Page</Typography>
      <Typography variant="h5">{data}</Typography>
      <Button onClick={() => dispatch(increment(1))}>Increment</Button>
      <Button onClick={() => dispatch(decrement(1))}>Decrement</Button>
    </>
  );
}
