import { setupServer } from "msw/node";
import defaultHandlers from "./handlers/defaultHandlers";

// Setup requests interception using the given handlers.
// eslint-disable-next-line import/prefer-default-export
export const server = setupServer(...defaultHandlers);
