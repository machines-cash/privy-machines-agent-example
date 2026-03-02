import { MachinesClient } from "./machines-client.mjs";

const amountCents = Number(process.env.DISPOSABLE_AMOUNT_CENTS || 5000);

if (!Number.isFinite(amountCents) || amountCents <= 0) {
  throw new Error("DISPOSABLE_AMOUNT_CENTS must be a positive integer");
}

const client = new MachinesClient();

console.log(`creating disposable proposal for $${(amountCents / 100).toFixed(2)}...`);
const proposalResult = await client.createDisposableProposal({ amountCents });
const proposal = proposalResult?.disposable || proposalResult?.data?.disposable || proposalResult?.data || null;
const proposalId = proposal?.proposalId || proposal?.id;

if (!proposalId) {
  throw new Error("proposalId missing in response");
}

console.log(`proposal created: ${proposalId}`);
console.log("executing proposal...");

const executeResult = await client.executeDisposable({ proposalId });
const disposable = executeResult?.disposable || executeResult?.data?.disposable || null;
const card = executeResult?.card || executeResult?.data?.card || null;

const cardLabel = card?.name || "disposable card";
const cardLast4 = card?.last4 ? `•••• ${card.last4}` : "(last4 unavailable)";

console.log(`card ready: ${cardLabel} ${cardLast4}`);
console.log("next: use your normal checkout flow to pay with this disposable card.");
console.log("polling recent transactions...");

const txResult = await client.listTransactions(5);
const txs = txResult?.transactions || txResult?.data?.transactions || [];

if (!Array.isArray(txs) || txs.length === 0) {
  console.log("no transactions yet.");
} else {
  for (const tx of txs.slice(0, 5)) {
    const amount = typeof tx?.amount === "number" ? tx.amount : tx?.displayAmount || "-";
    const merchant = tx?.merchant || tx?.merchantName || tx?.description || "unknown";
    const status = tx?.status || "unknown";
    console.log(`- ${merchant} | ${amount} | ${status}`);
  }
}

if (disposable?.status) {
  console.log(`disposable status: ${disposable.status}`);
}
