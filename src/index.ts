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

if (context.eventName === "issue" && context.payload.action === "created") {
	const issue = await getGithubIssue(octokit, {
		repo: context.repo,
		issue: context.payload.issue!.number,
	});

	await createLinearIssue(linear, linearTeamId, {
		title: issue.title,
		body: issue.body,
		githubUrl: issue.url,
	});
}

// if (context.eventName === "issue" && context.payload.action === "closed") {
// }
