import "./SimulatorLoader.css";

type SimulatorLoaderProps = {
  className?: string;
};

const SimulatorLoader = (props: SimulatorLoaderProps) => {
  let { className = "" } = props;
  className += " relative flex justify-center content-center";
  return (
    <div className={className}>
      <div className="loader">
        <div className="loader-container">
          <div className="box1" />
          <div className="box2" />
          <div className="box3" />
        </div>
        <div>
          <span className="font-open font-light">
            Building your workflow...
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimulatorLoader;
