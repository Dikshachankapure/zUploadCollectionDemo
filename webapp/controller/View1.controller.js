sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/UploadCollectionParameter",
	'sap/m/Dialog',
	'sap/ui/core/Fragment',
	"sap/m/MessageToast",
], function (Controller, UploadCollectionParameter, Dialog, Fragment, MessageToast) {
	"use strict";

	return Controller.extend("Demo.zUploadCollection.controller.View1", {
		onInit: function () {

			var oModel = this.getOwnerComponent().getModel("AttachmentDataSet");
			this.getView().setModel(oModel);

		},
			
		SelectDialogPress: function (oEvent) {

			if (!this._PressoDialog) {
				this._PressoDialog = sap.ui.xmlfragment("Demo.zUploadCollection.fragments.uploadcollection", this);
				this._PressoDialog.setModel(this.getView().getModel());
			}

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._PressoDialog);
			this._PressoDialog.open();
			
			var that = this;
					sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleText());

		},
		OnCancel: function (oEvent) {
			this._PressoDialog.close();
			if (this._PressoDialog) {
				this._PressoDialog.destroy();
				this._PressoDialog = null; // make it falsy so that it can be created next time
			}
		},
		onUploadComplete: function (oEvent) {
			debugger;
			var oUploadCollection = sap.ui.getCore().byId("UploadCollection");
			var oData = oUploadCollection.getModel().getData();
			//	var oData = sap.ui.getCore().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			var oItem = {};
			var sUploadedFile = oEvent.getParameter("files")[0].fileName;
			// at the moment parameter fileName is not set in IE9
			if (!sUploadedFile) {
				var aUploadedFile = (oEvent.getParameters().getSource().getProperty("value")).split(/\" "/);
				sUploadedFile = aUploadedFile[0];
			}
			oItem = {
				"documentId": jQuery.now().toString(), // generate Id,
				"fileName": sUploadedFile,
				"mimeType": "",
				"thumbnailUrl": "",
				"url": "",

			};

			aItems.unshift(oItem);
			sap.ui.getCore().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			// Sets the text to the label
			sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleText());
			// delay the success message for to notice onChange message
			setTimeout(function () {
				MessageToast.show("UploadComplete event triggered.");
			}, 4000);
		},
		onBeforeUploadStarts: function (oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts event triggered.");
		},
		onUploadTerminated: function (oEvent) {
			// get parameter file name
			var sFileName = oEvent.getParameter("fileName");
			// get a header parameter (in case no parameter specified, the callback function getHeaderParameter returns all request headers)
			var oRequestHeaders = oEvent.getParameters().getHeaderParameter();
		},
		onFileDeleted: function (oEvent) {
			debugger;
			this.deleteItemById(oEvent.getParameter("documentId"));
			MessageToast.show("FileDeleted event triggered.");
		},
		deleteItemById: function (sItemToDeleteId) {
			var oData = sap.ui.getCore().byId("UploadCollection").getModel().getData();
			var aItems = jQuery.extend(true, {}, oData).items;
			jQuery.each(aItems, function (index) {
				if (aItems[index] && aItems[index].documentId === sItemToDeleteId) {
					aItems.splice(index, 1);
				};
			});
			sap.ui.getCore().byId("UploadCollection").getModel().setData({
				"items": aItems
			});
			sap.ui.getCore().byId("attachmentTitle").setText(this.getAttachmentTitleText());
		},

		getAttachmentTitleText: function () {
			debugger;
			var aItems = sap.ui.getCore().byId("UploadCollection").getItems();
			return "Uploaded (" + aItems.length + ")";
		},
	});
});