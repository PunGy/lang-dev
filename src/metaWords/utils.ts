import { execution } from "../executionGraph";
import { makeEffect } from "../tokens";

export const makeEndBlockEffect = () => makeEffect(execution.endBlockOperation)
