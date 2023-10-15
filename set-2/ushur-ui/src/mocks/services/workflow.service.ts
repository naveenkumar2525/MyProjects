import {
  LegacyRootModule,
  LegacySubRootModule,
  LegacyWorkflow,
} from "../../api";
import LegacyWorkflowRepository from "../repository/workflowRepository";

export default class WorkflowService {
  workflowRepository: LegacyWorkflowRepository;

  constructor(workflowRepository: LegacyWorkflowRepository) {
    this.workflowRepository = workflowRepository;
  }

  findLegacyWorkflowById(id: string) {
    return this.workflowRepository.findById(id);
  }

  getAllLegacyWorkflows() {
    return this.workflowRepository.getAll();
  }

  updateLegacyWorkflow(workflow: LegacyWorkflow) {
    this.workflowRepository.updateById(workflow.id, workflow);
    return workflow;
  }

  getLegacyWorkflowSubRootModules(subRoots: object[]): object {
    return this.workflowRepository.getLegacyWorkflowSubRootModules(subRoots);
  }

  updateLegacyWorkflowSubRootModules(
    modules: (LegacySubRootModule | LegacyRootModule)[]
  ) {
    this.workflowRepository.updateLegacySubRootModules(modules);
    return modules;
  }
}
