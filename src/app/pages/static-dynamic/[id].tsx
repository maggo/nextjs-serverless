import { NextPage } from "next";
import { useRouter } from "next/router";

const DynamicPage: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <h1>This is a prerendered page with dynamic url {router.query.id}</h1>
    </>
  );
};

export default DynamicPage;
