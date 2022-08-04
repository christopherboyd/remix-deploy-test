import { prisma } from "~/utils/prisma.server";
import { Perf } from "./perf.server";

export async function GetRecentPosts(context: any, count: number ) {
	let stopTimer = Perf().Track(context, 'GetRecentPosts');
	let data = await prisma.posts.findMany({
		take: count,
		orderBy: { createdAt: "desc" }
	});
	stopTimer();

	return data;
}

export async function CreatePost(context:any, message: string) {
	let stopTimer = Perf().Track(context, 'CreatePost');
	let result = await prisma.posts.create({ data: { message } });
	stopTimer();

	return result;
}
