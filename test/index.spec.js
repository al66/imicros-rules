"use strict";

const { ServiceBroker } = require("moleculer");
const RulesService = require("../lib/service");

describe("Test rules-engine service", () => {

    describe("Test created", () => {

        it("should be created", () => {
			const broker = new ServiceBroker();
			const service = broker.createService(RulesService);
			expect(service).toBeDefined();
		});
    });

    describe("Test create rule", () => {

        let broker, service;
		beforeEach(() => {
			broker = new ServiceBroker();
			service = broker.createService(RulesService);
        });
        
        it("should return uuid for created rule", () => {
            let params = {
				ruleset: "RULESET_ @ user.age :: >= 16 & <= 35 => result := 'true' _RULESET"
			};

            return broker.call("rules-engine.create", params).then(res => {
                expect(res.id).toBeDefined();
            });
        });
        
        it("should return uuid for created rule which can be evaluated", () => {
            let params = {
				ruleset: "RULESET_ @ user.age :: >= 16 & <= 35 => result := 'true' _RULESET"
			};

            return broker.call("rules-engine.create", params).then(res => {
                expect(res.id).toBeDefined();
                params = { user: { age : 16 }, __rulesetID : res.id };
                return broker.call("rules-engine.eval", params).then(res => {
                    expect(res.result).toBeDefined();
                    expect(res.result).toBe(true);
                });
            });
        });
    });
});