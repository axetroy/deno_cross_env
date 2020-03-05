import {
  assertEquals
} from "https://deno.land/std@v0.35.0/testing/asserts.ts";
import { parse } from "./mod.ts";

const { test } = Deno;

test(async function testParse() {
  {
    const { env, command } = parse(["deno", "run", "example.ts"]);

    assertEquals(env, {});
    assertEquals(command, ["deno", "run", "example.ts"]);
  }

  {
    const { env, command } = parse(["FOO=bar", "deno", "run", "example.ts"]);

    assertEquals(env, { FOO: "bar" });
    assertEquals(command, ["deno", "run", "example.ts"]);
  }

  {
    const { env, command } = parse(["FOO=", "deno", "run", "example.ts"]);

    assertEquals(env, { FOO: "" });
    assertEquals(command, ["deno", "run", "example.ts"]);
  }

  {
    const { env, command } = parse([
      "FOO=bar",
      "NAME=deno",
      "deno",
      "run",
      "example.ts"
    ]);

    assertEquals(env, { FOO: "bar", NAME: "deno" });
    assertEquals(command, ["deno", "run", "example.ts"]);
  }
});
