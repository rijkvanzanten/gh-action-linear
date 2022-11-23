import type { LinearClient } from "@linear/sdk";
import { expect, test, vi } from "vitest";
import { setLinearStatus } from "./set-linear-status.js";

test("Calls linear issueUpdate with passed status", async () => {
	const linear = {
		issueUpdate: vi.fn(),
	} as unknown as LinearClient;

	await setLinearStatus(linear, {
		linearIssueId: "test-linear-issue-id",
		linearIssueStatus: "test-linear-issue-status",
	});

	expect(linear.issueUpdate).toHaveBeenCalledWith("test-linear-issue-id", {
		stateId: "test-linear-issue-status",
	});
});
