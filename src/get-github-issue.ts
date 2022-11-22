import type { getOctokit } from "@actions/github";

export const getGithubIssue = async (
	octokit: ReturnType<typeof getOctokit>,
	{ repo, issue }: {
		repo: {
			owner: string;
			repo: string;
		};
		issue: number;
	},
) => {
	const { data: result } = await octokit.rest.issues.get({
		...repo,
		issue_number: issue,
	});

	return {
		url: result.url,
		title: result.title,
		body: result.body ?? "",
	};
};
