let mongoose = require("mongoose");

module.exports =  class BaseApplication{
	constructor(options){
		try{
			if(!options.express) throw new Error("Express app is missing");

			//Global var
			this.express 			= options.express;
			this.socketio 		= new Object;

			//Setup functions
			this.dbBootstrap 			= options.dbBootstrap;

			//Middleware
			this.middlewares 	= new Array;

			//HTTP Modules
			this.modules 			= options.modules ? options.modules : [];
			this.httpPort 		= options.httpPort ? options.httpPort : 8888;
			this.httpAuth 		= new Object;
			this.registeredModules = []
			
			//DEBUG
			this.debug 				= true;
			if(options.hasOwnProperty("debug")) this.debug = options.debug;
		} catch(err){ console.log(err.message, err.stack) }
	}

	/**
	 * 
	 * 
	 * @param {string} endpoint 
	 * @param {any} middleware 
	 * 
	 * @memberof BaseApplication
	 */
	use(endpoint, middleware){
		this.express.use(endpoint, middleware);
	}

	/**
	 * Đăng ký một http module vào trong hệ thống
	 * 
	 * @param {string} endpoint 
	 * @param {Module} module 
	 */
	registerModule(module){
		//Khởi tạo Module Object
		let authMiddleware = this.httpAuth;

		if(!this.registeredModules[module.name]){
			//Đăng kí module vào trong application
			this.registeredModules[module.name] = true;
			
			//Xử lý auth middleware
			if(module.auth){
				if(module.auth instanceof Array){
					for(let moduleRoute of module.auth){
						this.express.use(module.endpoint + moduleRoute, authMiddleware);
					}
				}

				if(module.auth == "*")
					this.express.use(module.endpoint, authMiddleware);
			}

			//Đăng kí http server
			this.express.use(module.endpoint, module.router);
		} else {
			throw new Error(`Module "${module.name}" đã được đăng kí`);
		}
	}

	/**
	 * Đăng ký toàn bộ modules trong this.modules vào trong hệ thống
	 * 
	 */
	registerModules(){
		for(let module of this.modules) this.registerModule(module);
	}

	enableDebugMode(){
		mongoose.set('debug', true); // turn on mongoose debug
	}
}