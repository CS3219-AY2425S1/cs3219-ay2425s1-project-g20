import {
  Avatar,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MatchingForm } from "../../components/Matching/MatchingForm";
import {
  UserMatchDoneData,
  MessageType,
  UserMatchingRequest,
} from "@common/shared-types";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { initializeMatchSocket } from "../../socket/match";
import MatchingTimer from "../../components/Matching/MatchingTimer";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useTimeout } from "@mantine/hooks";
import { UserRoomCreatedData } from "../../../../common/shared-types/index";

export const Route = createFileRoute("/_authenticated/matching")({
  component: Matching,
});

export function Matching() {
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [matchFound, setMatchFound] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [matchSocket, setMatchSocket] = useState<Socket | null>(null);

  const navigate = useNavigate();

  const { start: startCooldown, clear: clearCooldown } = useTimeout(() => {
    setIsCooldown(false);
  }, 5000);

  useEffect(() => {
    const socket = initializeMatchSocket();
    setMatchSocket(socket);

    const handleMatchRequestQueued = (data: string) => {
      setIsMatching(true);
      setTicketId(data);
    };

    const handleMatchRequestFailed = () => {
      setIsMatching(false);
      notifications.show({
        icon: <IconX />,
        message: "Match request failed",
        color: "red",
      });
    };

    const handleAuthenticationFailed = () => {
      setIsMatching(false);
      notifications.show({
        icon: <IconX />,
        message: "Failed to authenticate match request",
        color: "red",
      });
    };

    const handleMatchFound = (data: UserRoomCreatedData) => {
      console.log(data);
      if (!data.id) {
        notifications.show({
          icon: <IconX />,
          title: "Matching server error",
          message: "No room data received",
          color: "red",
        });
        setIsMatching(false);
        return;
      }

      setMatchFound(true);
      notifications.show({
        icon: <IconCheck />,
        title: "Match found",
        message: "Redirecting...",
        color: "green",
      });

      setTimeout(() => {
        navigate({
          to: `/collaboration/${data.id}`,
          state: { userRoomData: data },
        });
      }, 3000);
    };

    const handleMatchCancelled = () => {
      setIsMatching(false);
      notifications.show({
        icon: <IconX />,
        message: "Matching cancelled",
        color: "red",
      });
    };

    // Setting up event listeners
    socket.on(MessageType.MATCH_REQUEST_QUEUED, handleMatchRequestQueued);
    socket.on(MessageType.MATCH_REQUEST_FAILED, handleMatchRequestFailed);
    socket.on(MessageType.AUTHENTICATION_FAILED, handleAuthenticationFailed);
    socket.on(MessageType.MATCH_FOUND, handleMatchFound);
    socket.on(MessageType.MATCH_CANCELLED, handleMatchCancelled);
    socket.on("disconnect", () => {
      setIsMatching(false);
    });

    return () => {
      // Cleanup: Disconnect socket and remove listeners
      socket.disconnect(); // Disconnect the socket on unmount
      socket.off(MessageType.MATCH_REQUEST_QUEUED, handleMatchRequestQueued);
      socket.off(MessageType.MATCH_REQUEST_FAILED, handleMatchRequestFailed);
      socket.off(MessageType.AUTHENTICATION_FAILED, handleAuthenticationFailed);
      socket.off(MessageType.MATCH_FOUND, handleMatchFound);
      socket.off(MessageType.MATCH_CANCELLED, handleMatchCancelled);
    };
  }, []);

  const startMatch = (values: UserMatchingRequest) => {
    startCooldown();
    setIsCooldown(true);
    if (!matchSocket) {
      notifications.show({
        title: "Socket not connected",
        message: "Unable to send match request.",
        color: "red",
      });
      return;
    }

    matchSocket.emit(MessageType.MATCH_REQUEST, values);
  };

  const cancel = () => {
    if (!matchSocket || !ticketId) return;
    matchSocket.emit(MessageType.MATCH_CANCEL);
  };

  return (
    <Stack align="center">
      <Title ta="center">Find a match!</Title>
      <Paper shadow="md" withBorder p="lg">
        {!isMatching && !matchFound && (
          <MatchingForm
            isCooldown={isCooldown}
            onSubmit={(values) => startMatch(values)}
          />
        )}
        {isMatching && !matchFound && (
          <MatchingTimer time={30} isMatching={isMatching} cancel={cancel} />
        )}
        {matchFound && (
          <Stack align="center">
            <Avatar color="green">
              <IconCheck />
            </Avatar>
            <Text fw="bold">Match Found!</Text>
            <Text c="dimmed" fs="italic">
              Redirecting...
            </Text>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
