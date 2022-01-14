import * as esbuild from "esbuild";
type FileObj = { name: string; code: string };
export async function runBundler() {
  const files = [
    {
      name: "index.tsx",
      code: `import log from 'log.tsx';log('test');`,
    },
    {
      name: "log.tsx",
      code: `export default console.log`,
    },
  ];
  const result = await esbuild.build({
    entryPoints: ["index.tsx"],
    bundle: true,
    write: false,
    plugins: [localPathPlugin({ files }), localPlugin({ files })],
    define: {
      "process.env.NODE_ENV": '"production"',
      global: "window",
    },
  });
  return result.outputFiles[0].text;
}

export const localPathPlugin = ({ files }: { files: FileObj[] }) => {
  return {
    name: "local-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle main file
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        const localFile = files.find((file) => file.name === args.path);
        if (localFile) {
          return {
            path: localFile.name,
            namespace: "demo",
          };
        }
      });
    },
  };
};

function localPlugin({ files }: { files: FileObj[] }) {
  return {
    name: "local",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const file = files.find((file) => file.name === args.path);
        if (args.path) {
          if (file) {
            return {
              loader: "tsx",
              contents: file.code,
            };
          }
        }

        return {
          loader: "tsx",
          contents: "",
        };
      });
    },
  };
}
