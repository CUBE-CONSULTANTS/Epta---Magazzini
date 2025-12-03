sap.ui.define(
  ["sap/ui/core/Fragment", "./BaseController", "../model/models", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel", "sap/m/MessageBox"],
  (Fragment, BaseController, models, Filter, FilterOperator, JSONModel, MessageBox) => {
    "use strict";

    return BaseController.extend("fdrevampxbrowser.controller.Home", {
      async onInit() {
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({
            image: true,
            panel: false,
            recap: false,
          }),
          "modelloVisibilit"
        );
        this.createModel(this);
        // this.getView().setModel(models.createTrasferimentoMagazzinoModel(), "trasferimentoMagazzino");

        // creazione modello info e user
        let xsoDataModelReport = this.getOwnerComponent().getModel();
        let user;
        let info;
        let self = this;

        // dati mok da cancellare
        self.getView().setModel(models._mokGetInfo(), "ModelloUser");

        xsoDataModelReport.read("/GetInfo(User='MHD_RM_3980')", {
          success: function (oDataIn, oResponse) {
            info = oDataIn.Info;
            user = oDataIn.User;
            self.getView().setModel(new sap.ui.model.json.JSONModel({ info: info, user: user }), "ModelloUser");
          },
          error: function (error) {
            console.log("error calling hana DB", error);
          },
        });
      },
      onCreatePanel: async function (filename, self, title) {
        return new sap.m.Panel({
          headerText: title,
          expandable: false,
          expanded: true,
          width: "auto",
          content: await Fragment.load({
            name: filename,
            controller: self,
          }),
        });
      },
      onSelectPallettizzazione: async function (oEvent) {
        var oPanel = await this.onCreatePanel("fdrevampxbrowser.view.Fragments.MaterialSelection", this, "2. Materiale");
        //debugger
        this.byId("materiale").addContent(oPanel);
      },
      onListaMateriali: async function (oEvent) {
        var oPanel = await this.onCreatePanel("fdrevampxbrowser.view.Fragments.MaterialList", this, "3. Seleziona Materiale");
        this.byId("materiale").addContent(oPanel);
      },
      onQuickActionPress: function (oEvent) {
        //debugger
        var oItem = oEvent.getParameter("item");
        this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
        if (this.byId("toolPage").getSideExpanded()) {
          this.byId("toolPage").setSideExpanded(false);
        }
      },
      onCollapseExpandPress: function () {
        const oSideNavigation = this.byId("sideNavigation"),
          bExpanded = oSideNavigation.getExpanded();

        oSideNavigation.setExpanded(!bExpanded);
      },
      onItemSelect: function (oEvent) {
        let selected = oEvent.getParameters("item").item.getProperty("text");
        if (selected == "Collapse/Expand") return;
        if (selected == "Home") {
          if (this.byId("vbox").getItems().length > 1) {
            this.byId("vbox")
              .getItems()
              .forEach((element, index) => {
                if (index != 0) {
                  this.byId("vbox").removeItem(element.sId);
                }
              });
            this.getView().getModel("modello").setProperty("/selected", null);
          }
          this.getView().getModel("modelloVisibilit").setProperty("/image", true);
          this.getView().getModel("modelloVisibilit").setProperty("/panel", false);
        }
        switch (selected) {
          case "Pallettizzazione":
            //debugger
            break;

          default:
            break;
        }
      },
      onSave: function () {
        this.byId("pageContainer").to(this.getView().createId("review"));
      },

      //trasferimento magazzino

      _tmCheckStep1() {
        const { Matnr, Werks, Lgtyp } = this.getView().getModel("ModelloUser").getProperty("/info");

        if (!Matnr) return false;
        if (!Werks) return false;
        if (!Lgtyp) return false;

        return true;
      },

      _tmCheckStep3() {
        const { new_mag } = this.getView().getModel("modelloTransf").getData();

        if (!new_mag) return false;

        return true;
      },

      _tmEnableStep2() {
        if (!this._tmCheckStep1()) return false;

        return true;
      },

      _tmEnableStep4() {
        if (!this._tmCheckStep3()) return false;

        return true;
      },

      async onTMStep1Change() {
        this.byId("wizardTrasferimento").discardProgress(this.byId("trasferimento_linea"));
        // const enabled = this._tmEnableStep2();

        // if (!enabled) return;

        // this.getView().getModel("trasferimentoMagazzino").setProperty("/step2/enabled", enabled);

        // validazione step
        let matnr = this.getView().getModel("ModelloUser").getProperty("/info/Matnr");
        let info = this.getView().getModel("ModelloUser").getProperty("/info");
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        if (matnr && info.Werks && info.Lgtyp) {
          step.setValidated(true);
        } else {
          step.setValidated(false);
        }

        //api call

        //    new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.EQ, sMatnr),
        // new sap.ui.model.Filter("Info/Werks", sap.ui.model.FilterOperator.EQ, sWerks),
        // new sap.ui.model.Filter("Info/Lgort", sap.ui.model.FilterOperator.EQ, sLgort)
        let aMatnr = new Filter({ path: "Matnr", operator: FilterOperator.EQ, value1: matnr });
        // let aWerks = new Filter({ path: "Info/Werks", operator: FilterOperator.EQ, value1: this.getView().getModel("ModelloUser").getProperty("/info/Werks") });
        // let aKostl = new Filter({ path: "Info/Kostl", operator: FilterOperator.EQ, value1: this.getView().getModel("ModelloUser").getProperty("/info/Kostl") });
        // let aLgnum = new Filter({ path: "Info/Lgnum", operator: FilterOperator.EQ, value1: this.getView().getModel("ModelloUser").getProperty("/info/Lgnum") });
        // let aLgort = new Filter({ path: "Info/Lgort", operator: FilterOperator.EQ, value1: this.getView().getModel("ModelloUser").getProperty("/info/Lgort") });
        // let aLgtyp = new Filter({ path: "Info/Lgtyp", operator: FilterOperator.EQ, value1: this.getView().getModel("ModelloUser").getProperty("/info/Lgtyp") });

        let arr = Object.entries(info).map(([key, value]) => {
          if (key != "__metadata" && key != "Matnr") {
            return new Filter({ path: `Info/${key}`, operator: FilterOperator.EQ, value1: value });
          }
        });

        let aFilters = [aMatnr, arr.filter(Boolean)].flat();

        // let aFilters = [
        //   new Filter({
        //     path: "Matnr",
        //     operator: FilterOperator.EQ,
        //     value1: matnr,
        //   }),
        // ];

        // let materiali = await this._getHanaData("/GetQuantity", aFilters);
        // console.log(materiali);
        // this.getView().setModel(new JSONModel(materiali), "trasferimentoModel");
        // dati mok da cancellare
        this.getView().setModel(models._mokGetQuantity(), "trasferimentoModel");

        // if (step.getValidated()) {
        //   step._oNextButton.firePress();
        // }
        //...
      },

      onTMStep2SelectionChange(e) {
        this.byId("wizardTrasferimento").discardProgress(this.byId("magazino_dest"));
        const { listItem } = e.getParameters();
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        if (listItem) {
          step.setValidated(true);
        } else {
          step.setValidated(false);
        }

        let itemMat = listItem.getBindingContext("trasferimentoModel").getObject();

        // this.getView()
        //   .getModel("trasferimentoMagazzino")
        //   .setProperty("/step3", {
        //     enabled: true,
        //     magazzino: {
        //       werks: this.getView().getModel("trasferimentoMagazzino").getProperty("/step2/materiale/werks"),
        //       lgort: this.getView().getModel("trasferimentoMagazzino").getProperty("/step1/magazzino/lgort"),
        //       tipo: this.getView().getModel("trasferimentoMagazzino").getProperty("/step1/magazzino/tipo"),
        //     },
        //     materiale: {
        //       matnr: this.getView().getModel("trasferimentoMagazzino").getProperty("/step2/materiale/matnr"),
        //       maktx: this.getView().getModel("trasferimentoMagazzino").getProperty("/step2/materiale/maktx"),
        //       vlpla: contextUbicazione.getProperty("vlpla"),
        //       labst: contextUbicazione.getProperty("labst"),
        //       meins: contextUbicazione.getProperty("meins"),
        //     },
        //     new_magazzino: {
        //       lgort: "",
        //     },
        //   });

        let model = {
          item: itemMat.WmList,
          Matnr: itemMat.WmList.Matnr,
          Maktx: itemMat.WmList.Maktx,
          Lgort: itemMat.WmList.Lgort,
          Lgpla: itemMat.WmList.Lgpla,
          Lgtyp: itemMat.WmList.Lgtyp,
          new_mag: "",
          quantity: "",
        };
        this.getView().setModel(new JSONModel(model), "modelloTransf");

        // if (step.getValidated()) {
        //   step._oNextButton.firePress();
        // }
      },

      onTMStep3Change() {
        this.byId("wizardTrasferimento").discardProgress(this.byId("centro_costo"));
        const wizard = this.byId("wizardTrasferimento");
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        if (this.getView().getModel("modelloTransf").getProperty("/new_mag") && this.getView().getModel("modelloTransf").getProperty("/new_mag") != "") {
          step.setValidated(true);
        } else {
          step.setValidated(false);
        }

        // const enabled = this._tmEnableStep4();
        // if (!enabled) return;
        // this.getView().getModel("trasferimentoMagazzino").setProperty("/step4/enabled", enabled);
        // // api call
        // const new_magazzino = { werks: "3980", lgort: "Z001", tipo: "004" };
        // //
        // this.getView()
        //   .getModel("trasferimentoMagazzino")
        //   .setProperty("/step4", {
        //     enabled: true,
        //     magazzino: {
        //       werks: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/magazzino/werks"),
        //       lgort: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/magazzino/lgort"),
        //       tipo: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/magazzino/tipo"),
        //     },
        //     materiale: {
        //       matnr: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/materiale/matnr"),
        //       maktx: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/materiale/maktx"),
        //       vlpla: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/materiale/vlpla"),
        //       labst: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/materiale/labst"),
        //       meins: this.getView().getModel("trasferimentoMagazzino").getProperty("/step3/materiale/meins"),
        //       nsola: "",
        //     },
        //     new_magazzino: {
        //       werks: new_magazzino.werks,
        //       lgort: new_magazzino.lgort,
        //       tipo: new_magazzino.tipo,
        //     },
        //   });

        // if (step.getValidated()) {
        //   step._oNextButton.firePress();
        // }
      },

      onTMStep4Change() {
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        if (this.getView().getModel("modelloTransf").getProperty("/quantity") && this.getView().getModel("modelloTransf").getProperty("/quantity") != "") {
          step.setValidated(true);
        } else {
          step.setValidated(false);
        }
      },

      gnegne: async function () {
        let { Lgort, Lgpla, Lgtyp, Maktx, Matnr, item, new_mag } = this.getView().getModel("modelloTransf").getData();

        if (!Lgort || !Lgpla || !Lgtyp || !Maktx || !Matnr || !item || !new_mag) {
          new sap.m.MessageBox.error("Per favore inserire gli elementi obbligatori");
        } else {
          let info = this.getView().getModel("ModelloUser").getProperty("/info");
          let qta = this.getView().getModel("modelloTransf").getProperty("/quantity");
          let userName = "ELENA";
          let data = {
            Info: info,
            Wmlist: item,
            Umlgo: new_mag,
            Menge: qta,
            User: userName,
          };

          MessageBox.success("Materiale trasportato con successo!");
          let response = await this._postHanaData("/BookBulk", data);
          console.log(response);
        }
      },

      onStepActivate: function (oEvent) {
        debugger;

        let stepId = oEvent.getSource().getId().split("--").pop();
        const oMap = {
          trasferimento_linea: "Matnr",
          centro_costo: "new_mag",
          quantita: "quantity",
        };
        let inputId = oMap[stepId];
        let input = this.byId(inputId);

        setTimeout(function () {
          input.$().find("input").focus();
          input.$().find("input").attr("readonly", true);
          setTimeout(function () {
            // Remove readonly attribute after keyboard is hidden.
            input.$().find("input").removeAttr("readonly");
          }, 300);
        }, 300);
      },
    });
  }
);
