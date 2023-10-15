/* eslint-disable max-lines */
import { dia, ui, linkTools, layout } from "@clientio/rappid";
import { v4 as uuidv4 } from "uuid";
import ToolbarService from "./toolbar-service";
import HaloService from "./halo-service";
import KeyboardService from "./keyboard-service";
import {
  DiagramCell,
  DiagramCellId,
  DiagrammingEventListeners,
  DiagrammingService,
  Group,
  Shapes,
  StepContextMenu,
} from "../../../interfaces/diagramming-service";
import * as appShapes from "../shapes/app.shapes";
import {
  ZOOM_MIN,
  ZOOM_MAX,
  ZOOM_STEP,
  PADDING_L,
  BACKGROUND_COLOR,
  GRID_SIZE,
  PADDING_S,
  LIGHT_COLOR,
  LINE_COLOR,
  LINK_COLOR,
  STEP_VERTICAL_DISTANCE,
  STEP_HORIZONTAL_DISTANCE,
} from "../theme/theme";
import { AddStepMenuOptions } from "../../../components/AddStepMenu";
import {
  getOffset,
  portIdfromCell,
  getAllSteps,
  paintPrimaryColorToPath,
  getLinesAndAddStepShapes,
  translateJointJsCellToWorkflowStep,
  translateJointJsCellToWorkflowLink,
} from "../../../../../utils/canvas.utils";
import { Workflow, WorkflowLink, WorkflowStep } from "../../../../../api";
import { notifyFunctionalityComingSoon } from "../../../data/validation";

export interface JointJsDiagrammingSelectors {
  canvas: string;
  paper: string;
  toolbar: string;
}

class JointJsDiagrammingService implements DiagrammingService {
  el: HTMLElement;

  graph!: dia.Graph;

  paper!: dia.Paper;

  paperScroller!: ui.PaperScroller;

  commandManager!: dia.CommandManager;

  clipboard!: ui.Clipboard;

  selection!: ui.Selection;

  toolbarService!: ToolbarService;

  haloService!: HaloService;

  keyboardService!: KeyboardService;

  eventListeners?: DiagrammingEventListeners;

  enableViewWorkflowJson: boolean;

  isNotFirstRendering: boolean;

  stepContextMenu: StepContextMenu;

  treeLayout: layout.TreeLayout;

  constructor(
    selectors: JointJsDiagrammingSelectors,
    eventListeners?: DiagrammingEventListeners,
    enableViewWorkflowJson = false
  ) {
    const canvas = <HTMLElement>document.querySelector(selectors.canvas);
    if (!canvas) {
      throw new Error(
        `Canvas element not found with the selector ${selectors.canvas}`
      );
    }

    this.el = canvas;
    this.eventListeners = eventListeners;
    this.enableViewWorkflowJson = enableViewWorkflowJson;
    this.isNotFirstRendering = false;
    this.stepContextMenu = {
      anchor: ((): HTMLDivElement => {
        // anchor element that points position of stepContextMenu popup anytime
        const div = document.createElement("div");
        div.style.position = "absolute";
        document.body.appendChild(div);
        return div;
      })(),
      el: null,
      branch: null,
    };
  }

  /* -- primary member functions -- */
  start() {
    this.toolbarService = new ToolbarService();
    this.haloService = new HaloService();
    this.keyboardService = new KeyboardService();

    this.initializePaper();
    this.initializeSelection();
    this.initializeToolsAndInspector();
    this.initializeToolbar();
    this.initializeKeyboardShortcuts();
    this.initializeTooltips();
  }

  destroy() {
    this.paper.remove();
    this.paperScroller.remove();
    this.toolbarService.remove();
    this.keyboardService.remove();
  }

  import(workflow: Workflow) {
    const workflowCanvas = workflow?.ui?.cells
      ? {
          cells: workflow.ui.cells,
        }
      : {
          cells: [],
        };
    this.graph.fromJSON(workflowCanvas);
    this.paperScroller.zoomToFit({
      minScale: ZOOM_MIN,
      maxScale: ZOOM_MAX,
      scaleGrid: ZOOM_STEP,
      useModelGeometry: true,
      padding: PADDING_L,
    });
  }

  startBatch(name: string) {
    this.graph.startBatch(name);
  }

  stopBatch(name: string) {
    this.graph.stopBatch(name);
  }

