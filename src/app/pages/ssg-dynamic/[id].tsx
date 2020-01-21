import { NextPage } from "next";
import { useRouter } from "next/router";

interface Props {
  date: string;
}

const DynamicPage: NextPage<Props> = ({ date }) => {
  const router = useRouter();

  return (
    <>
      <h1>
        This is a prerendered page generated at {date} with dynamic url{" "}
        {router.query.id}
      </h1>
    </>
  );
};

export async function unstable_getStaticProps() {
  return {
    props: {
      date: new Date().toISOString()
    }
  };
}

export async function unstable_getStaticPaths() {
  return [{ params: { id: "1" } }];
}

export default DynamicPage;
