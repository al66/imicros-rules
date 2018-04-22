/**
 * @license MIT, imicros.de (c) 2018 Andreas Leinen
 */
"use strict";

const uuidv4 = require('uuid/v4');

module.exports = {
    name: "rules-engine"

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

		eval: {
			params: {
				__rulesetID: "string"
			},
			handler(ctx) {
                if (this.rulesets[ctx.params.__rulesetID] && {}.toString.call(this.rulesets[ctx.params.__rulesetID].function) === '[object Function]') {
                    return this.rulesets[ctx.params.__rulesetID].function(ctx.params);
                };
                return { error: "unkown ruleset", id: ctx.params.__rulesetID }
			}
		},
    
        create: {
			params: {
				ruleset: "string"
			},
			handler(ctx) {
                let uuid = uuidv4();
                let str = "let r = { result: true }; return r";
                let f = new Function("c", str);
                this.rulesets[uuid] = {};
                this.rulesets[uuid].str = str;
                this.rulesets[uuid].function = f;
				//return `Created Ruleset ${uuid} with :` + ctx.params.ruleset;
                return { id: uuid }
			}
        },
        
        test: {
			handler(ctx) {
				return `Context ${ctx.meta}:` + JSON.stringify(ctx);
			}
        },
        
		update: {
			params: {
                __rulesetID:  "string",
				ruleset: "string"
			},
			handler(ctx) {
				return `Update Ruleset ${ctx.params.__rulesetID} with :` + ctx.params.ruleset;
			}
		},
    
		getFunction: {
			params: {
				__rulesetID: "string"
			},
			handler(ctx) {
                if (this.rulesets[ctx.params.__rulesetID] && {}.toString.call(this.rulesets[ctx.params.__rulesetID].function) === '[object Function]') {
                    return { id: ctx.params.__rulesetID, function: this.rulesets[ctx.params.__rulesetID].function.toString() };
                };
				//return `Called ruleset for eval: ${ctx.params.__rulesetID} - ` + JSON.stringify(ctx.params);
                return { error: "unkown ruleset", id: ctx.params.__rulesetID }
				//return `Get function of ruleset ${ctx.params.__rulesetID}`;
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
        this.rulesets = {};
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