import { Factory } from "fishery";
import { v4 as uuidv4 } from "uuid";
import { MessageModule } from "../../api";
import ModuleTypes from "../../features/canvas/interfaces/module-types";

const messageModuleFactory = Factory.define<MessageModule>(() => ({
  id: uuidv4(),
  title: "some title",
  type: ModuleTypes.MESSAGE_MODULE,
  text: "some text",
}));

export default messageModuleFactory;
