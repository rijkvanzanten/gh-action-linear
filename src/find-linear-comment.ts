import type { getOctokit } from "@actions/github";

export const findLinearComment = async (
	octokit: ReturnType<typeof getOctokit>,
	{ issue, repo }: { issue: number; repo: { owner: string; repo: string } },
) => {
	const comments = await octokit.rest.issues.listComments({
		...repo,
		issue_number: issue,
		per_page: 100,
	});

	const linearIdRegex =
		/<!-- linear-issue-id: \[([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\] -->/gm;

	const linearComment = comments.data.find((comment) => {
		return (
			comment.user?.login === "github-actions[bot]" &&
			comment.user?.type === "Bot" &&
			linearIdRegex.test(comment.body ?? "")
		);
	});

	if (!linearComment) {
		throw new Error(`Couldn't extract linear comment for issue #${issue}.`);
	}

	console.log(linearComment);

	const matches = linearIdRegex.exec(linearComment.body ?? "");

	console.log(matches);

	const linearId = matches?.[1];

	if (!linearId) {
		throw new Error(
			`Couldn't extract linear ID from comment ${linearComment.id} on issue #${issue}`,
		);
	}

	return linearId;
};
