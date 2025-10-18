import { execution } from "../execution";
import { makeEffect } from "../tokens";

export const makeEndBlockEffect = () => makeEffect(execution.endBlockOperation)
