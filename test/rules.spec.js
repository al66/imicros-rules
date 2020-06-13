"use strict";

const { ServiceBroker } = require("moleculer");
const { Rules } = require("../index");

const timestamp = Date.now();

const globalStore ={};

// mock imicros-minio mixin
const Store = (/*options*/) => { return {
    methods: {
        async putString ({ ctx = null, objectName = null, value = null } = {}) {
            if ( !ctx || !objectName ) return false;
            
            let internal = Buffer.from(ctx.meta.acl.ownerId + "~" + objectName).toString("base64");
            
            this.store[internal] = value;
            return true;
        },
        async getString ({ ctx = null, objectName }) {
            if ( !ctx || !objectName ) throw new Error("missing parameter");

            let internal = Buffer.from(ctx.meta.acl.ownerId + "~" + objectName).toString("base64");
            
            return this.store[internal];            
        }   
    },
    created () {
        this.store = globalStore;
    }
};};


describe("Test rules service", () => {

    let broker, service;
    beforeAll(() => {
    });
    
    afterAll(() => {
    });
    
    describe("Test create service", () => {

        it("it should start the broker", async () => {
            broker = new ServiceBroker({
                logger: console,
                logLevel: "info" //"debug"
            });
            service = await broker.createService(Rules, Object.assign({ 
                name: "rules",
                mixins: [Store()]
            }));
            await broker.start();
            expect(service).toBeDefined();
        });

    });
    
    describe("Test evaluate", () => {

        let opts;
        
        beforeEach(() => {
            opts = { 
                meta: { 
                    acl: {
                        accessToken: "this is the access token",
                        ownerId: `g1-${timestamp}`,
                        unrestricted: true
                    }, 
                    user: { 
                        id: `1-${timestamp}` , 
                        email: `1-${timestamp}@host.com` }
                } 
            };
        });
        
        it("it should evaluate ruleset", async () => {
            let params = {
                name: "path/to/ruleset/test.rules",
                data: { user: { age: 25 } }
            };
            let internal = Buffer.from(opts.meta.acl.ownerId + "~" + params.name).toString("base64");
            globalStore[internal] = "@@ @ user.age :: >= 16 & <= 35 => result := 'true' @@";

            return broker.call("rules.eval", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res.result).toEqual("true");
            });
                
        });
        
    });

    describe("Test parse to json", () => {

        let opts;
        
        beforeEach(() => {
            opts = { 
                meta: { 
                    acl: {
                        accessToken: "this is the access token",
                        ownerId: `g1-${timestamp}`,
                        unrestricted: true
                    }, 
                    user: { 
                        id: `1-${timestamp}` , 
                        email: `1-${timestamp}@host.com` }
                } 
            };
        });
        
        it("it should parse ruleset to json", async () => {
            let params = {
                ruleset: "@@ @ user.age :: >= 16 & <= 35 => result := 'true' @@"
            };
            return broker.call("rules.json", params, opts).then(res => {
                expect(res).toBeDefined();
                expect(res.input).toContainEqual({ label: "", source: "user.age", type: "", array: false});
            });
                
        });
        
    });

    describe("Test stop broker", () => {
        it("should stop the broker", async () => {
            expect.assertions(1);
            await broker.stop();
            expect(broker).toBeDefined();
        });
    });

});