import { ChakraProvider } from "@chakra-ui/provider";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "钱包靓号生成器",
  description: "生成带有自定义前缀或后缀的以太坊钱包地址",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
