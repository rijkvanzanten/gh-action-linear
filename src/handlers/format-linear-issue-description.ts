export const formatLinearIssueDescription = ({
	githubIssueBody,
	githubIssueUrl,
	githubIssueAuthor,
}: {
	githubIssueBody: string;
	githubIssueUrl: string;
	githubIssueAuthor: string;
}) => {
	const bodyQuoted = githubIssueBody
		.split("\n")
		.map((line) => `> ${line}`)
		.join("\n");

	return `GitHub user [@${githubIssueAuthor}](https://github.com/${githubIssueAuthor}) wrote:\n\n${bodyQuoted}\n\n[View original issue on GitHub](${githubIssueUrl})`;
};
