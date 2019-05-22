import * as vscode from 'vscode';
import Authenticator from './lib/Authenticator';
import * as decode from 'jwt-decode';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	
	// Create the login command
	const loginCommand = 'extension.login';
	context.subscriptions.push(vscode.commands.registerCommand(loginCommand, () => {
		new Authenticator()
			.start()
			.then((token) => vscode.window.showInformationMessage(token));
	}));

	// Create the status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = loginCommand;
	statusBarItem.text = 'Codcut';
	context.subscriptions.push(statusBarItem);
	statusBarItem.show();
}

export function deactivate() {}
