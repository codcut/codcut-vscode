import * as vscode from 'vscode';
import ShareInput from './ShareInput';
import { getToken } from './utils/token';

export type TToken = string | undefined;

const shareCommand = 'extension.codcut-share';

export function activate(context: vscode.ExtensionContext) {

	// Handle the share command
	const shareSub = vscode.commands.registerCommand(shareCommand, () => {
		const editor = vscode.window.activeTextEditor;
		const token = getToken();
		
		if (!editor) {
			vscode.window.showWarningMessage('Something went wrong');
			return;
		}

		if (!token) {
			vscode.window.showWarningMessage('You have to add a token in the configuration first');
			return;
		}

		const partialParams = {
			code: editor.document.getText(editor.selection),

			// FIXME: should handle this
			language: editor.document.fileName.split('.').pop()
		};

		new ShareInput(partialParams, token)
			.open();
	});

	context.subscriptions.push(shareSub);
}

export function deactivate() {}
