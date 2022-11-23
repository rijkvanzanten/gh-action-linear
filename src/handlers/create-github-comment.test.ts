import type { getOctokit } from "@actions/github";
import { afterEach, expect, test, vi } from "vitest";
import { createGithubComment } from "./create-github-comment.js";

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
		githubCommentBody: "test-github-comment-body",
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
		body: "test-github-comment-body",
	});
});
