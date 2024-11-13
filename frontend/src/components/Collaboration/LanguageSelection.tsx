import { Button, Menu, Text } from "@mantine/core";

interface Props {
  languages: string[];
  language: string;
  onSetLanguage: (language: string) => void;
}

export default function LanguageSelection({
  languages,
  language,
  onSetLanguage,
}: Props) {
  return (
    <Menu shadow="md" position="bottom-start">
      <Menu.Target>
        <Button
          variant="light"
          color="blue"
          justify="flex-start"
          style={{ width: "fit-content", fontSize: "15px" }}
        >
          {language}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {languages.map((curr_language) => (
          <Menu.Item
            onClick={() => onSetLanguage(curr_language)}
            key={curr_language}
          >
            <Text
              fw={language === curr_language ? 700 : 300}
              style={{ fontSize: "15px" }}
            >
              {curr_language}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
