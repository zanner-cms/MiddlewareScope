#!/usr/bin/env node

'use strict';


const Middleware = require('zanner-cms-middleware').Middleware;
const Scope = require('zanner-cms-scope').Scope;


class MiddlewareScope extends Scope {

	static init (...args) {
		return Object.freeze(new MiddlewareScope(...args));
	}

	_setKeyValue (key, value) {
		if (value instanceof Middleware) return super._setKeyValue(key, value);
		throw new Error('MiddlewareScope._setKeyValue got value not an Middleware');
	}

	_setObject (object) {
		if (object instanceof Middleware) return super._setKeyValue(object.name, object);
		if (object instanceof Object) {
			let result = Object.keys(object).map(key => {
				let O = object[key] || {};
				let name = O.name;
				let service = O.service;
				let dependencies = O.dependencies;
				let action = O.action;
				this._setKeyValue(key, Middleware.init(name, service, dependencies, action));
			}, this);
			return result.length===1 ? result[0] : result;
		}
		throw new Error('MiddlewareScope._setObject called with non-object');
	}

	apply (key, args) {		
		if (this._is(key)) return this._get(key).apply(args);
		throw new Error('MiddlewareScope.apply called with key not in Scope');
	}

	call (key, ...args) {
		if (this._is(key)) return this._get(key).call(...args);
		throw new Error('MiddlewareScope.call called with key not in Scope');
	}

}

exports.MiddlewareScope = MiddlewareScope;
