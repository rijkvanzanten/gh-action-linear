import type { LinearClient } from "@linear/sdk";

export const createLinearIssue = async (
	linear: LinearClient,
	{
		linearIssueDescription,
		linearIssueStatus,
		linearIssueTitle,
		linearTeamId,
		linearIssueLabel
	}: {
		linearIssueDescription: string;
		linearIssueStatus: string;
		linearIssueTitle: string;
		linearTeamId: string;
		linearIssueLabel: string | null;
	},
) => {
	const response = await linear.issueCreate({
		description: linearIssueDescription,
		stateId: linearIssueStatus,
		teamId: linearTeamId,
		title: linearIssueTitle,
		labelIds: linearIssueLabel ? [linearIssueLabel] : [],
	});

	const issue = await response.issue;

	if (!issue) {
		throw new Error(`Couldn't extract Linear issue information.`);
	}

	const { id, identifier, url } = issue;

	return { id, identifier, url };
};
