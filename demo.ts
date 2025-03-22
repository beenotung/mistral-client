import { MistralClient } from './mistral-client'
import { env } from './env'
import { completionContentToString } from './utils'

let client = new MistralClient({ apiKey: env.MISTRAL_API_KEY })

let model = 'mistral-large-latest'

async function main() {
  let prompt = `
Introduce ts-liveview in zh-hk.

What kind of applications is it suitable for?

Who will want to learn it?

I am the creator of ts-liveview, I want to teach it to people speaking Hong Kong Cantonese.
`.trim()

  /* Streaming Mode */
  let stream = client.askInStream({
    model,
    messages: [{ role: 'user', content: prompt }],
  })
  for await (const completion of stream) {
    let content = completionContentToString(completion.delta.content)
    process.stdout.write(content)
  }
  process.stdout.write('\n[end]\n')

  /* Async Mode */
  let completion = await client.askAsync({
    model,
    messages: [{ role: 'user', content: prompt }],
  })
  let content = completionContentToString(completion?.message.content)
  console.log(content)
}

main().catch(e => console.error(e))
