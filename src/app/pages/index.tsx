import { NextPage } from "next";
import Link from "next/link";

const IndexPage: NextPage = () => (
  <>
    <h1>nextjs-serverless</h1>
    <p>
      With this website you can test server-side rendered, statically generated
      and static nextjs pages on different hosters.
    </p>
    <hr />
    <p>This page is static because there are no initial props.</p>
    <ul>
      <li>
        <Link href="/ssr">
          <a>Server side rendered page</a>
        </Link>
      </li>
      <li>
        <Link href="/static">
          <a>Build time generated page</a>
        </Link>
      </li>
      <li>
        <Link href="/dynamic/[id]" as="/dynamic/1">
          <a>Dynamic page</a>
        </Link>
      </li>
      <li>
        <Link href="/folder/[folder]/[id]" as="/folder/foo/bar">
          <a>Folder page</a>
        </Link>
      </li>
      <li>
        <Link href="/path/[...path]" as="/path/a/b/c/d/e">
          <a>Path page</a>
        </Link>
      </li>
      <li>
        <Link href="/ssg-dynamic/[id]" as="/ssg-dynamic/1">
          <a>Statically generated page with dynamic path</a>
        </Link>
      </li>
      <li>
        <Link href="/static-dynamic/[id]" as="/static-dynamic/1">
          <a>Prerendered page with dynamic path</a>
        </Link>
      </li>
    </ul>
  </>
);

export default IndexPage;
