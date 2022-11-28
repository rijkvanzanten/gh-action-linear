import { debug } from "@actions/core";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createGithubComment } from "../handlers/create-github-comment.js";
import { createLinearIssue } from "../handlers/create-linear-issue.js";
import { getGithubIssue } from "../handlers/get-github-issue.js";
import { formatGithubComment } from "../handlers/format-github-comment.js";
import { formatLinearIssueDescription } from "../handlers/format-linear-issue-description.js";

export const workflowIssueOpened = async (
	octokit: ReturnType<typeof getOctokit>,
	linear: LinearClient,
	{ linearTeamId, linearStatusOpened, githubRepo, githubIssueNumber, linearIssueLabel }: {
		linearTeamId: string;
		linearIssueLabel: string | null;
		linearStatusOpened: string;
		githubRepo: {
			owner: string;
			repo: string;
		};
		githubIssueNumber: number;
	},
) => {
	debug("Getting GitHub Issue information...");

	const githubIssue = await getGithubIssue(octokit, {
		githubRepo,
		githubIssueNumber,
	});

	debug("Creating Linear Issue...");

	const linearIssue = await createLinearIssue(linear, {
		linearTeamId: linearTeamId,
		linearIssueStatus: linearStatusOpened,
		linearIssueTitle: githubIssue.title,
		linearIssueLabel,
		linearIssueDescription: formatLinearIssueDescription({
			githubIssueBody: githubIssue.body,
			githubIssueUrl: githubIssue.url,
			githubIssueAuthor: githubIssue.author,
		}),
	});

	debug("Posting GitHub Comment...");

	await createGithubComment(octokit, {
		githubCommentBody: formatGithubComment({
			linearIssueIdentifier: linearIssue.identifier,
			linearIssueId: linearIssue.id,
			linearIssueUrl: linearIssue.url,
		}),
		githubRepo,
		githubIssueNumber,
	});
};
