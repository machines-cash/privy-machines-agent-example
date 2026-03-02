import { randomUUID } from "node:crypto";

export class MachinesClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || process.env.MACHINES_API_BASE_URL || "https://api.machines.cash").replace(/\/$/, "");
    this.userApiKey = options.userApiKey || process.env.MACHINES_USER_API_KEY;

    if (!this.userApiKey) {
      throw new Error("MACHINES_USER_API_KEY is required");
    }
  }

  async request(method, path, body, idempotencyKey = null) {
    const headers = {
      "content-type": "application/json",
      "x-user-key": this.userApiKey,
    };

    if (idempotencyKey) {
      headers["idempotency-key"] = idempotencyKey;
    }

    const response = await fetch(`${this.baseUrl}/user/v1${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const summary = payload?.summary || payload?.message || payload?.error || `request failed (${response.status})`;
      throw new Error(summary);
    }

    return payload;
  }

  createDisposableProposal(input) {
    return this.request(
      "POST",
      "/cards/disposable/proposals",
      {
        amountCents: input.amountCents,
        currency: input.currency || "USD",
        limitFrequency: input.limitFrequency || "perAuthorization",
        autoCancelAfterAuth: input.autoCancelAfterAuth ?? true,
      },
      input.idempotencyKey || randomUUID(),
    );
  }

  executeDisposable(input) {
    return this.request(
      "POST",
      "/cards/disposable/execute",
      {
        proposalId: input.proposalId,
      },
      input.idempotencyKey || randomUUID(),
    );
  }

  listTransactions(limit = 5) {
    const query = new URLSearchParams({ limit: String(limit) });
    return this.request("GET", `/transactions?${query.toString()}`);
  }
}
