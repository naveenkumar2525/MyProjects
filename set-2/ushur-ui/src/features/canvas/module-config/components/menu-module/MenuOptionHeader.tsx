import { ReactElement } from "react";

const MenuOptionHeader = (): ReactElement => (
  <div className="mt-4">
    <div className="col-9">
      <span className="text-sm font-proxima-bold">Menu Options</span>
      <span className="text-sm font-proxima-bold float-right">
        Branch to...
      </span>
    </div>
  </div>
);

export default MenuOptionHeader;
