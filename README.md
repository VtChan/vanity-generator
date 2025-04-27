# 钱包靓号生成器

## 项目简介
钱包靓号生成器是一个基于 Web3 技术的工具，用于生成符合特定前缀要求的以太坊钱包地址。通过输入自定义前缀，用户可以生成一个以该前缀开头的钱包地址，并获取对应的私钥。该项目使用 Next.js 框架开发，集成了 Tailwind CSS 和 Chakra UI 进行样式设计，并支持多线程生成以提高性能。

## 功能特性
- **自定义前缀**：用户可以输入任意前缀，生成以该前缀开头的以太坊钱包地址。
- **多线程生成**：支持多线程并行生成，大幅提高生成速度。
- **进度显示**：实时显示生成进度和尝试次数，提升用户体验。
- **响应式设计**：适配桌面和移动端，提供良好的用户体验。

## 技术栈
- **框架**：Next.js
- **样式**：Tailwind CSS + Chakra UI
- **Web3 库**：ethers.js
- **多线程**：Web Worker
- **部署**：Vercel

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/VtChan/vanity-generator.git
cd vanity-generator
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行开发服务器
```bash
npm run dev
```

访问 `http://localhost:3000` 即可使用钱包靓号生成器。

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 使用指南

### 1. 输入前缀
在输入框中输入你想要的前缀（例如：`abc`）和后缀，然后点击“生成钱包”按钮（注意：条件越苛刻，生成速度越慢）。

### 2. 查看结果
生成成功后，页面会显示钱包地址和助记词。请务必妥善保存助记词，不要泄露。

## 项目结构
```
vanity-wallet-generator/
├── src/
│   ├── app/
│   │   └── page.tsx          # 主页面
│   ├── components/
│   │   └── VanityGenerator.tsx # 靓号生成器组件
│   ├── workers/
│   │   └── vanityWorker.js   # Web Worker 文件
├── public/                   # 静态资源
├── tailwind.config.js        # Tailwind CSS 配置
├── next.config.js            # Next.js 配置
└── package.json              # 项目依赖
```



## 注意事项
- **私钥安全**：生成的私钥会直接显示在页面上，请确保在安全环境下使用，并妥善保存私钥。
- **性能问题**：生成靓号可能需要较长时间，尤其是前缀较长时。建议使用多线程功能以提高效率。
- **浏览器兼容性**：加密存储功能依赖于浏览器的 `crypto.subtle` API，请确保使用现代浏览器。

## 贡献指南
欢迎提交 Issue 或 Pull Request 来改进项目。请确保代码风格一致，并通过所有测试。

## 许可证
本项目基于 MIT 许可证开源。详情请参阅 [LICENSE](LICENSE) 文件。

---

如有任何问题或建议，请通过 [Issues](https://github.com/VtChan/vanity-generator/issues) 反馈。感谢您的支持！


