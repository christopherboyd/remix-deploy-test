import { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react'
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/posts.css";
import { GetRecentPosts } from '~/utils/posts.server';

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesUrl }];
};

// don't return IP. createAt turns into a string on serialization, so can't use Pick
type PublicPostData = {id: number, message: string, createdAt: string | Date };
type LoaderData = {
    posts: Array< PublicPostData >
};

export const loader: LoaderFunction = async () => {
    let data = await GetRecentPosts( 10 );
    let posts = data.map( ( record ) => { return { id: record.id, createdAt: record.createdAt, message: record.message }; } );

    let response: LoaderData = { posts: posts };
    return json(response);
};

export default function PostsPage() {
    const data = useLoaderData< LoaderData >();
    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
            <Link to="/">Back</Link>
            <div className="PostWall">
                { data.posts.map( post => <Post post={ post } /> ) }
            </div>
        </div>
    );
}

function Post( props: { post: PublicPostData } )
{
    const { post } = props;
    let createdAt = new Date( post.createdAt );

    return (
        <div className="Post">
            <div>Posted: {createdAt.toLocaleString() }</div>
            <div>{post.message}</div>
        </div>
    )
}
