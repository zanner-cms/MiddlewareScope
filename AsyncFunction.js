#!/usr/bin/env node

'use strict';

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

exports.AsyncFunction = AsyncFunction;
