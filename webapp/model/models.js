sap.ui.define(
  ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
  function (JSONModel, Device) {
    "use strict";

    return {
      /**
       * Provides runtime information for the device the UI5 app is running on as a JSONModel.
       * @returns {sap.ui.model.json.JSONModel} The device model.
       */
      createDeviceModel: function () {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },

      createTrasferimentoMagazzinoModel() {
        return new JSONModel({
          step1: {
            enabled: true,
            magazzino: {
              lgort: "",
              tipo: "",
            },
            materiale: {
              matnr: "",
            },
          },
          step2: {
            enabled: false,
            materiale: {
              werks: "3980",
              lgort: "0001",
              matnr: "105555",
              maktx: "PIEDE REGOLABILE M12 H102",
            },
            list: {
              items: [
                {
                  vlpla: "TERRA",
                  labst: "152",
                  meins: "PZ",
                },
                {
                  vlpla: "03-18-04",
                  labst: "500",
                  meins: "PZ",
                },
              ],
            },
          },
          step3: {
            enabled: false,
            magazzino: {
              werks: "",
              lgort: "",
              tipo: "",
            },
            materiale: {
              matnr: "",
              maktx: "",
              vlpla: "",
              labst: "",
              meins: "",
            },
            new_magazzino: {
              lgort: "",
            },
          },
          step4: {
            enabled: false,
            magazzino: {
              werks: "",
              lgort: "",
              tipo: "",
            },
            materiale: {
              matnr: "",
              maktx: "",
              vlpla: "",
              labst: "",
              meins: "",
              nsola: ""
            },
            new_magazzino: {
              werks: "",
              lgort: "",
              tipo: "",
            },
          },
        });
      },
    };
  }
);
