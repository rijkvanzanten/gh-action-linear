import { test, afterEach, vi, expect } from "vitest";
import { workflowIssueOpened } from "./issue-opened.js";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createGithubComment } from "../handlers/create-github-comment.js";
import { createLinearIssue } from "../handlers/create-linear-issue.js";
import { getGithubIssue } from "../handlers/get-github-issue.js";

vi.mock("@actions/core");
vi.mock("../handlers/create-github-comment.js");
vi.mock("../handlers/create-linear-issue.js");
vi.mock("../handlers/get-github-issue.js");

afterEach(() => {
	vi.clearAllMocks();
});

test("Gets GitHub Issue information", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearTeamId = "test-linear-team-id";
	const linearStatusOpened = "test-linear-status-opened";

	vi.mocked(getGithubIssue).mockResolvedValueOnce({
		url: "test-url",
		title: "test-title",
		body: "test-body",
	});

	vi.mocked(createLinearIssue).mockResolvedValueOnce({
		id: "test-linear-issue-id",
		identifier: "test-linear-issue-identifier",
		url: "test-linear-issue-url",
	});

	await workflowIssueOpened(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubRepo,
		githubIssueNumber,
	});

	expect(getGithubIssue).toHaveBeenCalledWith(octokit, {
		githubRepo,
		githubIssueNumber,
	});
});

test("Creates Linear issue", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearTeamId = "test-linear-team-id";
	const linearStatusOpened = "test-linear-status-opened";

	vi.mocked(getGithubIssue).mockResolvedValueOnce({
		url: "test-url",
		title: "test-title",
		body: "test-body",
	});

	vi.mocked(createLinearIssue).mockResolvedValueOnce({
		id: "test-linear-issue-id",
		identifier: "test-linear-issue-identifier",
		url: "test-linear-issue-url",
	});

	await workflowIssueOpened(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubRepo,
		githubIssueNumber,
	});

	expect(createLinearIssue).toHaveBeenCalledWith(linear, {
		linearTeamId,
		linearIssueStatus: "test-linear-status-opened",
		githubIssueTitle: "test-title",
		githubIssueBody: "test-body",
		githubIssueUrl: "test-url",
	});
});

test("Creates GitHub Comment", async () => {
	const octokit = {} as ReturnType<typeof getOctokit>;
	const linear = {} as LinearClient;

	const githubRepo = {
		owner: "test-owner",
		repo: "test-repo",
	};
	const githubIssueNumber = 123;
	const linearTeamId = "test-linear-team-id";
	const linearStatusOpened = "test-linear-status-opened";

	vi.mocked(getGithubIssue).mockResolvedValueOnce({
		url: "test-url",
		title: "test-title",
		body: "test-body",
	});

	vi.mocked(createLinearIssue).mockResolvedValueOnce({
		id: "test-linear-issue-id",
		identifier: "test-linear-issue-identifier",
		url: "test-linear-issue-url",
	});

	await workflowIssueOpened(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubRepo,
		githubIssueNumber,
	});

	expect(createGithubComment).toHaveBeenCalledWith(linear, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		linearIssueId: "test-linear-issue-id",
		linearIssueIdentifier: "test-linear-issue-identifier",
		linearIssueUrl: "test-linear-issue-url",
	});
});
