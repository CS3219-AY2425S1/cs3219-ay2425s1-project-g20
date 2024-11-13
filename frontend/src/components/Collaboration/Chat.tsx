import {
  PaperProps,
  Paper,
  ScrollArea,
  Stack,
  Flex,
  Avatar,
  Group,
  Divider,
  Textarea,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { initializeChatSocket } from "../../socket/chat";
import { userStorage } from "../../utils/userStorage";
import { IconSend } from "@tabler/icons-react";

interface ChatMessage {
  timestamp: Date;
  sender: string;
  message: string;
}

export default function Chat(props: PaperProps) {
  const { username } = userStorage.getUser()!;

  const { roomId } = useParams({
    from: "/_authenticated/collaboration/$roomId",
  });
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const socket = initializeChatSocket();
    setChatSocket(socket);

    socket.emit("join", roomId);

    socket.on("messages", (messages: ChatMessage[]) => {
      setMessages(
        messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
      );
    });

    socket.on("message", (message: ChatMessage) => {
      if (message.sender === username) return; // Handled by optimistic input
      setMessages((prev) => [
        ...prev,
        { ...message, timestamp: new Date(message.timestamp) },
      ]);
    });

    return () => {
      setChatSocket(null);
      socket.disconnect();
    };
  }, []);

  // console.log(messages.map((m) => m.timestamp));

  const sendMessage = () => {
    if (chatSocket && messageInput.trim()) {
      const msgData = { roomId, message: messageInput, sender: username };
      chatSocket.emit("message", msgData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: messageInput, sender: username, timestamp: new Date() },
      ]); // Optimistic UI update
      setMessageInput("");
    }
  };

  return (
    <Paper {...props}>
      <ScrollArea h={400}>
        <Stack>
          {messages.map((message) => (
            <Flex
              gap={6}
              direction={message.sender === username ? "row-reverse" : "row"}
            >
              <Avatar />
              <Paper shadow="sm" withBorder p="xs" flex={1}>
                <Stack
                  gap={0}
                  align={
                    message.sender === username ? "flex-end" : "flex-start"
                  }
                >
                  <Text fw="bold" fz="lg">
                    {message.sender === username ? "You" : message.sender}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                  <Text>{message.message}</Text>
                </Stack>
              </Paper>
            </Flex>
          ))}
        </Stack>
      </ScrollArea>
      <Divider my={8} />
      <Group>
        <Textarea
          flex={1}
          placeholder="Enter a message"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <ActionIcon onClick={sendMessage} disabled={!messageInput}>
          <IconSend />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
