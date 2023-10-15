import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import {
  configureStore,
  EmptyObject,
  EnhancedStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import { ReducerTypes, reducer, serializableCheckOptions } from "../app/store";

/**
 * This module overrides the render method so that
 * each test case receives an independent copy of a store allowing
 * test cases to be independent.
 */

type TStore = EnhancedStore<ReducerTypes>;

type CustomRenderOptions = {
  preloadedState?: PreloadedState<ReducerTypes & EmptyObject>;
  store?: TStore;
} & Omit<RenderOptions, "wrapper">;

function createStore(
  preloadedState?: PreloadedState<ReducerTypes & EmptyObject>
) {
  return configureStore({
    reducer,
    preloadedState, // allow the state to be overridden
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: serializableCheckOptions,
      }),
  });
}

function render(ui: ReactElement, options?: CustomRenderOptions) {
  const { preloadedState } = options || {};

  const store = options?.store || createStore(preloadedState);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";

// Override render method
export { render, createStore };
