import type {
  ButtonPosition,
  ButtonShape,
  AnimationType,
  IconType,
  ScrollSpeed,
  ScrollToTopSettingsInput,
} from "../types";

export const DEFAULT_SETTINGS: ScrollToTopSettingsInput = {
  isEnabled: true,
  iconType: "arrow",
  buttonShape: "circle",
  buttonSize: 50,
  iconSize: 20,
  borderRadius: 50,
  borderWidth: 0,
  opacity: 1.0,
  buttonColor: "#000000",
  iconColor: "#ffffff",
  hoverBackgroundColor: "#333333",
  hoverIconColor: "#ffffff",
  borderColor: "#000000",
  shadowColor: "#000000",
  buttonPosition: "bottom-right",
  bottomOffset: 20,
  sideOffset: 20,
  showOnDesktop: true,
  showOnMobile: true,
  hideAtTop: false,
  scrollThreshold: 300,
  scrollSpeed: "medium",
  animationType: "fade",
  enableShadow: false,
  shadowBlur: 10,
  shadowOpacity: 0.3,
};

export const BUTTON_POSITIONS: { value: ButtonPosition; label: string }[] = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
];

export const BUTTON_SHAPES: { value: ButtonShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
  { value: "pill", label: "Pill" },
];

export const ICON_TYPES: { value: IconType; label: string }[] = [
  { value: "arrow", label: "Arrow" },
  { value: "chevron", label: "Chevron" },
  { value: "double-chevron", label: "Double" },
  { value: "circle", label: "Circle" },
  { value: "home", label: "Home" },
  { value: "caret", label: "Caret" },
];

export const ANIMATION_TYPES: { value: AnimationType; label: string }[] = [
  { value: "fade", label: "Fade" },
  { value: "scale", label: "Scale" },
  { value: "slide", label: "Slide" },
  { value: "bounce", label: "Bounce" },
  { value: "zoom", label: "Zoom" },
  { value: "none", label: "None" },
];

export const SCROLL_SPEEDS: { value: ScrollSpeed; label: string }[] = [
  { value: "instant", label: "Instant" },
  { value: "fast", label: "Fast" },
  { value: "medium", label: "Medium" },
  { value: "slow", label: "Slow" },
];

export const BUTTON_SIZE_LIMITS = { min: 30, max: 100 } as const;
export const ICON_SIZE_LIMITS = { min: 10, max: 40 } as const;
export const SCROLL_THRESHOLD_LIMITS = { min: 50, max: 2000 } as const;
export const BORDER_RADIUS_LIMITS = { min: 0, max: 50 } as const;
export const BORDER_WIDTH_LIMITS = { min: 0, max: 10 } as const;
export const OFFSET_LIMITS = { min: 0, max: 200 } as const;
export const OPACITY_LIMITS = { min: 0, max: 1 } as const;
export const SHADOW_BLUR_LIMITS = { min: 0, max: 50 } as const;
export const SHADOW_OPACITY_LIMITS = { min: 0, max: 1 } as const;
