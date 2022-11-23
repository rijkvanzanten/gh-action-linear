import type { LinearClient } from "@linear/sdk";

export const createLinearIssue = async (
	linear: LinearClient,
	{
		githubIssueUrl,
		linearTeamId,
		githubIssueBody,
		linearIssueStatus,
		githubIssueTitle,
	}: {
		linearTeamId: string;
		githubIssueUrl: string;
		githubIssueTitle: string;
		githubIssueBody: string;
		linearIssueStatus: string;
	},
) => {
	const response = await linear.issueCreate({
		title: githubIssueTitle,
		teamId: linearTeamId,
		description: `${githubIssueBody}\n\n[View original issue on GitHub](${githubIssueUrl})`,
		stateId: linearIssueStatus,
	});

	const issue = await response.issue;

	if (!issue) {
		throw new Error(`Couldn't extract Linear issue information.`);
	}

	const { id, identifier, url } = issue;

	return { id, identifier, url };
};
