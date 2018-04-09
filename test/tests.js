#!/usr/bin/env node

'use strict';


const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const mlog = require('mocha-logger');
const util = require('util');

const Middleware = require('zanner-cms-middleware').Middleware;

const MiddlewareScope = require('../MiddlewareScope').MiddlewareScope;
const AsyncFunction = require('../AsyncFunction').AsyncFunction;


describe('AsyncFunction', () => {

	it('is async function class', () => {
		expect(async function () {}).to.be.instanceof(AsyncFunction);
	});

});

describe('MiddlewareScope', () => {

	describe('static', () => {

		it('MiddlewareScope is a function', (done) => {
			expect(MiddlewareScope).to.be.an.instanceof(Function);
			done();
		});

		it('MiddlewareScope.init is a function', (done) => {
			expect(MiddlewareScope.init).to.be.an.instanceof(Function);
			done();
		});

		it('MiddlewareScope.init creates instanceof Middleware', (done) => {
			expect(MiddlewareScope.init()).to.be.an.instanceof(MiddlewareScope);
			done();
		});

	});
	
	describe('instance', () => {

		it('MiddlewareScope creates instanceof MiddlewareScope with Middleware', (done) => {
			let M = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				action: async function () {}
			};

			expect(new MiddlewareScope({name: M})).to.be.an.instanceof(MiddlewareScope);
			done();
		});

		it('MiddlewareScope._setKeyValue', (done) => {
			let name = 'name';
			let service = 'service';
			let dependencies = ['dependency 1', 'dependency 2'];
			let action = async function () {};
			let M = Middleware.init(name, service, dependencies, action);
			let m = MiddlewareScope.init();
			m._setKeyValue('name', M);

			expect(m.keys).to.have.members(['name']);
			done();
		});

		it('MiddlewareScope._setObject', (done) => {
			let M = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				action: async function () {}
			};
			let m = MiddlewareScope.init();
			m._setObject({name: M});

			expect(m.keys).to.have.members(['name']);
			done();
		});

		it('MiddlewareScope.apply exec', (done) => {
			let M = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				action: async function (x, y) { return x + y; }
			};
			let m = MiddlewareScope.init({name: M});

			expect(m.apply).to.be.an.instanceof(Function);
			expect(m.apply('name', [13, 31])).to.eventually.equal(13 + 31).notify(done);
			//m.apply('name', [13, 31]).should.eventually.equal(44).notify(done);
		});

		it('MiddlewareScope.apply exec with throw', (done) => {
			let M = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				action: async function (x, y) { throw new Error('MiddlewareScope.apply'); }
			};
			let m = MiddlewareScope.init({name: M});

			expect(m.apply('name', [13, 31])).to.be.rejectedWith('MiddlewareScope.apply').notify(done);
		});

		it('MiddlewareScope.call exec', (done) => {
			let M = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				action: async function (x, y) { return x + y; }
			};
			let m = MiddlewareScope.init({name: M});

			expect(m.call).to.be.an.instanceof(Function);
			expect(m.call('name', 13, 31)).to.eventually.equal(13 + 31).notify(done);
			//m.call('name', 13, 31).should.eventually.equal(44).notify(done);
		});

		it('MiddlewareScope.call exec with throw', (done) => {
			let M = {
				name: 'name',
				service: 'service',
				dependencies: ['dependency 1', 'dependency 2'],
				action: async function (x, y) { throw new Error('MiddlewareScope.call'); }
			};
			let m = MiddlewareScope.init({name: M});

			expect(m.apply('name', 13, 31)).to.be.rejectedWith('MiddlewareScope.call').notify(done);
		});

	});

});
