import type { LinearClient } from "@linear/sdk";

export const createLinearIssue = async (
	linear: LinearClient,
	{
		linearIssueDescription,
		linearIssueStatus,
		linearIssueTitle,
		linearTeamId,
		linearIssueLabel,
		linearIssueCreateAsUser,
		linearAttachmentUrl,
		linearAttachmentTitle,
		linearAttachmentSubtitle,
	}: {
		linearIssueDescription: string;
		linearIssueStatus: string;
		linearIssueTitle: string;
		linearTeamId: string;
		linearIssueLabel: string | null;
		linearIssueCreateAsUser: string;
		linearAttachmentUrl: string;
		linearAttachmentTitle: string;
		linearAttachmentSubtitle: string;
	}
) => {
	const response = await linear.issueCreate({
		description: linearIssueDescription,
		stateId: linearIssueStatus,
		teamId: linearTeamId,
		title: linearIssueTitle,
		labelIds: linearIssueLabel ? [linearIssueLabel] : [],
		createAsUser: linearIssueCreateAsUser,
	} as any);

	const issue = await response.issue;

	if (!issue) {
		throw new Error(`Couldn't extract Linear issue information.`);
	}

	const { id, identifier, url } = issue;

	await linear.attachmentCreate({
		issueId: id,
		title: linearAttachmentTitle,
		url: linearAttachmentUrl,
		iconUrl:
			"https://uploads.linear.app/attachment-icons/87ab12fa0eb341a2c5350114f91e1896569c2eadbba9da5a6ed193c0972eaa11",
		subtitle: linearAttachmentSubtitle,
	});

	return { id, identifier, url };
};
