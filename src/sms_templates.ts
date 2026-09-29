import { z } from "zod";

export const templateRequest = z.object({
  tenantId: z.string().min(1),
  templateName: z.string().min(1),
  signature: z.string().min(2),
  purpose: z.enum(["onboarding", "account_lifecycle", "admin_operation"]),
  body: z.string().min(1)
});
export type TemplateRequest = z.infer<typeof templateRequest>;

export function approveTemplate(input: unknown) {
  const parsed = templateRequest.parse(input);
  const normalized = parsed.signature.trim();
  const approved = normalized.startsWith("[") && normalized.endsWith("]") && parsed.body.includes("{{code}}") === (parsed.purpose === "onboarding");
  return { ...parsed, signature: normalized, approved, reason: approved ? "policy_match" : "policy_mismatch" };
}
