import { Workflow } from "../../../../api";
import { Module, LegacyModuleSection } from "../../interfaces/api";

export interface LinkModuleRequestOptions {
  nextModule: Module;
}

export type LegacyLinkRequestOptions = LinkModuleRequestOptions;

export interface NewModuleLinkerBase {
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    options: LegacyLinkRequestOptions
  ): void;
}
