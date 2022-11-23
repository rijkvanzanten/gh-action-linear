import type { LinearClient } from "@linear/sdk";

export const createLinearComment = async (
	linear: LinearClient,
	{ linearIssueId, linearIssueComment }: {
		linearIssueId: string;
		linearIssueComment: string;
	},
) => {
	await linear.commentCreate({
		issueId: linearIssueId,
		body: linearIssueComment,
	});
};
