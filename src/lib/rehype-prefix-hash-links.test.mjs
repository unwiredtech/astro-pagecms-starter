import { test } from 'node:test';
import assert from 'node:assert/strict';
import rehypePrefixHashLinks from './rehype-prefix-hash-links.mjs';

const link = (href) => ({ type: 'element', tagName: 'a', properties: { href }, children: [] });

test('matches percent-encoded links to non-ASCII ids and survives bad encoding', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'element', tagName: 'h2', properties: { id: 'user-content-café' }, children: [] },
      link('#caf%C3%A9'),
      link('#bad%E0%A4%A'),
    ],
  };
  rehypePrefixHashLinks()(tree);
  const hrefs = tree.children.slice(1).map((node) => node.properties.href);
  assert.deepEqual(hrefs, ['#user-content-café', '#bad%E0%A4%A']);
});

test('points in-page links at prefixed ids, leaves the rest alone', () => {
  const tree = {
    type: 'root',
    children: [
      { type: 'element', tagName: 'li', properties: { id: 'user-content-fn-1' }, children: [] },
      link('#fn-1'),
      link('#nowhere'),
      link('/about/'),
      link('#user-content-fn-1'),
    ],
  };
  rehypePrefixHashLinks()(tree);
  const hrefs = tree.children.slice(1).map((node) => node.properties.href);
  assert.deepEqual(hrefs, ['#user-content-fn-1', '#nowhere', '/about/', '#user-content-fn-1']);
});
