import { ReactElement } from "react";

interface CanvasButtonProp {
  icon: string;
  text: string;
  className: string;
  onClick?: () => void | undefined | Promise<void>;
}
const CanvasButton = ({
  className,
  onClick,
  icon,
  text,
}: CanvasButtonProp): ReactElement => (
  <button
    type="button"
    className={`w-[fit-content] h-[32px] flex items-center justify-center mt-[1.6rem] 
    mr-2 p-[0.4rem] ${className}`}
    onClick={onClick}
  >
    <i className={`mr-[0.5rem] fa-thin ${icon}`} />
    <span className="font-proxima-light font-light text-sm">{text}</span>
  </button>
);
export default CanvasButton;
