import test from 'node:test';
import assert from 'node:assert/strict';
import {FEATURES_DEFAULT, featuresEnabled} from '../src/features.js';

test('yield tools are on by default, including production, unless FEATURES_ON=0', () => {
  assert.equal(FEATURES_DEFAULT, true);
  assert.equal(featuresEnabled({}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'preview'}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'development'}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production'}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production', FEATURES_ON: '1'}), true);
  assert.equal(featuresEnabled({FEATURES_ON: '1'}), true);
  assert.equal(featuresEnabled({FEATURES_ON: 'true'}), true);
  assert.equal(featuresEnabled({FEATURES_ON: '0'}), false);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production', FEATURES_ON: '0'}), false);
  assert.equal(featuresEnabled({VERCEL_ENV: 'preview', FEATURES_ON: '0'}), false);
});
