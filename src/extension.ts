import * as vscode from 'vscode';
import Authenticator from './lib/Authenticator';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	
	// Create the login command
	const loginCommand = 'extension.login';
	context.subscriptions.push(vscode.commands.registerCommand(loginCommand, () => {
		if (context.globalState.get('token')) {
			return;
		}

		new Authenticator()
			.start()
			.then((token) => {
				context.globalState.update('token', token);
				statusBarItem.text = 'Codcut';
			});
	}));

	// Create the status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = loginCommand;
	statusBarItem.text = context.globalState.get('token') ? 'Codcut' : 'Codcut - login';
	context.subscriptions.push(statusBarItem);
	statusBarItem.show();
}

export function deactivate() {}
