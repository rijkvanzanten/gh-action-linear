import type { LinearClient } from "@linear/sdk";

export const createLinearIssue = async (
	linear: LinearClient,
	{ githubUrl, title, body, team }: {
		team: string;
		githubUrl: string;
		title: string;
		body: string;
	},
) => {
	const response = await linear.issueCreate({
		title,
		teamId: team,
		description: `${body}\n\n[View original issue on GitHub](${githubUrl})`,
	});

	return await response.issue;
};
