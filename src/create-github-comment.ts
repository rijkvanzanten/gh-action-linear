import type { Issue } from "@linear/sdk";
import type { getOctokit } from "@actions/github";

export const createGithubComment = async (
	octokit: ReturnType<typeof getOctokit>,
	{ linearIssue, issue, repo }: {
		linearIssue: Issue;
		issue: number;
		repo: { owner: string; repo: string };
	},
) => {
	await octokit.rest.issues.createComment({
		...repo,
		issue_number: issue,
		body: `Linear: [${linearIssue.identifier}](${linearIssue.url})\n\n<!-- linear-issue-id: [${linearIssue.id}] -->`,
	});
};
