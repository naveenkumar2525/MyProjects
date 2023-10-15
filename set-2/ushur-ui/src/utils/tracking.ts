import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Userpilot } from "userpilot";
import { getUserInfo } from "./api.utils";

const TOKEN = "NX-88yx13e5";

export const initializeTracking = () => {
  // Initialize Userpilot
  Userpilot.initialize(TOKEN);
};

export const trackUser = () => {
  const user = getUserInfo();
  if ("emailId" in user) {
    const dt = new Date();
    const twoDigit = (num: number) => String(num).padStart(2, "0");
    const created_at = `${dt.getFullYear()}-${twoDigit(
      dt.getMonth() + 1
    )}-${twoDigit(dt.getDate())}`;
    Userpilot.identify(user.emailId, {
      name: user.nickName,
      email: user.emailId,
      created_at,
    });
  }
};

export const useTrackUser = () => {
  useEffect(() => trackUser(), []);
};

type TrackPage = {
  name: string;
};

const trackPageLoad = (payload: TrackPage) => {
  const { name } = payload;
  const url = `/${window.location.pathname.split("/").pop()}`;
  Userpilot.track(name, { url });
};

export const useTrackPageLoad = (payload: TrackPage) => {
  useEffect(() => trackPageLoad(payload), []);
};

export const useTrackPageReload = () => {
  const location = useLocation();
  useEffect(() => {
    Userpilot.reload();
  }, [location]);
};
