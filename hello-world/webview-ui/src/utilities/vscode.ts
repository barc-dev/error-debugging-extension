// Type definition for VSCode webview API
interface VsCodeApi {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(newState: unknown): void;
}

// Declare the global function available in VSCode webviews
declare function acquireVsCodeApi(): VsCodeApi;

class VSCodeAPIWrapper {
  private readonly vsCodeApi: VsCodeApi | undefined;

  constructor() {
    // Check if we're in a VSCode webview context
    if (typeof acquireVsCodeApi === "function") {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  public postMessage(message: unknown) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log("Message:", message);
    }
  }

  public getState(): unknown {
    return this.vsCodeApi?.getState();
  }

  public setState(newState: unknown) {
    return this.vsCodeApi?.setState(newState);
  }
}

export const vscode = new VSCodeAPIWrapper();
