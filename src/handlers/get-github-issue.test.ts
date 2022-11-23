import type { getOctokit } from "@actions/github";
import { expect, test, vi } from "vitest";
import { getGithubIssue } from "./get-github-issue.js";

test("Gets issue by passed number from GitHub", async () => {
	const octokit = {
		rest: {
			issues: {
				get: vi.fn().mockResolvedValue({
					data: {
						html_url: "test-github-url",
						title: "test-github-title",
						user: {
							login: "test-author",
						},
					},
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	await getGithubIssue(octokit, {
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		githubIssueNumber: 123,
	});

	expect(octokit.rest.issues.get).toHaveBeenCalledWith({
		owner: "test-owner",
		repo: "test-repo",
		issue_number: 123,
	});
});

test("Returns url, title, and body from issue", async () => {
	const octokit = {
		rest: {
			issues: {
				get: vi.fn().mockResolvedValue({
					data: {
						html_url: "test-github-url",
						title: "test-github-title",
						body: "test-github-body",
						user: {
							login: "test-author",
						},
					},
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	const result = await getGithubIssue(octokit, {
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		githubIssueNumber: 123,
	});

	expect(result).toStrictEqual({
		url: "test-github-url",
		title: "test-github-title",
		body: "test-github-body",
		author: "test-author",
	});
});

test("Defaults to empty string if body is undefined", async () => {
	const octokit = {
		rest: {
			issues: {
				get: vi.fn().mockResolvedValue({
					data: {
						html_url: "test-github-url",
						title: "test-github-title",
						user: {
							login: "test-author",
						},
					},
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	const result = await getGithubIssue(octokit, {
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		githubIssueNumber: 123,
	});

	expect(result).toStrictEqual({
		url: "test-github-url",
		title: "test-github-title",
		body: "",
		author: "test-author",
	});
});
