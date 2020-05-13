import { NextPage } from "next";
import { useRouter } from "next/router";

const DynamicPathPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <h1>
        This is a dynamic folder page with folder {router.query.folder} and id{" "}
        {router.query.id}
      </h1>
      <p>You can change the last two segments of the URL.</p>
    </>
  );
};

DynamicPathPage.getInitialProps = () => ({
  foo: "bar",
});

export default DynamicPathPage;
