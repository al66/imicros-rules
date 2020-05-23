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
            acl: "before",
            params: {
                name: [{ type: "string" },{ type: "array" }],
                data: { type: "object" }
            },
            async handler(ctx) {
                
				// gateway passes name as array if path is used.. 
                let objectName = Array.isArray(ctx.params.name) ? ctx.params.name.join("/") :ctx.params.name;
				
				// get ruleset as string from object service
                let ruleset;
                try {
                    ruleset = await this.getString({ctx: ctx, objectName: objectName});
                } catch (err) {
                    this.logger.debug("Failed to retrieve ruleset", {err: err});
                    return null;
                }
                
                // build funtion
                let f;
                try {
                    let strFunction = await Compiler.compile(ruleset);
                    f = new Function(strFunction)();
                } catch (err) {
                    this.logger.debug("Failed to compile ruleset", {err: err});
                    return null;
                }

                // execute function
                try {
                    return await f(ctx.params.data);
                } catch (err) {
                    this.logger.debug("Failed to execute ruleset", {err: err});
                    return null;
                }
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