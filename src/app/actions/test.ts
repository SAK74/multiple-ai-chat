"use server";

import { randomUUID } from "node:crypto";

export async function testAction() {
  console.log("Test action");

  const uuid = randomUUID();
  return uuid;
}
