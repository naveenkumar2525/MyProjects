type freeTrialProps = {
  path: string;
};

const Freetrial = (props: freeTrialProps) => {
  const { path } = props;

  if (!path) {
    return (
      <div className="p-3 m-0">
        <div className="container-fluid variables-page p-3">
          <div className="row m-0 mb-3">
            <div className="col-12 p-0">
              <div className="mt-11 bg-white	p-3 rounded-lg">
                There is some problem on loading the content
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      className="flex-1 ml-8 border-0 [ w-fill-available h-screen ]"
      key={path}
      src={path}
    />
  );
};

export default Freetrial;
