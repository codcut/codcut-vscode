import * as vscode from 'vscode';
import { TToken } from './extension';

interface IMainMenuItem {
  label: string;
  command: string;
  isVisible: (token: TToken) => boolean;
}

class MainMenu {
  items: Array<IMainMenuItem>;
  token: TToken;

  constructor(items: Array<IMainMenuItem>) {
    this.items = items;
  }

  show(token: TToken) {
    const { items } = this;
  
    const visibleItems = items
      .filter(item => item.isVisible(token))
      .map(item => item.label);

    vscode.window.showQuickPick<any>(visibleItems, {
      canPickMany: false
    })
      .then((value: string) => {
        const selectedItem = items.filter(item => item.label === value)[0];

        if (!selectedItem) {
          return;
        }

        vscode.commands.executeCommand(
          selectedItem.command
        );
      });
  }
}

export default MainMenu;