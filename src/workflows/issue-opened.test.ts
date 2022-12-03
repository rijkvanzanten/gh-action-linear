import { test, afterEach, vi, expect } from "vitest";
import { workflowIssueOpened } from "./issue-opened.js";
import type { getOctokit } from "@actions/github";
import type { LinearClient } from "@linear/sdk";

import { createGithubComment } from "../handlers/create-github-comment.js";
import { createLinearIssue } from "../handlers/create-linear-issue.js";
import { getGithubIssue } from "../handlers/get-github-issue.js";
import { formatGithubComment } from "../handlers/format-github-comment.js";
import { formatLinearIssueDescription } from "../handlers/format-linear-issue-description.js";

vi.mock("@actions/core");
vi.mock("../handlers/create-github-comment.js");
vi.mock("../handlers/create-linear-issue.js");
vi.mock("../handlers/get-github-issue.js");
vi.mock("../handlers/format-github-comment.js");
vi.mock("../handlers/format-linear-issue-description.js");

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
		author: "test-author",
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
		linearIssueLabel: null,
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
		author: "test-author",
	});

	vi.mocked(createLinearIssue).mockResolvedValueOnce({
		id: "test-linear-issue-id",
		identifier: "test-linear-issue-identifier",
		url: "test-linear-issue-url",
	});

	vi.mocked(formatLinearIssueDescription).mockReturnValueOnce(
		"test-linear-issue-description"
	);

	await workflowIssueOpened(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubRepo,
		githubIssueNumber,
		linearIssueLabel: null,
	});

	expect(createLinearIssue).toHaveBeenCalledWith(linear, {
		linearTeamId,
		linearIssueStatus: "test-linear-status-opened",
		linearIssueDescription: "test-linear-issue-description",
		linearIssueTitle: "test-title",
		linearIssueLabel: null,
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
		author: "test-author",
	});

	vi.mocked(createLinearIssue).mockResolvedValueOnce({
		id: "test-linear-issue-id",
		identifier: "test-linear-issue-identifier",
		url: "test-linear-issue-url",
	});

	vi.mocked(formatGithubComment).mockReturnValueOnce(
		"test-github-comment-body"
	);

	await workflowIssueOpened(octokit, linear, {
		linearTeamId,
		linearStatusOpened,
		githubRepo,
		githubIssueNumber,
		linearIssueLabel: null,
	});

	expect(createGithubComment).toHaveBeenCalledWith(linear, {
		githubIssueNumber: 123,
		githubRepo: {
			owner: "test-owner",
			repo: "test-repo",
		},
		githubCommentBody: "test-github-comment-body",
	});
});
