import { error } from '@sveltejs/kit';
import { resourceSections, videos } from '$lib/resources';
import type { RequestHandler } from './$types';

// Only known project files can be downloaded; no user-supplied upstream URLs.
const downloads = new Map(
	[...resourceSections.flatMap((section) => section.items), ...videos]
		.filter((item) => item.downloadId && item.href)
		.map((item) => [item.downloadId, item.href])
);

const download: RequestHandler = async ({ params, request, fetch }) => {
	const href = downloads.get(params.id);
	if (!href) error(404, 'Download not found.');

	const headers = new Headers();
	for (const name of ['range', 'if-range']) {
		const value = request.headers.get(name);
		if (value) headers.set(name, value);
	}

	const upstream = await fetch(href, { method: request.method, headers });
	if (!upstream.ok && upstream.status !== 416) {
		error(502, 'This file is temporarily unavailable. Please try again later.');
	}

	const responseHeaders = new Headers();
	for (const name of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
		const value = upstream.headers.get(name);
		if (value) responseHeaders.set(name, value);
	}
	const filename = decodeURIComponent(new URL(href).pathname.split('/').pop()!);
	responseHeaders.set('content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
	responseHeaders.set('x-content-type-options', 'nosniff');

	// Stream large MP4s from Bunny without buffering them in server memory.
	return new Response(request.method === 'HEAD' ? null : upstream.body, {
		status: upstream.status,
		headers: responseHeaders
	});
};

export const GET = download;
export const HEAD = download;
