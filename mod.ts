#!/usr/bin/env -S deno --allow-run --allow-env
const { run, env, exit } = Deno;

const VERSION = "v0.1.0";

const args = Deno.args.slice(1);
const reg = /^(\S+)=(.*)?$/i;

interface Result {
  env: {
    [key: string]: string;
  };
  command: string[];
}

export function parse(args: string[]): Result {
  args = args.slice();
  const env: { [key: string]: string } = {};
  const command = args.slice();
  for (const argv of args) {
    const matcher = argv.match(reg);
    if (matcher) {
      const [_, key, value] = matcher;
      env[key] = value === undefined ? "" : value;
      command.shift();
    } else {
      break;
    }
  }
  return {
    env,
    command
  };
}

function printHelp() {
  console.log(`
cross-env - A tool for setting environment variables across platforms

Usage:
    cross-env --help
    cross-env [key=value] <COMMAND>
    cross-env PORT=8080 HOST=localhost deno run server.ts
      `);

  exit(1);
}

function printVersion() {
  console.log(VERSION);
  exit(0);
}

if (import.meta.main) {
  if (args.length === 0) {
    printHelp();
  }

  if (args.length === 1) {
    if (["--help", "-h"].includes(args[0])) {
      printHelp();
    } else if (["--version", "-v"].includes(args[0])) {
      printVersion();
    }
  }

  const { env: externalEnv, command } = parse(args);

  const ps = run({
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    args: command,
    env: {
      ...env(),
      ...externalEnv
    }
  });

  const status = await ps.status();

  exit(status.code);
}
