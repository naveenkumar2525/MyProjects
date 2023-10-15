/* eslint-disable */
import * as joint from "@clientio/rappid";
import { g, dia, util } from "@clientio/rappid";

import {
  MAX_PORT_COUNT,
  FONT_FAMILY,
  OUT_PORT_HEIGHT,
  OUT_PORT_WIDTH,
  OUT_PORT_LABEL,
  PORT_BORDER_RADIUS,
  PADDING_L,
  PADDING_S,
  REMOVE_PORT_SIZE,
  BACKGROUND_COLOR,
  LIGHT_COLOR,
  DARK_COLOR,
  MAIN_COLOR,
  LINE_WIDTH,
  LINK_COLOR,
  LINE_COLOR,
} from "../theme/theme";

export namespace app {
  export enum ShapeTypesEnum {
    BASE = "app.Base",
    STEP = "app.Step",
    LINK = "app.Link",
    LINE = "app.Line",
    ADDSTEP = "app.AddStep",
    PRIMARYGRADIENT = "app.PrimaryGradient",
  }

  const outputPortPosition = (
    portsArgs: dia.Element.Port[],
    elBBox: dia.BBox
  ): g.Point[] => {
    const step = OUT_PORT_WIDTH + PADDING_S;
    return portsArgs.map(
      (port: dia.Element.Port, index: number) =>
        new g.Point({
          x: PADDING_L + OUT_PORT_WIDTH / 2 + index * step,
          y: elBBox.height,
        })
    );
  };

  const Base = dia.Element.define(
    ShapeTypesEnum.BASE,
    {
      // no default attributes
    },
    {
      getBoundaryPadding() {
        return util.normalizeSides(this.boundaryPadding);
      },

      toJSON() {
        // Simplify the element resulting JSON
        const json = dia.Element.prototype.toJSON.call(this);
        // Remove port groups and angle for better readability
        delete json.ports.groups;
        delete json.angle;
        return json;
      },
    }
  );

  export const Step = Base.define(
    ShapeTypesEnum.STEP,
    {
      size: { width: 187.85, height: 54 },
      ports: {
        groups: {
          in: {
            position: {
              name: "manual",
              args: {
                x: 187.85 / 2,
                y: 0,
              },
            },
            size: {
              width: 0,
              height: 0,
            },
            attrs: {
              portIn: {
                magnet: "passive",
                refWidth: "100%",
                refHeight: "100%",
                refY: "-50%",
                rx: PORT_BORDER_RADIUS,
                ry: PORT_BORDER_RADIUS,
                fill: LIGHT_COLOR,
                stroke: LINK_COLOR,
                strokeWidth: LINE_WIDTH,
              },
            },
            markup: [
              {
                tagName: "rect",
                selector: "portIn",
              },
            ],
          },
          out: {
            position: {
              name: "manual",
              args: {
                x: 187.85 / 2 - 5,
                y: 54,
              },
            },
            size: {
              width: 10,
              height: 10,
              strokeWidth: 1,
            },
            attrs: {
              portOut: {
                magnet: "active",
                refWidth: "100%",
                refHeight: "100%",
                refY: "-50%",
                rx: 10,
                ry: 10,
                fill: LIGHT_COLOR,
                stroke: LINK_COLOR,
                strokeWidth: LINE_WIDTH,
              },
              portLabel: {
                pointerEvents: "none",
                fontFamily: FONT_FAMILY,
                fontWeight: 400,
                fontSize: 13,
                fill: LIGHT_COLOR,
                textAnchor: "start",
                textVerticalAnchor: "middle",
                textWrap: {
                  width: -REMOVE_PORT_SIZE - PADDING_L - PADDING_S,
                  maxLineCount: 1,
                  ellipsis: true,
                },
                x: PADDING_L - OUT_PORT_WIDTH / 2,
              },
              portRemoveButton: {
                cursor: "pointer",
                event: "element:port:remove",
                refX: "-50%",
                refDx: -PADDING_L,
                dataTooltip: "Remove Output Port",
                dataTooltipPosition: "top",
              },
              portRemoveButtonBody: {
                width: REMOVE_PORT_SIZE,
                height: REMOVE_PORT_SIZE,
                x: -REMOVE_PORT_SIZE / 2,
                y: -REMOVE_PORT_SIZE / 2,
                fill: LIGHT_COLOR,
                rx: PORT_BORDER_RADIUS,
                ry: PORT_BORDER_RADIUS,
              },
              portRemoveButtonIcon: {
                d: "M -4 -4 4 4 M -4 4 4 -4",
                stroke: DARK_COLOR,
                strokeWidth: LINE_WIDTH,
              },
            },
            markup: [
              {
                tagName: "rect",
                selector: "portOut",
              },
            ],
          },
        },
        items: [
          {
            group: "in",
          },
        ],
      },
      attrs: {
        body: {
          refWidth: "100%",
          refHeight: "100%",
          fill: LIGHT_COLOR,
          strokeWidth: LINE_WIDTH / 2,
          rx: 8,
          ry: 8,
        },
        label: {
          refX: 54,
          refY: PADDING_L,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 14,
          fill: "#3D3F65",
          text: "Label",
          textWrap: {
            width: -54 - PADDING_L,
            maxLineCount: 1,
            ellipsis: true,
          },
          textVerticalAnchor: "top",
        },
        icon: {
          width: 20,
          height: 20,
          opacity: 0.4,
          refX: PADDING_L,
          y: 40,
          x: -5,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 24,
          text: "\uf056",
        },
      },
    },
    {
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "text",
          className: "fa",
          selector: "icon",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],

      boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_L,
        bottom: OUT_PORT_HEIGHT / 2 + PADDING_L,
      },

