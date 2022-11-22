import { getOctokit, context } from "@actions/github";
import { getInput } from "@actions/core";
// import { LinearClient } from "@linear/sdk";

import { getIssue } from "./get-issue.js";

const githubToken = getInput("github-token");
// const linearApiKey = getInput("linear-api-key");
// const linearTeamId = getInput("linear-team-id");

const octokit = getOctokit(githubToken);
// const linear = new LinearClient({ apiKey: linearApiKey });

if (context.eventName === "issue") {
	const issue = await getIssue(octokit, {
		repo: context.repo,
		issue: context.payload.issue!.number,
	});

	console.log(issue);
}
