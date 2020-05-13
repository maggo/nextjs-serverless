import { NextPage } from "next";

interface Props {
  date: string;
}

const StaticPage: NextPage<Props> = ({ date }) => (
  <h1>The date at build time is {date}</h1>
);

export async function getStaticProps() {
  return {
    props: {
      date: new Date().toISOString(),
    },
  };
}

export default StaticPage;
