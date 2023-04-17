import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";
import { expect, test, vi, afterEach } from "vitest";
import { workflowIssueClosed } from "./issue-closed.js";

import { createLinearComment } from "../handlers/create-linear-comment.js";
import { findLinearComment } from "../handlers/find-linear-comment.js";
import { setLinearStatus } from "../handlers/set-linear-status.js";

vi.mock("@actions/core");
vi.mock("../handlers/create-linear-comment.js");
vi.mock("../handlers/find-linear-comment.js");
vi.mock("../handlers/set-linear-status.js");

afterEach(() => {
	vi.clearAllMocks();
});

test("Gets linear issue id", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	await workflowIssueClosed(octokit, linear, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		linearStatusClosed: "test-linear-status-closed",
	});

	expect(findLinearComment).toHaveBeenCalledWith(octokit, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
	});
});

test("Gets no linear issue id", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	vi.mocked(findLinearComment).mockRejectedValueOnce(new Error("Not found"));

	await workflowIssueClosed(octokit, linear, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		linearStatusClosed: "test-linear-status-closed",
	});

	expect(setLinearStatus).not.toHaveBeenCalled();
	expect(createLinearComment).not.toHaveBeenCalled();
});

test("Sets linear status to closed", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	vi.mocked(findLinearComment).mockResolvedValueOnce("test-linear-issue-id");

	await workflowIssueClosed(octokit, linear, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		linearStatusClosed: "test-linear-status-closed",
	});

	expect(setLinearStatus).toHaveBeenCalledWith(linear, {
		linearIssueId: "test-linear-issue-id",
		linearIssueStatus: "test-linear-status-closed",
	});
});

test("Creates comment on Linear", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	vi.mocked(findLinearComment).mockResolvedValueOnce("test-linear-issue-id");

	await workflowIssueClosed(octokit, linear, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		linearStatusClosed: "test-linear-status-closed",
	});

	expect(createLinearComment).toHaveBeenCalledWith(linear, {
		linearIssueId: "test-linear-issue-id",
		linearIssueBody: "Issue closed on GitHub",
	});
});
