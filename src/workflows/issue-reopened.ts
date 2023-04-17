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

	let linearIssueId;

	try {
		linearIssueId = await findLinearComment(octokit, {
			githubIssueNumber,
			githubRepo,
		});
	} catch {
		debug("Linear comment not found, skip reopening Linear issue...");
		return;
	}

	debug("Reopening Linear issue...");

	await setLinearStatus(linear, {
		linearIssueId,
		linearIssueStatus: linearStatusReopened,
	});

	await createLinearComment(linear, {
		linearIssueId,
		linearIssueBody: "Issue reopened on GitHub",
	});
};
