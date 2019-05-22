import * as vscode from 'vscode';
import Authenticator from './lib/Authenticator';
import StatusBarLabel from './StatusBarLabel';

const SBLabel = new StatusBarLabel();

export function activate(context: vscode.ExtensionContext) {
	const { globalState } = context;
	
	// Create the login command
	const loginCommand = 'extension.login';
	context.subscriptions.push(vscode.commands.registerCommand(loginCommand, () => {
		if (globalState.get('token')) {
			return;
		}

		new Authenticator()
			.start()
			.then((token) => {
				context.globalState.update('token', token);
				SBLabel.setText('Codcut');
			});
	}));

	// Create the status bar item
	SBLabel.setText(globalState.get('token') ? 'Codcut' : 'Codcut - login');
	SBLabel.setCommand(loginCommand);
	context.subscriptions.push(SBLabel.instance);
}

export function deactivate() {}
