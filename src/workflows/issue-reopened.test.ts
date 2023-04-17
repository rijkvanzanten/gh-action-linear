import { test, afterEach, vi, expect } from "vitest";
import { workflowIssueReopened } from "./issue-reopened.js";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

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

test("Finds Linear ID from GitHub comment", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearStatusReopened = "test-linear-status-opened";

	vi.mocked(findLinearComment).mockResolvedValueOnce("test-linear-issue-id");

	await workflowIssueReopened(octokit, linear, {
		githubIssueNumber,
		githubRepo,
		linearStatusReopened,
	});

	expect(findLinearComment).toHaveBeenCalledWith(octokit, {
		githubIssueNumber,
		githubRepo,
	});
});

test("Finds no Linear ID from GitHub comment", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearStatusReopened = "test-linear-status-opened";

	vi.mocked(findLinearComment).mockRejectedValueOnce(new Error("Not found"));

	await workflowIssueReopened(octokit, linear, {
		githubIssueNumber,
		githubRepo,
		linearStatusReopened,
	});

	expect(setLinearStatus).not.toBeCalled();
	expect(createLinearComment).not.toBeCalled();
});

test("Sets Linear Issue status", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearStatusReopened = "test-linear-status-opened";
	const linearIssueId = "test-linear-issue-id";

	vi.mocked(findLinearComment).mockResolvedValueOnce(linearIssueId);

	await workflowIssueReopened(octokit, linear, {
		githubIssueNumber,
		githubRepo,
		linearStatusReopened,
	});

	expect(setLinearStatus).toHaveBeenCalledWith(linear, {
		linearIssueId,
		linearIssueStatus: linearStatusReopened,
	});
});

test("Creates comment on Linear Issue", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearStatusReopened = "test-linear-status-opened";
	const linearIssueId = "test-linear-issue-id";

	vi.mocked(findLinearComment).mockResolvedValueOnce(linearIssueId);

	await workflowIssueReopened(octokit, linear, {
		githubIssueNumber,
		githubRepo,
		linearStatusReopened,
	});

	expect(createLinearComment).toHaveBeenCalledWith(linear, {
		linearIssueId,
		linearIssueBody: "Issue reopened on GitHub",
	});
});
