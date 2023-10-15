import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import VariablesPage from "./features/variables/variables.react";
import ShortLinksPage from "./features/short-links/ShortLinks.react";
import { initializeTracking } from "./utils/tracking";
import { BrowserRouter as Router } from "react-router-dom";
import './fonts/ProximaNova.otf'; 
import initializeI18n from "./i18n/i18n";
import "./utils/alerting";

initializeI18n();
initializeTracking();

console.log("envs", process.env);

// Assume app is ready to run immediately.
// However, for mocked requests using MSW if requests
// are performed before MSW initializes then API calls result in 404s.
// The following ensures that we defer mounting the app until MSW has started.
// See also https://mswjs.io/docs/recipes/deferred-mounting for details
let appReadyToRun = Promise.resolve();
if (
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_MOCK_SERVER === "MSW"
) {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, global-require, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-argument
  appReadyToRun = require("./mocks/browser").default;
  // eslint-disable-next-line promise/param-names
}

if (process.env.NODE_ENV === "production") {
  const Window = window as any;
  const Ushur = new Window.UshurApi();
  if (!Ushur.isLoggedIn()) {
    Window.parent.location.reload();
  }
}

// let lc = new CustomEvent("load_component", {
//   detail: { selector: "#root", name: "variables" },
// });
// window.dispatchEvent(lc);

window.addEventListener("load_component", (event: any) => {
  const { selector, name } = event.detail;
  let Component: any = <div>empty component</div>;
  if (name === "variables") {
    Component = VariablesPage;
  } else if (name == "short_links") {
    Component = ShortLinksPage;
  }
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.querySelector(selector)
  );
});

appReadyToRun
  .then(() =>
    // eslint-disable-next-line react/no-render-return-value
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <Router basename={window.location.pathname}>
            <App />
          </Router>
        </Provider>
      </React.StrictMode>,
      document.getElementById("root")
    )
  )
  .catch((err) => {
    console.log(err)
    throw new Error("Failed to start app");
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
