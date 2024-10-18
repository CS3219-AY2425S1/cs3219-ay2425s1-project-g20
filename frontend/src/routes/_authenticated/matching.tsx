import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { MatchingForm } from "../../components/Matching/MatchingForm";

export const Route = createFileRoute("/_authenticated/matching")({
  component: Matching,
});

export function Matching() {
  return (
    <Stack align="center">
      <Title ta="center">Find a match!</Title>
      <MatchingForm />
    </Stack>
  );
}
