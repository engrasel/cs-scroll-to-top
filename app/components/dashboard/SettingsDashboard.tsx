import {
  Page,
  Layout,
  Card,
  FormLayout,
  Select,
  Button,
  RangeSlider,
  Checkbox,
  ChoiceList,
  InlineStack,
  BlockStack,
  Badge,
  Divider,
  Text,
  Banner,
  Spinner,
} from "@shopify/polaris";
import type { IconType, AnimationType, ScrollToTopSettingsInput } from "../../types";
import {
  BUTTON_SHAPES,
  BUTTON_POSITIONS,
  SCROLL_SPEEDS,
  ANIMATION_TYPES,
  ICON_TYPES,
  BUTTON_SIZE_LIMITS,
  ICON_SIZE_LIMITS,
  BORDER_RADIUS_LIMITS,
  BORDER_WIDTH_LIMITS,
  OFFSET_LIMITS,
  SCROLL_THRESHOLD_LIMITS,
  SHADOW_BLUR_LIMITS,
  SHADOW_OPACITY_LIMITS,
} from "../../constants";
import { ColorField } from "../ui/ColorField";
import { LivePreview } from "./LivePreview";

// ─── Icon SVGs ────────────────────────────────────────────────────────────────

const ICON_SVGS: Record<IconType, React.ReactNode> = {
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  "double-chevron": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <polyline points="17 17 12 12 7 17" /><polyline points="17 11 12 6 7 11" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <circle cx="12" cy="12" r="9" /><polyline points="15 13 12 10 9 13" /><line x1="12" y1="14" x2="12" y2="10" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  caret: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <polygon points="12,5 20,19 4,19" />
    </svg>
  ),
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  values: ScrollToTopSettingsInput;
  onChange: <K extends keyof ScrollToTopSettingsInput>(
    key: K,
    value: ScrollToTopSettingsInput[K],
  ) => void;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  isLoading: boolean;
  errors: Record<string, string>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SELECTED_STYLE: React.CSSProperties = {
  border: "2px solid #008060",
  borderRadius: "8px",
  padding: "8px",
  backgroundColor: "#f0faf7",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  color: "#008060",
};

const UNSELECTED_STYLE: React.CSSProperties = {
  border: "1px solid #c9cccf",
  borderRadius: "8px",
  padding: "8px",
  backgroundColor: "white",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  color: "#202223",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: string }) {
  return (
    <Text as="h2" variant="headingMd">
      {children}
    </Text>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: IconType;
  onChange: (v: IconType) => void;
}) {
  return (
    <BlockStack gap="200">
      <Text as="span" variant="bodyMd" fontWeight="medium">
        Icon
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
        {ICON_TYPES.map((icon) => {
          const selected = value === icon.value;
          return (
            <button
              key={icon.value}
              type="button"
              onClick={() => onChange(icon.value as IconType)}
              style={selected ? SELECTED_STYLE : UNSELECTED_STYLE}
              title={icon.label}
            >
              {ICON_SVGS[icon.value as IconType]}
              <span style={{ fontSize: "10px", fontWeight: selected ? 600 : 400 }}>
                {icon.label}
              </span>
            </button>
          );
        })}
      </div>
    </BlockStack>
  );
}

