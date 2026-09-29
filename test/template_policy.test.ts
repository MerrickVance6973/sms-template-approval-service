import assert from "node:assert/strict";
import { approveTemplate } from "../src/sms_templates.js";

const result = approveTemplate({ tenantId: "t1", templateName: "invite", signature: " [Northstar] ", purpose: "onboarding", body: "Use {{code}} to join" });
assert.equal(result.approved, true);
assert.equal(result.signature, "[Northstar]");
assert.equal(approveTemplate({ tenantId: "t1", templateName: "alert", signature: "Northstar", purpose: "admin_operation", body: "Action recorded" }).approved, false);
console.log("template policy checks passed");
