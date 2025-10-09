sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "./BaseController",
    "sap/ui/core/Fragment"
], (Controller, BaseController, Fragment) => {
    "use strict";

    return BaseController.extend("fdrevampxbrowser.controller.Pallettizzazione", {
        onInit() {
            this.initModel()

            this._oNavContainer = this.byId("wizardNavContainer");

        },
        initModel: function () {
            let obj = {
                edit: true,
                selected: '',
                numeroMagazzino: '',
                codMateriale: '',
                listaMateriali: [
                    {
                        materiale: "KIT-MTOR",
                        ubicazione: "Magazzino Centrale",
                        prov: "MI",
                        tipo: "Componente Elettrico",
                        divisione: "Produzione",
                        stock_dispo: 450,
                        descrizione_materiale: "Resistenza 10KΩ 1/4W"
                    },
                    {
                        materiale: "KIT-MOTO",
                        ubicazione: "Magazzino Nord",
                        prov: "TO",
                        tipo: "Materia Prima",
                        divisione: "Assemblaggio",
                        stock_dispo: 120,
                        descrizione_materiale: "Lamiera di alluminio spessore 2mm"
                    },
                    {
                        ubicazione: "Stabilimento Sud",
                        prov: "NA",
                        tipo: "Prodotto Finito",
                        divisione: "Vendite",
                        materiale: "KIT-MOTOR",
                        stock_dispo: 35,
                        descrizione_materiale: "Kit motore completo per modello XZ200"
                    },
                    {
                        ubicazione: "Magazzino Est",
                        prov: "VE",
                        tipo: "Componente Meccanico",
                        divisione: "Manutenzione",
                        materiale: "BLT-M8",
                        stock_dispo: 2200,
                        descrizione_materiale: "Bullone M8 in acciaio inox"
                    },
                    {
                        ubicazione: "Deposito Ovest",
                        prov: "GE",
                        tipo: "Materiale di Consumo",
                        divisione: "Logistica",
                        materiale: "NSTR-TAPE",
                        stock_dispo: 560,
                        descrizione_materiale: "Nastro isolante nero 19mm x 20m"
                    }
                ]
            }
            this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "modello")
        },
        onSelectPallettizzazione: async function (oEvent) {
            let wizard = this.byId("wizard")
            this.getView().getModel("modello").setProperty("/edit", false)
            this.getView().getModel("modello").updateBindings()
            let selected = this.getView().getModel("modello").getProperty("/selected")
            //
            let step = await this.createWizardStep("Material Selection", "fdrevampxbrowser.view.Fragments.MaterialSelection", this)
            wizard.addStep(step);
            wizard.nextStep();
            let steps = await this.createWizardStep("Selezione Quantità", "fdrevampxbrowser.view.Fragments.MaterialList", this)
            wizard.addStep(steps);
            wizard.getSteps()[2].setValidated(false)

        },
        createWizardStep: async function (sTitle, FragmentName, wizard) {
            return new sap.m.WizardStep({
                title: sTitle,
                validated: true,
                content: await Fragment.load({
                    name: FragmentName,
                    controller: this,

                })
            });
        },
        onChangeSelectMaterial: function (oEvent) {
            let wizard = this.byId("wizard")
            const itemsSelected = oEvent.getSource().getSelectedItems()
            if (itemsSelected.length != 0) {
                let currentStep = this.getView().byId('wizard').mAggregations._progressNavigator.getCurrentStep();
                wizard.getSteps()[currentStep - 1].setValidated(true)
                this.getOwnerComponent().getModel("modelloAppoggio").setProperty("/Pallettizzazione", {
                    ...oEvent.getSource().getSelectedItem().getBindingContext("modello").getObject(),
                    numeroMagazzino: this.getView().getModel("modello").getProperty("/numeroMagazzino"),
                    numeroStampe: 0,
                    simmetrico: false,
                    quantità: 0

                })
            }
        },
        wizardCompletedHandler: function () {
            this._oNavContainer.to(this.byId("wizardReviewPage"));
        },
        handleWizardCancel: function () {
            this._handleMessageBoxOpen("Are you sure you want to cancel your report?", "warning");
        },

        handleWizardSubmit: function () {
            this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
        },
        _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
            sap.m.MessageBox[sMessageBoxType](sMessage, {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                        this._handleNavigationToStep(0);
                        this.getView().getModel("modello").setProperty("/edit", true)
                        this.byId("wizard").discardProgress(this.byId("wizard").getSteps()[0]);
                    }
                }.bind(this)
            });
        },
        goStepOne: function () {
            this._handleNavigationToStep(0);
            this.byId("wizard").discardProgress(this.byId("wizard").getSteps()[0]);
        },
        goStepTwo: function () {
            this._handleNavigationToStep(1);
        },
        _handleNavigationToStep: function (iStepNumber) {
            var fnAfterNavigate = function () {
                this.byId("wizard").goToStep(this.byId("wizard").getSteps()[iStepNumber]);
                this._oNavContainer.detachAfterNavigate(fnAfterNavigate);

            }.bind(this);


            this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
            this.backToWizardContent();
        },
        backToWizardContent: function () {
            this._oNavContainer.backToPage(this.byId("pageWizard"));
        },
        discardProgress: function () {
            this.byId("wizard").discardProgress(this.byId("Pallettizzazione"));

            var clearContent = function (content) {
                for (var i = 0; i < content.length; i++) {
                    if (content[i].setValue) {
                        content[i].setValue("");
                    }

                    if (content[i].getContent) {
                        clearContent(content[i].getContent());
                    }
                }
            };
            clearContent(this.byId("wizard").getSteps());
        }
    });
});