import { setupServer } from "msw/node"
import { handlers } from "./msw-handlers"

// Setup MSW server with default handlers
export const server = setupServer(...handlers)
