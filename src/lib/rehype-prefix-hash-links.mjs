// rehype-sanitize prefixes every id with "user-content-" so CMS content can't clash with ids
// in the layout (e.g. #main). This points in-page links (#fn-1, #my-heading) at the prefixed ids.
const PREFIX = 'user-content-';

function collectIds(node, ids) {
  if (node.properties?.id) ids.add(String(node.properties.id));
  node.children?.forEach((child) => collectIds(child, ids));
  return ids;
}

// Links to non-ASCII headings arrive percent-encoded (#caf%C3%A9) while ids are raw (café).
function decodeFragment(fragment) {
  try {
    return decodeURIComponent(fragment);
  } catch {
    return fragment; // malformed % sequence: compare as typed
  }
}

function rewriteLinks(node, ids) {
  const href = node.tagName === 'a' ? node.properties?.href : undefined;
  if (typeof href === 'string' && href.startsWith('#')) {
    const target = PREFIX + decodeFragment(href.slice(1));
    if (ids.has(target)) node.properties.href = '#' + target;
  }
  node.children?.forEach((child) => rewriteLinks(child, ids));
}

export default function rehypePrefixHashLinks() {
  return (tree) => rewriteLinks(tree, collectIds(tree, new Set()));
}
