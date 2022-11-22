import type { LinearClient } from "@linear/sdk";

export const createLinearIssue = async (
	linear: LinearClient,
	linearTeam: string,
	{ githubUrl, title, body }: {
		githubUrl: string;
		title: string;
		body: string;
	},
) => {
	await linear.issueCreate({
		title,
		teamId: linearTeam,
		description: `${body}\n\n[View original issue on GitHub](${githubUrl})`,
	});
};
