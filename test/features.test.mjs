import test from 'node:test';
import assert from 'node:assert/strict';
import {featuresEnabled} from '../src/features.js';

test('feature flag follows VERCEL_ENV unless FEATURES_ON=1', () => {
  assert.equal(featuresEnabled({}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'preview'}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'development'}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production'}), false);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production', FEATURES_ON: '1'}), true);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production', FEATURES_ON: 'true'}), false);
  assert.equal(featuresEnabled({VERCEL_ENV: 'production', FEATURES_ON: '0'}), false);
  assert.equal(featuresEnabled({FEATURES_ON: '1'}), true);
});
