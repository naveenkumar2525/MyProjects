import { ReactNode } from "react";
import { Provider } from "react-redux";
import { DropResult } from "react-beautiful-dnd";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { createStore } from "../../../utils/test.utils";
import { stateFactory } from "../../../mocks/factories/test/state";
import { FormModule } from "../../../api";
import useElementsHook from "./useElementsHook";

const DropResultTemplate = {
  combine: null,
  mode: "FLUID",
  reason: "DROP",
  type: "DEFAULT",
  draggableId: "",
  destination: {
    droppableId: "selectedElements",
    index: 0,
  },
  source: {
    droppableId: "",
    index: 0,
  },
};

const Wrapper = ({ children }: { children: ReactNode }) => {
  const store = createStore(
    stateFactory.build({
      canvas: {
        selectedCellId: "test cell",
        selectedModule: {
          id: "form-module-0",
          type: "form-module",
          title: "Form Module",
          fields: [],
        } as FormModule,
      },
    })
  );

  return <Provider store={store}>{children}</Provider>;
};

test("Form Module is rendered", () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { elements } = hook.result.current;
  expect(elements).toHaveLength(0);
});

test("Drag and drop from static elements", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { elements, onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "text",
      source: {
        droppableId: "staticElements",
        index: 0,
      },
    } as unknown as DropResult);

    expect(elements).toHaveLength(1);
  });
});

test("Drag and drop from form elements", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { elements, onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "textInput",
      source: {
        droppableId: "formElements",
        index: 0,
      },
    } as unknown as DropResult);

    expect(elements).toHaveLength(1);
  });
});

test("Drag and drop from static and form elements", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "text",
      source: {
        droppableId: "staticElements",
        index: 0,
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements).toHaveLength(1);

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "textInput",
      source: {
        droppableId: "formElements",
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements).toHaveLength(2);
});

test("Swap fields", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "text",
      source: {
        droppableId: "staticElements",
        index: 0,
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements[0].name).toBe("text");

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "textInput",
      destination: {
        droppableId: "selectedElements",
      },
      source: {
        droppableId: "formElements",
        index: 0,
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements[1].name).toBe("textInput");

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "textInput",
      destination: {
        droppableId: "selectedElements",
        index: 0,
      },
      source: {
        droppableId: "selectedElements",
        index: 1,
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements[1].name).toBe("text");
});

test("Insert at index", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "text",
      source: {
        droppableId: "staticElements",
        index: 0,
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements[0].name).toBe("text");

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "textInput",
      destination: {
        droppableId: "selectedElements",
        index: 0,
      },
      source: {
        droppableId: "formElements",
        index: 0,
      },
    } as unknown as DropResult);
  });

  expect(hook.result.current.elements[0].name).toBe("textInput");
});

test("When destination is null", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { elements, onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      destination: null,
      draggableId: "text",
      source: {
        droppableId: "staticElements",
        index: 0,
      },
    } as unknown as DropResult);

    expect(elements).toHaveLength(0);
  });
});

test("When source is not valid", async () => {
  const hook = renderHook(() => useElementsHook(), {
    wrapper: Wrapper,
  });
  const { elements, onDragEnd } = hook.result.current;

  await waitFor(() => {
    onDragEnd({
      ...DropResultTemplate,
      draggableId: "text",
      source: {
        droppableId: "elements",
        index: 0,
      },
    } as unknown as DropResult);

    expect(elements).toHaveLength(0);
  });
});
