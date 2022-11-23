import type { getOctokit } from "@actions/github";

export const createGithubComment = async (
	octokit: ReturnType<typeof getOctokit>,
	{ githubCommentBody, githubIssueNumber, githubRepo }: {
		githubCommentBody: string;
		githubIssueNumber: number;
		githubRepo: { owner: string; repo: string };
	},
) => {
	await octokit.rest.issues.createComment({
		...githubRepo,
		issue_number: githubIssueNumber,
		body: githubCommentBody,
	});
};
