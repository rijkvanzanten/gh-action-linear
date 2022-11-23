export const formatLinearIssueDescription = ({
	githubIssueBody,
	githubIssueUrl,
}: { githubIssueBody: string; githubIssueUrl: string }) => {
	return `${githubIssueBody}\n\n[View original issue on GitHub](${githubIssueUrl})`;
};
