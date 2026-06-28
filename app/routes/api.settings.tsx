import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getSettings, upsertSettings } from "../services/settings.service.server";
import { validateSettings } from "../utils/validation.server";
import {
  successResponse,
  errorResponse,
  methodNotAllowedResponse,
} from "../utils/response.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getSettings(session.shop);
  return successResponse(settings);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const allowedMethods = ["POST", "PUT", "PATCH"];
  if (!allowedMethods.includes(request.method.toUpperCase())) {
    return methodNotAllowedResponse();
  }

  const body = await request.json().catch(() => null);
  if (body === null) {
    return errorResponse("Request body must be valid JSON");
  }

  const { valid, errors, parsed } = validateSettings(body);
  if (!valid) {
    return errorResponse(
      "Validation failed",
      Object.fromEntries(
        Object.entries(errors).map(([key, message]) => [key, [message]]),
      ),
      422,
    );
  }

  const settings = await upsertSettings(session.shop, parsed);
  return successResponse(settings, "Settings saved successfully");
};
