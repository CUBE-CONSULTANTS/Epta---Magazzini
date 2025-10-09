sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("fdrevampxbrowser.controller.Home", {
        onInit() {
            this.getView().setModel(new sap.ui.model.json.JSONModel({ image: true, panel: false }), "modello")
        },
        onNavDetail: function (oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            let titleTile = oEvent.getSource().getProperty("header")
            switch (titleTile) {
                case 'Materie Prime':
                    oRouter.navTo("MateriePrime");
                    break;
                case 'Semilavorati':

                    break;
                case 'Conferma Produzione':

                    break;
                case 'Production manual transfer':

                    break;
            }

        },
        onCollapseExpandPress: function () {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },
        onItemSelect: function (oEvent) {
            let selected = oEvent.getParameters("item").item.getProperty("text")
            if (selected == 'Collapse/Expand') return
            debugger
            switch (selected) {
                case 'Pallettizzazione':
                    this.getView().getModel("modello").setProperty("/image", false)
                    this.getView().getModel("modello").setProperty("/panel", true)
                    break;

                default:
                    break;
            }
        }
    });
});