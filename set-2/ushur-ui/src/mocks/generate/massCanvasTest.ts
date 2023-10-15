import { WorkflowLink, WorkflowStep } from "../../api";

function generateData(amount: number): (WorkflowStep | WorkflowLink)[] {
  const cells = [];

  for (let id = 0; id < amount; id += 1) {
    const prevId = id - 1;
    const prevPrevId = id - 2;

    const appStep: WorkflowStep = {
      type: "app.Step",
      ports: {
        items: [
          {
            group: "in",
            id: "1",
          },
          {
            group: "out",
            id: "2",
          },
        ],
      },
      position: {
        x: -id * -50,
        y: -id * -80,
      },
      modules: [],
      id: id.toString(),
      attrs: {
        label: {
          text: "Schedule Appointment",
        },
        description: {
          text: "Schedule appointment with doctor",
        },
      },
    };

    const appLink: WorkflowLink = {
      type: "app.Link",
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
      source: {
        id: prevPrevId.toString(),
        magnet: "portBody",
        port: "2",
      },
      target: {
        id: prevId.toString(),
        magnet: "portBody",
        port: "1",
      },
      id: id.toString(),
      z: id,
      attrs: {},
    };

    if (id !== 0 && id % 2 === 0) {
      cells.push(appLink);
    } else {
      cells.push(appStep);
    }
  }

  return cells;
}

export default generateData;