      addDefaultPort() {
        if (!this.canAddPort("out")) return;
        this.addPort({
          group: "out",
          attrs: { portLabel: { text: OUT_PORT_LABEL } },
        });
      },

      canAddPort(group: string): boolean {
        return Object.keys(this.getGroupPorts(group)).length < MAX_PORT_COUNT;
      },

      toggleAddPortButton(group: string): void {
        const buttonAttributes = this.canAddPort(group)
          ? { fill: MAIN_COLOR, cursor: "pointer" }
          : { fill: "#BEBEBE", cursor: "not-allowed" };
        this.attr(["portAddButton"], buttonAttributes, {
          dry: true /* to be ignored by the Command Manager */,
        });
      },
    }
  );

  export const Link = dia.Link.define(
    ShapeTypesEnum.LINK,
    {
      attrs: {
        root: {
          cursor: "pointer",
        },
        line: {
          fill: "none",
          connection: true,
          stroke: LINK_COLOR,
          strokeWidth: LINE_WIDTH,
        },
        wrapper: {
          fill: "none",
          connection: true,
          stroke: "transparent",
          strokeWidth: 10,
        },
        arrowhead: {
          d: "M -5 -2.5 0 0 -5 2.5 Z",
          stroke: LINK_COLOR,
          fill: LINK_COLOR,
          atConnectionRatio: 1.5,
          strokeWidth: 3,
        },
      },
      labels: [
        {
          attrs: {
            labelText: {
              text: "",
            },
          },
          position: {
            distance: 0.25,
          },
        },
      ],
    },
    {
      markup: [
        {
          tagName: "path",
          selector: "line",
        },
        {
          tagName: "path",
          selector: "wrapper",
        },
        {
          tagName: "path",
          selector: "arrowhead",
        },
      ],
      defaultLabel: {
        markup: [
          {
            tagName: "rect",
            selector: "labelBody",
          },
          {
            tagName: "text",
            selector: "labelText",
          },
        ],
        attrs: {
          labelText: {
            fontFamily: FONT_FAMILY,
            fontSize: 13,
            textWrap: {
              width: 200,
              height: 100,
              ellipsis: true,
            },
            cursor: "pointer",
            fill: DARK_COLOR,
            textAnchor: "middle",
            textVerticalAnchor: "middle",
            pointerEvents: "none",
          },
          labelBody: {
            ref: "labelText",
            fill: BACKGROUND_COLOR,
            stroke: BACKGROUND_COLOR,
            strokeWidth: 2,
            refWidth: "100%",
            refHeight: "100%",
            refX: 0,
            refY: 0,
          },
        },
      },
    }
  );

  export const Line = dia.Link.define(
    ShapeTypesEnum.LINE,
    {
      attrs: {
        line: {
          fill: "none",
          connection: true,
          stroke: LINE_COLOR,
          strokeWidth: LINE_WIDTH,
        },
        wrapper: {
          fill: "none",
          connection: true,
          stroke: "transparent",
          strokeWidth: 10,
        },
      },
    },
    {
      markup: [
        {
          tagName: "path",
          selector: "line",
        },
        {
          tagName: "path",
          selector: "wrapper",
        },
      ],
    }
  );

  export const AddStepShape = Base.define(
    ShapeTypesEnum.ADDSTEP,
    {
      size: { width: 20, height: 20 },
      ports: {
        groups: {
          in: {
            position: { name: "top", args: { y: -5 } },
            attrs: {
              portBody: {
                fill: DARK_COLOR,
                stroke: BACKGROUND_COLOR,
                strokeWidth: 6,
                paintOrder: "stroke",
                magnet: "passive",
                refR: "50%",
              },
            },
            size: { width: 0, height: 0 },
            markup: [
              {
                tagName: "circle",
                selector: "portBody",
              },
            ],
          },
        },
        items: [{ group: "in" }],
      },
      attrs: {
        body: {
          fill: LIGHT_COLOR,
          stroke: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#2F80ED" },
              { offset: "100%", color: "#8A69FF" },
            ],
            attrs: {
              x1: "0%",
              y1: "0%",
              x2: "100%",
              y2: "100%",
            },
          },
          strokeDasharray: "2",
          refCx: "50%",
          refCy: "50%",
          r: 15,
          dataTooltip: "Add Step here",
          dataTooltipPosition: "top",
          dataTooltipClassName: "bg-black text-white",
          cursor: "pointer",
          boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.25)",
        },
        icon: {
          d: "M 2 8 L 4.29 5.71 L 1.41 2.83 L 2.83 1.41 L 5.71 4.29 L 8 2 L 8 8 Z M -2 8 L -8 8 L -8 2 L -5.71 4.29 L -1 -0.41 L -1 -8 L 1 -8 L 1 0.41 L -4.29 5.71 Z",
          refX: "50%",
          refY: "50%",
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#2F80ED" },
              { offset: "100%", color: "#8A69FF" },
            ],
            attrs: {
              x1: "0%",
              y1: "0%",
              x2: "100%",
              y2: "100%",
            },
          },
          dataTooltip: "Add Step here",
          dataTooltipPosition: "top",
          dataTooltipClassName: "bg-black text-white",
          cursor: "pointer",
          "font-size": 15,
          "text-anchor": "middle",
          "font-weight": "bold",
          y: "0.3em",
        },
      },
    },
    {
      markup: [
        {
          tagName: "circle",
          selector: "body",
        },
        {
          tagName: "text",
          textContent: "+",
          selector: "icon",
        },
      ],
      boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_S,
        bottom: PADDING_L,
      },
    }
  );

  export const PrimaryGradient = Base.define(
    // We make this shape for purpose of using gradient color to cells markup by utilizing id of color-cell
    // i.e we specify color of svg using fill:url("#primary-gradient")
    ShapeTypesEnum.PRIMARYGRADIENT,
    {
      size: { width: 0, height: 0 },
      ports: {},
      attrs: {
        body: {
          fill: "transparent",
          stroke: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#2F80ED" },
              { offset: "100%", color: "#8A69FF" },
            ],
            attrs: {
              x1: "0%",
              y1: "0%",
              x2: "100%",
              y2: "100%",
            },
          },
        },
      },
    },
    {
      markup: [
        {
          tagName: "circle",
          selector: "body",
        },
      ],
      boundaryPadding: {
        horizontal: PADDING_L,
        top: PADDING_S,
        bottom: PADDING_L,
      },
    }
  );
}

// re-export build-in shapes from JointJs
export const { basic } = joint.shapes;
export const { standard } = joint.shapes;
