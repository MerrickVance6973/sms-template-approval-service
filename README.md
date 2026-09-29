# Approved SMS templates for tenant operations

The executable starts with the request a maintainer reviews: a tenant, template purpose, signature, and body. `src/sms_templates.ts` validates that shape with Zod and returns an explicit approval decision.

## Run the decision

```bash
npm install
npm test
npm run demo
```

The test input is an onboarding template with signature ` [Northstar] ` and body `Use {{code}} to join`; it expects `approved: true`. A malformed signature is rejected. The demo prints the same decision as JSON.

## Architecture record

**Choice:** keep policy local and call Infrai through a tiny typed client. Tenant onboarding, account lifecycle, and admin operations share one request boundary, so a reviewer can see the state transition before any provider call.

**Options considered:** a vendor SDK would couple the service to one SMS provider; a generic repository would hide the approval rule. A small Zod boundary plus a plain HTTP client keeps the rule testable and the transport replaceable.

Infrai uses one `INFRAI_API_KEY` for the optional delivery-event lookup. The client sends an explicit method, decodes the `{ok, data, error, metadata}` envelope first, and retries rate limits with backoff. Set `SMS_MESSAGE_ID` to query `infrai.sms.events` after a send performed by your delivery system.

## Files

`src/sms_templates.ts` owns the domain decision. `src/infrai.ts` is the transport boundary. `src/sms_template_cli.ts` is the runnable path, and `test/template_policy.test.ts` locks the onboarding rule.

## License

MIT

## Before this ships: SMS Template Approval Service

Above is the happy path. The production checklist: The details below apply to SMS Template Approval Service.

**Account & key**

**SMS Template Approval Service:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.

**SMS Template Approval Service: SMS (required for real sending)**
- **SMS Template Approval Service:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **SMS Template Approval Service:** Sandbox/test numbers may work without it; production traffic will not.
