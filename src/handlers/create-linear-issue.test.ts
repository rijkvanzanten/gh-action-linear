import type { LinearClient } from "@linear/sdk";
import { afterEach, expect, test, vi } from "vitest";
import { createLinearIssue } from "./create-linear-issue.js";

afterEach(() => {
	vi.clearAllMocks();
});

test("Calls issue create with passed params", async () => {
	const linear = {
		issueCreate: vi.fn().mockResolvedValue({
			issue: vi.fn().mockResolvedValue({}),
		}),
	} as unknown as LinearClient;

	await createLinearIssue(linear, {
		linearIssueDescription: "test-linear-issue-description",
		linearIssueStatus: "test-linear-issue-status",
		linearIssueTitle: "test-linear-issue-title",
		linearTeamId: "test-linear-team-id",
	});

	expect(linear.issueCreate).toHaveBeenCalledWith({
		description: "test-linear-issue-description",
		stateId: "test-linear-issue-status",
		teamId: "test-linear-team-id",
		title: "test-linear-issue-title",
	});
});
