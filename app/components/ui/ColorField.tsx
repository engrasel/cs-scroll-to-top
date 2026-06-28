import { TextField, InlineStack, BlockStack, Text } from "@shopify/polaris";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string;
}

export function ColorField({ label, value, onChange, helpText, error }: ColorFieldProps) {
  return (
    <BlockStack gap="100">
      <Text as="span" variant="bodyMd" fontWeight="medium">
        {label}
      </Text>
      <InlineStack gap="200" blockAlign="center">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          title={label}
          style={{
            width: "2.25rem",
            height: "2.25rem",
            flexShrink: 0,
            border: error ? "1px solid #d72c0d" : "1px solid #c9cccf",
            borderRadius: "0.375rem",
            cursor: "pointer",
            padding: "0.125rem",
            backgroundColor: "white",
          }}
        />
        <div style={{ flex: 1 }}>
          <TextField
            label={label}
            labelHidden
            value={value}
            onChange={onChange}
            autoComplete="off"
            maxLength={7}
            error={error}
            helpText={helpText}
          />
        </div>
      </InlineStack>
    </BlockStack>
  );
}
