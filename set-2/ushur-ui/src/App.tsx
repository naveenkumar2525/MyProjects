import React, { useEffect, Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Switch, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  dataSecurityRule,
  getDataSecurityRuleAPI as getEnterpriseSettings,
} from "./features/variables/variablesSlice";
import "./App.css";
import "./app/sidebar.css";

import ShortLinksPage from "./features/short-links/ShortLinks.react";
import RulesetListPage from "./features/ruleset/RulesetList.react";
import RulesetPage from "./features/ruleset/RulesetPage.react";
import ValidationPage from "./features/validation/ValidationPage.react";

import Freetrial from "./features/free-trial/FreeTrialPage.react";
import VariablesPage from "./features/variables/variables.react";
import UshursList from "./features/ushurs/UshursList.react";
import Contacts from "./features/contacts/ContactsList.react";
import Integration from "./features/integration/integration.react";
import HubSettings from "./features/hub-settings/HubSettings.react";
import Sidebar from "./app/Sidebar.react";
import { getUserInfo } from "./utils/api.utils";
import useUrlSearchParams from "./custom-hooks/useUrlSearchParams";
import DataTables from "./features/datatables/DataTables.react";
import LaunchPad from "./features/launchpad/launchpad.react";
import Analytics from "./features/analytics/Analytics.react";
import { hasValidToken } from "./utils/helpers.utils";
import { useTrackPageReload, useTrackUser } from "./utils/tracking";
import InitiatedActivitiesList from "./features/campaign/InitiatedActivitiesList.react";
import {
  isFreeTrial,
  navPaths,
  getFreeTrialEnvStatus,
  getFreeTrialConfig,
} from "./features/free-trial/freeTrialSlice";
import ErrorFallback from "./components/ErrorFallback.react";

/**
 * Lazy load the Canvas component. However, in CI/CD we avoid lazy loading
 * since this throws off code coverage results for end to end reports
 * that the 'istanbul' tool reports.
 *
 * @returns The Canvas component.
 */
function importCanvasComponent() {
  let CanvasPage: unknown;
  if (process.env.REACT_APP_CI) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    CanvasPage = require(`./features/canvas/CanvasPage.react`).default;
  } else {
    CanvasPage = lazy(() => import("./features/canvas/CanvasPage.react"));
  }

  return CanvasPage;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const CanvasPage = importCanvasComponent() as any;

const userInfo = getUserInfo();
const adminInfo: any = localStorage.getItem("adminUser");
const mainUrl = window.location.href.split("/").slice(0, 4).join("/");
const loginPath = `${mainUrl}/auth`;

function App() {
  const { page, route } = useUrlSearchParams();
  const dispatch = useAppDispatch();
  const entSettings = useAppSelector(dataSecurityRule);
  const isFreeTrialEnabled = useAppSelector(isFreeTrial);
  const navigatorPaths = useAppSelector(navPaths);
  useTrackUser();
  useTrackPageReload();

  useEffect(() => {
    dispatch(getEnterpriseSettings());
    dispatch(getFreeTrialEnvStatus());
    dispatch(getFreeTrialConfig());
  }, []);
  const pages: { [key: string]: any } = {
    variables: <VariablesPage />,
    short_links: <ShortLinksPage />,
    hub_settings:
      isFreeTrialEnabled === null ? null : isFreeTrialEnabled ? (
        <Freetrial path={navigatorPaths?.InvisiblePortal ?? ""} />
      ) : (
        <HubSettings />
      ),
    contacts: <Contacts />,
    datatables: <DataTables />,
    integration: 
      isFreeTrialEnabled === null ? null : isFreeTrialEnabled ? (
        <Freetrial path={navigatorPaths?.Integrations ?? ""} />
      ) : (
        <Integration />
      ),
    validation: <ValidationPage />,
    launchpad: <LaunchPad />,
    edit_ruleset: <RulesetPage />,
    rules_manager:
      isFreeTrialEnabled === null ? null : isFreeTrialEnabled ? (
        <Freetrial path={navigatorPaths?.MLStudio ?? ""} />
      ) : (
        <RulesetListPage />
      ),
    canvas: <CanvasPage />,
    analytics:
      isFreeTrialEnabled === null ? null : isFreeTrialEnabled ? (
        <Freetrial path={navigatorPaths?.Insights ?? ""} />
      ) : (
        <Analytics />
      ),
    campaign: <InitiatedActivitiesList />,
    "": <UshursList />,
  };
  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      const expiryTime = userInfo?.expiryTime - new Date().getTime();
      if (expiryTime > 0) {
        setTimeout(() => {
          localStorage.setItem(
            "ui2.0",
            window.location.search.includes("?page=") ? "false" : "true"
          );
          localStorage.removeItem("user");
          localStorage.removeItem("adminUser");
          // @ts-ignore
          window.top.location.href = loginPath;
        }, expiryTime);
      } else {
        window.location.replace(loginPath);
      }
    }
  }, []);

  if (page in pages) {
    return (
      <>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
        >
          <Suspense fallback={<div>Loading...</div>}>{pages[page]}</Suspense>
        </ErrorBoundary>
      </>
    );
  }
  if (route in pages) {
    return (
      <Sidebar>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
        >
          <Suspense fallback={<div>Loading...</div>}>{pages[route]}</Suspense>
        </ErrorBoundary>
      </Sidebar>
    );
  }

  if (entSettings?.data?.showUi2Tabs === "No") {
    window.location.replace(`${mainUrl}/error-page`);
    return null;
  }

  return typeof isFreeTrialEnabled === "boolean" ? (
    <Sidebar>
      <Switch>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {Object.keys(pages).map((path: string) => (
              <Route key={`/${path}`} path={`/${path}`}>
                {hasValidToken(userInfo, adminInfo) ||
                window.location.hostname === "localhost"
                  ? pages[path]
                  : window.location.replace(loginPath)}
              </Route>
            ))}
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </Sidebar>
  ) : null;
}

export default App;
