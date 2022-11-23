import { debug } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createGithubComment } from "../handlers/create-github-comment.js";
import { createLinearIssue } from "../handlers/create-linear-issue.js";
import { getGithubIssue } from "../handlers/get-github-issue.js";

export const workflowIssueOpened = async (
	octokit: ReturnType<typeof getOctokit>,
	linear: LinearClient,
	{ linearTeamId, linearStatusOpened }: {
		linearTeamId: string;
		linearStatusOpened: string;
	},
) => {
	debug("Getting GitHub Issue information...");

	const githubIssue = await getGithubIssue(octokit, {
		repo: context.repo,
		issue: context.payload.issue!.number,
	});

	debug("Creating Linear Issue...");

	const linearIssue = await createLinearIssue(linear, {
		team: linearTeamId,
		title: githubIssue.title,
		body: githubIssue.body,
		githubUrl: githubIssue.url,
		status: linearStatusOpened,
	});

	if (linearIssue) {
		debug("Posting GitHub Comment...");

		await createGithubComment(octokit, {
			linearIssue,
			repo: context.repo,
			issue: context.payload.issue!.number,
		});
	} else {
		debug("Linear issue not returned.");
	}
};
