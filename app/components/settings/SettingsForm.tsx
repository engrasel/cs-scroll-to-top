import type { ScrollToTopSettings } from "../../types";

export interface SettingsFormProps {
  settings: ScrollToTopSettings;
  onSave: (values: Partial<ScrollToTopSettings>) => void;
  isSaving: boolean;
}

// TODO: Implement settings form UI
export function SettingsForm(_props: SettingsFormProps) {
  return null;
}
