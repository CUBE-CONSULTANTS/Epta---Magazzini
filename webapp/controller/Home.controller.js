sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("fdrevampxbrowser.controller.Home", {
        onInit() {
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

        }
    });
});