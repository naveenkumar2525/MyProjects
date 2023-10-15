import * as joint from "@clientio/rappid";
import { ZOOM_MAX, ZOOM_STEP, ZOOM_MIN } from "../theme/theme";

class ToolbarService {
  toolbar!: joint.ui.Toolbar;

  create(
    commandManager: joint.dia.CommandManager,
    paperScroller: joint.ui.PaperScroller,
    enableViewWorkflowJson = false
  ) {
    const { tools } = this.getToolbarConfig(enableViewWorkflowJson);

    this.toolbar = new joint.ui.Toolbar({
      tools,
      autoToggle: true,
      references: {
        paperScroller,
        commandManager,
      },
    });
  }

  remove() {
    this.toolbar.remove();
  }

  // eslint-disable-next-line
  getToolbarConfig(enableViewWorkflowJson: boolean) {
    const optionalTools = [];

    if (enableViewWorkflowJson) {
      optionalTools.push({
        type: "button",
        name: "debug-workflow",
        group: "debug",
        attrs: {
          button: {
            "data-tooltip": "Workflow Debug",
            "data-tooltip-position": "top",
            "aria-label": "Workflow Debug",
          },
        },
      });
    }

    return {
      tools: [
        ...optionalTools,
        {
          type: "button",
          name: "search",
          group: "undo-redo",
          attrs: {
            button: {
              "data-tooltip": "Search",
              "data-tooltip-position": "top",
              "aria-label": "Search",
            },
          },
        },
        {
          type: "button",
          name: "custom-undo",
          group: "undo-redo",
          attrs: {
            button: {
              "data-tooltip": "Undo <i>(Ctrl+Z)</i>",
              "data-tooltip-position": "top",
              "aria-label": "Undo",
            },
          },
        },
        {
          type: "button",
          name: "custom-redo",
          group: "undo-redo",
          attrs: {
            button: {
              "data-tooltip": "Redo <i>(Ctrl+Y)</i>",
              "data-tooltip-position": "top",
              "aria-label": "Redo",
            },
          },
        },
        {
          type: "zoom-to-fit",
          name: "zoom-to-fit",
          group: "zoom",
          max: ZOOM_MAX,
          min: ZOOM_MIN,
          step: ZOOM_STEP,
          attrs: {
            button: {
              "data-tooltip": "Fit Diagram <i>(Ctrl+0)</i>",
              "data-tooltip-position": "top",
              "aria-label": "Fit Diagram",
            },
          },
        },
        {
          type: "zoom-in",
          name: "zoom-in",
          group: "zoom",
          max: ZOOM_MAX,
          step: ZOOM_STEP,
          attrs: {
            button: {
              "data-tooltip": "Zoom In <i>(Ctrl+Plus)</i>",
              "data-tooltip-position": "top",
              "aria-label": "Zoom In",
            },
          },
        },
        {
          type: "zoom-out",
          name: "zoom-out",
          group: "zoom",
          min: ZOOM_MIN,
          step: ZOOM_STEP,
          attrs: {
            button: {
              "data-tooltip": "Zoom Out <i>(Ctrl+Minus)</i>",
              "data-tooltip-position": "top",
              "aria-label": "Zoom Out",
            },
          },
        },
        {
          type: "button",
          name: "minimap",
          group: "zoom",
          attrs: {
            button: {
              "data-tooltip": "Minimap",
              "data-tooltip-position": "top",
              "aria-label": "Minimap",
            },
          },
        },
      ],
    };
  }
}
export default ToolbarService;
