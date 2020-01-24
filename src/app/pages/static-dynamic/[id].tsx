import { NextPage } from "next";
import { useRouter } from "next/router";

const DynamicPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <h1>
        This is a buildtime prerendered page with dynamic url {router.query.id}
      </h1>
      <p>
        This page is special as it's being initialised without{" "}
        <code>router.query.id</code> but then rehydrated after mount.
      </p>
    </>
  );
};

export default DynamicPage;
