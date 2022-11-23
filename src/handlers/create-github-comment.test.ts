import { expect, test, vi, afterEach } from "vitest";
import { createGithubComment } from "./create-github-comment.js";
import type { getOctokit } from "@actions/github";

afterEach(() => {
	vi.clearAllMocks();
});

test("Calls octokit createComment with Linear formatted body", async () => {
	const octokit = {
		rest: {
			issues: {
				createComment: vi.fn(),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	await createGithubComment(octokit, {
		linearIssueIdentifier: "TEST-1",
		linearIssueId: "test-linear-issue-id",
		linearIssueUrl: "test-linear-issue-url",
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
	});

	expect(octokit.rest.issues.createComment).toHaveBeenCalledWith({
		owner: "test-owner",
		repo: "test-repo",
		issue_number: 123,
		body: "Linear: [TEST-1](test-linear-issue-url)\n\n<!-- linear-issue-id: [test-linear-issue-id] -->",
	});
});
