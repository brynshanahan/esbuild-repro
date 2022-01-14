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
              .then(() => {
                setStatus("success");
              })
              .catch((err) => {
                setStatus(err.message);
              });
          }}
        >
          Run api endpoint
        </button>
        {status}
      </div>
    </div>
  );
};

export default Home;
