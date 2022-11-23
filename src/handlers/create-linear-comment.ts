import type { LinearClient } from "@linear/sdk";

export const createLinearComment = async (
	linear: LinearClient,
	{ linearIssueId, comment }: { linearIssueId: string; comment: string },
) => {
	await linear.commentCreate({
		issueId: linearIssueId,
		body: comment,
	});
};
