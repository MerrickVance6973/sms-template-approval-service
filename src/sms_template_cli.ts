import { approveTemplate } from "./sms_templates.js";
import { infrai } from "./infrai.js";

const input = { tenantId: "acme", templateName: "welcome-code", signature: "[Acme]", purpose: "onboarding" as const, body: "Your code is {{code}}" };
const decision = approveTemplate(input);
console.log(JSON.stringify(decision));
const messageId = process.env.SMS_MESSAGE_ID;
if (messageId && process.env.INFRAI_API_KEY) console.log(await infrai.sms.events(messageId));
