import { debug, getInput } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { LinearClient } from "@linear/sdk";

import { workflowIssueClosed } from "./workflows/issue-closed.js";
import { workflowIssueOpened } from "./workflows/issue-opened.js";
import { workflowIssueReopened } from "./workflows/issue-reopened.js";

const githubToken = getInput("github-token");
const linearApiKey = getInput("linear-api-key");
const linearTeamId = getInput("linear-team-id");
const linearStatusOpened = getInput("linear-status-opened");
const linearStatusClosed = getInput("linear-status-closed");
const linearStatusReopened = getInput("linear-status-reopened");
const linearIssueLabel = getInput('linear-issue-label') as string | null;

const githubIssueNumber = context.payload.issue?.number;
const githubRepo = context.repo;

const octokit = getOctokit(githubToken);
const linear = new LinearClient({ apiKey: linearApiKey });

debug(`Running for action "${context.payload.action}" in event "${context.eventName}"...`);

if (context.eventName === "issues" && context.payload.action === "opened" && githubIssueNumber) {
	await workflowIssueOpened(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubIssueNumber,
		githubRepo,
		linearIssueLabel
	});
} else if (context.eventName === "issues" && context.payload.action === "closed" && githubIssueNumber) {
	await workflowIssueClosed(octokit, linear, {
		linearStatusClosed,
		githubRepo,
		githubIssueNumber,
	});
} else if (context.eventName === "issues" && context.payload.action === "reopened" && githubIssueNumber) {
	await workflowIssueReopened(octokit, linear, {
		linearStatusReopened,
		githubIssueNumber,
		githubRepo,
	});
} else {
	debug(`No event handler for action "${context.payload.action}" in event "${context.eventName}".`);
}

debug("Done!");
