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
	return `Linear: [${linearIssueIdentifier}](${linearIssueUrl})\n\n<!-- linear-issue-id: [${linearIssueId}] -->`;
};
