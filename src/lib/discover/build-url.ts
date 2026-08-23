export function buildDiscoverUrl(searchParams: URLSearchParams, page: number) {
  const params = new URLSearchParams(searchParams.toString());

  params.set('page', String(page));

  return `/discover?${params.toString()}`;
}
