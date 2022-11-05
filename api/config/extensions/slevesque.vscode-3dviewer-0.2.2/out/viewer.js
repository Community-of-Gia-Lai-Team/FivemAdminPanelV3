'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
class ViewerProvider {
    constructor(context) {
        this._viewers = [];
        this._disposables = [];
        if (ViewerProvider.s_instance) {
            ViewerProvider.s_instance.dispose();
        }
        ViewerProvider.s_instance = this;
        this._extensionPath = context.extensionPath;
        this._disposables.push(vscode_1.commands.registerCommand('3dviewer.openInViewer', (fileUri) => {
            if (fileUri) {
                for (const v of this._viewers) {
                    if (v.fileUri.toString() === fileUri.toString()) {
                        v.reveal();
                        return;
                    }
                }
                this._viewers.push(new ViewerPanel(this._extensionPath, fileUri));
            }
        }));
        this._disposables.push(vscode_1.commands.registerCommand("3dviewer.openUrlInViewer", () => {
            vscode_1.window.showInputBox({ prompt: "Enter URL to open", placeHolder: "http://..." }).then((value) => __awaiter(this, void 0, void 0, function* () {
                const fileUri = vscode_1.Uri.parse(value);
                if (fileUri) {
                    for (const v of this._viewers) {
                        if (v.fileUri.toString() === fileUri.toString()) {
                            v.reveal();
                            return;
                        }
                    }
                    this._viewers.push(new ViewerPanel(this._extensionPath, fileUri));
                }
            }));
        }));
        // Make sure we register a serializer in activation event
        vscode_1.window.registerWebviewPanelSerializer(ViewerPanel.viewType, new ViewerSerializer());
    }
    static get instance() {
        return ViewerProvider.s_instance;
    }
    dispose() {
        this._disposables.forEach(d => d.dispose());
        this._viewers.forEach(d => d.dispose());
    }
    static removeViewer(viewer) {
        if (ViewerProvider.s_instance) {
            const index = ViewerProvider.s_instance._viewers.indexOf(viewer);
            if (index > -1) {
                ViewerProvider.s_instance._viewers.splice(index, 1);
            }
        }
    }
}
ViewerProvider.s_instance = null;
exports.default = ViewerProvider;
class ViewerSerializer {
    deserializeWebviewPanel(webviewPanel, state) {
        return __awaiter(this, void 0, void 0, function* () {
            // `state` is the state persisted using `setState` inside the webview
            console.log(`Got state: ${state}`);
            // Restore the content of our webview.
            //
            // Make sure we hold on to the `webviewPanel` passed in here and
            // also restore any event listeners we need on it.
            //webviewPanel.webview.html = getWebviewContent();
        });
    }
}
class ViewerPanel {
    constructor(extensionPath, fileUri) {
        this._disposables = [];
        this._extensionPath = extensionPath;
        this._fileUri = fileUri;
        const column = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.viewColumn : undefined;
        this._panel = vscode_1.window.createWebviewPanel(ViewerPanel.viewType, "3D Mesh Preview", column || vscode_1.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        this._panel.webview.html = this.getHtmlForWebview();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => {
            ViewerProvider.removeViewer(this);
            this.dispose();
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode_1.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    get fileUri() {
        return this._fileUri;
    }
    reveal() {
        this._panel.reveal();
    }
    doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }
    revive(panel, extensionPath) {
        //TODO
        //CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath);
        //this._panel = panel;
    }
    dispose() {
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    getMediaPath(scheme, mediaFile) {
        return vscode_1.Uri.file(path.join(this._extensionPath, 'media', mediaFile))
            .with({ scheme: scheme });
    }
    getSettings(uri) {
        let config = vscode_1.workspace.getConfiguration('3dviewer');
        let initialData = {
            fileToLoad: uri.toString(),
            wireframe: config.get('wireframe', false),
            background: config.get('background', '#8f8f8f'),
            boundingBox: config.get('boundingBox', false),
            grid: config.get('grid', true),
            gridSize: config.get('gridSize', 32),
            near: config.get('near', 0.01),
            far: config.get('far', 1000000)
        };
        return `<meta id="vscode-3dviewer-data" data-settings="${JSON.stringify(initialData).replace(/"/g, '&quot;')}">`;
    }
    getScripts(scheme, nonce) {
        const scripts = [
            this.getMediaPath(scheme, 'build/three.js'),
            this.getMediaPath(scheme, 'examples/js/libs/inflate.min.js'),
            this.getMediaPath(scheme, 'examples/js/libs/dat.gui.min.js'),
            this.getMediaPath(scheme, 'examples/js/controls/OrbitControls.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/LoaderSupport.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/ColladaLoader.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/FBXLoader.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/TDSLoader.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/OBJLoader.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/STLLoader.js'),
            this.getMediaPath(scheme, 'examples/js/loaders/PLYLoader.js'),
            this.getMediaPath(scheme, 'viewer.js')
        ];
        return scripts
            .map(source => `<script nonce="${nonce}" src="${source}"></script>`)
            .join('\n');
    }
    getHtmlForWebview() {
        let fileToLoad = this._fileUri.scheme === "file" ?
            this._fileUri.with({ scheme: 'vscode-resource' }) :
            this._fileUri;
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode_1.Uri.file(path.join(this._extensionPath, 'media', 'viewer.js'));
        // And the uri we use to load this script in the webview
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();
        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">

                <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';">
                -->

                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${this.getSettings(fileToLoad)}
                <base href="${this.getMediaPath('vscode-resource', '/')}">

                <title>3D Viewer</title>
                <style>
                    body {
                        font-family: Monospace;
                        background-color: #0f0;
                        color: #f00;
                        margin: 0px;
                        padding: 0px 0px;
                        overflow: hidden;
                    }
                </style>
            </head>
            <body>
                ${this.getScripts('vscode-resource', nonce)}
            </body>
            </html>`;
    }
}
ViewerPanel.viewType = '3dViewer';
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=viewer.js.map