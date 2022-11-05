const { off } = require('process');
const vscode = require('vscode');
const commentsFilter = require('./commentFilter.json')
/**
 * @param {vscode.ExtensionContext} context
 */

const LINE_SEPERATOR = /\n|\r\n/;

function RemoveComments(text, ext){
	let lines = text.split('\n');
	let newText = '';
	let largeComment = false;
	for(let i = 0; i < lines.length; i++){
		if(!lines[i].includes(commentsFilter[ext]['small']) && !lines[i].includes(commentsFilter[ext]['largeInit']) && !lines[i].includes(commentsFilter[ext]['largeEnd']) && !largeComment){
			newText += lines[i] + '\n';
		}
		if(lines[i].includes(commentsFilter[ext]['largeInit'])){
			largeComment = true;
		}
		if(lines[i].includes(commentsFilter[ext]['largeEnd'])){
			largeComment = false;
		}
	}
	return newText;
}

function activate(context) {
	let disposable = vscode.commands.registerCommand('comments-deletor.removeComments', function () {
		let Supported = undefined;
		try{
			let check = commentsFilter[vscode.window.activeTextEditor?.document.languageId];
			const editor = vscode.window.activeTextEditor;
			const raw = editor.document.getText();
			editor.edit(builder => {
				const start = new vscode.Position(0, 0);
				const lines = raw.split(LINE_SEPERATOR);
				const end = new vscode.Position(lines.length, lines[lines.length - 1].length);
				const allRange = new vscode.Range(start, end);
				builder.replace(allRange, RemoveComments(raw, vscode.window.activeTextEditor?.document.languageId));
			})
			Supported = true;
		}catch(error){
			vscode.window.showInputBox();
			vscode.window.showInformationMessage(`Sorry but, ${vscode.window.activeTextEditor?.document.languageId} is not currently supported`);
			return;
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