  initializePaper() {
    this.graph = new dia.Graph(
      {},
      {
        cellNamespace: appShapes,
      }
    );

    const { graph } = this;

    this.commandManager = new dia.CommandManager({ graph });

    const paperOptions: dia.Paper.Options = {
      model: graph,
      frozen: true,
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      gridSize: GRID_SIZE,
      drawGrid: { name: "dot", color: "#A7A8A9" },
      linkPinning: false,
      multiLinks: false,
      snapLinks: true,
      moveThreshold: 5,
      magnetThreshold: "onleave",
      background: { color: BACKGROUND_COLOR },
      cellViewNamespace: appShapes,
      interactive(cellView, _method) {
        // make all "Add step" button to not be draggable
        return cellView.model.get("type") === Shapes.STEP;
      },
      defaultRouter: {
        name: "manhattan",
        args: {
          padding: {
            bottom: PADDING_L,
            vertical: PADDING_S,
            horizontal: PADDING_S,
          },
          step: GRID_SIZE,
        },
      },
      defaultConnector: {
        name: "rounded",
      },
      defaultLink: () => new appShapes.app.Link(),
      /* eslint-disable max-params */
      validateConnection: (
        sourceView: dia.CellView,
        sourceMagnet: SVGElement,
        targetView: dia.CellView,
        targetMagnet: SVGElement
      ) => {
        if (sourceView === targetView) return false;
        if (targetView.findAttribute("port-group", targetMagnet) !== "in")
          return false;
        if (sourceView.findAttribute("port-group", sourceMagnet) !== "out")
          return false;
        return true;
      },
    };

    const paper = new dia.Paper(paperOptions);
    this.paper = paper;

    const treeLayout = new layout.TreeLayout({
      graph,
      direction: "B", // tree direction is from top to bottom
      parentGap: STEP_VERTICAL_DISTANCE, // distance between two steps in vertical
      siblingGap: STEP_HORIZONTAL_DISTANCE, // distance between two steps in horizontal
    });
    this.treeLayout = treeLayout; // to draw a tree-view layout use this

    paper.on("blank:mousewheel", (evt, ox, oy, delta) =>
      this.onMousewheel.bind(this)(null, evt, ox, oy, delta)
    );
    paper.on("cell:mousewheel", this.onMousewheel.bind(this));

    const paperScroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      scrollWhileDragging: true,
      cursor: "grab",
      borderless: true,
      contentOptions: {
        padding: 100,
        allowNewOrigin: "any",
      },
    });
    this.paperScroller = paperScroller;

    this.renderPlugin(".paper-container", paperScroller);
    paperScroller.render().center();
  }

  initializeSelection() {
    this.clipboard = new ui.Clipboard();
    this.selection = new ui.Selection({
      paper: this.paper,
      useModelGeometry: true,
      translateConnectedLinks: ui.Selection.ConnectedLinksTranslation.ALL, // default
    });
    this.selection.removeHandle("rotate");
    this.selection.removeHandle("resize");

    this.selection.collection.on(
      "reset add remove",
      this.onSelectionChange.bind(this)
    );

    this.selection.collection.on("reset", this.onSelectionReset.bind(this));

    const { keyboard } = this.keyboardService;

    // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // Otherwise, initiate paper pan.
    this.paper.on(
      "blank:pointerdown",
      (evt: dia.Event /* , x: number, y: number */) => {
        this.eventListeners?.["blank:pointerdown"]?.();
        if (keyboard.isActive("shift", evt)) {
          this.selection.startSelecting(evt);
        } else {
          this.selection.collection.reset([]);
          this.paperScroller.startPanning(evt);
          this.paper.removeTools();
        }
      }
    );

    const start = new Date().getTime();
    this.paper.unfreeze({
      // eslint-disable-next-line consistent-return
      afterRender: () => {
        const mainDiv = document.getElementById(
          "canvasInfoMetric"
        ) as HTMLDivElement | null;
        if (mainDiv) {
          const msDiv = document.createElement("div");
          const cellCountDiv = document.createElement("div");
          msDiv.innerHTML = `Layout and Render Time:  ${
            new Date().getTime() - start
          } ms`;
          cellCountDiv.innerHTML = `Number of Cells: ${
            this.graph && this.graph.getCells().length
          }`;
          if (mainDiv.childNodes.length) {
            // empty
          } else {
            mainDiv.appendChild(msDiv);
            mainDiv.appendChild(cellCountDiv);
            return this.paper.unfreeze({ batchSize: 500 });
          }
        }
      },
    });

    this.paper.on(
      "element:pointerdown",
      (elementView: dia.ElementView, evt: dia.Event) => {
        // Select an element if CTRL/Meta key is pressed while the element is clicked.
        if (keyboard.isActive("ctrl meta", evt)) {
          this.selection.collection.add(elementView.model);
        }
        if (this.isCellPrimary(elementView.model)) {
          const cell = elementView.model;
          const diagramCell = this.getCell([cell]);
          const cellId: DiagramCellId = diagramCell.getId();
          this.eventListeners?.["element:pointerdown"](cellId);
        }
        if (elementView.model.get("type") === Shapes.ADDSTEP) {
          const targetId = elementView.model.id; // get id of Add Step button
          const line = this.getLinkByTargetId(targetId as string); // get line obj
          const parentCell = line?.getSourceCell(); // get source obj from the add step button
          if (parentCell) {
            line?.remove();
            this.addNewStepUnderParentOnCurrentBranch(parentCell);
          }
        }
      }
    );

    this.paper.on("element:pointerdblclick", () => {
      this.eventListeners?.["element:pointerdblclick"]();
    });

    this.graph.on("remove", (cell: dia.Cell) => {
      // If element is removed from the graph, remove from the selection too.
      if (this.selection.collection.has(cell)) {
        this.selection.collection.reset(
          this.selection.collection.models.filter((c) => c !== cell)
        );
      }
      if (this.isCellPrimary(cell)) {
        const WorkflowStepOrLink =
          cell.get("type") === Shapes.LINK
            ? translateJointJsCellToWorkflowLink(cell.attributes)
            : translateJointJsCellToWorkflowStep(cell.attributes);
        this.eventListeners?.onRemoveObject(WorkflowStepOrLink);
        this.onCellsChange();
      }
    });

    this.graph.on("add", (cell: dia.Cell) => {
      if (this.isCellPrimary(cell)) {
        this.onCellsChange();
      }
    });

    this.paper.on("render:done", () => {
      // render:done event is always hooked when ever any render event,
      // to hook the event of all cells are loaded I have to use a value to indicate first rendering.
      if (!this.isNotFirstRendering) {
        const primaryGradientCell = new appShapes.app.PrimaryGradient({
          id: "primary-gradient-cell",
        });
        const currentPaper = this.paper;
        currentPaper.model.addCell(primaryGradientCell);
        this.onCellsChange();
      }
      this.isNotFirstRendering = true;
    });

    this.selection.on(
      "selection-box:pointerdown",
      (elementView: dia.ElementView, evt: dia.Event) => {
        // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
        if (keyboard.isActive("ctrl meta", evt)) {
          this.selection.collection.remove(elementView.model);
        }
      },
      this
    );
  }

  initializeToolsAndInspector() {
    this.paper.on("cell:pointerup", (cellView: dia.CellView) => {
      const cell = cellView.model;
      const { collection } = this.selection;
      if (collection.includes(cell) || !this.isCellPrimary(cell)) {
        return;
      }
      collection.reset([cell]);
      this.treeLayout.layout(); // auto layout once we release hold of mouse
    });

    this.paper.on("link:mouseenter", (linkView: dia.LinkView) => {
      const diagramCell = this.getCell([linkView.model]);
      if (diagramCell.getType() === Shapes.LINE) {
        return;
      }
      this.onSelectionChange.bind(this)();
      const thisCell = this.graph.getCell(diagramCell.getId());
      if (thisCell && this.isCellValid(thisCell))
        this.selectPrimaryLink(linkView);
    });

    this.paper.on("link:mouseleave", (linkView: dia.LinkView) => {
      const diagramCell = this.getCell([linkView.model]);
      if (diagramCell.getType() === Shapes.LINE) {
        return;
      }
      this.unSelectPrimaryLink(linkView);
    });

    this.paper.on("cell:mouseenter", (cellView: dia.CellView) => {
      const diagramCell = this.getCell([cellView.model]);
      if (diagramCell.getType() === Shapes.ADDSTEP) {
        paintPrimaryColorToPath(diagramCell, "attrs/body/fill");

        diagramCell.setValue("attrs/body/stroke", null);
        diagramCell.setValue("attrs/body/strokeDasharray", null);
        diagramCell.setValue("attrs/icon/fill", LIGHT_COLOR);
      }
    });

    this.paper.on("cell:mouseleave", (cellView: dia.CellView) => {
      const diagramCell = this.getCell([cellView.model]);
      if (diagramCell.getType() === Shapes.ADDSTEP) {
        diagramCell.setValue("attrs/body/fill", LIGHT_COLOR);
        paintPrimaryColorToPath(diagramCell, "attrs/body/stroke");
        diagramCell.setValue("attrs/body/strokeDasharray", "2");
        paintPrimaryColorToPath(diagramCell, "attrs/icon/fill");
        diagramCell.setValue("attrs/icon/fill/type", "linearGradient");
      }
    });

    this.graph.on(
      "change",
      (
        cell: dia.Cell,
        opt: {
          inspector: string;
        }
      ) => {
        if (!cell.isLink() || !opt.inspector) {
          return;
        }
        const ns = linkTools;
        const toolsView = new dia.ToolsView({
          name: "link-inspected",
          tools: [new ns.Boundary({ padding: 15 })],
        });

        cell.findView(this.paper).addTools(toolsView);
      }
    );
  }

  initializeToolbar() {
    this.toolbarService.create(
      this.commandManager,
      this.paperScroller,
      this.enableViewWorkflowJson
    );

    this.toolbarService.toolbar.on({
      "clear:pointerclick": this.graph.clear.bind(this.graph),
      "minimap:pointerclick": () => {
        notifyFunctionalityComingSoon();
      },
      "search:pointerclick": () => {
        notifyFunctionalityComingSoon();
      },
      "custom-undo:pointerclick": () => {
        notifyFunctionalityComingSoon();
      },
      "custom-redo:pointerclick": () => {
        notifyFunctionalityComingSoon();
      },
      "grid-size:change": this.paper.setGridSize.bind(this.paper),
      "debug-workflow:pointerclick": () => {
        this.eventListeners?.["debug-workflow:pointerclick"]?.();
      },
    });

    this.renderPlugin(".toolbar-container", this.toolbarService.toolbar);
  }

  initializeKeyboardShortcuts() {
    this.keyboardService.create({
      graph: this.graph,
      clipboard: this.clipboard,
      selection: this.selection,
      paperScroller: this.paperScroller,
      commandManager: this.commandManager,
    });
  }

  initializeTooltips(): ui.Tooltip {
    this.isNotFirstRendering = false;
    return new ui.Tooltip({
      rootTarget: document.body,
      target: "[data-tooltip]",
      direction: ui.Tooltip.TooltipArrowPosition.Auto,
      padding: 10,
    });
  }

  /* -- get functions -- */
  getGraph(): dia.Graph {
    return this.graph;
  }

  getCellById(id: string): DiagramCell | null {
    const jointJsCell = this.graph?.getCell(id);
    if (jointJsCell) {
      return this.getCell([jointJsCell]);
    }
    return null;
  }

  getCell = (jointJsCell: unknown) => {
    const [selectedCell] = jointJsCell as dia.Cell[];
    const cell: DiagramCell = {
      getType: () => selectedCell.get("type") as string,
      getId: () => selectedCell.id,
      remove: () => selectedCell.remove(),
      getValue: <T>(path: string | string[]) => selectedCell.prop(path) as T,
      setValue: <T>(path: string | string[], val: T) =>
        selectedCell.prop(path, val),
      on: (event: string, callback: unknown, context: object) =>
        selectedCell.on(event, callback as Backbone.EventHandler, context),
      off: (event: string, callback: unknown, context: object) =>
        selectedCell.off(event, callback as Backbone.EventHandler, context),
    };
    return cell;
  };

  getLinkById(id: string): dia.Link | null {
    const links = this.graph.getLinks();
    const result = links.find((link) => link.id === id) || null;
    return result;
  }

  getLinks() {
    return this.graph.getLinks();
  }

  getElements() {
    return this.graph.getElements();
  }

  // eslint-disable-next-line class-methods-use-this
  getInboundAndOutboundStepsToCell(
    workflow: Workflow,
    step: WorkflowStep
  ): {
    inboundStepsToCell: WorkflowStep[];
    outboundStepsToCell: WorkflowStep[];
  } {
    const { cells } = workflow.ui;

    const links = cells.filter(
      (cell) => cell.type === "app.Link"
    ) as WorkflowLink[];

    const linksIntoCell = links.filter((link) => link.target?.id === step.id);
    const linksLeavingCell = links.filter(
      (link) => link.source?.id === step.id
    );

    const steps = cells.filter(
      (cell) => cell.type === "app.Step"
    ) as WorkflowStep[];

    const inboundStepsToCell = linksIntoCell
      .map((link) => {
        const targetCellId = link.target?.id;
        if (!targetCellId) {
          return undefined;
        }

        // Which step is the link associated with?
        const sourceCellId = link.source?.id;

        const foundStep = steps.find((elem) => elem.id === sourceCellId);

        if (!foundStep) {
          throw new Error("Could not find step");
        }

        return foundStep;
      })
      .filter((item) => item !== undefined) as unknown as WorkflowStep[];

    const outboundStepsToCell = linksLeavingCell
      .map((link) => {
        const sourceCellId = link.source?.id;
        if (!sourceCellId) {
          return undefined;
        }

        const targetCellId = link.target?.id;

        const foundStep = steps.find((elem) => targetCellId === elem.id);

        if (!foundStep) {
          throw new Error("Could not find step");
        }

        return foundStep;
      })
      .filter((item) => item !== undefined) as unknown as WorkflowStep[];

    return {
      inboundStepsToCell: inboundStepsToCell ?? [],
      outboundStepsToCell: outboundStepsToCell ?? [],
    };
  }

  getLinkByTargetId(id: string): dia.Link | null {
    const links = this.graph.getLinks();
    const result = links.find((link) => link.target().id === id) || null;
    return result;
  }

  getElementById(id: string): dia.Element | null {
    const currentGraph = this.graph;
    const allElements = currentGraph.getElements();
    const result = allElements.find((element) => element.id === id) || null;
    return result;
  }

  /* -- event handler function -- */
  /* eslint-disable complexity */
  onClickAddStepPopupMenu(option: AddStepMenuOptions) {
    if (
      option === AddStepMenuOptions.DeleteBranch &&
      this.stepContextMenu.branch
    ) {
      this.getCellById(this.stepContextMenu.branch as string)?.remove(); // remove link
    } else if (
      option === AddStepMenuOptions.AddInBranch &&
      this.stepContextMenu.branch
    ) {
      this.addNewStepBetweenSteps();
    } else if (this.stepContextMenu.branch) {
      const linkId = this.stepContextMenu.branch;
      const thisLink = this.getLinkById(linkId as string);
      const parentCell = thisLink?.getSourceCell();
      const childCell = thisLink?.getTargetCell();
      if (parentCell && childCell) {
        this.addNewStepUnderParentOnNewBranch(parentCell);
      }
    }
    this.stepContextMenu.el?.remove();
  }

  onSelectionReset(
    _models: dia.Cell[],
    options: { previousModels: dia.Cell[] }
  ) {
    const { paper } = this;

    if (options?.previousModels?.length) {
      options.previousModels?.forEach((cell: dia.Cell) => {
        const cellView = cell.findView(paper);
        if (cellView) {
          cellView.vel.removeClass("selected");
        }
      });
    }
  }

  onSelectionChange() {
    const { paper, selection } = this;
    const { collection } = selection;
    paper.removeTools();
    ui.Halo.clear(paper);
    if (collection.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const primaryCell: dia.Cell = collection.first();
      selection.destroySelectionBox(primaryCell); // remove Halo box around cell if selected only one
      if (this.isCellValid(primaryCell)) {
        // proceed selecting cell only when cell is valid
        const primaryCellView = paper.requireView(primaryCell);
        this.selectPrimaryCell(primaryCellView);
        const cellView = primaryCell.findView(paper);
        cellView?.vel.addClass("selected");
      }
    } else if (collection.length === 2) {
      collection.each((cell: dia.Cell) => {
        selection.createSelectionBox(cell);
      });
    }
  }

  onMousewheel(
    cellView: dia.CellView | null,
    evt: dia.Event,
    ox: number,
    oy: number,
    delta: number
  ) {
    evt.preventDefault();
    this.paperScroller.zoom(delta * 0.2, {
      min: 0.2,
      max: 5,
      grid: 0.2,
      ox,
      oy,
    });
  }

  onCellsChange() {
    const currentPaper = this.paper;
    const cells = currentPaper.model.getCells();
    const { childfulSteps, childlessSteps } = getAllSteps(cells);
    const linesAndAddStepShapes = getLinesAndAddStepShapes(cells);
    linesAndAddStepShapes.forEach((id: dia.Cell.ID) => {
      this.getCellById(id as string)?.remove();
    });
    if (childlessSteps.length > 0) {
      childlessSteps.forEach((element: dia.Cell) => {
        const cellId = uuidv4();
        // add Add Step Shape
        const newAddStepCell = new appShapes.app.AddStepShape({
          id: cellId,
          size: { width: 20, height: 20 },
        });

        // add line
        const newLine = new appShapes.app.Line({
          source: {
            id: element.id,
            port: portIdfromCell(element, Group.out) as string | number,
          },
          target: {
            id: cellId,
            port: portIdfromCell(newAddStepCell, Group.in) as string | number,
          },
        });
        currentPaper.model.addCells([newAddStepCell, newLine]);

        // draw Gray to output port of childless Cell
        const thisStep = this.getCellById(element.id as string);
        thisStep?.setValue("ports/groups/out/attrs/portOut/stroke", LINE_COLOR);
      });
    }
    if (childfulSteps.length > 0) {
      childfulSteps.forEach((element: dia.Cell) => {
        const thisStep = this.getCellById(element.id as string);
        thisStep?.setValue(
          "ports/groups/out/attrs/portBody/stroke",
          LINK_COLOR
        );
      });
    }
    this.treeLayout.layout(); // once any remove or add of cell happened, auto layout
  }

  /* -- action functions -- */
  selectPrimaryCell(cellView: dia.CellView) {
    const cell = cellView.model;
    if (cell.isElement()) {
      this.selectPrimaryElement(<dia.ElementView>cellView);
    } else {
      this.selectPrimaryLink(<dia.LinkView>cellView);
    }
  }

  selectPrimaryElement(elementView: dia.ElementView) {
    this.haloService.create(elementView);
  }

  selectPrimaryLink(linkView: dia.LinkView) {
    // highlight link
    const currentPaper = this.paper;
    const linkModelSource = linkView.model.get("source") as dia.Cell;
    const linkModelTarget = linkView.model.get("target") as dia.Cell;
    const sourceCell = currentPaper.model.getCell(linkModelSource.id);
    const targetCell = currentPaper.model.getCell(linkModelTarget.id);
    if (sourceCell.position().x !== targetCell.position().x) {
      // don't highlight link if line is straight.
      // this is to avoid bug of jointjs which is still not resolved: https://github.com/clientIO/joint/issues/1314
      linkView.model.attr({
        line: {
          filter: {
            name: "highlight",
            args: {
              color: LINK_COLOR,
              width: 2,
              opacity: 0.5,
              blur: 5,
            },
          },
        },
      });
    }
    const primaryGradientElementID =
      document.getElementsByTagName("linearGradient")[0]?.id;
    const addStepBtn = new linkTools.Button({
      distance: "50%",
      action: (evt: dia.Event) => {
        const rect: DOMRect = (
          evt.currentTarget as HTMLButtonElement
        ).children[1].getBoundingClientRect(); // boundary of SVG "+" of button
        this.setStepContextMenuAnchorPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
        this.stepContextMenu.el = new ui.Popup({
          target: this.stepContextMenu.anchor,
          content: "<div id='add-step-menu-wrapper'></div>",
        });
        this.stepContextMenu.branch = linkView.model.id;
        this.stepContextMenu.el.render();
        this.eventListeners?.onClickAddStepBtnInBranch();
      },
      markup: [
        {
          tagName: "circle",
          selector: "button",
          attributes: {
            fill: `url(#${primaryGradientElementID})`,
            refCx: "50%",
            refCy: "50%",
            r: 15,
            cursor: "pointer",
          },
        },
        {
          tagName: "text",
          textContent: "+",
          attributes: {
            fill: "#FFFFFF",
            refX: "50%",
            refY: "50%",
            cursor: "pointer",
            "font-size": 15,
            "text-anchor": "middle",
            "font-weight": "bold",
            y: "0.3em",
          },
        },
      ],
    });
    const toolsView = new dia.ToolsView({
      name: "link-pointerdown",
      tools: [addStepBtn],
    });

    linkView.addTools(toolsView);
  }

  unSelectPrimaryLink = (linkView: dia.LinkView) => {
    // Remove highlight from link
    linkView.model.removeAttr("line/filter");
  };

  setStepContextMenuAnchorPosition({ x, y }: { x: number; y: number }) {
    const zoomLevel = this.paperScroller.zoom();
    this.stepContextMenu.anchor.style.left = `${
      x - getOffset(zoomLevel).offsetX
    }px`;
    this.stepContextMenu.anchor.style.top = `${
      y - getOffset(zoomLevel).offsetY
    }px`;
  }

  /* -- render functions -- */
  renderPlugin(selector: string, plugin: ui.PaperScroller | ui.Toolbar): void {
    this.el?.querySelector(selector)?.appendChild(plugin.el);
    plugin.render();
  }

  /* -- is/Has functions -- */
  isCellPrimary = (cell: dia.Cell) => {
    if (cell.get("type") === Shapes.LINK || cell.get("type") === Shapes.STEP)
      return true;
    return false;
  };

  isCellValid = (cell: dia.Cell) => {
    if (!cell.id) return false;
    if (cell.get("type") === Shapes.LINK) {
      const thisLink = this.getLinkById(cell.id as string);
      const isSourceExisting = thisLink?.getSourceCell()?.id;
      const isTargetExisting = thisLink?.getTargetCell()?.id;
      const isTargetAddStep =
        thisLink?.getTargetCell()?.get("type") === Shapes.ADDSTEP;
      const isLinkInvalid =
        !isSourceExisting || !isTargetExisting || isTargetAddStep;
      if (isLinkInvalid) thisLink?.remove();
      return !isLinkInvalid;
    }
    return true;
  };

  /* -- add/delete functions -- */
  addNewStepBetweenSteps() {
    // add new step when click "in this branch" in popup menu
    const linkId = this.stepContextMenu.branch;
    const thisLink = this.getLinkById(linkId as string) as dia.Cell;
    const currentPaper = this.paper;
    if (thisLink) {
      const source = thisLink.get("source") as dia.Cell.Attributes;

      const target = thisLink.get("target") as dia.Cell.Attributes;

      const sourcePortId: string = source.port as string;

      const targetPortId = target.port as string;

      const sourceCell = currentPaper.model.getCell(
        source?.id as string | number
      );

      const targetCell = currentPaper.model.getCell(
        target.id as string | number
      );
      if (sourceCell && targetCell) {
        const newCell = new appShapes.app.Step({
          type: Shapes.STEP,
          ports: {
            items: [
              {
                id: uuidv4(),
                group: "in",
              },
              {
                id: uuidv4(),
                group: "out",
              },
            ],
          },
          attrs: {
            label: {
              text: "New Step",
            },
            description: {
              text: "Please enter in a description for this step",
            },
            icon: {
              text: "\u003F",
            },
          },
        });
        const firstLink = new appShapes.app.Link({
          source: {
            id: source.id as string | number,

            port: sourcePortId,
          },
          target: {
            id: newCell.id,
            port: portIdfromCell(newCell, Group.in) as string | number,
          },
        });
        const secondLink = new appShapes.app.Link({
          source: {
            id: newCell.id,
            port: portIdfromCell(newCell, Group.out) as string | number,
          },
          target: {
            id: target.id as string | number,
            port: targetPortId,
          },
        });
        firstLink.removeLabel(); // remove "Label" from link
        secondLink.removeLabel(); // remove "Label" from link
        thisLink.remove();
        currentPaper.model.addCells([newCell, firstLink, secondLink]); // add objects to canvas without writing to state

        /* - write created objects to state - */
        const newWorkflowStep = translateJointJsCellToWorkflowStep(
          newCell.attributes
        );
        const newWorkflowFirstLink = translateJointJsCellToWorkflowLink(
          firstLink.attributes
        );
        const newWorkflowSecondLink = translateJointJsCellToWorkflowLink(
          secondLink.attributes
        );
        this.eventListeners?.onAddNewObjects([
          newWorkflowStep,
          newWorkflowFirstLink,
          newWorkflowSecondLink,
        ]);
      }
    }
  }

  addNewStepUnderParentOnCurrentBranch(parentCell: dia.Cell) {
    // add new step when click add step button
    const newCell = new appShapes.app.Step({
      type: Shapes.STEP,
      ports: {
        items: [
          {
            id: uuidv4(),
            group: "in",
          },
          {
            id: uuidv4(),
            group: "out",
          },
        ],
      },
      attrs: {
        label: {
          text: "New Step",
        },
        description: {
          text: "Please enter in a description for this step",
        },
        icon: {
          text: "\u003F",
        },
      },
    });
    const currentPaper = this.paper;
    const link = new appShapes.app.Link({
      source: {
        id: parentCell.id,
        port: portIdfromCell(parentCell, Group.out) as string | number,
      },
      target: {
        id: newCell.id,
        port: portIdfromCell(newCell, Group.in) as string | number,
      },
    });

    link.removeLabel(); // remove "Label" from link
    currentPaper.model.addCells([newCell, link]); // add objects to canvas without writing to state

    /* - write created cells to state - */
    const newWorkflowStep = translateJointJsCellToWorkflowStep(
      newCell.attributes
    );
    const newWorkflowLink = translateJointJsCellToWorkflowLink(link.attributes);
    this.eventListeners?.onAddNewObjects([newWorkflowStep, newWorkflowLink]);
  }

  addNewStepUnderParentOnNewBranch(parentCell: dia.Cell) {
    // add new step when click "on new branch" in popup menu
    const newCell = new appShapes.app.Step({
      type: Shapes.STEP,
      ports: {
        items: [
          {
            id: uuidv4(),
            group: "in",
          },
          {
            id: uuidv4(),
            group: "out",
          },
        ],
      },
      attrs: {
        label: {
          text: "New Step",
        },
        description: {
          text: "Please enter in a description for this step",
        },
        icon: {
          text: "\u003F",
        },
      },
    });
    const currentPaper = this.paper;
    const link = new appShapes.app.Link({
      source: {
        id: parentCell.id,
        port: portIdfromCell(parentCell, Group.out) as string | number,
      },
      target: {
        id: newCell.id,
        port: portIdfromCell(newCell, Group.in) as string | number,
      },
    });

    link.removeLabel(); // remove "Label" from link
    currentPaper.model.addCells([newCell, link]); // add objects to canvas without writing to state

    /* - write created objects to state - */
    const newWorkflowStep = translateJointJsCellToWorkflowStep(
      newCell.attributes
    );
    const newWorkflowLink = translateJointJsCellToWorkflowLink(link.attributes);
    this.eventListeners?.onAddNewObjects([newWorkflowStep, newWorkflowLink]);
  }

  addNewStep(parentStep: string, stepName: string): DiagramCellId {
    // add new step cell from parent step with given name
    const newCell = new appShapes.app.Step({
      type: Shapes.STEP,
      ports: {
        items: [
          {
            id: uuidv4(),
            group: "in",
          },
          {
            id: uuidv4(),
            group: "out",
          },
        ],
      },
      attrs: {
        label: {
          text: stepName,
        },
        description: {
          text: "Please enter in a description for this step",
        },
        icon: {
          text: "\u003F",
        },
      },
    });
    const currentPaper = this.paper;
    const parentCell = this.graph.getCell(parentStep);
    const link = new appShapes.app.Link({
      source: {
        id: parentStep,
        port: portIdfromCell(parentCell, Group.out) as string | number,
      },
      target: {
        id: newCell.id,
        port: portIdfromCell(newCell, Group.in) as string | number,
      },
    });

    link.removeLabel(); // remove "Label" from link
    currentPaper.model.addCells([newCell, link]); // add objects to canvas without writing to state

    /* - write created objects to state - */
    const newWorkflowStep = translateJointJsCellToWorkflowStep(
      newCell.attributes
    );
    const newWorkflowLink = translateJointJsCellToWorkflowLink(link.attributes);
    this.eventListeners?.onAddNewObjects([newWorkflowStep, newWorkflowLink]);
    return newCell.id;
  }

  linkTwoSteps(parentStep: string, childStep: string) {
    // draw line from parent to child
    const currentPaper = this.paper;
    const parentCell = this.graph.getCell(parentStep);
    const childCell = this.graph.getCell(childStep);
    const link = new appShapes.app.Link({
      source: {
        id: parentStep,
        port: portIdfromCell(parentCell, Group.out) as string | number,
      },
      target: {
        id: childStep,
        port: portIdfromCell(childCell, Group.in) as string | number,
      },
    });

    link.removeLabel(); // remove "Label" from link
    currentPaper.model.addCells([link]); // add objects to canvas without writing to state

    /* - write created objects to state - */
    const newWorkflowLink = translateJointJsCellToWorkflowLink(link.attributes);
    this.eventListeners?.onAddNewObjects([newWorkflowLink]);
  }
}

export default JointJsDiagrammingService;
