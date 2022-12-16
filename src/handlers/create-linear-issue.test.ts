import type { LinearClient } from "@linear/sdk";
import { afterEach, expect, test, vi } from "vitest";
import { createLinearIssue } from "./create-linear-issue.js";

afterEach(() => {
	vi.clearAllMocks();
});

test("Calls issue create with passed params", async () => {
	const linear = {
		issueCreate: vi.fn().mockResolvedValue({
			get issue() {
				return Promise.resolve({});
			},
		}),
		attachmentCreate: vi.fn(),
	} as unknown as LinearClient;

	await createLinearIssue(linear, {
		linearIssueDescription: "test-linear-issue-description",
		linearIssueStatus: "test-linear-issue-status",
		linearIssueTitle: "test-linear-issue-title",
		linearTeamId: "test-linear-team-id",
		linearIssueLabel: "test-linear-issue-label",
		linearAttachmentTitle: "test-linear-attachment-title",
		linearAttachmentSubtitle: "test-linear-attachment-subtitle",
		linearAttachmentUrl: "test-linear-attachment-url",
		linearIssueCreateAsUser: "test-linear-issue-create-as-user",
	});

	expect(linear.issueCreate).toHaveBeenCalledWith({
		description: "test-linear-issue-description",
		stateId: "test-linear-issue-status",
		teamId: "test-linear-team-id",
		title: "test-linear-issue-title",
		labelIds: ["test-linear-issue-label"],
		createAsUser: "test-linear-issue-create-as-user",
	});
});

test("Throws error if Linear issue information is not returned", async () => {
	const linear = {
		issueCreate: vi.fn().mockResolvedValue({
			get issue() {
				return Promise.resolve(undefined);
			},
		}),
		attachmentCreate: vi.fn(),
	} as unknown as LinearClient;

	expect(
		createLinearIssue(linear, {
			linearIssueDescription: "test-linear-issue-description",
			linearIssueStatus: "test-linear-issue-status",
			linearIssueTitle: "test-linear-issue-title",
			linearTeamId: "test-linear-team-id",
			linearIssueLabel: "test-linear-issue-label",
			linearAttachmentTitle: "test-linear-attachment-title",
			linearAttachmentSubtitle: "test-linear-attachment-subtitle",
			linearAttachmentUrl: "test-linear-attachment-url",
			linearIssueCreateAsUser: "test-linear-issue-create-as-user",
		})
	).rejects.toBeInstanceOf(Error);
});

test("Returns id, identifier, url from issue", async () => {
	const linear = {
		issueCreate: vi.fn().mockResolvedValue({
			get issue() {
				return Promise.resolve({
					id: "test-id",
					identifier: "test-identifier",
					url: "test-url",
				});
			},
		}),
		attachmentCreate: vi.fn(),
	} as unknown as LinearClient;

	const output = await createLinearIssue(linear, {
		linearIssueDescription: "test-linear-issue-description",
		linearIssueStatus: "test-linear-issue-status",
		linearIssueTitle: "test-linear-issue-title",
		linearTeamId: "test-linear-team-id",
		linearIssueLabel: "test-linear-issue-label",
		linearAttachmentTitle: "test-linear-attachment-title",
		linearAttachmentSubtitle: "test-linear-attachment-subtitle",
		linearAttachmentUrl: "test-linear-attachment-url",
		linearIssueCreateAsUser: "test-linear-issue-create-as-user",
	});

	expect(output).toStrictEqual({
		id: "test-id",
		identifier: "test-identifier",
		url: "test-url",
	});
});
