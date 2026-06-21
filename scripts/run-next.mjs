import { spawn } from "node:child_process";
import { join } from "node:path";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const [, , command = "dev", ...args] = process.argv;

loadEnvConfig(process.cwd());

const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, command, ...args], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
