import type { getOctokit } from "@actions/github";

export const getGithubIssue = async (
	octokit: ReturnType<typeof getOctokit>,
	{ githubRepo, githubIssueNumber }: {
		githubRepo: {
			owner: string;
			repo: string;
		};
		githubIssueNumber: number;
	},
) => {
	const { data: result } = await octokit.rest.issues.get({
		...githubRepo,
		issue_number: githubIssueNumber,
	});

	return {
		url: result.html_url,
		title: result.title,
		body: result.body || "--",
		author: result.user!.login,
	};
};
