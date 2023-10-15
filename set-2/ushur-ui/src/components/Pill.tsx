import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
interface PillProps {
  text: string,
  className?: string,
  variant?: string;
  icon?: React.ReactNode;
  showTooltip?: boolean;
  tooltipText?: string;
}

const Pill = (props: PillProps) => {
  const { className, text, icon, variant = "", showTooltip, tooltipText = "" } = props;
  return showTooltip ? (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="tooltip-top" className="pill-tooltip">
          {tooltipText}
        </Tooltip>
      }
    >
      <Badge pill className={`custom-pill justify-center items-center ${className}`} bg={variant} >
        {text}
        {icon && <span>{icon}</span>}
      </Badge >
    </OverlayTrigger>
  ) : (<Badge pill className={`custom-pill justify-center items-center ${className}`} bg={variant}>
    {text}
    {icon && <span>{icon}</span>}
  </Badge>)
};

export default Pill;
