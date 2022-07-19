import { prisma } from "~/utils/prisma.server";

export async function GetRecentPosts(count: number ) {
	let data = await prisma.posts.findMany({
		take: count,
		orderBy: { createdAt: "desc" }
	});

	return data;
}

export async function CreatePost(message: string) {
	return await prisma.posts.create({ data: { message } });
}
