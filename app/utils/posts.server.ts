import { prisma } from "~/utils/prisma.server";
import { Perf } from "./perf.server";

export async function GetRecentPosts(count: number ) {
	let stopTimer = Perf().Track('GetRecentPosts');
	let data = await prisma.posts.findMany({
		take: count,
		orderBy: { createdAt: "desc" }
	});
	stopTimer();

	return data;
}

export async function CreatePost(message: string) {
	let stopTimer = Perf().Track('CreatePost');
	let result = await prisma.posts.create({ data: { message } });
	stopTimer();

	return result;
}
