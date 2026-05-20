import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAllSections, loadHelpArticles, loadLegalPage } from './data-providers.js';

test('loadAllSections returns an array', () => {
  const result = loadAllSections();
  assert.ok(Array.isArray(result), 'expected an array');
});

test('loadHelpArticles returns an array', () => {
  const result = loadHelpArticles();
  assert.ok(Array.isArray(result), 'expected an array');
});

test('loadLegalPage(known slug) returns an object or null', () => {
  const result = loadLegalPage('privacy-policy');
  assert.ok(result === null || (typeof result === 'object' && 'title' in result));
});

test('loadLegalPage(unknown slug) returns null', () => {
  const result = loadLegalPage('this-slug-definitely-does-not-exist');
  assert.equal(result, null);
});
