import { Workflow } from "../../../../api";
import { LegacyModuleSection } from "../../interfaces/api";
import {
  LinkModuleRequestOptions,
  NewModuleLinkerBase,
} from "./newModuleLinkerBase";

export default class NewUnimplementedModuleLinker
  implements NewModuleLinkerBase
{
  // eslint-disable-next-line class-methods-use-this
  create(
    _workflow: Workflow,
    _section: LegacyModuleSection,
    _options: LinkModuleRequestOptions
  ) {
    /* Implement a module linker */
  }
}