function AnimationPicker({
  value,
  onChange,
}: {
  value: AnimationType;
  onChange: (v: AnimationType) => void;
}) {
  return (
    <BlockStack gap="200">
      <Text as="span" variant="bodyMd" fontWeight="medium">
        Animation type
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {ANIMATION_TYPES.map((anim) => {
          const selected = value === anim.value;
          return (
            <button
              key={anim.value}
              type="button"
              onClick={() => onChange(anim.value as AnimationType)}
              style={{
                padding: "10px 8px",
                border: selected ? "2px solid #008060" : "1px solid #c9cccf",
                borderRadius: "8px",
                backgroundColor: selected ? "#f0faf7" : "white",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: selected ? 600 : 400,
                color: selected ? "#008060" : "#202223",
                textAlign: "center",
              }}
            >
              {anim.label}
            </button>
          );
        })}
      </div>
    </BlockStack>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SettingsDashboard({
  values,
  onChange,
  onSave,
  onReset,
  isSaving,
  isLoading,
  errors,
}: Props) {
  const set =
    <K extends keyof ScrollToTopSettingsInput>(key: K) =>
    (value: ScrollToTopSettingsInput[K]) =>
      onChange(key, value);

  const visibilityMode =
    values.showOnDesktop && values.showOnMobile
      ? "both"
      : values.showOnDesktop
        ? "desktop"
        : "mobile";

  const setVisibilityMode = (mode: string) => {
    onChange("showOnDesktop", mode === "both" || mode === "desktop");
    onChange("showOnMobile", mode === "both" || mode === "mobile");
  };

  const hasErrors = Object.keys(errors).length > 0;

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <Page
      title="Scroll To Top"
      subtitle="Customise your scroll-to-top button"
      titleMetadata={
        <Badge tone={values.isEnabled ? "success" : "critical"}>
          {values.isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      }
      primaryAction={{
        content: "Save settings",
        onAction: onSave,
        loading: isSaving,
      }}
      secondaryActions={[
        {
          content: "Reset to defaults",
          onAction: onReset,
          loading: isSaving,
          destructive: false,
        },
      ]}
    >
      <Layout>
        {/* ── Left column: all settings cards ── */}
        <Layout.Section>
          <BlockStack gap="500">

            {hasErrors && (
              <Banner tone="critical" title="Please fix the following errors before saving">
                <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                  {Object.entries(errors).map(([k, msg]) => (
                    <li key={k}>{msg}</li>
                  ))}
                </ul>
              </Banner>
            )}

            {/* 1. General ─────────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>1. General</SectionHeading>
                <Divider />
                <Checkbox
                  label="Enable scroll to top button"
                  helpText="Toggle the button on or off across your entire storefront."
                  checked={values.isEnabled}
                  onChange={set("isEnabled")}
                />
              </BlockStack>
            </Card>

            {/* 2. Design ──────────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>2. Design</SectionHeading>
                <Divider />

                <IconPicker
                  value={values.iconType}
                  onChange={set("iconType")}
                />

                <FormLayout>
                  <Select
                    label="Button shape"
                    options={BUTTON_SHAPES}
                    value={values.buttonShape}
                    onChange={set("buttonShape")}
                  />
                </FormLayout>

                <RangeSlider
                  label="Button size"
                  min={BUTTON_SIZE_LIMITS.min}
                  max={BUTTON_SIZE_LIMITS.max}
                  step={1}
                  value={values.buttonSize}
                  onChange={(v) => set("buttonSize")(v as number)}
                  output
                  suffix={
                    <Text as="span" variant="bodyMd">
                      {values.buttonSize}px
                    </Text>
                  }
                />

                <RangeSlider
                  label="Icon size"
                  min={ICON_SIZE_LIMITS.min}
                  max={ICON_SIZE_LIMITS.max}
                  step={1}
                  value={values.iconSize}
                  onChange={(v) => set("iconSize")(v as number)}
                  output
                  suffix={
                    <Text as="span" variant="bodyMd">
                      {values.iconSize}px
                    </Text>
                  }
                />

                {values.buttonShape === "rounded" && (
                  <RangeSlider
                    label="Border radius"
                    min={BORDER_RADIUS_LIMITS.min}
                    max={BORDER_RADIUS_LIMITS.max}
                    step={1}
                    value={values.borderRadius}
                    onChange={(v) => set("borderRadius")(v as number)}
                    output
                    suffix={
                      <Text as="span" variant="bodyMd">
                        {values.borderRadius}px
                      </Text>
                    }
                  />
                )}

                <RangeSlider
                  label="Border width"
                  min={BORDER_WIDTH_LIMITS.min}
                  max={BORDER_WIDTH_LIMITS.max}
                  step={1}
                  value={values.borderWidth}
                  onChange={(v) => set("borderWidth")(v as number)}
                  output
                  suffix={
                    <Text as="span" variant="bodyMd">
                      {values.borderWidth}px
                    </Text>
                  }
                />
              </BlockStack>
            </Card>

            {/* 3. Colors ──────────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>3. Colors</SectionHeading>
                <Divider />
                <FormLayout>
                  <FormLayout.Group>
                    <ColorField
                      label="Background color"
                      value={values.buttonColor}
                      onChange={set("buttonColor")}
                      error={errors.buttonColor}
                    />
                    <ColorField
                      label="Icon color"
                      value={values.iconColor}
                      onChange={set("iconColor")}
                      error={errors.iconColor}
                    />
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <ColorField
                      label="Hover background"
                      value={values.hoverBackgroundColor}
                      onChange={set("hoverBackgroundColor")}
                      error={errors.hoverBackgroundColor}
                    />
                    <ColorField
                      label="Hover icon color"
                      value={values.hoverIconColor}
                      onChange={set("hoverIconColor")}
                      error={errors.hoverIconColor}
                    />
                  </FormLayout.Group>
                  <FormLayout.Group>
                    <ColorField
                      label="Border color"
                      value={values.borderColor}
                      onChange={set("borderColor")}
                      error={errors.borderColor}
                    />
                    <ColorField
                      label="Shadow color"
                      value={values.shadowColor}
                      onChange={set("shadowColor")}
                      error={errors.shadowColor}
                    />
                  </FormLayout.Group>
                </FormLayout>
              </BlockStack>
            </Card>

            {/* 4. Position ────────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>4. Position</SectionHeading>
                <Divider />
                <ChoiceList
                  title="Button position"
                  choices={BUTTON_POSITIONS.map((p) => ({
                    label: p.label,
                    value: p.value,
                  }))}
                  selected={[values.buttonPosition]}
                  onChange={(vals) =>
                    set("buttonPosition")(vals[0] as ScrollToTopSettingsInput["buttonPosition"])
                  }
                />
                <RangeSlider
                  label="Bottom offset"
                  min={OFFSET_LIMITS.min}
                  max={OFFSET_LIMITS.max}
                  step={1}
                  value={values.bottomOffset}
                  onChange={(v) => set("bottomOffset")(v as number)}
                  output
                  suffix={
                    <Text as="span" variant="bodyMd">
                      {values.bottomOffset}px
                    </Text>
                  }
                />
                <RangeSlider
                  label="Side offset"
                  min={OFFSET_LIMITS.min}
                  max={OFFSET_LIMITS.max}
                  step={1}
                  value={values.sideOffset}
                  onChange={(v) => set("sideOffset")(v as number)}
                  output
                  suffix={
                    <Text as="span" variant="bodyMd">
                      {values.sideOffset}px
                    </Text>
                  }
                />
              </BlockStack>
            </Card>

            {/* 5. Visibility ──────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>5. Visibility</SectionHeading>
                <Divider />
                <ChoiceList
                  title="Show on devices"
                  choices={[
                    { label: "Desktop + Mobile", value: "both" },
                    { label: "Desktop only", value: "desktop" },
                    { label: "Mobile only", value: "mobile" },
                  ]}
                  selected={[visibilityMode]}
                  onChange={(vals) => setVisibilityMode(vals[0])}
                />
                <Checkbox
                  label="Hide when page is already at the top"
                  helpText="The button will not appear until the user scrolls down."
                  checked={values.hideAtTop}
                  onChange={set("hideAtTop")}
                />
              </BlockStack>
            </Card>

            {/* 6. Scroll Behavior ─────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>6. Scroll Behavior</SectionHeading>
                <Divider />
                <RangeSlider
                  label="Show after scrolling"
                  min={SCROLL_THRESHOLD_LIMITS.min}
                  max={SCROLL_THRESHOLD_LIMITS.max}
                  step={10}
                  value={values.scrollThreshold}
                  onChange={(v) => set("scrollThreshold")(v as number)}
                  output
                  suffix={
                    <Text as="span" variant="bodyMd">
                      {values.scrollThreshold}px
                    </Text>
                  }
                  error={errors.scrollThreshold}
                />
                <FormLayout>
                  <Select
                    label="Scroll speed"
                    options={SCROLL_SPEEDS}
                    value={values.scrollSpeed}
                    onChange={set("scrollSpeed")}
                    helpText="How fast the page scrolls back to the top when the button is clicked."
                  />
                </FormLayout>
              </BlockStack>
            </Card>

            {/* 7. Animation ───────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>7. Animation</SectionHeading>
                <Divider />
                <AnimationPicker
                  value={values.animationType}
                  onChange={set("animationType")}
                />
              </BlockStack>
            </Card>

            {/* 8. Shadow ──────────────────────────────────── */}
            <Card>
              <BlockStack gap="400">
                <SectionHeading>8. Shadow</SectionHeading>
                <Divider />
                <Checkbox
                  label="Enable drop shadow"
                  checked={values.enableShadow}
                  onChange={set("enableShadow")}
                />
                {values.enableShadow && (
                  <BlockStack gap="400">
                    <RangeSlider
                      label="Shadow blur"
                      min={SHADOW_BLUR_LIMITS.min}
                      max={SHADOW_BLUR_LIMITS.max}
                      step={1}
                      value={values.shadowBlur}
                      onChange={(v) => set("shadowBlur")(v as number)}
                      output
                      suffix={
                        <Text as="span" variant="bodyMd">
                          {values.shadowBlur}px
                        </Text>
                      }
                    />
                    <RangeSlider
                      label="Shadow opacity"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(values.shadowOpacity * 100)}
                      onChange={(v) => set("shadowOpacity")(Math.round(v as number) / 100)}
                      output
                      suffix={
                        <Text as="span" variant="bodyMd">
                          {Math.round(values.shadowOpacity * 100)}%
                        </Text>
                      }
                    />
                  </BlockStack>
                )}
              </BlockStack>
            </Card>

            {/* Bottom Save row */}
            <InlineStack align="end" gap="300">
              <Button onClick={onReset} disabled={isSaving}>
                Reset to defaults
              </Button>
              <Button variant="primary" onClick={onSave} loading={isSaving}>
                Save settings
              </Button>
            </InlineStack>

          </BlockStack>
        </Layout.Section>

        {/* ── Right column: live preview ── */}
        <Layout.Section variant="oneThird">
          <div style={{ position: "sticky", top: "16px" }}>
            <LivePreview values={values} />
          </div>
        </Layout.Section>
      </Layout>

      {/* Bottom padding */}
      <div style={{ height: "40px" }} />
    </Page>
  );
}
