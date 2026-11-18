"use client";

import { CodeBlock } from "@/components/marketing/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const typescriptCode = `import { Dropflow } from "@dropflow/sdk";

const dropflow = new Dropflow({
  publicKey: process.env.NEXT_PUBLIC_DROPFLOW_KEY!,
});

const asset = await dropflow.upload(file, {
  onProgress: (percent) => setProgress(percent),
});

console.log(asset.url);
// https://assets.dropflow.dev/df_8f3a.../avatar.png`;

const javascriptCode = `import { Dropflow } from "@dropflow/sdk";

const dropflow = new Dropflow({
  publicKey: "df_pub_8f3a21c9",
});

const asset = await dropflow.upload(file, {
  onProgress: (percent) => setProgress(percent),
});

console.log(asset.url);
// https://assets.dropflow.dev/df_8f3a.../avatar.png`;

export function SdkTabs() {
  return (
    <Tabs defaultValue="typescript" className="gap-4">
      <TabsList>
        <TabsTrigger value="typescript">TypeScript</TabsTrigger>
        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
      </TabsList>
      <TabsContent value="typescript">
        <CodeBlock
          code={typescriptCode}
          filename="upload.ts"
          language="typescript"
        />
      </TabsContent>
      <TabsContent value="javascript">
        <CodeBlock
          code={javascriptCode}
          filename="upload.js"
          language="javascript"
        />
      </TabsContent>
    </Tabs>
  );
}
