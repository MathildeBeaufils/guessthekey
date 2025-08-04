import "../styles/globals.css";
import Login from "../components/login";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "../reducers/users";

const store = configureStore({
  reducer: { user },
});

function App() {
  return (
    <Provider store={store}>
      <Login />;
    </Provider>
  );
}

export default App;
