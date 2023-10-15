import * as joint from "@clientio/rappid";

class HaloService {
  create(cellView: joint.dia.CellView) {
    const halo = new joint.ui.Halo({
      cellView,
      boxContent: false,
      handles: this.getHaloConfig(),
      useModelGeometry: true,
    });
    halo.render();
  }

  // eslint-disable-next-line class-methods-use-this
  getHaloConfig() {
    return [
      // Disable removal until we support it fully
      //   {
      //     name: "remove",
      //     position: Position.NW,
      // eslint-disable-next-line spellcheck/spell-checker
      //     events: { pointerdown: "removeElement" },
      //   },
    ];
  }
}

export default HaloService;
