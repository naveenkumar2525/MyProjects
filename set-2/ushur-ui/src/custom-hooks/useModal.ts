import { useState } from "react";

export const useModal = (): [boolean, () => void, () => void, () => void] => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggle = () => setVisible(!visible);
  const close = () => setVisible(false);
  const open = () => setVisible(false);

  return [visible, toggle, close, open];
};
