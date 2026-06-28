import type { LoaderFunctionArgs } from "react-router";
import { getSettings } from "../services/settings.service.server";

// Public settings endpoint called by the Theme App Extension JS.
// The extension fetches: GET /proxy/settings?shop=my-store.myshopify.com
// No Shopify authentication is needed — settings are non-sensitive appearance data.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const shop = new URL(request.url).searchParams.get("shop");

  if (!shop) {
    return Response.json(
      { error: "Missing shop parameter" },
      { status: 400, headers: corsHeaders("*") },
    );
  }

  let s;
  try {
    s = await getSettings(shop);
  } catch (err) {
    console.error("[CS Scroll To Top] Failed to load settings from database:", err);
    return Response.json(
      { error: "Failed to load settings" },
      { status: 500, headers: corsHeaders("*") },
    );
  }

  return Response.json(
    {
      // General
      isEnabled: s.isEnabled,
      // Design
      iconType: s.iconType,
      buttonShape: s.buttonShape,
      buttonSize: s.buttonSize,
      iconSize: s.iconSize,
      borderRadius: s.borderRadius,
      borderWidth: s.borderWidth,
      opacity: s.opacity,
      // Colors
      buttonColor: s.buttonColor,
      iconColor: s.iconColor,
      hoverBackgroundColor: s.hoverBackgroundColor,
      hoverIconColor: s.hoverIconColor,
      borderColor: s.borderColor,
      shadowColor: s.shadowColor,
      // Position
      buttonPosition: s.buttonPosition,
      bottomOffset: s.bottomOffset,
      sideOffset: s.sideOffset,
      // Visibility
      showOnDesktop: s.showOnDesktop,
      showOnMobile: s.showOnMobile,
      hideAtTop: s.hideAtTop,
      // Scroll
      scrollThreshold: s.scrollThreshold,
      scrollSpeed: s.scrollSpeed,
      // Animation
      animationType: s.animationType,
      // Shadow
      enableShadow: s.enableShadow,
      shadowBlur: s.shadowBlur,
      shadowOpacity: s.shadowOpacity,
    },
    {
      headers: {
        ...corsHeaders("*"),
        "Cache-Control": "public, max-age=60",
      },
    },
  );
};

// Allow preflight from storefronts
export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders("*") });
  }
  return new Response("Method not allowed", { status: 405 });
};

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
