import { Button, RingProgress, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

interface MatchingTimerProps {
  time: number;
  onTimeout: () => void;
  isMatching: boolean;
}

interface RingProgressSection {
  value: number;
  color: string;
}

function MatchingTimer({
  time = 30,
  onTimeout,
  isMatching,
}: MatchingTimerProps) {
  const [timer, setTimer] = useState<number>(time);
  const [ringProgress, setRingProgress] = useState<RingProgressSection[]>([
    {
      value: 100,
      color: "blue",
    },
  ]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMatching) {
      setStartTime(Date.now());
      const interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const remainingTime = Math.max(time - elapsedTime, 0);

        setTimer(Math.ceil(remainingTime));

        setRingProgress([
          {
            value: (remainingTime / time) * 100,
            color: "blue",
          },
        ]);

        if (remainingTime <= 0) {
          clearInterval(intervalId!);
          onTimeout();
        }
      }, 10);

      setIntervalId(interval);

      return () => {
        clearInterval(interval);
      };
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [isMatching]);

  return (
    <Stack justify="center" align="center">
      <Text fz="xl"> Matching... </Text>
      <RingProgress
        size={150}
        sections={ringProgress}
        label={
          <Text c="blue" ta={"center"} fz="h1">
            {timer}
          </Text>
        }
      />
      <Button
        fullWidth
        color="red"
        onClick={() => {
          setTimer(time);
          setRingProgress([
            {
              value: 100,
              color: "blue",
            },
          ]);
          if (intervalId) {
            clearInterval(intervalId);
          }
          // Handle match cancelation
          onTimeout();
        }}
      >
        Cancel
      </Button>
    </Stack>
  );
}

export default MatchingTimer;
