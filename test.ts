import { assertEquals } from "https://deno.land/std@v0.29.0/testing/asserts.ts";
import { runIfMain, test } from "https://deno.land/std@v0.29.0/testing/mod.ts";
import { parse } from "./mod.ts";

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

runIfMain(import.meta);
