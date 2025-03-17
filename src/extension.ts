import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('vscode-test-generator.generateRtlTests', async (uri: vscode.Uri) => {
        if (uri.fsPath.endsWith('.tsx')) {
            await generateRtlTests(uri.fsPath);
        } else {
            vscode.window.showErrorMessage('Please select a .tsx file');
        }
    });

    context.subscriptions.push(disposable);
}

async function generateRtlTests(filePath: string) {
    const testFilePath = filePath.replace('.tsx', '.spec.tsx'); // Use .spec.tsx instead of .test.tsx

    try {
        // Trigger Copilot's generate tests functionality
        const testContent = await vscode.commands.executeCommand<string>('github.copilot.chat.generateTests', {
            content: filePath, // Pass filePath to Copilot for context (or use full file content here if required)
            language: 'tsx'
        });

        if (testContent) {
            // Directly save the content as a .spec.tsx file
            const doc = await vscode.workspace.openTextDocument({
                content: testContent,
                language: 'typescriptreact',
            });

            const edit = new vscode.WorkspaceEdit();
            edit.createFile(vscode.Uri.file(testFilePath), { overwrite: true });
            await vscode.workspace.applyEdit(edit);

            vscode.window.showInformationMessage(`Test file generated: ${testFilePath}`);
        } else {
            vscode.window.showErrorMessage('Could not generate tests using Copilot');
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error generating tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export function deactivate() {}
