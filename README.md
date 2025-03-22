# mistral-client

Client SDK for Mistral AI API.

[![npm Package Version](https://img.shields.io/npm/v/mistral-client)](https://www.npmjs.com/package/mistral-client)

## Features

- Rate limit throttling
- Helper functions to convert stream delta messages to html/markdown/text
- Typescript support

## Installation

```bash
npm install mistral-client
```

You can also install `mistral-client` with [pnpm](https://pnpm.io/), [yarn](https://yarnpkg.com/), or [slnpm](https://github.com/beenotung/slnpm)

## Usage Example

### Setup Client SDK

```typescript
import { MistralClient, completionContentToString } from 'mistral-client'

async function main() {
  let client = new MistralClient({ apiKey: 'your-api-key' })

  let prompt = `Introduce ts-liveview in zh-hk`
  // use async or stream mode, see examples below
}

main().catch(e => console.error(e))
```

### Chat Completion in Async Mode

```typescript
let completion = await client.askAsync({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: prompt }],
})

let content = completionContentToString(completion?.message.content)
console.log(content)
```

### Chat Completion in Streaming Mode

```typescript
let stream = client.askInStream({
  model: 'mistral-large-latest',
  messages: [{ role: 'user', content: prompt }],
})

for await (let completion of stream) {
  let content = completionContentToString(completion.delta.content)
  process.stdout.write(content)
}
process.stdout.write('\n[end]\n')
```

## Typescript Signature

```typescript
export class MistralClient {
  constructor(options: { apiKey: string })

  askAsync(
    request: ChatCompletionRequest,
    options?: RequestOptions,
  ): Promise<ChatCompletionChoice | undefined>

  askInStream(
    request: ChatCompletionRequest,
    options?: RequestOptions,
  ): AsyncGenerator<CompletionResponseStreamChoice, void, unknown>
}

export function completionContentToString(
  content:
    | ChatCompletionChoice['message']['content']
    | CompletionResponseStreamChoice['delta']['content'],
  options?: {
    /** default 'text' */
    format?: 'html' | 'markdown' | 'text'
  },
): string
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
