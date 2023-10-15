import { LegacyWorkflow } from "../../api";
import CampaignList from "../../types/campaignList";
import { Repository } from "../interfaces/repository";

export default class LegacyWorkflowRepository
  implements Repository<LegacyWorkflow>
{
  legacyWorkflows: LegacyWorkflow[];

  legacyWorkflowSubRootModules: object[];

  workflowList: CampaignList | null;

  constructor(
    legacyWorkflows: LegacyWorkflow[] = [],
    workflowList: CampaignList | null = null,
    legacyWorkflowSubRootModules: object[] = []
  ) {
    this.legacyWorkflows = legacyWorkflows;
    this.workflowList = workflowList;
    this.legacyWorkflowSubRootModules = legacyWorkflowSubRootModules;
  }

  findById(id: string): LegacyWorkflow | undefined {
    return this.legacyWorkflows.find((workflow) => workflow.id === id);
  }

  updateById(id: string, updatedWorkflow: LegacyWorkflow): void {
    const workflowIx = this.legacyWorkflows.findIndex(
      (workflow) => workflow.id === id
    );

    if (workflowIx !== -1) {
      this.legacyWorkflows[workflowIx] = updatedWorkflow;
    }
  }

  getLegacyWorkflowSubRootModules(subRoots: object[] = []) {
    return subRoots
      .map((moduleToFind) => {
        const ix = this.legacyWorkflowSubRootModules.findIndex(
          (mod) =>
            (mod as Record<string, string>).id ===
            (moduleToFind as Record<string, string>).campaignId
        );
        if (ix > -1) {
          return this.legacyWorkflowSubRootModules[ix];
        }
        return undefined;
      })
      .filter((resp) => resp);
  }

  updateLegacySubRootModules(modules: object[]) {
    modules.forEach((module) => {
      const operationMap: Record<string, (module: object) => void> = {
        addModule: (moduleToAdd) => {
          this.legacyWorkflowSubRootModules.push(
            (moduleToAdd as Record<string, object>).campaignData
          );
        },
        updateModule: (moduleToUpdate) => {
          const ix = this.legacyWorkflowSubRootModules.findIndex(
            (mod) =>
              (mod as Record<string, object>).id ===
              (moduleToUpdate as Record<string, object>).campaignId
          );
          if (ix > -1) {
            this.legacyWorkflowSubRootModules[ix] = (
              module as Record<string, object>
            ).campaignData;
          }
        },
        deleteModule: (moduleToDelete) => {
          this.legacyWorkflowSubRootModules =
            this.legacyWorkflowSubRootModules.filter(
              (item) =>
                (item as Record<string, object>).id !==
                (moduleToDelete as Record<string, object>).campaignId
            );
        },
      };

      const { cmd } = module as Record<string, string>;
      if (!operationMap[cmd]) {
        throw new Error(`Unknown command: ${cmd}`);
      }
      operationMap[cmd].bind(this)(module);
    });
    return {};
  }

  getAll(): CampaignList | null {
    return this.workflowList;
  }
}
