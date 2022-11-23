import type { LinearClient } from "@linear/sdk";

export const setLinearStatus = async (
	linear: LinearClient,
	{ linearIssueId, status }: { linearIssueId: string; status: string },
) => {
	await linear.issueUpdate(linearIssueId, { stateId: status });
};
