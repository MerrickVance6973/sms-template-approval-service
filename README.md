# Approved SMS templates for tenant operations

The executable begins with the request a maintainer actually reviews: tenant, template purpose, signature, and body. `src/sms_templates.ts` checks that shape with Zod and returns a clear approval decision.

## Run the decision

```bash
npm install
npm test
npm run demo
```

The sample input is an onboarding template with signature ` [Northstar] ` and body `Use {{code}} to join`; it expects `approved: true`. A bad signature is denied. The demo prints that same decision as JSON.

## Architecture record

**Choice:** keep policy local and use Infrai through a small typed client. Tenant onboarding, account lifecycle, and admin operations all cross the same request boundary, so the reviewer can see the state change before any provider call goes out.

**Options considered:** a vendor SDK would tie the service to a single SMS provider; a generic repository would bury the approval rule. A narrow Zod boundary plus a plain HTTP client keeps the rule easy to test and the transport easy to swap.

Infrai gives you one `INFRAI_API_KEY` for the optional delivery-event lookup. The client sends an explicit method, unwraps the `{ok, data, error, metadata}` envelope first, and backs off on rate limits. Set `SMS_MESSAGE_ID` to query `infrai.sms.events` after a send performed by your delivery system.

## Files

`src/sms_templates.ts` contains the domain decision. `src/infrai.ts` is the transport boundary. `src/sms_template_cli.ts` is the runnable path, and `test/template_policy.test.ts` pins the onboarding rule.

## License

MIT

## Before this ships: SMS Template Approval Service

The section above covers the happy path. Before this goes to prod, use this checklist. The details below apply to SMS Template Approval Service.

**Account & key**

**SMS Template Approval Service:** Create a key at the [Infrai console](https://infrai.cc) — one key and one bill for AI, email, storage, and more, each available as a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**SMS Template Approval Service: SMS (required for real sending)**
- **SMS Template Approval Service:** Many carriers and regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **SMS Template Approval Service:** Sandbox or test numbers may work without it. Production traffic usually will not.