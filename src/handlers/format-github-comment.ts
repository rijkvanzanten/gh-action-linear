import type { Issue } from "@linear/sdk";

export const formatGithubComment = ({
	linearIssueUrl,
	linearIssueId,
	linearIssueIdentifier,
}: {
	linearIssueUrl: Issue["url"];
	linearIssueId: Issue["id"];
	linearIssueIdentifier: Issue["identifier"];
}) => {
	return `🤖 Linear issue created! Maintainers can access it here: [${linearIssueIdentifier}](${linearIssueUrl})\n\n<!-- linear-issue-id: [${linearIssueId}] -->`;
};
