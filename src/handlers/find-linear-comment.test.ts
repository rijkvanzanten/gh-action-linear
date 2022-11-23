import type { getOctokit } from "@actions/github";
import { test, expect, vi, afterEach } from "vitest";
import { findLinearComment } from "./find-linear-comment.js";

afterEach(() => {
	vi.clearAllMocks();
});

test("Gets comments from GitHub", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [
						{
							user: {
								login: "github-actions[bot]",
								type: "Bot",
							},
							body: "<!-- linear-issue-id: [b640fdad-7578-4016-bc22-3509b354d691] -->",
						},
					],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	await findLinearComment(octokit, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
	});

	expect(octokit.rest.issues.listComments).toHaveBeenCalledWith({
		owner: "test-owner",
		repo: "test-repo",
		issue_number: 123,
		per_page: 100,
	});
});

test("Throws error if returned comments are empty", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	expect(
		findLinearComment(octokit, {
			githubIssueNumber: 123,
			githubRepo: {
				owner: "test-owner",
				repo: "test-repo",
			},
		}),
	).rejects.toBeInstanceOf(Error);
});

test("Throws error if none of the comments are by the right user", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [
						{
							user: {
								login: "incorrect",
								type: "Bot",
							},
							body: "<!-- linear-issue-id: [b640fdad-7578-4016-bc22-3509b354d691] -->",
						},
					],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	expect(
		findLinearComment(octokit, {
			githubIssueNumber: 123,
			githubRepo: {
				owner: "test-owner",
				repo: "test-repo",
			},
		}),
	).rejects.toBeInstanceOf(Error);
});

test("Throws error if none of the comments are by the right login type", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [
						{
							user: {
								login: "github-actions[bot]",
								type: "incorrect",
							},
							body: "<!-- linear-issue-id: [b640fdad-7578-4016-bc22-3509b354d691] -->",
						},
					],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	expect(
		findLinearComment(octokit, {
			githubIssueNumber: 123,
			githubRepo: {
				owner: "test-owner",
				repo: "test-repo",
			},
		}),
	).rejects.toBeInstanceOf(Error);
});

test("Throws error if none of the comments by gh-actions have a body", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [
						{
							user: {
								login: "github-actions[bot]",
								type: "incorrect",
							},
							body: "",
						},
					],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	expect(
		findLinearComment(octokit, {
			githubIssueNumber: 123,
			githubRepo: {
				owner: "test-owner",
				repo: "test-repo",
			},
		}),
	).rejects.toBeInstanceOf(Error);
});

test("Throws error if none of the comments by gh-actions have a body containing the linear UUID", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [
						{
							user: {
								login: "github-actions[bot]",
								type: "incorrect",
							},
							body: "incorrect value",
						},
					],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	expect(
		findLinearComment(octokit, {
			githubIssueNumber: 123,
			githubRepo: {
				owner: "test-owner",
				repo: "test-repo",
			},
		}),
	).rejects.toBeInstanceOf(Error);
});

test("Returns UUID found in Linear comment", async () => {
	const octokit = {
		rest: {
			issues: {
				listComments: vi.fn().mockResolvedValue({
					data: [
						{
							user: {
								login: "github-actions[bot]",
								type: "Bot",
							},
							body: "<!-- linear-issue-id: [b640fdad-7578-4016-bc22-3509b354d691] -->",
						},
					],
				}),
			},
		},
	} as unknown as ReturnType<typeof getOctokit>;

	const uuid = await findLinearComment(octokit, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
	});

	expect(uuid).toBe("b640fdad-7578-4016-bc22-3509b354d691");
});
