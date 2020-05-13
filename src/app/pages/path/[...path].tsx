import { NextPage } from "next";
import { useRouter } from "next/router";

const DynamicPathPage: NextPage = () => {
  const router = useRouter();

  const path = Array.isArray(router.query.path)
    ? router.query.path.join("/")
    : router.query.path;

  return (
    <>
      <h1>This is a dynamic path page with path "{path}"</h1>
      <p>You can change all segments of the URL after /path/.</p>
    </>
  );
};

DynamicPathPage.getInitialProps = () => ({
  foo: "bar",
});

export default DynamicPathPage;
