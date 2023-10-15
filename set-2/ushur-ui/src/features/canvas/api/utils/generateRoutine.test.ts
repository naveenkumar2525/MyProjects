import { getEndOfCampaignJump } from "../../data/utils";
import {
  generateOnReturnRoutine,
  generateSectionOnReturn,
  generateInitialRoutine,
} from "./generateRoutine";

test("generateOnReturnRoutine", () => {
  // Arrange
  const workflowId = "someWorkflowId";
  const ueTag = "someUeTag";

  // Act
  const routine = generateOnReturnRoutine(workflowId, ueTag);

  // Assert
  expect(routine.UeTag).toBe(ueTag);
  expect(routine.action).toBe("goToMenu");
  expect(routine.params).toEqual({
    menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
    stayInCampaign: true,
  });
});

test("generateSectionOnReturn", () => {
  // Arrange
  const ueTag = "someUeTag";

  // Act
  const sectionOnReturn = generateSectionOnReturn(ueTag);

  // Assert
  expect(sectionOnReturn).toEqual({
    UeTag: ueTag,
    ...getEndOfCampaignJump(),
  });
});

test("generateInitialRoutine", () => {
  // Arrange
  const workflowId = "someWorkflowId";

  // Act
  const initialRoutine = generateInitialRoutine(workflowId);

  // Assert
  expect(initialRoutine).toEqual({
    action: "goToMenu",
    params: {
      menuId: `${workflowId}_child_**ENDCAMPAIGN**`,
      stayInCampaign: true,
    },
  });
});
