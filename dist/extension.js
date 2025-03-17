"use strict";var f=Object.create;var i=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var l=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty;var v=(e,t)=>{for(var s in t)i(e,s,{get:t[s],enumerable:!0})},d=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of x(t))!g.call(e,n)&&n!==s&&i(e,n,{get:()=>t[n],enumerable:!(r=p(t,n))||r.enumerable});return e};var c=(e,t,s)=>(s=e!=null?f(l(e)):{},d(t||!e||!e.__esModule?i(s,"default",{value:e,enumerable:!0}):s,e)),w=e=>d(i({},"__esModule",{value:!0}),e);var b={};v(b,{activate:()=>h,deactivate:()=>T});module.exports=w(b);var o=c(require("vscode")),a=c(require("fs")),m=c(require("path"));function h(e){let t=o.commands.registerCommand("vscode-test-generator.generateRtlTests",s=>{s.fsPath.endsWith(".tsx")?u(s.fsPath):o.window.showErrorMessage("Please select a .tsx file")});e.subscriptions.push(t)}function u(e){let t=e.replace(".tsx",".test.tsx"),s=m.basename(e,".tsx");if(a.existsSync(t)){o.window.showInformationMessage("Test file already exists");return}let r=`import { render, screen } from '@testing-library/react';
import ${s} from '${e}';

describe('${s}', () => {
  test('renders component', () => {
    render(<${s} />);
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });
});`;a.writeFileSync(t,r),o.window.showInformationMessage(`Test file generated: ${t}`)}function T(){}0&&(module.exports={activate,deactivate});
