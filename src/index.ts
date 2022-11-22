import { getOctokit, context } from "@actions/github";
import { getInput } from "@actions/core";
import { LinearClient } from "@linear/sdk";

import { getGithubIssue } from "./get-github-issue.js";
import { createLinearIssue } from "./create-linear-issue.js";

const githubToken = getInput("github-token");
const linearApiKey = getInput("linear-api-key");
const linearTeamId = getInput("linear-team-id");

const octokit = getOctokit(githubToken);
const linear = new LinearClient({ apiKey: linearApiKey });

console.log(
	`Running for action "${context.payload.action}" in event "${context.eventName}"...`,
);

if (context.eventName === "issues" && context.payload.action === "opened") {
	console.log("Getting GitHub Issue information...");
	const issue = await getGithubIssue(octokit, {
		repo: context.repo,
		issue: context.payload.issue!.number,
	});

	console.log("Creating Linear Issue...");
	await createLinearIssue(linear, linearTeamId, {
		title: issue.title,
		body: issue.body,
		githubUrl: issue.url,
	});

	console.log("[TODO] Posting GitHub Comment...");
} else {
	console.log(
		`No event handler for action "${context.payload.action}" in event "${context.eventName}"`,
	);
}

console.log("Done!");

// if (context.eventName === "issue" && context.payload.action === "closed") {
// }
