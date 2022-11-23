import type { LinearClient } from "@linear/sdk";

export const createLinearIssue = async (
	linear: LinearClient,
	{ githubUrl, title, body, team, status }: {
		team: string;
		githubUrl: string;
		title: string;
		body: string;
		status: string;
	},
) => {
	const response = await linear.issueCreate({
		title,
		teamId: team,
		description: `${body}\n\n[View original issue on GitHub](${githubUrl})`,
		stateId: status,
	});

	return await response.issue;
};
