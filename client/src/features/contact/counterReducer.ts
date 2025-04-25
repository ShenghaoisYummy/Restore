import { createSlice } from "@reduxjs/toolkit";
export interface CounterState {
  data: number;
}

const initialState: CounterState = {
  data: 42,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

// export function decrementLegacy(amount: number) {
//   return { type: "decrement", payload: amount };
// }

// export default function counterReducer(
//   state = initialState,
//   action: { type: string; payload: number }
// ) {
//   switch (action.type) {
//     case "increment":
//       return { ...state, data: state.data + action.payload };
//     case "decrement":
//       return { ...state, data: state.data - action.payload };
//   }
//   return state;
// }
