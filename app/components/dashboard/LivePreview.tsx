import { Card, BlockStack, Text, Badge, InlineStack } from "@shopify/polaris";
import type { ScrollToTopSettingsInput, ButtonShape, IconType } from "../../types";

interface LivePreviewProps {
  values: ScrollToTopSettingsInput;
}

const ICON_SVGS: Record<IconType, React.ReactNode> = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  "double-chevron": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <polyline points="17 17 12 12 7 17" />
      <polyline points="17 11 12 6 7 11" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="12" cy="12" r="9" />
      <polyline points="15 13 12 10 9 13" />
      <line x1="12" y1="14" x2="12" y2="10" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  caret: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <polygon points="12,5 20,19 4,19" />
    </svg>
  ),
};

function getBorderRadius(shape: ButtonShape, radius: number): string {
  if (shape === "circle") return "50%";
  if (shape === "pill") return "999px";
  if (shape === "square") return "0px";
  return `${radius}px`;
}

export function LivePreview({ values }: LivePreviewProps) {
  const borderRadius = getBorderRadius(values.buttonShape, values.borderRadius);

  const shadow = values.enableShadow
    ? `0 4px ${values.shadowBlur}px rgba(0,0,0,${values.shadowOpacity})`
    : "none";

  const positionStyle: React.CSSProperties =
    values.buttonPosition === "bottom-right"
      ? { right: Math.min(values.sideOffset, 20), bottom: Math.min(values.bottomOffset, 20) }
      : { left: Math.min(values.sideOffset, 20), bottom: Math.min(values.bottomOffset, 20) };

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Text as="h2" variant="headingMd">
            Live Preview
          </Text>
          <Badge tone={values.isEnabled ? "success" : "critical"}>
            {values.isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </InlineStack>

        {/* Storefront mock */}
        <div
          style={{
            position: "relative",
            height: "220px",
            backgroundColor: "#f4f6f8",
            borderRadius: "8px",
            border: "1px solid #e1e3e5",
            overflow: "hidden",
          }}
        >
          {/* Fake page content */}
          <div style={{ padding: "16px", opacity: 0.25 }}>
            {[80, 60, 70, 50, 65].map((w, i) => (
              <div
                key={i}
                style={{
                  height: "10px",
                  backgroundColor: "#8c9196",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  width: `${w}%`,
                }}
              />
            ))}
          </div>

          {/* The button */}
          {values.isEnabled && (
            <div
              style={{
                position: "absolute",
                ...positionStyle,
                width: Math.round(values.buttonSize * 0.7),
                height: Math.round(values.buttonSize * 0.7),
                backgroundColor: values.buttonColor,
                borderRadius,
                border: values.borderWidth > 0
                  ? `${values.borderWidth}px solid ${values.borderColor}`
                  : "none",
                boxShadow: shadow,
                opacity: values.opacity,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: values.iconColor,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <div style={{ width: Math.round(values.iconSize * 0.7), height: Math.round(values.iconSize * 0.7) }}>
                {ICON_SVGS[values.iconType] ?? ICON_SVGS.arrow}
              </div>
            </div>
          )}
        </div>

        <Text as="p" variant="bodySm" tone="subdued">
          Preview updates instantly as you change settings.
          Actual size and offsets are scaled for display.
        </Text>
      </BlockStack>
    </Card>
  );
}
