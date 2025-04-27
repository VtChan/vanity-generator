"use client"; // 标记为客户端组件

import { Container, ChakraProvider } from "@chakra-ui/react";

import { defaultSystem } from "@chakra-ui/react"

import VanityGenerator from "@/components/VanityGenerator";

export default function Home() {
  return (
    <ChakraProvider value={defaultSystem}>
        <Container maxW="container.md" py={8}>
        <VanityGenerator />
      </Container>
    </ChakraProvider>
  );
}
