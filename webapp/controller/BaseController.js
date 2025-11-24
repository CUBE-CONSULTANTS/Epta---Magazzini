sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";
    return Controller.extend("fdrevampxbrowser.controller.BaseController", {
      onNavBack: function (oEvent) {
        let oNavContainer = this.byId("pageContainer");
        if (oNavContainer.getPreviousPage()) {
          oNavContainer.back();
        } else {
          oNavContainer.to("page2");
        }
      },
      _setToggleButtonTooltip: function (bLarge) {
        var oToggleButton = this.byId("sideNavigationToggleButton");
        if (bLarge) {
          oToggleButton.setTooltip("Large Size Navigation");
        } else {
          oToggleButton.setTooltip("Small Size Navigation");
        }
      },
      onSideNavButtonPress: function () {
        //debugger
        var oToolPage = this.byId("toolPage");
        var bSideExpanded = oToolPage.getSideExpanded();

        this._setToggleButtonTooltip(bSideExpanded);

        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },

      onNavHome: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },
      onChangeSelectMaterial: function (oEvent) {
        const itemsSelected = oEvent.getSource().getSelectedItems();
        if (itemsSelected.length != 0) {
          //debugger
          this.getView().getModel("modello").setProperty("/enableSave", true);
          this.getOwnerComponent()
            .getModel("modelloAppoggio")
            .setProperty("/Pallettizzazione", {
              ...oEvent.getSource().getSelectedItem().getBindingContext("modello").getObject(),
              numeroMagazzino: this.getView().getModel("modello").getProperty("/numeroMagazzino"),
              numeroStampe: 0,
              simmetrico: false,
              quantità: 0,
            });
        }
      },
      createModel: function (self) {
        let obj = {
          edit: true,
          selected: "",
          enableSave: false,
          numeroMagazzino: "",
          codMateriale: "",
          listaMateriali: [
            {
              materiale: "KIT-MTOR",
              ubicazione: "Magazzino Centrale",
              prov: "MI",
              tipo: "Componente Elettrico",
              divisione: "Produzione",
              stock_dispo: 450,
              descrizione_materiale: "Resistenza 10KΩ 1/4W",
            },
            {
              materiale: "KIT-MOTO",
              ubicazione: "Magazzino Nord",
              prov: "TO",
              tipo: "Materia Prima",
              divisione: "Assemblaggio",
              stock_dispo: 120,
              descrizione_materiale: "Lamiera di alluminio spessore 2mm",
            },
            {
              materiale: "KIT-MOTO",
              ubicazione: "Magazzino Nord",
              prov: "TO",
              tipo: "Materia Prima",
              divisione: "Assemblaggio",
              stock_dispo: 120,
              descrizione_materiale: "Lamiera di alluminio spessore 2mm",
            },
            {
              materiale: "KIT-MOTO",
              ubicazione: "Magazzino Nord",
              prov: "TO",
              tipo: "Materia Prima",
              divisione: "Assemblaggio",
              stock_dispo: 120,
              descrizione_materiale: "Lamiera di alluminio spessore 2mm",
            },
            {
              materiale: "KIT-MOTO",
              ubicazione: "Magazzino Nord",
              prov: "TO",
              tipo: "Materia Prima",
              divisione: "Assemblaggio",
              stock_dispo: 120,
              descrizione_materiale: "Lamiera di alluminio spessore 2mm",
            },
            {
              ubicazione: "Stabilimento Sud",
              prov: "NA",
              tipo: "Prodotto Finito",
              divisione: "Vendite",
              materiale: "KIT-MOTOR",
              stock_dispo: 35,
              descrizione_materiale: "Kit motore completo per modello XZ200",
            },
            {
              ubicazione: "Magazzino Est",
              prov: "VE",
              tipo: "Componente Meccanico",
              divisione: "Manutenzione",
              materiale: "BLT-M8",
              stock_dispo: 2200,
              descrizione_materiale: "Bullone M8 in acciaio inox",
            },
            {
              ubicazione: "Deposito Ovest",
              prov: "GE",
              tipo: "Materiale di Consumo",
              divisione: "Logistica",
              materiale: "NSTR-TAPE",
              stock_dispo: 560,
              descrizione_materiale: "Nastro isolante nero 19mm x 20m",
            },
          ],
        };
        self.getView().setModel(new sap.ui.model.json.JSONModel(obj), "modello");
      },

      //funzione per chiamata alle entity
      _getHanaData: function (Entity, Filters) {
        var xsoDataModelReport = this.getOwnerComponent().getModel();
        return new Promise(function (resolve, reject) {
          xsoDataModelReport.read(Entity, {
            filters: Filters,
            success: function (oDataIn, oResponse) {
              resolve(oDataIn.results);
            },
            error: function (error) {
              reject(console.log("error calling hana DB", error));
            },
          });
        });
      },
    });
  }
);
