import { ReactElement, FC } from "react";
import "./Simulator.css";

interface SimulatorProps {
  HeaderElement: FC;
  BodyElement: FC;
  FooterElement?: FC;
}

const Simulator = ({
  HeaderElement,
  BodyElement,
  FooterElement = () => <></>,
}: SimulatorProps): ReactElement => (
  <div
    data-testid="mobile_simulator_outer"
    className="mobile_simulator_outer box-border bg-very-dark-gray flex items-center justify-center"
  >
    <div className="mobile_simulator_inner bg-white w-94 h-97">
      <div className="d-flex h-full justify-top flex-column">
        <HeaderElement />
        <BodyElement />
        <FooterElement />
      </div>
    </div>
  </div>
);
export default Simulator;
