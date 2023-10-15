import { Workflow } from "../../../../api";
import { LegacyModuleSection, Module } from "../../interfaces/api";

export interface AddMessageModuleSubRootRequestGeneratorOptions {
  nextModules?: Module[];
}

export type AddSubRootRequestGeneratorRequestOptions =
  AddMessageModuleSubRootRequestGeneratorOptions;

export interface AddModuleSubRootRequestGeneratorBase {
  create(
    workflow: Workflow,
    section: LegacyModuleSection,
    options?: AddSubRootRequestGeneratorRequestOptions,
    module?: Module
  ): object;
}
