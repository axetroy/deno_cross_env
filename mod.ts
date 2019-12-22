#!/usr/bin/env -S deno --allow-run --allow-env
const { run, env, exit } = Deno;

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
  const env = {};
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

if (import.meta.main) {
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
