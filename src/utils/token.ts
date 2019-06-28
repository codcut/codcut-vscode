import * as vscode from 'vscode';

export function getToken() {
  const config = vscode.workspace.getConfiguration('codcut');
  return config.get<string>('token');
}