import { NextPage } from "next";

interface Props {
  date: string;
}

const SSRPage: NextPage<Props> = ({ date }) => <h1>The date is {date}</h1>;

SSRPage.getInitialProps = async () => ({ date: new Date().toISOString() });

export default SSRPage;
