import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { FormModule } from "../../api";
import ModuleTypes from "../../features/canvas/interfaces/module-types";

const formModuleFactory = Factory.define<FormModule>(() => ({
  id: uuidv4(),
  title: "form title",
  type: ModuleTypes.FORM_MODULE,
  fields: [],
}));

export default formModuleFactory;
