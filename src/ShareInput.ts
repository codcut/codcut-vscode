import * as vscode from 'vscode';
import { ICreatePostParams, createPostReq } from './utils/api';
import { POST_PREVIEW_ENDPOINT } from './utils/config';

class ShareInput {
  MAX_DESCRIPTION_LENGTH = 500;
  MIN_CODE_LENGTH = 1;

  params: ICreatePostParams = {
    code: '',
    language: '',
    body: ''
  };

  token: string;
  
  constructor(params: Partial<ICreatePostParams>, token: string) {
    this.params = {
      ...this.params,
      ...params
    };

    this.token = token;
  }

  open() {
    const { MAX_DESCRIPTION_LENGTH, MIN_CODE_LENGTH, params } = this;

    if (params.code.length < MIN_CODE_LENGTH) {
      vscode.window.showWarningMessage('The code is too short');
			return;
		}

    vscode.window.showInputBox({
			placeHolder: `Enter a description (max ${MAX_DESCRIPTION_LENGTH} characters)`,
			prompt: 'Share this selection on Codcut',

			validateInput: this._validateDescription
		})
			.then((value) => {
				if (value === undefined) {
					return;
				}

        params.body = value;
        
        this._share();
			});
  }

  _validateDescription(value: string) {
    const { MAX_DESCRIPTION_LENGTH } = this;

    if (value.length > MAX_DESCRIPTION_LENGTH) {
      return `The description is too long (+${value.length - MAX_DESCRIPTION_LENGTH} characters)`;
    }

    return null;
  }

  _share() {
    const { params, token } = this;
    
    if (!params.code || !params.language || typeof params.body !== 'string') {
      vscode.window.showErrorMessage('Something went wrong');
      return;
    }

    createPostReq(params, token)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }

        vscode.window.showErrorMessage('There are problems with our servers, retry in a few minutes :(');
        return undefined;
      })
      .then((json) => json ? json.id : undefined)
      .then((id) => this._handleConfirmation(id))
      .catch(() => vscode.window.showErrorMessage('Something went wrong, check your connection :('));
  }

  _handleConfirmation(postId: number | undefined) {
    vscode.window.showInformationMessage('Code shared successfully!', 'Open in your browser')
      .then((action) => {
        if (!action || postId === undefined) {
          return;
        }

        vscode.env.openExternal(vscode.Uri.parse(`${POST_PREVIEW_ENDPOINT}/${postId}`));
      });
  }
}

export default ShareInput;