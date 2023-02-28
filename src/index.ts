import { debug, getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { LinearClient } from "@linear/sdk";

import { workflowIssueClosed } from "./workflows/issue-closed.js";
import { workflowRepositoryDispatch } from "./workflows/repository-dispatch.js";
import { workflowIssueReopened } from "./workflows/issue-reopened.js";

const githubToken = getInput("github-token");
const linearApiKey = getInput("linear-api-key");
const linearTeamId = getInput("linear-team-id");
const linearStatusOpened = getInput("linear-status-opened");
const linearStatusClosed = getInput("linear-status-closed");
const linearStatusReopened = getInput("linear-status-reopened");
const linearIssueLabel =
	getInput("linear-issue-label") || (null as string | null);

const octokit = getOctokit(githubToken);
const linear = new LinearClient({ apiKey: linearApiKey });

debug(
	`Running for action "${context.payload.action}" in event "${context.eventName}"...`
);

if (context.eventName === "repository_dispatch") {
	console.log(context.payload);

	const githubRepoRaw = getInput("github-repo");
	const githubIssueNumberRaw = getInput("github-issue");

	if (!githubRepoRaw) {
		throw new Error("No GitHub repo given.");
	}

	if (!githubIssueNumberRaw) {
		throw new Error("No GitHub Issue given.");
	}

	const owner = githubRepoRaw.split("/")[0];
	const repo = githubRepoRaw.split("/")[1];

	if (!owner || !repo) {
		throw new Error("Owner or repo missing");
	}

	const githubRepo = { owner, repo };

	const githubIssueNumber = Number(githubIssueNumberRaw);

	await workflowRepositoryDispatch(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubIssueNumber,
		githubRepo,
		linearIssueLabel,
	});
} else if (
	context.eventName === "issues" &&
	context.payload.action === "closed"
) {
	const githubRepo = context.repo;
	const githubIssueNumber = context.payload.issue?.number;

	if (!githubIssueNumber) {
		throw new Error("No GitHub Issue given.");
	}

	await workflowIssueClosed(octokit, linear, {
		linearStatusClosed,
		githubRepo,
		githubIssueNumber,
	});
} else if (
	context.eventName === "issues" &&
	context.payload.action === "reopened"
) {
	const githubRepo = context.repo;
	const githubIssueNumber = context.payload.issue?.number;

	if (!githubIssueNumber) {
		throw new Error("No GitHub Issue given.");
	}

	await workflowIssueReopened(octokit, linear, {
		linearStatusReopened,
		githubIssueNumber,
		githubRepo,
	});
} else {
	debug(
		`No event handler for action "${context.payload.action}" in event "${context.eventName}".`
	);
}

debug("Done!");
