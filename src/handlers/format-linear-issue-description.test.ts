import { expect, test } from "vitest";
import { formatLinearIssueDescription } from "./format-linear-issue-description.js";

test("Matches snapshot", () => {
	expect(
		formatLinearIssueDescription({
			githubIssueBody: "test-github-issue-body",
			githubIssueUrl: "test-github-issue-url",
			githubIssueAuthor: "test-author",
		}),
	).toMatchInlineSnapshot(`
		"GitHub user [@test-author](https://github.com/test-author) wrote:

		> test-github-issue-body

		[View original issue on GitHub](test-github-issue-url)"
	`);
});
