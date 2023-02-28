import { debug } from "@actions/core";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createGithubComment } from "../handlers/create-github-comment.js";
import { createLinearIssue } from "../handlers/create-linear-issue.js";
import { getGithubIssue } from "../handlers/get-github-issue.js";
import { formatGithubComment } from "../handlers/format-github-comment.js";

export const workflowRepositoryDispatch = async (
	octokit: ReturnType<typeof getOctokit>,
	linear: LinearClient,
	{
		linearTeamId,
		linearStatusOpened,
		githubRepo,
		githubIssueNumber,
		linearIssueLabel,
	}: {
		linearTeamId: string;
		linearIssueLabel: string | null;
		linearStatusOpened: string;
		githubRepo: {
			owner: string;
			repo: string;
		};
		githubIssueNumber: number;
	}
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
		linearIssueDescription: githubIssue.body,
		linearIssueCreateAsUser: `@${githubIssue.author}`,
		linearAttachmentTitle: githubIssue.title,
		linearAttachmentSubtitle: `${githubRepo.owner}/${githubRepo.repo} • #${githubIssueNumber}`,
		linearAttachmentUrl: githubIssue.url,
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
