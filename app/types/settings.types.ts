export type ButtonPosition = "bottom-right" | "bottom-left";
export type ButtonShape = "circle" | "rounded" | "square" | "pill";
export type AnimationType = "fade" | "slide" | "scale" | "bounce" | "zoom" | "none";
export type IconType = "arrow" | "chevron" | "double-chevron" | "circle" | "home" | "caret";
export type ScrollSpeed = "instant" | "fast" | "medium" | "slow";

export interface ScrollToTopSettings {
  id: string;
  shop: string;
  // General
  isEnabled: boolean;
  // Design
  iconType: IconType;
  buttonShape: ButtonShape;
  buttonSize: number;
  iconSize: number;
  borderRadius: number;
  borderWidth: number;
  opacity: number;
  // Colors
  buttonColor: string;
  iconColor: string;
  hoverBackgroundColor: string;
  hoverIconColor: string;
  borderColor: string;
  shadowColor: string;
  // Position
  buttonPosition: ButtonPosition;
  bottomOffset: number;
  sideOffset: number;
  // Visibility
  showOnDesktop: boolean;
  showOnMobile: boolean;
  hideAtTop: boolean;
  // Scroll
  scrollThreshold: number;
  scrollSpeed: ScrollSpeed;
  // Animation
  animationType: AnimationType;
  // Shadow
  enableShadow: boolean;
  shadowBlur: number;
  shadowOpacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ScrollToTopSettingsInput = Omit<
  ScrollToTopSettings,
  "id" | "shop" | "createdAt" | "updatedAt"
>;

export type PartialScrollToTopSettingsInput = Partial<ScrollToTopSettingsInput>;
