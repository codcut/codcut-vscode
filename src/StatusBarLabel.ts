import * as vscode from 'vscode';
import { TToken } from './extension';

class StatusBarLabel {
  statusBarItem: vscode.StatusBarItem;
  
  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    this.statusBarItem.show();
  }

  setCommand(command: string) {
    this.statusBarItem.command = command;
  }

  updateText(token: TToken) {
    if (token) {
      this.statusBarItem.text = 'Codcut';
    }
    else {
      this.statusBarItem.text = 'Codcut - login';
    }
  }

  get instance() {
    return this.statusBarItem;
  }
}

export default StatusBarLabel;