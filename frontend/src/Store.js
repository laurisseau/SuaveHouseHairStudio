import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  employeeInfo: localStorage.getItem("employeeInfo")
    ? JSON.parse(localStorage.getItem("employeeInfo"))
    : null,
};

function reducer(state, action) {
  switch (action.type) {
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };

    case "USER_SIGNOUT":
      return { ...state, userInfo: null };

    case "EMPLOYEE_SIGNIN":
      return { ...state, employeeInfo: action.payload };

    case "EMPLOYEE_SIGNOUT":
      return { ...state, employeeInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
