/**
 * @constructor
 */
var PrintPDF = function () {
	this.URL_TYPE = 'url';
	this.BASE64_TYPE = 'base64';
	this.URL_METHOD = 'printWithURL';
	this.BASE64_METHOD = 'printWithData';
};

PrintPDF.prototype.print = function(options) {
	
	options = options || {};
	
	this.type = options.type; // type, either url or base64 (required)
	
	this.data = options.data; // print data, either url string or base64 string (required)
	
	this.title = options.title || ''; // title of document
	
	this.dialogX = options.dialogX || -1; // if a dialog coord is not set, default to -1.
										  // the iOS method will fall back to center on the  
	this.dialogY = options.dialogY || -1; // screen if it gets a dialog coord less than 0.
	
	// make sure callbacks are functions or reset to null
	this.successCallback = (options.success && typeof(options.success) === 'function') ? options.success : null; 
	
	this.errorCallback = (options.error && typeof(options.error) === 'function') ? options.error : null;
		
	// make sure both type and item are set	
	if (!this.type || !this.data) {
		if (this.errorCallback) {
			this.errorCallback({
				success: false,
				error: "Parameters 'type' and 'data' are required."
			});
		}
		return false;
	}
	
	// make sure type is one of the two defined types
	if (this.type !== this.URL_TYPE && this.type !== this.BASE64_TYPE) {
		if (this.errorCallback) {
			this.errorCallback({
				success: false,
				error: "Parameter 'type' must be 'url' or 'base64'."
			});
		}
		return false;
	}	
	
	// depending on the type of data, set the appropriate ios method to call
	var method = (this.type === this.URL_TYPE) ? this.URL_METHOD : this.BASE64_METHOD;
	
	var args = [this.data]; 
	
	if (device.platform === "iOS") {
		
		// add dialog arguments for ios method
		args.push(this.dialogX);
		args.push(this.dialogY);

    }	

	// make the call
    cordova.exec(this.successCallback, this.errorCallback, 'PrintPDF', method, args);
		
}

PrintPDF.prototype.isPrintingAvailable = function (successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'PrintPDF', 'isPrintingAvailable', []);
};

// Plug in to Cordova
cordova.addConstructor(function () {
    if (!window.Cordova) {
        window.Cordova = cordova;
    };

    if (!window.plugins) window.plugins = {};
    window.plugins.PrintPDF = new PrintPDF();
});
