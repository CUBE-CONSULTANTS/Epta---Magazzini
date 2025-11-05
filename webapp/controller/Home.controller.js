sap.ui.define(
  ["sap/ui/core/Fragment", "./BaseController", "../model/models"],
  (Fragment, BaseController, models) => {
    "use strict";

    return BaseController.extend("fdrevampxbrowser.controller.Home", {
      onInit() {
        this.getView().setModel(
          new sap.ui.model.json.JSONModel({
            image: true,
            panel: false,
            recap: false,
          }),
          "modelloVisibilit"
        );
        this.createModel(this);
        this.getView().setModel(
          models.createTrasferimentoMagazzinoModel(),
          "trasferimentoMagazzino"
        );
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
        var oPanel = await this.onCreatePanel(
          "fdrevampxbrowser.view.Fragments.MaterialSelection",
          this,
          "2. Materiale"
        );
        //debugger
        this.byId("materiale").addContent(oPanel);
      },
      onListaMateriali: async function (oEvent) {
        var oPanel = await this.onCreatePanel(
          "fdrevampxbrowser.view.Fragments.MaterialList",
          this,
          "3. Seleziona Materiale"
        );
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
          this.getView()
            .getModel("modelloVisibilit")
            .setProperty("/image", true);
          this.getView()
            .getModel("modelloVisibilit")
            .setProperty("/panel", false);
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
        const { magazzino, materiale } = this.getView()
          .getModel("trasferimentoMagazzino")
          .getProperty("/step1");

        if (!magazzino.lgort) return false;
        if (!magazzino.tipo) return false;
        if (!materiale.matnr) return false;

        return true;
      },

      _tmCheckStep3() {
        const { new_magazzino } = this.getView()
          .getModel("trasferimentoMagazzino")
          .getProperty("/step3");

        if (!new_magazzino.lgort) return false;

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

      onTMStep1Change() {
        const enabled = this._tmEnableStep2();

        if (!enabled) return;

        this.getView()
          .getModel("trasferimentoMagazzino")
          .setProperty("/step2/enabled", enabled);

        //api call

        //...
      },

      onTMStep2SelectionChange(e) {
        const { listItem } = e.getParameters();

        if (!listItem) return;

        const contextUbicazione = listItem.getBindingContext(
          "trasferimentoMagazzino"
        );

        this.getView()
          .getModel("trasferimentoMagazzino")
          .setProperty("/step3", {
            enabled: true,
            magazzino: {
              werks: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step2/materiale/werks"),
              lgort: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step1/magazzino/lgort"),
              tipo: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step1/magazzino/tipo"),
            },
            materiale: {
              matnr: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step2/materiale/matnr"),
              maktx: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step2/materiale/maktx"),
              vlpla: contextUbicazione.getProperty("vlpla"),
              labst: contextUbicazione.getProperty("labst"),
              meins: contextUbicazione.getProperty("meins"),
            },
            new_magazzino: {
              lgort: "",
            },
          });
      },

      onTMStep3Change() {
        const enabled = this._tmEnableStep4();

        if (!enabled) return;

        this.getView()
          .getModel("trasferimentoMagazzino")
          .setProperty("/step4/enabled", enabled);

        // api call
        const new_magazzino = { werks: "3980", lgort: "Z001", tipo: "004" };
        //

        this.getView()
          .getModel("trasferimentoMagazzino")
          .setProperty("/step4", {
            enabled: true,
            magazzino: {
              werks: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/magazzino/werks"),
              lgort: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/magazzino/lgort"),
              tipo: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/magazzino/tipo"),
            },
            materiale: {
              matnr: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/materiale/matnr"),
              maktx: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/materiale/maktx"),
              vlpla: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/materiale/vlpla"),
              labst: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/materiale/labst"),
              meins: this.getView()
                .getModel("trasferimentoMagazzino")
                .getProperty("/step3/materiale/meins"),
              nsola: "",
            },
            new_magazzino: {
              werks: new_magazzino.werks,
              lgort: new_magazzino.lgort,
              tipo: new_magazzino.tipo,
            },
          });
      },
    });
  }
);
