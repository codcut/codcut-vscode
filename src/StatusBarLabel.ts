import * as vscode from 'vscode';

class StatusBarLabel {
  statusBarItem: vscode.StatusBarItem;
  
  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.show();
  }

  setCommand(command: string) {
    this.statusBarItem.command = command;
  }

  setText(text: string) {
    this.statusBarItem.text = text;
  }

  get instance() {
    return this.statusBarItem;
  }
}

export default StatusBarLabel;