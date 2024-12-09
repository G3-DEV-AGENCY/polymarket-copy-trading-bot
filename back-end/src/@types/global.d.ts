import { Logger } from "winston";
import { Environment, Config } from "../config/config";

// Extend NodeJS global object
declare global {
  // eslint-disable-next-line no-var
  var logger: Logger; // Declare logger as a global variable
}

export {}; // This is needed to prevent TypeScript from treating this as a global script
