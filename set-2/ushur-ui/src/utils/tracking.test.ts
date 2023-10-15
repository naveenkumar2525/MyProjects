import { renderHook } from "@testing-library/react-hooks";

import { Userpilot } from "userpilot";
import MockDate from "mockdate";
import { useTrackUser } from "./tracking";
import * as Utils from "./api.utils";

let userPilotIdentifySpy: jest.SpyInstance;

/** Renable test after upgrading node/react-scripts as per
 * https://stackoverflow.com/questions/56261381/how-do-i-set-a-timezone-in-my-jest-config
 * 
 */
xdescribe("Tracking", () => {
  beforeAll(() => {
    MockDate.set("2020-10-31");
  });

  // Reset the mock
  afterAll(() => {
    MockDate.reset();
  });

  const setup = () => {
    userPilotIdentifySpy = jest.spyOn(Userpilot, "identify");
  };

  test("does not track page loads for a user that does not exist in localstorage", () => {
    setup();
    const userInfoSpy = jest.spyOn(Utils, "getUserInfo").mockReturnValue({});
    renderHook(() => useTrackUser());
    expect(userInfoSpy).toHaveBeenCalledTimes(1);
    expect(userPilotIdentifySpy).not.toHaveBeenCalled();
  });

  test("tracks page loads for a user that does exist in localstorage", () => {
    setup();

    const userInfoSpy = jest.spyOn(Utils, "getUserInfo").mockReturnValue({
      emailId: "joe@smith.com",
      nickName: "Joker",
    });
    renderHook(() => useTrackUser());
    expect(userInfoSpy).toHaveBeenCalledTimes(1);
    expect(userPilotIdentifySpy).toHaveBeenCalledTimes(1);
    expect(userPilotIdentifySpy).toHaveBeenCalledWith("joe@smith.com", {
      created_at: "2020-10-31",
      email: "joe@smith.com",
      name: "Joker",
    });
  });
});
