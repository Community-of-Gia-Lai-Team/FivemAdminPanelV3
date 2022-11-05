'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Path = require("path");
let EditorProvider = /** @class */ (() => {
    class EditorProvider {
        constructor(context) {
            this.context = context;
            this._disposables = [];
            if (EditorProvider.s_instance) {
                EditorProvider.s_instance.dispose();
            }
            EditorProvider.s_instance = this;
            EditorProvider.s_editorUri = vscode_1.Uri.file(context.asAbsolutePath(Path.join('media', 'editor', 'index.html')));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.openEditor", () => {
                vscode_1.commands.executeCommand('vscode.previewHtml', EditorProvider.s_editorUri, vscode_1.ViewColumn.Active, "THREE.js Editor").then((e) => {
                    this.patchEditor();
                });
            }));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.openInEditor", (fileUri) => {
                vscode_1.commands.executeCommand('vscode.previewHtml', EditorProvider.s_editorUri, vscode_1.ViewColumn.Active, "THREE.js Editor").then((e) => {
                    this.patchEditor();
                    EditorProvider.importFile(fileUri);
                });
            }));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.openUrlInEditor", () => {
                vscode_1.window.showInputBox({ prompt: "Enter URL to open", placeHolder: "http://..." }).then((value) => {
                    if (value) {
                        let fileUri = vscode_1.Uri.parse(value);
                        EditorProvider.importFile(fileUri);
                    }
                });
            }));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.onMessage", EditorProvider.onMessage));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.displayString", EditorProvider.displayString));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.sendCommand", EditorProvider.sendCommand));
            this._disposables.push(vscode_1.commands.registerCommand("3dviewer.importFile", EditorProvider.importFile));
        }
        static get instance() {
            return EditorProvider.s_instance;
        }
        static sendCommand(command) {
            if (EditorProvider.s_editorUri) {
                return vscode_1.commands.executeCommand('_workbench.htmlPreview.postMessage', EditorProvider.s_editorUri, { eval: command });
            }
            return Promise.resolve(false);
        }
        static importFile(uri) {
            return EditorProvider.sendCommand(`
            if (!window.fileLoader) {
                window.fileLoader = new THREE.FileLoader();
                window.fileLoader.crossOrigin = '';
                window.fileLoader.setResponseType( 'arraybuffer' );
            }
            window.fileLoader.load('${uri.toString()}', (data) => { 
                editor.loader.loadFile( new File([data], '${Path.basename(uri.fsPath)}'), '${Path.dirname(uri.toString())}/' ) 
            });
        `);
        }
        dispose() {
            this._disposables.forEach(d => d.dispose());
        }
        // Inject script file on client in order to patch the editor functionalities
        patchEditor() {
            EditorProvider.sendCommand(`document.body.appendChild(document.createElement("script")).src="${this.context.asAbsolutePath(Path.join('media', 'editorPatch.js'))}"`);
        }
        static onMessage(e) {
            console.log(e);
        }
        static displayString(text) {
            vscode_1.workspace.openTextDocument({ language: 'json', content: text }).then((doc) => {
                vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.Three, true);
            });
        }
    }
    EditorProvider.s_instance = null;
    EditorProvider.s_editorUri = null;
    return EditorProvider;
})();
exports.default = EditorProvider;
//# sourceMappingURL=editorProvider.js.map