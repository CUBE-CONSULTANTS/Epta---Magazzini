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
                expandable: false,
                expanded: true,
                width: "auto",
                content: await Fragment.load({
                    name: filename,
                    controller: self
                })
            });
        },
        onSelectPallettizzazione: async function (oEvent) {
            var oPanel = await this.onCreatePanel("fdrevampxbrowser.view.Fragments.MaterialSelection", this, "2. Materiale")
            //debugger
            this.byId("materiale").addContent(oPanel);
        },
        onListaMateriali: async function (oEvent) {
            var oPanel = await this.onCreatePanel("fdrevampxbrowser.view.Fragments.MaterialList", this, "3. Seleziona Materiale")
            this.byId("materiale").addContent(oPanel);
        },
        onQuickActionPress: function (oEvent) {
            //debugger
            var oItem = oEvent.getParameter("item");
            this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        },
        onCollapseExpandPress: function () {
            const oSideNavigation = this.byId("sideNavigation"),
                bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },
        onItemSelect: function (oEvent) {
            let selected = oEvent.getParameters("item").item.getProperty("text")
            if (selected == 'Collapse/Expand') return
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
                    //debugger
                    break;

                default:
                    break;
            }
        },
        onSave: function () {
            this.byId("pageContainer").to(this.getView().createId('review'));
        }
    });
});