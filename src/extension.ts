import * as vscode from "vscode";
import * as path from "path";
import * as _ from "lodash";
import { Utils } from "./utils/utils";
import { Architecture } from "./utils/architecture";
import { ViewFile } from "./utils/view_file";
import { VsCodeActions } from "./utils/vs_code_actions";
import { WidgetFile } from "./utils/widget_file";
import { FileSystemManager } from "./utils/file_system_manager";

export function activate(context: vscode.ExtensionContext) {
  function check(element: any, index: any, array: any) {
    if (typeof element !== "string") {
      return false;
    }

    if (element.trim() === "") {
      return false;
    }
    return !Number.isNaN(Number(element));
  }

  let initializeDisposable = vscode.commands.registerCommand(
    "extension.initializeArchitecture",
    async () => {
      if (!FileSystemManager.isFlutterProject()) {
        return;
      }

      let rootPath = VsCodeActions.rootPath;
      if (_.isUndefined(rootPath)) {
        return;
      }
      new Architecture(path.join(rootPath, "lib")).init();
      new ViewFile(rootPath, "home").createDemoViews();
    }
  );

  let viewDisposable = vscode.commands.registerCommand(
    "extension.createViews",
    async () => {
      if (!FileSystemManager.isFlutterProject()) {
        return;
      }

      let inputString = await VsCodeActions.getInputString(
        "Enter class name",
        async (value) => {
          if (value.length === 0) {
            return "Enter class name";
          }

          if (value.toLowerCase() === "view") {
            return "View is not a valid class name";
          }

          return undefined;
        }
      );

      if (inputString.length === 0 || inputString.toLowerCase() === "view") {
        console.warn("activate: inputString length is 0");
        VsCodeActions.showErrorMessage("Invalid name for file");
        return;
      }

      console.debug(`fileName: { ${inputString} }`);

      let nameArray = inputString.trim().split("/");
      let folders: string[] = [];
      if (nameArray.length > 1) {
        let folderList = nameArray
          .splice(0, nameArray.length - 1)
          .map((element) => {
            return element;
          });
        console.debug(`folderlist: { ${folderList} }`);
        folders = folderList;
      }

      let formattedInputString = _.last(nameArray);
      if (formattedInputString === undefined) {
        console.error("formattedInputString is undefined");
        return;
      }

	  let opts = await VsCodeActions.showQuickPick();

      let options = await VsCodeActions.getInputString(
        "Enter options => 0 for all, 1 for mobile, 2 for web and 3 for tablet. Separate with commas.",
        async (value) => {
			//change it to null to mean all
          let vals = value.split(",");
          if (!vals.every(check)) {
            return undefined;
          }
        }
      );

      let fileName = Utils.processFileName(formattedInputString);
      console.debug(`activate: fileName: ${fileName}`);

      let rootPath = VsCodeActions.rootPath;
      if (rootPath === undefined) {
        return;
      }
      new ViewFile(rootPath, fileName, folders).createResponsiveViews(options);
    }
  );

  let widgetDisposable = vscode.commands.registerCommand(
    "extension.createWidget",
    async () => {
      if (!FileSystemManager.isFlutterProject()) {
        return;
      }

      let inputString = await VsCodeActions.getInputString(
        "Enter class name",
        async (value) => {
          if (value.length === 0) {
            return "Enter class name";
          }
          if (value.toLowerCase() === "widget") {
            return "Widget is not a valid class name";
          }
          return undefined;
        }
      );

      if (inputString.length === 0 || inputString.toLowerCase() === "widget") {
        console.warn("activate: inputString length is 0");
        VsCodeActions.showErrorMessage("Invalid name for file");
        return;
      }

      let fileName = Utils.processFileName(inputString.trim());
      console.debug(`activate: fileName: ${fileName}`);

      let rootPath = VsCodeActions.rootPath;
      if (rootPath === undefined) {
        return;
      }
      new WidgetFile(rootPath, fileName).createResponsiveWidgets();
    }
  );

  context.subscriptions.push(viewDisposable);
  context.subscriptions.push(initializeDisposable);
  context.subscriptions.push(widgetDisposable);
}

export function deactivate() {
  console.debug("Flutter MVVM Generator: Deactivated");
}

/// [test ,splash]
