"use client"

import { useState, useEffect, useRef } from "react";


import { ethers } from "ethers";
// import { Progress } from "@chakra-ui/progress";


import {  Box, Button, VStack, HStack, Text, useDisclosure, 
  IconButton, Progress, Clipboard, Input, InputGroup } from "@chakra-ui/react";
import {  Alert, AlertIcon } from "@chakra-ui/alert";
import { Fade, ScaleFade } from '@chakra-ui/transition'


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

  const ClipboardIconButton = () => {
    return (
      <Clipboard.Trigger asChild>
        <IconButton variant="surface" size="xs" me="-2">
          <Clipboard.Indicator />
        </IconButton>
      </Clipboard.Trigger>
    )
  }

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


    const totalThreads = 4; // 启动 4 个线程
    for (let i = 0; i < totalThreads; i++) {
      const worker = new Worker(new URL("@/workers/vanityWorker.js", import.meta.url));
      workers.current.push(worker);
      worker.postMessage({ prefix, suffix, threadId: i, totalThreads });
      worker.onmessage = (e) => {
        if (wallet) {
          // 终止所有 Worker
          terminateAllWorkers();
            // console.log("wallet : "+JSON.stringify(wallet))
            // console.log("address:"+wallet.address+", privKey:"+wallet.privateKey)
        }
        setWallet(e.data.wallet);
        setAttempts((prev) => prev + e.data.attempts);
        setIsGenerating(false);
        showResult();
        
        // worker.terminate();
      };
    }

  };
  
  const terminateAllWorkers = () => {
    workers.current.forEach(worker => worker.terminate());
    workers.current = [];
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack borderSpacing={6} maxW="md" mx="auto">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text fontSize="2xl" fontWeight="bold" color="blue.600" textAlign="center">
            钱包靓号生成器
          </Text>
        </MotionBox>
        <VStack borderSpacing={4} w="full">
        <strong>前缀:</strong> 

        <Input
          placeholder="输入前缀（例如：abc）"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          bg="white"
        />
        <strong>后缀:</strong> 

        <Input
          placeholder="输入后缀（例如：xyz）"
          value={suffix}
          onChange={(e) => setSuffix(e.target.value)}
          bg="white"
        />
        <Button
          onClick={generateWallet}
          variant="solid"
          colorPalette="teal"
          loading={isGenerating}
          loadingText={`生成中... (尝试次数: ${attempts})`}
          w="full"
        >
          生成钱包
        </Button>
        </VStack>
        {/* {isGenerating && <Progress size="sm" isIndeterminate w="full" />} */}

        {isResultVisible && wallet && (
          <ScaleFade in={isResultVisible}>
            <Box p={4} bg="white" borderRadius="md" w="full" boxShadow="md">
              <Clipboard.Root value={wallet.address}>
                <Clipboard.Label textStyle="label">              
                  <strong>地址:</strong> 
                </Clipboard.Label>
                <InputGroup endElement={<ClipboardIconButton />}>
                  <Clipboard.Input asChild>
                    <Input />
                  </Clipboard.Input>
                </InputGroup>
              </Clipboard.Root>

              <Clipboard.Root value={wallet.mnemonic?.phrase}>
                <Clipboard.Label textStyle="label">              
                  <strong>助记词:</strong> 
                </Clipboard.Label>
                <InputGroup endElement={<ClipboardIconButton />}>
                  <Clipboard.Input asChild>
                    <Input />
                  </Clipboard.Input>
                </InputGroup>
              </Clipboard.Root>
              <Alert status="warning" mt={4} borderRadius="md">
                <AlertIcon />
                警告：请妥善保存助记词，不要泄露！
              </Alert>
            
            </Box>
          </ScaleFade>
        )}
        {isGenerating && (
            <Progress.Root maxW="240px" value={null}>
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
        )}  
      </VStack>
    </Box>

  );
};

export default VanityGenerator;

