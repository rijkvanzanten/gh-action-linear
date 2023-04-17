import { expect, test } from "vitest";
import { formatGithubComment } from "./format-github-comment.js";

test("Matches snapshot", () => {
	expect(
		formatGithubComment({
			linearIssueId: "test-linear-id",
			linearIssueIdentifier: "test-linear-identifier",
			linearIssueUrl: "test-linear-issue-url",
		}),
	).toMatchInlineSnapshot(`
		"🤖 Linear issue created! Maintainers can access it here: [test-linear-identifier](test-linear-issue-url)

		<!-- linear-issue-id: [test-linear-id] -->"
	`);
});
