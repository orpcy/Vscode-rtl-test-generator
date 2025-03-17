import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('vscode-test-generator.generateRtlTests', (uri: vscode.Uri) => {
        if (uri.fsPath.endsWith('.tsx')) {
            generateRtlTests(uri.fsPath);
        } else {
            vscode.window.showErrorMessage('Please select a .tsx file');
        }
    });

    context.subscriptions.push(disposable);
}

function generateRtlTests(filePath: string) {
    const testFilePath = filePath.replace('.tsx', '.test.tsx');
    const componentName = path.basename(filePath, '.tsx');

    // Check if the test file already exists
    if (fs.existsSync(testFilePath)) {
        vscode.window.showInformationMessage('Test file already exists');
        return;
    }

    // Generate test content
    const testContent = `import { render, screen } from '@testing-library/react';
import ${componentName} from '${filePath}';

describe('${componentName}', () => {
  test('renders component', () => {
    render(<${componentName} />);
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });
});`;

    // Create the test file
    fs.writeFileSync(testFilePath, testContent);
    vscode.window.showInformationMessage(`Test file generated: ${testFilePath}`);
}

export function deactivate() {}
