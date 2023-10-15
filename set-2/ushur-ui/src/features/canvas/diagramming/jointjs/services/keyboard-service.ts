import * as joint from "@clientio/rappid";
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP, PADDING_L } from "../theme/theme";

class KeyboardService {
  keyboard: joint.ui.Keyboard;

  constructor() {
    this.keyboard = new joint.ui.Keyboard();
  }

  create(options: {
    graph: joint.dia.Graph;
    clipboard: joint.ui.Clipboard;
    selection: joint.ui.Selection;
    paperScroller: joint.ui.PaperScroller;
    commandManager: joint.dia.CommandManager;
  }) {
    const { paperScroller } = options;

    this.keyboard.on({
      "ctrl+c": () => {
        // Disable until fully supported
        // Copy all selected elements and their associated links.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        // clipboard.copyElements(selection.collection, graph);
      },

      "ctrl+v": () => {
        // Disable until fully supported
        // const pastedCells = clipboard.pasteCells(graph, {
        //   translate: { dx: 20, dy: 20 },
        //   useLocalStorage: true,
        // });
        // const elements = filter(pastedCells, (cell) => cell.isElement());
        // // Make sure pasted elements get selected immediately. This makes the UX better as
        // // the user can immediately manipulate the pasted elements.
        // selection.collection.reset(elements);
      },

      "ctrl+x shift+delete": () => {
        // Disable until fully supported
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        // clipboard.cutElements(selection.collection, graph);
      },

      "delete backspace": (_evt: JQuery.Event) => {
        // Disable until fully supported
        // eslint-disable-next-line spellcheck/spell-checker
        // evt.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        // graph.removeCells(selection.collection.toArray());
      },

      "ctrl+z": () => {
        // Disable until fully supported
        // commandManager.undo();
        // selection.cancelSelection();
      },

      "ctrl+y": () => {
        // Disable until fully supported
        // commandManager.redo();
        // selection.cancelSelection();
      },

      "ctrl+a": () => {
        // Disable until fully supported
        // selection.collection.reset(graph.getElements());
      },

      "ctrl+plus": (evt: JQuery.Event) => {
        evt.preventDefault();
        paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
      },

      "ctrl+minus": (evt: JQuery.Event) => {
        evt.preventDefault();
        paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
      },

      "ctrl+0": (_evt: JQuery.Event) => {
        paperScroller.zoomToFit({
          minScale: ZOOM_MIN,
          maxScale: ZOOM_MAX,
          scaleGrid: ZOOM_STEP,
          useModelGeometry: true,
          padding: PADDING_L,
        });
      },

      "keydown:shift": (_evt: JQuery.Event) => {
        paperScroller.setCursor("crosshair");
      },

      "keyup:shift": () => {
        paperScroller.setCursor("grab");
      },
    });
  }

  remove() {
    this.keyboard.off("ctrl+c");
    this.keyboard.off("ctrl+v");
    this.keyboard.off("ctrl+x shift+delete");
    this.keyboard.off("delete backspace");
    this.keyboard.off("ctrl+z");
    this.keyboard.off("ctrl+y");
    this.keyboard.off("ctrl+a");
    this.keyboard.off("ctrl+plus");
    this.keyboard.off("ctrl+minus");
    this.keyboard.off("ctrl+0");
    this.keyboard.off("keydown:shift");
    this.keyboard.off("keyup:shift");
  }
}

export default KeyboardService;
