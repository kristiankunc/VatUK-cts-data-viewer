import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { DB } from "$lib/server/db";

export const GET: RequestHandler = async ({ url }) => {
	const params = url.searchParams;

	// check if any params are passed
	if (params.size === 0) {
		const bookings = await DB.getAllBookings(await DB.connect());

		return new Response(JSON.stringify(bookings), {
			headers: {
				"content-type": "application/json"
			}
		});
	}

	const queryParams: { key: string; value: string }[] = [];
	params.forEach((value, key) => {
		queryParams.push({ key, value });
	});

	const bookings = await DB.getBookings(await DB.connect(), queryParams);

	return new Response(JSON.stringify(bookings), {
		headers: {
			"content-type": "application/json"
		}
	});
};
