import { useEffect } from "react";

const useOutsideClickAlert = (
  ref: React.RefObject<HTMLDivElement | null>,
  isAlertRequired: boolean,
  onClickOutside: () => void
) => {
  useEffect(() => {
    // Function for click event
    function handleOutsideClick(event: MouseEvent) {
      const refObject = ref && ref.current;
      if (refObject && !refObject.contains(event.target as HTMLElement)) {
        if (isAlertRequired && onClickOutside) onClickOutside();
      }
    }

    // Adding click event listener
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [ref, onClickOutside]);
};

export default useOutsideClickAlert;
