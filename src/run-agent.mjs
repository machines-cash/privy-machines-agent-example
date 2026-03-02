import { MachinesClient } from "./machines-client.mjs";

const client = new MachinesClient();

console.log("running simple agent action...");

const proposal = await client.createDisposableProposal({ amountCents: 2000 });
const proposalId = proposal?.disposable?.proposalId || proposal?.data?.disposable?.proposalId;

if (!proposalId) {
  throw new Error("proposalId missing in response");
}

const execution = await client.executeDisposable({ proposalId });
const card = execution?.card || execution?.data?.card || null;

if (card?.last4) {
  console.log(`done: created disposable card ending in ${card.last4}`);
} else {
  console.log("done: proposal executed");
}
