import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import ushursReducer from "../features/ushurs/ushursSlice";
import shortlinks from "../features/short-links/shortlinksSlice";
import variables from "../features/variables/variablesSlice";
import contactsReducer from "../features/contacts/contactsSlice";
import metadata from "../features/metadata/metadataSlice";
import integrationReducer from "../features/integration/integrationSlice";
import hubSettings from "../features/hub-settings/hubSettingsSlice";
import ruleset from "../features/ruleset/rulesetSlice";
import canvas, {
  setDiagrammingService,
} from "../features/canvas/data/canvasSlice";
import validation from "../features/validation/ValidationSlice";
import roles from "../features/roles/rolesSlice";
import launchpadReducer from "../features/launchpad/launchpadSlice";
import freeTrial from "../features/free-trial/freeTrialSlice";

export const reducer = {
  roles,
  ushurs: ushursReducer,
  shortlinks,
  variables,
  metadata,
  hubSettings,
  contacts: contactsReducer,
  integration: integrationReducer,
  ruleset,
  canvas,
  validation,
  freeTrial,
  launchpad: launchpadReducer,
};

export const serializableCheckOptions = {
  ignoredActions: [setDiagrammingService.type],
  ignoredPaths: ["canvas.diagrammingService"],
};

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: serializableCheckOptions,
    }),
});

export type ReducerTypes = Pick<RootState, "roles"> &
  Pick<RootState, "ushurs"> &
  Pick<RootState, "shortlinks"> &
  Pick<RootState, "variables"> &
  Pick<RootState, "metadata"> &
  Pick<RootState, "hubSettings"> &
  Pick<RootState, "contacts"> &
  Pick<RootState, "integration"> &
  Pick<RootState, "validation"> &
  Pick<RootState, "ruleset"> &
  Pick<RootState, "canvas"> &
  Pick<RootState, "launchpad">;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
