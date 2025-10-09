sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "./BaseController"
], (Controller, BaseController) => {
    "use strict";

    return BaseController.extend("fdrevampxbrowser.controller.MateriePrime", {
        onInit() {
        },

        onNav: function (oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Pallettizzazione");
        }
    });
});