const Dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const { exit } = require("process");

process.env.BASE_PATH = path.dirname(__dirname);

let mode = "release";
const args = process.argv.slice(2);
if (args.length) {
  if (args[0].includes("--mode") && args[0].includes("=")) {
    const { 0: Command, 1: Mode } = args[0].split("=");
    mode = Mode;
  }
}

process.env.mode = mode;

let envPath = path.join(process.env.BASE_PATH, "envs", `${mode}.env`);
if (mode === "local" && !process.env.isPackaged) {
  envPath = path.join(process.env.BASE_PATH, "../envs", `.env.${mode}`);
}

Dotenv.config({
  path: envPath
});