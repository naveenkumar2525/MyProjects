export interface ModuleData {
  menuListOptions: MenuOption[];
  menuBranchTo: string;
  branchOptions: BranchInfo[];
  menuUserSelection: string;
  errorLimitValue: string;
  errorBranchTo: string;
  errorBranchOptions: BranchInfo[];
}

export interface BranchInfo {
  id: string;
  text: string;
}

export interface MenuOption {
  id: string;
  value: string;
  isHovered: boolean;
  isEditable: boolean;
  branchStepValue: string;
}

export interface ModuleDetails {
  [moduleId: string]: ModuleData;
}

export interface ModulePayload {
  id: string;
  data: ModuleData | null;
}
