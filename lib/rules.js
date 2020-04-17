/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
"use strict";

const { Compiler } = require("imicros-rules-compiler");

module.exports = {
    name: "rules",

	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service metadata
	 */
	metadata: {

	},

	/**
	 * Service dependencies
	 */
	//dependencies: [],	

	/**
	 * Actions
	 */
	actions: {

        /**
         * evaluate ruleset
         * 
         * @actions
         * @param {String} name
         * @param {Object} data
         * 
         * @returns {String} result 
         */
        eval: {
            params: {
                name: [{ type: "string" },{ type: "array" }],
                data: { type: "object" }
            },
            async handler(ctx) {
                if (!await this.isAuthorized({ ctx: ctx, ressource: { ruleset: ctx.params.name }, action: "eval" })) throw new Error("not authorized");
                
				// gateway passes name as array if path is used.. 
                let objectName = Array.isArray(ctx.params.name) ? ctx.params.name.join("/") :ctx.params.name;
				
				// get ruleset as string from object service
                let ruleset = await this.getString({ctx: ctx, objectName: objectName});
				console.log(ruleset);
				// build funtion
				let strFunction = await Compiler.compile(ruleset);
				let f = new Function(strFunction)();
				
				// execute function
                return await f(ctx.params.data);

            }
        }
        
    },
    
    /**
	 * Events
	 */
	events: {

    },

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};