import { useEffect, useState } from "react";
import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import { getSettings, upsertSettings } from "../services/settings.service.server";
import { validateSettings } from "../utils/validation.server";
import { DEFAULT_SETTINGS } from "../constants";
import type { ScrollToTopSettingsInput } from "../types";
import { SettingsDashboard } from "../components/dashboard/SettingsDashboard";

// ─── Loader ───────────────────────────────────────────────────────────────────

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getSettings(session.shop);
  return { settings };
};

// ─── Action ───────────────────────────────────────────────────────────────────

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const body = await request.json().catch(() => null);
  if (!body) return { ok: false as const, errors: { _root: "Invalid request body" } };

  if (body.intent === "reset") {
    const settings = await upsertSettings(session.shop, DEFAULT_SETTINGS);
    return { ok: true as const, settings, message: "Settings reset to defaults" };
  }

  const { intent: _, ...data } = body;
  const { valid, errors, parsed } = validateSettings(data);

  if (!valid) {
    return { ok: false as const, errors };
  }

  const settings = await upsertSettings(session.shop, parsed);
  return { ok: true as const, settings, message: "Settings saved" };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toFormValues(s: Record<string, unknown>): ScrollToTopSettingsInput {
  return {
    isEnabled: Boolean(s.isEnabled),
    iconType: (s.iconType as ScrollToTopSettingsInput["iconType"]) ?? "arrow",
    buttonShape: (s.buttonShape as ScrollToTopSettingsInput["buttonShape"]) ?? "circle",
    buttonSize: Number(s.buttonSize),
    iconSize: Number(s.iconSize),
    borderRadius: Number(s.borderRadius),
    borderWidth: Number(s.borderWidth),
    opacity: Number(s.opacity),
    buttonColor: String(s.buttonColor),
    iconColor: String(s.iconColor),
    hoverBackgroundColor: String(s.hoverBackgroundColor),
    hoverIconColor: String(s.hoverIconColor),
    borderColor: String(s.borderColor),
    shadowColor: String(s.shadowColor),
    buttonPosition: (s.buttonPosition as ScrollToTopSettingsInput["buttonPosition"]) ?? "bottom-right",
    bottomOffset: Number(s.bottomOffset),
    sideOffset: Number(s.sideOffset),
    showOnDesktop: Boolean(s.showOnDesktop),
    showOnMobile: Boolean(s.showOnMobile),
    hideAtTop: Boolean(s.hideAtTop),
    scrollThreshold: Number(s.scrollThreshold),
    scrollSpeed: (s.scrollSpeed as ScrollToTopSettingsInput["scrollSpeed"]) ?? "medium",
    animationType: (s.animationType as ScrollToTopSettingsInput["animationType"]) ?? "fade",
    enableShadow: Boolean(s.enableShadow),
    shadowBlur: Number(s.shadowBlur),
    shadowOpacity: Number(s.shadowOpacity),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Index() {
  const { settings } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const [values, setValues] = useState<ScrollToTopSettingsInput>(
    () => toFormValues(settings as Record<string, unknown>),
  );

  // Sync state when server responds (save or reset)
  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.ok) {
      shopify.toast.show(fetcher.data.message, { duration: 3000 });
      setValues(toFormValues(fetcher.data.settings as Record<string, unknown>));
    }
  }, [fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const isSaving = fetcher.state !== "idle";
  const errors =
    fetcher.data && !fetcher.data.ok ? fetcher.data.errors ?? {} : {};

  const handleChange = <K extends keyof ScrollToTopSettingsInput>(
    key: K,
    value: ScrollToTopSettingsInput[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    fetcher.submit(
      { intent: "save", ...values } as unknown as Record<string, string>,
      { method: "post", encType: "application/json" },
    );
  };

  const handleReset = () => {
    fetcher.submit(
      { intent: "reset" } as Record<string, string>,
      { method: "post", encType: "application/json" },
    );
  };

  return (
    <SettingsDashboard
      values={values}
      onChange={handleChange}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      isLoading={false}
      errors={errors as Record<string, string>}
    />
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
