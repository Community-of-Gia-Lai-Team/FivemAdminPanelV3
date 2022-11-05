'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
class ViewerPanel {
    //TODO: If we already have a panel, show it.
    // public static createOrShow(extensionPath: string) {
    // }
    constructor(extensionPath, fileUri) {
        this._disposables = [];
        this._extensionPath = extensionPath;
        this._fileUri = fileUri;
        const column = vscode_1.window.activeTextEditor ? vscode_1.window.activeTextEditor.viewColumn : undefined;
        this._panel = vscode_1.window.createWebviewPanel(ViewerPanel.viewType, "3D Mesh Preview", column || vscode_1.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
        });
        // Set the webview's initial html content 
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
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
    _update() {
        var fileToLoad = this._fileUri.toString();
        var file = fileToLoad.split('/').pop();
        this._panel.title = file;
        this._panel.webview.html = this._getHtmlForWebview();
    }
    getMediaPath(scheme, mediaFile) {
        //return Uri.file(this.context.asAbsolutePath(path.join('media', mediaFile))).toString();
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
    _getHtmlForWebview() {
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
exports.default = ViewerPanel;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=viewerPanel.js.map