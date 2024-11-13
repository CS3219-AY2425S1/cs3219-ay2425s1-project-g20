// References: https://github.com/yjs/y-codemirror.next, https://liveblocks.io/docs/get-started/yjs-codemirror-react
import { autocompletion } from "@codemirror/autocomplete";
import { cpp, cppLanguage } from "@codemirror/lang-cpp";
import { java, javaLanguage } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { LanguageSupport } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Paper, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { EditorView, basicSetup } from "codemirror";
import { useEffect, useRef, useState } from "react";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import { accessTokenStorage } from "../../utils/accessTokenStorage";
import { userStorage } from "../../utils/userStorage";
import LanguageSelection from "./LanguageSelection";
import { javaAutocomplete, cppAutocomplete } from "../../utils/languageSupport";

interface Props {
  roomId: string;
  isOpen: boolean;
  onCodeChange: (code: string) => void;
}

export default function CodingEditor({ roomId, isOpen, onCodeChange }: Props) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const language_map: Record<string, LanguageSupport> = {
    Javascript: javascript(),
    Java: java(),
    Python: python(),
    "C++": cpp(),
  };
  const languages: string[] = ["Javascript", "Java", "Python", "C++"];
  const [language, setLanguage] = useState<string>("Javascript");
  const languageCompartment = useRef(new Compartment()).current;
  const viewRef = useRef<EditorView | null>(null);

  const onSetLanguage = (curr_language: string) => {
    setLanguage(curr_language);

    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: languageCompartment.reconfigure(language_map[curr_language]!),
      });
    }
  };

  useEffect(() => {
    let ydoc: Y.Doc;
    let view: EditorView;

    ydoc = new Y.Doc();
    const accessToken = accessTokenStorage.getAccessToken();
    console.log("Creating editor with access token:", accessToken);
    const provider = new HocuspocusProvider({
      url: import.meta.env.VITE_COLLABORATION_SERVICE_WS_URL,
      name: roomId,
      document: ydoc,
      token: accessToken,
      onAuthenticationFailed: () => {
        notifications.show({
          title: "Authentication failed",
          message: "Server failed to authenticate you, please login again",
          color: "red",
        });
        console.error("Authentication failed");
      },
      onStatus: (status) => {
        console.log("Connection status:", status);
      },
    });

    const yText = ydoc.getText("codemirror");
    const undoManager = new Y.UndoManager(yText);

    yText.observe(() => {
      onCodeChange(yText.toString());
    });

    provider.setAwarenessField("user", {
      name: userStorage.getUser()?.username,
      color: "#30bced",
      colorLight: "#30bced33",
    });

    const fixedHeightEditor = EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    });

    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        languageCompartment.of(language_map[language]!),
        javaLanguage.data.of({
          autocomplete: javaAutocomplete,
        }),

        cppLanguage.data.of({
          autocomplete: cppAutocomplete,
        }),
        autocompletion(),
        fixedHeightEditor,
        EditorState.readOnly.of(!isOpen),
        yCollab(yText, provider.awareness, { undoManager }),
      ],
    });

    view = new EditorView({
      state,
      parent: elementRef.current!,
    });

    viewRef.current = view;

    return () => {
      console.log("Editor unmounted");
      ydoc?.destroy();
      provider?.destroy();
      view?.destroy();
    };
  }, [roomId, isOpen]);

  return (
    <Paper shadow="md" p="lg" h="80vh" withBorder>
      <Stack h="100%">
        <LanguageSelection
          onSetLanguage={onSetLanguage}
          language={language}
          languages={languages}
        />
        <div
          ref={elementRef}
          style={{
            height: "100%",
            width: "100%",
            border: "1px solid #000",
            margin: "0 auto",
          }}
        />
      </Stack>
    </Paper>
  );
}
