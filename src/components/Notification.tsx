import { Notification as Message } from "@mantine/core";
import { useEffect, useState } from "react";

interface Notification {
  title: string;
  text: string;
}

export function Notification({ title, text }: Notification) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);

  return show ? (
    <Message
      title={title}
      w="100%"
      color="red"
      pos="absolute"
      left="50vw"
      top="10px"
    >
      {text}
    </Message>
  ) : null;
}
