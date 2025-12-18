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
        // self.getView().setModel(models._mokGetInfo(), "ModelloUser");

        let oView = this.getView();
        oView.setBusy(true);
        xsoDataModelReport.read("/GetInfo", {
          success: function (oDataIn, oResponse) {
            info = oDataIn.results[0].Info;
            user = oDataIn.results[0].User;
            self.getView().setModel(new sap.ui.model.json.JSONModel({ info: info, user: user }), "ModelloUser");
            self.getView().setModel(new sap.ui.model.json.JSONModel({ info: info }), "modelMag");
            oView.setBusy(false);
          },
          error: function (error) {
            console.log("error calling hana DB", error);
            oView.setBusy(false);
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
        if (oEvent.getParameter("item").getText() == "Logout") {
          this.logOutTrasf();
        } else {
          this.byId("pageContainer").to(this.getView().createId(oItem.getKey()));
          if (this.byId("toolPage").getSideExpanded()) {
            this.byId("toolPage").setSideExpanded(false);
          }
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
        let oView = this.getView();
        // const enabled = this._tmEnableStep2();

        // if (!enabled) return;

        // this.getView().getModel("trasferimentoMagazzino").setProperty("/step2/enabled", enabled);

        // validazione step
        let matnr = this.getView().getModel("modelMag").getProperty("/Matnr");
        let info = this.getView().getModel("modelMag").getProperty("/info");
        let Lgnum = this.getView().getModel("modelMag").getProperty("/info/Lgnum");
        let Lgtyp = this.getView().getModel("modelMag").getProperty("/info/Lgtyp");
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        //api call

        if (matnr != "" && matnr != undefined && Lgtyp != "" && Lgtyp != undefined && Lgnum != "" && Lgnum != undefined) {
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

          oView.setBusy(true);
          let materiali = await this._getHanaData("/GetQuantity", aFilters);
          console.log(materiali);

          if (!Array.isArray(materiali)) {
            MessageBox.error(JSON.parse(materiali.responseText).error.message.value, { title: `Errore, codice ${JSON.parse(materiali.responseText).error.code}` });
            step.setValidated(false);
            oView.setBusy(false);
          } else {
            this.getView().setModel(new JSONModel(materiali), "trasferimentoModel");
            oView.setBusy(false);

            if (matnr && info.Werks && info.Lgtyp) {
              step.setValidated(true);
              setTimeout(() => {
                let oWizard = this.byId("wizardTrasferimento");
                let oNextButton = oWizard._getNextButton();
                if (oNextButton) {
                  oNextButton.setText("Continua");
                }
              }, 100);
            } else {
              step.setValidated(false);
            }
          }

          // dati mok da cancellare
          // this.getView().setModel(models._mokGetQuantity(), "trasferimentoModel");

          // if (step.getValidated()) {
          //   step._oNextButton.firePress();
          // }
          //...
        } else {
          step.setValidated(false);
        }
      },

      onTMStep2SelectionChange(e) {
        this.byId("wizardTrasferimento").discardProgress(this.byId("magazino_dest"));
        const { listItem } = e.getParameters();
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        if (listItem) {
          step.setValidated(true);
          setTimeout(() => {
            let oWizard = this.byId("wizardTrasferimento");
            let oNextButton = oWizard._getNextButton();
            if (oNextButton) {
              oNextButton.setText("Continua");
            }
          }, 100);
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

        let cdc;

        if (itemMat.WmList.Schgt) {
          this.byId("centro_costo").setTitle("Inserimento Centro di costo");
          cdc = true;
        } else {
          this.byId("centro_costo").setTitle("Inserimento magazzino");
          cdc = false;
        }

        let model = {
          item: itemMat.WmList,
          Matnr: itemMat.WmList.Matnr,
          Maktx: itemMat.WmList.Maktx,
          Lgort: itemMat.WmList.Lgort,
          Lgpla: itemMat.WmList.Lgpla,
          Lgtyp: itemMat.WmList.Lgtyp,
          new_mag: "",
          quantity: "",
          cdc: cdc,
        };
        this.getView().setModel(new JSONModel(model), "modelloTransf");
        if (cdc) {
          this.getView().getModel("modelloTransf").setProperty("/new_mag", this.getView().getModel("modelMag").getProperty("/info/Kostl"));
        }

        // if (step.getValidated()) {
        //   step._oNextButton.firePress();
        // }
      },

      onTMStep3Change(oEvent) {
        this.byId("wizardTrasferimento").discardProgress(this.byId("centro_costo"));
        this.getView().getModel("modelloTransf").setProperty("/quantity", "");
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        if (oEvent.getSource().getId().split("--").pop() == "new_mag2") {
          if (oEvent.getSource().getValue().length > 1) {
            step.setValidated(true);
            setTimeout(() => {
              let oWizard = this.byId("wizardTrasferimento");
              let oNextButton = oWizard._getNextButton();
              if (oNextButton) {
                oNextButton.setText("Continua");
              }
            }, 100);
          } else {
            step.setValidated(false);
          }
        } else {
          if (oEvent.getSource().getValue().length == 4) {
            step.setValidated(true);
            setTimeout(() => {
              let oWizard = this.byId("wizardTrasferimento");
              let oNextButton = oWizard._getNextButton();
              if (oNextButton) {
                oNextButton.setText("Continua");
              }
            }, 100);
          } else {
            step.setValidated(false);
            MessageBox.warning("Il valore non può essere diverso da 4 cifre");
          }
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

      onTMStep3LiveChange(oEvent) {
        // debugger;
        let step = this.byId(this.byId("wizardTrasferimento").getCurrentStep());

        this.byId("wizardTrasferimento").discardProgress(this.byId("centro_costo"));
        this.getView().getModel("modelloTransf").setProperty("/quantity", "");

        const oInput = oEvent.getSource();
        let sValue = oInput.getValue();

        // rimuove tutto ciò che non è numero
        sValue = sValue.replace(/\D/g, "");

        // taglia a 4 cifre
        if (sValue.length > 4) {
          sValue = sValue.substring(0, 4);
        } else if (oEvent.getSource().getValue().length === 4) {
          step.setValidated(true);
          setTimeout(() => {
            let oWizard = this.byId("wizardTrasferimento");
            let oNextButton = oWizard._getNextButton();
            if (oNextButton) {
              oNextButton.setText("Continua");
            }
          }, 100);
        }

        oInput.setValue(sValue);
        if (oInput.getValue().length != 4) {
          step.setValidated(false);
        } else {
          step.setValidated(true);
          setTimeout(() => {
            let oWizard = this.byId("wizardTrasferimento");
            let oNextButton = oWizard._getNextButton();
            if (oNextButton) {
              oNextButton.setText("Continua");
            }
          }, 50);
        }

        // if (oEvent.getSource().getId().split("--").pop() == "new_mag2") {
        //   step.setValidated(true);
        //   setTimeout(() => {
        //     let oWizard = this.byId("wizardTrasferimento");
        //     let oNextButton = oWizard._getNextButton();
        //     if (oNextButton) {
        //       oNextButton.setText("Continua");
        //     }
        //   }, 100);
        // } else {
        //   if (oEvent.getSource().getValue().length === 4) {
        //     step.setValidated(true);
        //     setTimeout(() => {
        //       let oWizard = this.byId("wizardTrasferimento");
        //       let oNextButton = oWizard._getNextButton();
        //       if (oNextButton) {
        //         oNextButton.setText("Continua");
        //       }
        //     }, 100);
        //   } else {
        //     step.setValidated(false);
        //   }
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
            WmList: item,
            Umlgo: new_mag,
            Menge: qta,
            User: userName,
          };

          delete data.Info.Matnr;
          // MessageBox.success("Materiale trasportato con successo!");
          this.getView().setBusy(true);
          let response = await this._postHanaData("/BookBulk", data);
          console.log(response);
          this.getView().setBusy(false);

          if (response.statusCode == "400") {
            MessageBox.error(JSON.parse(response.responseText).error.message.value, { title: `Errore, codice ${JSON.parse(response.responseText).error.code}` });
          } else {
            MessageBox.success("Registrazione effettuata.");
            this.byId("wizardTrasferimento").discardProgress(this.byId("trasferimento_linea"));
            this.getView().getModel("modelloTransf").setData({});
            this.getView().getModel("trasferimentoModel").setData({});
            this.getView().getModel("ModelloUser").setProperty("/info/Matnr", "");
            this.getView().byId("trasferimento_linea").setValidated(false);
          }
        }
      },

      onStepActivate: function (oEvent) {
        // debugger;

        let stepId = oEvent.getSource().getId().split("--").pop();
        const oMap = {
          trasferimento_linea: "Matnr",
          centro_costo: "new_mag",
          quantita: "quantity",
        };
        let inputId = oMap[stepId];
        let input = this.byId(inputId);

        if (stepId == "centro_costo") {
          if (this.getView().getModel("modelloTransf").getProperty("/cdc")) {
            this.byId(oEvent.getSource().getId()).setValidated(true);
            setTimeout(() => {
              let oWizard = this.byId("wizardTrasferimento");
              let oNextButton = oWizard._getNextButton();
              if (oNextButton) {
                oNextButton.setText("Continua");
              }
            }, 100);
          }
        }

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
