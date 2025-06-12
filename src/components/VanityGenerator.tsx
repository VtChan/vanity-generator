"use client"

import { useState, useEffect, useRef } from "react";
import React from "react";

import { ethers } from "ethers";
import { Progress } from "@chakra-ui/progress";

import { Box, Button, VStack, HStack, Text, useDisclosure, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { Fade, ScaleFade } from '@chakra-ui/transition'
import { CopyIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react";

import { motion } from "framer-motion";
const MotionBox = motion.create(Box);

const VanityGenerator = () => {
  const [prefix, setPrefix] = useState(""); // 前缀
  const [suffix, setSuffix] = useState(""); // 后缀

  const [wallet, setWallet] = useState<ethers.HDNodeWallet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { open: isResultVisible, onOpen: showResult, onClose: hideResult } = useDisclosure();
  const workers = useRef<Worker[]>([]);
  const [privKey, setPrivKey] = useState("");

  const ClipboardInput = ({ value, label }: { value: string, label: string }) => {
    const [copied, setCopied] = React.useState(false);
    const handleCopy = async () => {
      if (value) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    };
    return (
      <Box mb={2}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>{label}</label>
        <InputGroup>
          <Input value={value || ""} readOnly />
        </InputGroup>
        <Box mt={2}>
          <IconButton
            aria-label={`复制${label}`}
            onClick={handleCopy}
            size="sm"
            variant="ghost"
          >
            <CopyIcon />
          </IconButton>
        </Box>
        {copied && <Text color="green.500" fontSize="sm">已复制！</Text>}
      </Box>
    );
  };

  useEffect(() => {
    const worker = new Worker(new URL("@/workers/vanityWorker.js", import.meta.url));
    workers.current.push(worker);

    worker.onmessage = (e) => {
      setWallet(e.data.wallet);

      setAttempts(e.data.attempts);
      setIsGenerating(false);
    };

    return () => terminateAllWorkers();
    ;
  }, []);

  const generateWallet = () => {
    if (!prefix && !suffix) {
      alert("请输入前缀或后缀");
      return;
    }
  
    setIsGenerating(true);
    hideResult();

    const totalThreads = 1; // 启动 4 个线程
    for (let i = 0; i < totalThreads; i++) {
      const worker = new Worker(new URL("@/workers/vanityWorker.js", import.meta.url));
      workers.current.push(worker);
      worker.postMessage({ prefix, suffix, threadId: i, totalThreads });
      worker.onmessage = (e) => {
        if (wallet) {
          // 终止所有 Worker
          console.log("terminateAll");
          terminateAllWorkers();
        }
        setPrivKey(e.data.privateKey);
        setWallet(e.data.wallet);
        setAttempts((prev) => prev + e.data.attempts);
        setIsGenerating(false);
        showResult();
      };
    }
  };
  
  const terminateAllWorkers = () => {
    workers.current.forEach(worker => worker.terminate());
    workers.current = [];
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-br, gray.100, blue.50)">
      <VStack gap={8} maxW="lg" mx="auto" py={12}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text fontSize="3xl" fontWeight="extrabold" color="blue.600" textAlign="center" letterSpacing="wide">
            钱包靓号生成器
          </Text>
          <Text fontSize="md" color="gray.500" textAlign="center" mt={2}>
            生成带有自定义前缀或后缀的钱包地址
          </Text>
        </MotionBox>
        <Box bg="white" p={{ base: 4, md: 8 }} borderRadius="2xl" boxShadow="2xl" w="full">
          <VStack gap={6} align="stretch">
            <HStack gap={4} flexDir={{ base: "column", md: "row" }}>
              <Box flex={1}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>前缀</label>
                <Input
                  placeholder="输入前缀（例如：abc）"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  bg="gray.50"
                  borderRadius="lg"
                />
              </Box>
              <Box flex={1}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>后缀</label>
                <Input
                  placeholder="输入后缀（例如：xyz）"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  bg="gray.50"
                  borderRadius="lg"
                />
              </Box>
            </HStack>
            <Button
              onClick={generateWallet}
              colorScheme="teal"
              size="lg"
              loading={isGenerating}
              loadingText={`生成中... (尝试次数: ${attempts})`}
              borderRadius="xl"
              fontWeight="bold"
              w="full"
              boxShadow="md"
            >
              生成钱包
            </Button>
            {isGenerating && (
              <Progress size="sm" isIndeterminate w="full" colorScheme="teal" borderRadius="xl" />
            )}
            {isResultVisible && wallet && (
              <ScaleFade in={isResultVisible}>
                <Box mt={4} p={6} bg="gray.50" borderRadius="xl" boxShadow="md" w="full">
                  <VStack align="stretch" gap={4}>
                    <ClipboardInput value={wallet.address} label="地址" />
                    <ClipboardInput value={wallet.mnemonic?.phrase || ""} label="助记词" />
                  </VStack>
                  <Alert status="warning" mt={6} borderRadius="md">
                    <AlertIcon boxSize="6" />
                    <Text fontWeight="bold">警告：</Text>
                    <Text ml={2}>请妥善保存助记词，不要泄露！</Text>
                  </Alert>
                </Box>
              </ScaleFade>
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default VanityGenerator;

