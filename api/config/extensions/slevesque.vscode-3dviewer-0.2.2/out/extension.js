"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const MeshViewerProvider_1 = require("./MeshViewerProvider");
const MeshEditorProvider_1 = require("./MeshEditorProvider");
function activate(context) {
    // Register our custom editor providers
    if (+vscode.version.match(/1\.(\d+)/)[1] >= 45) {
        context.subscriptions.push(MeshViewerProvider_1.MeshViewerProvider.register(context));
        context.subscriptions.push(MeshEditorProvider_1.MeshEditorProvider.register(context));
    }
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map