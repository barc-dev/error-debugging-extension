// import * as vscode from 'vscode';

// export function registerDiagnosticListener(context: vscode.ExtensionContext) {
//     //event containts the locations of where it occured, and the uris of the files that were affected
//     //
//     const listener = vscode.languages.onDidChangeDiagnostics((event: vscode.DiagnosticChangeEvent) => {

//         //check for uris not filepaths (due to potential files on cloud), uri is current file we are on 
//         const uris = event.uris;
//         uris.forEach(uri => {

//             //this is the list of errors it returns a list of objects, each object is a red line
//             const diagnostics = vscode.languages.getDiagnostics(uri);

//             //so we use for each to loop through the list of errors
//             //then we use a if statement because vscode has 4 levels of severity, red is error, yellow i warning, blue is info, gray is hint
//             //this if statement only focuses on the errors
//             diagnostics.forEach(diagnostic => {
//                 if (diagnostic.severity === vscode.DiagnosticSeverity.Error) {

//     }

// }