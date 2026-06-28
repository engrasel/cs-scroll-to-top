import db from "../db.server";
import { DEFAULT_SETTINGS } from "../constants";
import type { PartialScrollToTopSettingsInput } from "../types";

export async function getSettings(shop: string) {
  const settings = await db.scrollToTopSettings.findUnique({
    where: { shop },
  });

  if (!settings) {
    return db.scrollToTopSettings.create({
      data: { shop, ...DEFAULT_SETTINGS },
    });
  }

  return settings;
}

export async function upsertSettings(
  shop: string,
  input: PartialScrollToTopSettingsInput,
) {
  return db.scrollToTopSettings.upsert({
    where: { shop },
    update: input,
    create: { shop, ...DEFAULT_SETTINGS, ...input },
  });
}

export async function deleteSettings(shop: string) {
  return db.scrollToTopSettings.deleteMany({ where: { shop } });
}
