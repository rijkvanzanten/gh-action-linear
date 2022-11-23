import { debug } from "@actions/core";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createLinearComment } from "../handlers/create-linear-comment.js";
import { findLinearComment } from "../handlers/find-linear-comment.js";
import { setLinearStatus } from "../handlers/set-linear-status.js";

export const workflowIssueReopened = async (
	octokit: ReturnType<typeof getOctokit>,
	linear: LinearClient,
	{ githubIssueNumber, githubRepo, linearStatusReopened }: {
		githubIssueNumber: number;
		githubRepo: { owner: string; repo: string };
		linearStatusReopened: string;
	},
) => {
	debug("Finding Linear comment...");

	const linearIssueId = await findLinearComment(octokit, {
		githubIssueNumber,
		githubRepo,
	});

	debug("Reopening Linear issue...");

	await setLinearStatus(linear, {
		linearIssueId,
		status: linearStatusReopened,
	});

	await createLinearComment(linear, {
		linearIssueId,
		comment: "Issue reopened on GitHub",
	});
};
