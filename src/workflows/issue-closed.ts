import { debug } from "@actions/core";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createLinearComment } from "../handlers/create-linear-comment.js";
import { findLinearComment } from "../handlers/find-linear-comment.js";
import { setLinearStatus } from "../handlers/set-linear-status.js";

export const workflowIssueClosed = async (
	octokit: ReturnType<typeof getOctokit>,
	linear: LinearClient,
	{ githubRepo, githubIssueNumber, linearStatusClosed }: {
		githubRepo: { owner: string; repo: string };
		githubIssueNumber: number;
		linearStatusClosed: string;
	},
) => {
	debug("Finding Linear comment...");

	const linearIssueId = await findLinearComment(octokit, {
		githubIssueNumber,
		githubRepo,
	});

	debug("Closing Linear issue...");

	await setLinearStatus(linear, {
		linearIssueId,
		linearIssueStatus: linearStatusClosed,
	});

	await createLinearComment(linear, {
		linearIssueId,
		linearIssueBody: "Issue closed on GitHub",
	});
};
