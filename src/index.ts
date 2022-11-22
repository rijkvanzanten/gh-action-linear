import { getOctokit, context } from "@actions/github";
import { getInput } from "@actions/core";
import { LinearClient } from "@linear/sdk";

import { getGithubIssue } from "./get-github-issue.js";
import { createLinearIssue } from "./create-linear-issue.js";
import { createGithubComment } from "./create-github-comment.js";

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
	const githubIssue = await getGithubIssue(octokit, {
		repo: context.repo,
		issue: context.payload.issue!.number,
	});

	console.log("Creating Linear Issue...");
	const linearIssue = await createLinearIssue(linear, {
		team: linearTeamId,
		title: githubIssue.title,
		body: githubIssue.body,
		githubUrl: githubIssue.url,
	});

	if (linearIssue) {
		console.log("Posting GitHub Comment...");
		await createGithubComment(octokit, {
			linearIssue,
			repo: context.repo,
			issue: context.payload.issue!.number,
		});
	} else {
		console.log("Linear issue not returned.");
	}
} else {
	console.log(
		`No event handler for action "${context.payload.action}" in event "${context.eventName}".`,
	);
}

console.log("Done!");

// if (context.eventName === "issue" && context.payload.action === "closed") {
// }
