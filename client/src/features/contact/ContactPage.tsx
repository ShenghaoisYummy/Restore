import { useSelector, useDispatch } from "react-redux";
import { CounterState } from "./counterReducer";
import { Typography, Button } from "@mui/material";

export default function ContactPage() {
  const data = useSelector((state: CounterState) => state.data);
  const dispatch = useDispatch();
  return (
    <>
      <Typography variant="h2">Contact Page</Typography>
      <Typography variant="h5">{data}</Typography>
      <Button onClick={() => dispatch({ type: "increment" })}>Increment</Button>
      <Button onClick={() => dispatch({ type: "decrement" })}>Decrement</Button>
    </>
  );
}
