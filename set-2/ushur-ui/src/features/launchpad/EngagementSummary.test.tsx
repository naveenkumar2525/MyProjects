import React, { useEffect } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EngagementSummary from "./EngagementSummary.react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { setContacts } from "./launchpadSlice";
import { useAppDispatch } from "../../app/hooks";

test("renders engagement summary", async () => {
  const Component = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(setContacts({ users: [{ deleted: false }] }));
    }, []);

    return <EngagementSummary goodCount={2} errorCount={1} />;
  };
  const { getByText } = render(
    <Provider store={store}>
      <Component />
    </Provider>
  );

  const ele = await getByText(/Launch/i);

  expect(ele).toBeInTheDocument();
});
