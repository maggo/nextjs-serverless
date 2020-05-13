import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const DynamicPage: NextPage = () => {
  const router = useRouter();

  const id = parseInt(router.query.id?.toString());

  return (
    <>
      <h1>This is a dynamic page with id {id}</h1>
      <ul>
        <li>
          <Link href="/dynamic/[id]" as={`/dynamic/${id - 1}`}>
            <a>-1</a>
          </Link>
        </li>
        <li>
          <Link href="/dynamic/[id]" as={`/dynamic/${id + 1}`}>
            <a>+1</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

DynamicPage.getInitialProps = () => ({
  foo: "bar",
});

export default DynamicPage;
