import * as vscode from 'vscode';
import Authenticator from './lib/Authenticator';
import StatusBarLabel from './StatusBarLabel';
import ShareInput from './ShareInput';

const SBLabel = new StatusBarLabel();

export function activate(context: vscode.ExtensionContext) {
	const { globalState } = context;
	
	// Handle the login command
	const loginCommand = 'extension.login';
	context.subscriptions.push(vscode.commands.registerCommand(loginCommand, () => {
		if (globalState.get<string>('token')) {
			return;
		}

		new Authenticator()
			.start()
			.then((token) => {
				context.globalState.update('token', token);
				SBLabel.setText('Codcut');
			});
	}));

	// Handle the share command
	const shareCommand = 'extension.share';
	context.subscriptions.push(vscode.commands.registerCommand(shareCommand, () => {
		const editor = vscode.window.activeTextEditor;
		const token = globalState.get<string>('token');
		
		if (!editor || !token) {
			return;
		}

		const partialParams = {
			code: editor.document.getText(editor.selection),

			// FIXME: should handle this
			language: editor.document.fileName.split('.').pop()
		};

		new ShareInput(partialParams, token)
			.open();
	}));

	// Create the status bar item
	SBLabel.setText(globalState.get('token') ? 'Codcut' : 'Codcut - login');
	SBLabel.setCommand(loginCommand);
	context.subscriptions.push(SBLabel.instance);
}

export function deactivate() {}
