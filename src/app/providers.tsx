
import { ChakraProvider } from "@chakra-ui/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
