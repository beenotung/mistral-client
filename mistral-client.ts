import { Mistral } from '@mistralai/mistralai'
import {
  ChatCompletionRequest,
  ChatCompletionStreamRequest,
} from '@mistralai/mistralai/models/components'
import { RequestOptions } from '@mistralai/mistralai/src/lib/sdks'
import { TaskQueue } from '@beenotung/tslib/task/task-queue'
import { later } from '@beenotung/tslib/async/wait'

export class MistralClient {
  client: Mistral

  taskQueue = new TaskQueue()

  lastTime = 0

  rateLimitInterval = 1000

  constructor(private options: { apiKey: string }) {
    this.client = new Mistral({ apiKey: this.options.apiKey })
  }

  async waitForCoolDown() {
    let timePassed = Date.now() - this.lastTime
    if (timePassed < this.rateLimitInterval) {
      await later(this.rateLimitInterval - timePassed)
    }
    this.lastTime = Date.now()
  }

  /**
   * wrapper of this.complete()
   *
   * @example
   * ```typescript
   * let completion = await client.askAsync({
   *   model: 'mistral-large-latest',
   *   messages: [{ role: 'user', content: 'Introduce ts-liveview in zh-hk' }],
   * })
   * let content = completionContentToString(completion?.message.content)
   * console.log(content)
   * ```
   */
  async askAsync(request: ChatCompletionRequest, options?: RequestOptions) {
    let completion = await this.complete(request, options)
    return completion.choices?.[0]
  }

  async complete(request: ChatCompletionRequest, options?: RequestOptions) {
    await this.taskQueue.runTask(() => this.waitForCoolDown())
    return await this.client.chat.complete(request, options)
  }

  /**
   * @example
   * ```typescript
   * let stream = client.askInStream({
   *   model: 'mistral-large-latest',
   *   messages: [{ role: 'user', content: 'Introduce ts-liveview in zh-hk' }],
   * })
   * for await (let completion of stream) {
   *   let content = completionContentToString(completion.delta.content)
   *   process.stdout.write(content)
   * }
   * process.stdout.write('\n[end]\n')
   * ```
   */
  async *askInStream(request: ChatCompletionRequest, options?: RequestOptions) {
    let stream = this.stream(request, options)
    for await (let completion of stream) {
      yield completion.data.choices?.[0]
    }
  }

  /** with rate limit throttling, return full completion response for custom usage */
  async *stream(
    request: ChatCompletionStreamRequest,
    options?: RequestOptions,
  ) {
    await this.taskQueue.runTask(() => this.waitForCoolDown())
    let stream = await this.client.chat.stream(request, options)
    for await (let completion of stream) {
      yield completion
    }
  }
}
