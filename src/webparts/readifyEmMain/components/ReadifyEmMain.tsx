/* eslint-disable @typescript-eslint/no-explicit-any */
import "./ReadifyEmMain.module.scss";
import { Provider } from "react-redux";
import { store } from "../../../redux/store/store";
import App from "../../../App/App";

// This is the entry point of this ReadifyEM application, it will render the App component in the main  div. NOTE: Every main props and redux data(store) should be injected in this main(index) component.

const ReadiFyEmMain = (props: any): JSX.Element => {
  return (
    <div className="main">
      <Provider store={store}>
        <App context={props.context} />
      </Provider>
    </div>
  );
};

export default ReadiFyEmMain;
