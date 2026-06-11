#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

// Agregar jbang al PATH si no esta
const jbangBin = path.join(process.env.USERPROFILE || process.env.HOME || '', '.jbang', 'bin');
process.env.PATH = jbangBin + path.delimiter + process.env.PATH;

const args = process.argv.slice(2);
const karateArgs = args.length > 0 ? args.join(' ') : 'karate';

const configDir = path.resolve(__dirname, 'karate');
const cmd = `jbang -Dkarate.config.dir="${configDir}" com.intuit.karate:karate-core:LATEST:all ${karateArgs}`;
console.log('Ejecutando:', cmd);

try {
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
} catch (err) {
  process.exit(err.status || 1);
}
