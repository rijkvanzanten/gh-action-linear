import type { LinearClient } from "@linear/sdk";
import { afterEach, expect, test, vi } from "vitest";
import { createLinearComment } from "./create-linear-comment.js";

afterEach(() => {
	vi.clearAllMocks();
});

test("Calls Linear commentCreate with formatted body", async () => {
	const linear = { commentCreate: vi.fn() } as unknown as LinearClient;

	await createLinearComment(linear, {
		linearIssueId: "test-linear-issue-id",
		linearIssueBody: "test-linear-issue-comment",
	});

	expect(linear.commentCreate).toHaveBeenCalledWith({
		issueId: "test-linear-issue-id",
		body: "test-linear-issue-comment",
	});
});
