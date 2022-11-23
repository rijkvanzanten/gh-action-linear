import type { LinearClient } from "@linear/sdk";

export const createLinearComment = async (
	linear: LinearClient,
	{ linearIssueId, linearIssueBody }: {
		linearIssueId: string;
		linearIssueBody: string;
	},
) => {
	await linear.commentCreate({
		issueId: linearIssueId,
		body: linearIssueBody,
	});
};
