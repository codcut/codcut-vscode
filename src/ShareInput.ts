import * as vscode from 'vscode';
import { ICreatePostParams, createPostReq } from './utils/api';

class ShareInput {
  MAX_DESCRIPTION_LENGTH = 500;
  MIN_CODE_LENGTH = 5;

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
      return;
    }

    createPostReq(params, token)
      .then(res => {
        if (res.ok) {
          vscode.window.showInformationMessage('Code shared successfully!');
        }
        else {
          vscode.window.showErrorMessage('There are problems with our servers, retry in a few minutes :(');
        }
      })
    .catch(() => vscode.window.showErrorMessage('Something went wrong, check your connection :('));
  }
}

export default ShareInput;