import { prisma } from "~/utils/prisma.server";

export async function GetRecentPosts(count: number ) {
    let data = await prisma.posts.findMany({
        take: count,
        orderBy: { createdAt: "desc" }
    });

    return data;
}
