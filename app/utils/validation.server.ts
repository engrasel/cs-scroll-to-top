import {
  BUTTON_SIZE_LIMITS,
  ICON_SIZE_LIMITS,
  BORDER_RADIUS_LIMITS,
  BORDER_WIDTH_LIMITS,
  OFFSET_LIMITS,
  SCROLL_THRESHOLD_LIMITS,
  OPACITY_LIMITS,
  SHADOW_BLUR_LIMITS,
  SHADOW_OPACITY_LIMITS,
  BUTTON_POSITIONS,
  BUTTON_SHAPES,
  ANIMATION_TYPES,
  ICON_TYPES,
  SCROLL_SPEEDS,
} from "../constants";
import type { PartialScrollToTopSettingsInput } from "../types";

type ValidationErrors = Record<string, string>;

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
  parsed: PartialScrollToTopSettingsInput;
}

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

function validateHex(key: string, val: unknown, errors: ValidationErrors): string | undefined {
  if (typeof val !== "string" || !HEX_RE.test(val)) {
    errors[key] = "Must be a valid 6-digit hex color (e.g. #FF5733)";
    return undefined;
  }
  return val;
}

function validateInt(
  key: string,
  val: unknown,
  min: number,
  max: number,
  errors: ValidationErrors,
): number | undefined {
  const n = Number(val);
  if (isNaN(n) || n < min || n > max) {
    errors[key] = `Must be between ${min} and ${max}`;
    return undefined;
  }
  return n;
}

function validateFloat(
  key: string,
  val: unknown,
  min: number,
  max: number,
  errors: ValidationErrors,
): number | undefined {
  const n = Number(val);
  if (isNaN(n) || n < min || n > max) {
    errors[key] = `Must be between ${min} and ${max}`;
    return undefined;
  }
  return n;
}

function validateEnum<T extends string>(
  key: string,
  val: unknown,
  allowed: T[],
  errors: ValidationErrors,
): T | undefined {
  if (!allowed.includes(val as T)) {
    errors[key] = `Must be one of: ${allowed.join(", ")}`;
    return undefined;
  }
  return val as T;
}

export function validateSettings(data: unknown): ValidationResult {
  const errors: ValidationErrors = {};
  const parsed: PartialScrollToTopSettingsInput = {};

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: { _root: "Body must be a JSON object" }, parsed };
  }

  const d = data as Record<string, unknown>;

  // General
  if ("isEnabled" in d) {
    if (typeof d.isEnabled !== "boolean") errors.isEnabled = "Must be a boolean";
    else parsed.isEnabled = d.isEnabled;
  }

  // Design
  if ("iconType" in d) {
    const v = validateEnum("iconType", d.iconType, ICON_TYPES.map((t) => t.value), errors);
    if (v !== undefined) parsed.iconType = v;
  }
  if ("buttonShape" in d) {
    const v = validateEnum("buttonShape", d.buttonShape, BUTTON_SHAPES.map((s) => s.value), errors);
    if (v !== undefined) parsed.buttonShape = v;
  }
  if ("buttonSize" in d) {
    const v = validateInt("buttonSize", d.buttonSize, BUTTON_SIZE_LIMITS.min, BUTTON_SIZE_LIMITS.max, errors);
    if (v !== undefined) parsed.buttonSize = v;
  }
  if ("iconSize" in d) {
    const v = validateInt("iconSize", d.iconSize, ICON_SIZE_LIMITS.min, ICON_SIZE_LIMITS.max, errors);
    if (v !== undefined) parsed.iconSize = v;
  }
  if ("borderRadius" in d) {
    const v = validateInt("borderRadius", d.borderRadius, BORDER_RADIUS_LIMITS.min, BORDER_RADIUS_LIMITS.max, errors);
    if (v !== undefined) parsed.borderRadius = v;
  }
  if ("borderWidth" in d) {
    const v = validateInt("borderWidth", d.borderWidth, BORDER_WIDTH_LIMITS.min, BORDER_WIDTH_LIMITS.max, errors);
    if (v !== undefined) parsed.borderWidth = v;
  }
  if ("opacity" in d) {
    const v = validateFloat("opacity", d.opacity, OPACITY_LIMITS.min, OPACITY_LIMITS.max, errors);
    if (v !== undefined) parsed.opacity = v;
  }

  // Colors
  for (const key of ["buttonColor", "iconColor", "hoverBackgroundColor", "hoverIconColor", "borderColor", "shadowColor"] as const) {
    if (key in d) {
      const v = validateHex(key, d[key], errors);
      if (v !== undefined) (parsed as Record<string, unknown>)[key] = v;
    }
  }

  // Position
  if ("buttonPosition" in d) {
    const v = validateEnum("buttonPosition", d.buttonPosition, BUTTON_POSITIONS.map((p) => p.value), errors);
    if (v !== undefined) parsed.buttonPosition = v;
  }
  if ("bottomOffset" in d) {
    const v = validateInt("bottomOffset", d.bottomOffset, OFFSET_LIMITS.min, OFFSET_LIMITS.max, errors);
    if (v !== undefined) parsed.bottomOffset = v;
  }
  if ("sideOffset" in d) {
    const v = validateInt("sideOffset", d.sideOffset, OFFSET_LIMITS.min, OFFSET_LIMITS.max, errors);
    if (v !== undefined) parsed.sideOffset = v;
  }

  // Visibility
  for (const key of ["showOnDesktop", "showOnMobile", "hideAtTop"] as const) {
    if (key in d) {
      if (typeof d[key] !== "boolean") errors[key] = "Must be a boolean";
      else (parsed as Record<string, unknown>)[key] = d[key];
    }
  }

  // Scroll
  if ("scrollThreshold" in d) {
    const v = validateInt("scrollThreshold", d.scrollThreshold, SCROLL_THRESHOLD_LIMITS.min, SCROLL_THRESHOLD_LIMITS.max, errors);
    if (v !== undefined) parsed.scrollThreshold = v;
  }
  if ("scrollSpeed" in d) {
    const v = validateEnum("scrollSpeed", d.scrollSpeed, SCROLL_SPEEDS.map((s) => s.value), errors);
    if (v !== undefined) parsed.scrollSpeed = v;
  }

  // Animation
  if ("animationType" in d) {
    const v = validateEnum("animationType", d.animationType, ANIMATION_TYPES.map((t) => t.value), errors);
    if (v !== undefined) parsed.animationType = v;
  }

  // Shadow
  if ("enableShadow" in d) {
    if (typeof d.enableShadow !== "boolean") errors.enableShadow = "Must be a boolean";
    else parsed.enableShadow = d.enableShadow;
  }
  if ("shadowBlur" in d) {
    const v = validateInt("shadowBlur", d.shadowBlur, SHADOW_BLUR_LIMITS.min, SHADOW_BLUR_LIMITS.max, errors);
    if (v !== undefined) parsed.shadowBlur = v;
  }
  if ("shadowOpacity" in d) {
    const v = validateFloat("shadowOpacity", d.shadowOpacity, SHADOW_OPACITY_LIMITS.min, SHADOW_OPACITY_LIMITS.max, errors);
    if (v !== undefined) parsed.shadowOpacity = v;
  }

  return { valid: Object.keys(errors).length === 0, errors, parsed };
}
