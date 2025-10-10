sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "./BaseController"
], (Controller, Fragment, BaseController) => {
    "use strict";

    return BaseController.extend("fdrevampxbrowser.controller.Home", {
        onInit() {
            this.getView().setModel(new sap.ui.model.json.JSONModel({ image: true, panel: false, recap: false }), "modelloVisibilit")
            this.createModel(this)
        },
        onCreatePanel: async function (filename, self, title) {
            return new sap.m.Panel({
                headerText: title,
                expandable: true,
                expanded: true,
                width: "auto",
                content: await Fragment.load({
                    name: filename,
                    controller: self
                })
            }).addStyleClass("sapUiResponsiveMargin");
        },
        onSelectPallettizzazione: async function (oEvent) {
            var oPanel = await this.onCreatePanel("fdrevampxbrowser.view.Fragments.MaterialSelection", this, "Seleziona Materiale")
            this.byId("vbox").addItem(oPanel);
        },
        onListaMateriali: async function (oEvent) {
            var oPanel = await this.onCreatePanel("fdrevampxbrowser.view.Fragments.MaterialList", this, "Seleziona Materiale")
            this.byId("vbox").addItem(oPanel);
        },
        onCollapseExpandPress: function () {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },
        onItemSelect: function (oEvent) {
            debugger
            const oRouter = this.getOwnerComponent().getRouter();
            let selected = oEvent.getParameters("item").item.getProperty("text")
            if (selected == 'Collapse/Expand') return
            oRouter.navTo("Palletisation",{'TYPE':selected})
            if (selected == 'Home') {
                if (this.byId("vbox").getItems().length > 1) {
                    this.byId("vbox").getItems().forEach((element, index) => {
                        if (index != 0) {
                            this.byId("vbox").removeItem(element.sId)
                        }
                    });
                    this.getView().getModel("modello").setProperty("/selected", null)
                }
                this.getView().getModel("modelloVisibilit").setProperty("/image", true)
                this.getView().getModel("modelloVisibilit").setProperty("/panel", false)
            }
            switch (selected) {
                case 'Pallettizzazione':
                    this.getView().getModel("modelloVisibilit").setProperty("/image", false)
                    this.getView().getModel("modelloVisibilit").setProperty("/panel", true)
                    break;

                default:
                    break;
            }
        },
        onSave: function () {
            this.getView().getModel("modelloVisibilit").setProperty("/panel", false)
            this.getView().getModel("modelloVisibilit").setProperty("/recap", true)

        }
    });
});