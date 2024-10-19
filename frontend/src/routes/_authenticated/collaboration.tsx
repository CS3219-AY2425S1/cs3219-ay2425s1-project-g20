import { Stack, Text } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import AceEditor from "react-ace";
import { socket } from "../../socket";

export const Route = createFileRoute("/_authenticated/collaboration")({
  component: Collaboration,
});

function Collaboration() {
  const [editorValue, setEditorValue] = useState<string>("");

  // useEffect(() => {
  //   socket.emit("join-collab", "test", "user1");
  //   socket.emit("code-get");
  //   return () => {
  //     // socket.off("code-get");
  //   };
  // }, []);

  // // Listen for code changes to update server
  // useEffect(() => {
  //   setInterval(() => {
  //     socket.emit("code-change", editorValue);
  //   }, 1000);

  //   return () => {
  //     // socket.off("code-change");
  //   };
  // }, [socket, editorValue]);

  // // Listen for code updates
  // useEffect(() => {
  //   socket.on("code-get", (code: string) => {
  //     setEditorValue(code);
  //   });

  //   return () => {
  //     socket.off("code-get");
  //   };
  // }, [socket, editorValue]);

  return (
    <Stack align="center" w="100%">
      <Text fz="h2">Collaboration</Text>

      <AceEditor
        width="50%"
        mode="javascript"
        theme="monokai"
        fontSize={14}
        lineHeight={19}
        showGutter
        showPrintMargin
        highlightActiveLine
        value={editorValue}
        onChange={(value) => {
          setEditorValue(value);
          // socket.emit("code-change", value);
        }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </Stack>
  );
}
