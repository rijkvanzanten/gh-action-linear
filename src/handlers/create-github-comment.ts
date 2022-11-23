import type { Issue } from "@linear/sdk";
import type { getOctokit } from "@actions/github";

export const createGithubComment = async (
	octokit: ReturnType<typeof getOctokit>,
	{
		linearIssueIdentifier,
		linearIssueId,
		linearIssueUrl,
		githubIssueNumber,
		githubRepo,
	}: {
		linearIssueIdentifier: Issue["identifier"];
		linearIssueId: Issue["id"];
		linearIssueUrl: Issue["url"];
		githubIssueNumber: number;
		githubRepo: { owner: string; repo: string };
	},
) => {
	await octokit.rest.issues.createComment({
		...githubRepo,
		issue_number: githubIssueNumber,
		body: `Linear: [${linearIssueIdentifier}](${linearIssueUrl})\n\n<!-- linear-issue-id: [${linearIssueId}] -->`,
	});
};
