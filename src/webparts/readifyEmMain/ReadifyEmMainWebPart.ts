/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "ReadifyEmMainWebPartStrings";
import ReadifyEmMain from "./components/ReadifyEmMain";
import { IReadifyEmMainProps } from "./components/IReadifyEmMainProps";
import { sp } from "@pnp/sp/presets/all";
import { graph } from "@pnp/graph/presets/all";
import { SPComponentLoader } from "@microsoft/sp-loader";
require("../../../src/assets/css/style.css");
// require("../../webparts/main/assets/css/theme.css");
require("../../../node_modules/primereact/resources/themes/bootstrap4-light-blue/theme.css");
// require("../../../node_modules/primereact/resources/primereact.min.css");

export interface IReadifyEmMainWebPartProps {
  description: string;
  tocTitle: string;
}

export default class ReadifyEmMainWebPart extends BaseClientSideWebPart<IReadifyEmMainWebPartProps> {
  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = "";

  public async onInit(): Promise<void> {
    SPComponentLoader.loadCss(
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    );
    SPComponentLoader.loadCss(
      "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
    );

    SPComponentLoader.loadCss("https://unpkg.com/primeicons/primeicons.css");

    // Set up SharePoint context
    sp.setup({
      spfxContext: this.context as unknown as undefined,
    });

    // Set up Graph context
    graph.setup({
      spfxContext: this.context as unknown as undefined,
    });

    await super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IReadifyEmMainProps> =
      React.createElement(ReadifyEmMain, {
        context: { ...this.context, tocTitle: this.properties.tocTitle },
      });

    ReactDom.render(element, this.domElement);
  }

  // protected onInit(): Promise<void> {
  //   return this._getEnvironmentMessage().then((message) => {
  //     this._environmentMessage = message;
  //   });
  // }

  // private _getEnvironmentMessage(): Promise<string> {
  //   if (!!this.context.sdks.microsoftTeams) {
  //     // running in Teams, office.com or Outlook
  //     return this.context.sdks.microsoftTeams.teamsJs.app
  //       .getContext()
  //       .then((context) => {
  //         let environmentMessage: string = "";
  //         switch (context.app.host.name) {
  //           case "Office": // running in Office
  //             environmentMessage = this.context.isServedFromLocalhost
  //               ? strings.AppLocalEnvironmentOffice
  //               : strings.AppOfficeEnvironment;
  //             break;
  //           case "Outlook": // running in Outlook
  //             environmentMessage = this.context.isServedFromLocalhost
  //               ? strings.AppLocalEnvironmentOutlook
  //               : strings.AppOutlookEnvironment;
  //             break;
  //           case "Teams": // running in Teams
  //           case "TeamsModern":
  //             environmentMessage = this.context.isServedFromLocalhost
  //               ? strings.AppLocalEnvironmentTeams
  //               : strings.AppTeamsTabEnvironment;
  //             break;
  //           default:
  //             environmentMessage = strings.UnknownEnvironment;
  //         }

  //         return environmentMessage;
  //       });
  //   }

  //   return Promise.resolve(
  //     this.context.isServedFromLocalhost
  //       ? strings.AppLocalEnvironmentSharePoint
  //       : strings.AppSharePointEnvironment
  //   );
  // }

  // protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
  //   if (!currentTheme) {
  //     return;
  //   }

  //   // this._isDarkTheme = !!currentTheme.isInverted;
  //   const { semanticColors } = currentTheme;

  //   if (semanticColors) {
  //     this.domElement.style.setProperty(
  //       "--bodyText",
  //       semanticColors.bodyText || null
  //     );
  //     this.domElement.style.setProperty("--link", semanticColors.link || null);
  //     this.domElement.style.setProperty(
  //       "--linkHovered",
  //       semanticColors.linkHovered || null
  //     );
  //   }
  // }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField("tocTitle", {
                  label: "TOC Title",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
