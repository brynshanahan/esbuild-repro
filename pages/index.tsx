import type { NextPage } from "next";
import { useState } from "react";
import { runBundler } from "../src/bundle";

export const getStaticProps = async () => {
  return {
    props: {
      content: await runBundler(),
    },
  };
};

const Home: NextPage<{ content: string }> = (props) => {
  let [status, setStatus] = useState("");
  return (
    <div>
      <div>{props.content}</div>
      <hr />
      <div>
        <button
          onClick={() => {
            fetch("/api/bundle", {
              method: "POST",
            })
              .then((res) => {
                setStatus(String(res.status));
              })
              .catch((err) => {
                setStatus(err.message);
              });
          }}
        >
          Run api endpoint
        </button>
        Status: {status}
      </div>
    </div>
  );
};

export default Home;
