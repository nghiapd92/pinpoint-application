const BaseApplication = require("./BaseApplication");
module.exports = class Application extends BaseApplication{
	constructor(options){
		super(options);
	}

	bootstrap(){
		if(this.debug) this.enableDebugMode();

		return this.dbBootstrap().then(() => {
			this._registerModules();
			this.httpServer.listen(this.httpPort);
		});
	}
}