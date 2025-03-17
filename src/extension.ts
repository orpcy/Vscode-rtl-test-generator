import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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
    const testFilePath = filePath.replace('.tsx', '.test.tsx');
    const componentName = path.basename(filePath, '.tsx');

    // Check if the test file already exists
    if (fs.existsSync(testFilePath)) {
        vscode.window.showInformationMessage('Test file already exists');
        return;
    }

    try {
        // Use Copilot to generate the test content for the component
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const range = new vscode.Range(0, 0, document.lineCount, 0);
            const fileContent = document.getText(range);

            // Trigger Copilot's generate tests functionality
            const testContent = await vscode.commands.executeCommand<string>('github.copilot.chat.generateTests', {
                content: fileContent,
                language: 'tsx'
            });

            if (testContent) {
                // Create the test file with Copilot-generated content
                fs.writeFileSync(testFilePath, testContent);
                vscode.window.showInformationMessage(`Test file generated: ${testFilePath}`);
            } else {
                vscode.window.showErrorMessage('Could not generate tests using Copilot');
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(`Error generating tests: ${error.message}`);
        } else {
            vscode.window.showErrorMessage('Error generating tests');
        }
    }
}

export function deactivate() {}
