import * as vscode from 'vscode';
import Authenticator from './lib/Authenticator';
import StatusBarLabel from './StatusBarLabel';
import ShareInput from './ShareInput';
import MainMenu from './MainMenu';

export type TToken = string | undefined;

const menuCommand = 'extension.menu';
const loginCommand = 'extension.login';
const logoutCommand = 'extension.logout';
const shareCommand = 'extension.share';

const SBLabel = new StatusBarLabel();

const MMenu = new MainMenu([
	{ label: 'Login', command: loginCommand, isVisible: token => !token},
	{ label: 'Logout', command: logoutCommand, isVisible: token => !!token}
]);

export function activate(context: vscode.ExtensionContext) {
	const { globalState } = context;

	// Handle the menu command
	context.subscriptions.push(vscode.commands.registerCommand(menuCommand, () => {
		const token = globalState.get<string>('token');
		MMenu.show(token);
	}));
	
	// Handle the login command
	context.subscriptions.push(vscode.commands.registerCommand(loginCommand, () => {
		if (globalState.get<string>('token')) {
			return;
		}

		new Authenticator()
			.start()
			.then((token) => {
				context.globalState.update('token', token);
				SBLabel.updateText(token);
			});
	}));

	// Handle the logout command
	context.subscriptions.push(vscode.commands.registerCommand(logoutCommand, () => {
		globalState.update('token', undefined);
		SBLabel.updateText(undefined);
	}));

	// Handle the share command
	context.subscriptions.push(vscode.commands.registerCommand(shareCommand, () => {
		const editor = vscode.window.activeTextEditor;
		const token = globalState.get<string>('token');
		
		if (!editor) {
			return;
		}

		if (!token) {
			vscode.window.showWarningMessage('You are not logged in');
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
	SBLabel.updateText(globalState.get<string>('token'));
	SBLabel.setCommand(menuCommand);
	context.subscriptions.push(SBLabel.instance);
}

export function deactivate() {}
