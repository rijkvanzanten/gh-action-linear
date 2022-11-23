import type { getOctokit } from "@actions/github";

export const findLinearComment = async (
	octokit: ReturnType<typeof getOctokit>,
	{ githubIssueNumber, githubRepo }: {
		githubIssueNumber: number;
		githubRepo: { owner: string; repo: string };
	},
) => {
	const comments = await octokit.rest.issues.listComments({
		...githubRepo,
		issue_number: githubIssueNumber,
		per_page: 100,
	});

	const uuidRegex =
		/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;

	const linearComment = comments.data.find((comment) => {
		return (
			comment.user?.login === "github-actions[bot]" &&
			comment.user?.type === "Bot" &&
			comment.body &&
			uuidRegex.test(comment.body)
		);
	});

	if (!linearComment) {
		throw new Error(
			`Couldn't extract Linear comment on issue #${githubIssueNumber}`,
		);
	}

	// We know it exists as we're testing for it in the find call above
	return linearComment.body!.match(uuidRegex)![0]!;
};
