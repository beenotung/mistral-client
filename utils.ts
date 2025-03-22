import {
  CompletionResponseStreamChoice,
  ChatCompletionChoice,
} from '@mistralai/mistralai/models/components'

export function completionContentToString(
  /** from result of askAsync() or askInStream() */
  content:
    | ChatCompletionChoice['message']['content']
    | CompletionResponseStreamChoice['delta']['content'],
  options?: {
    /** default: 'text' */
    format?: 'html' | 'markdown' | 'text'
  },
): string {
  if (!content) {
    return ''
  }
  if (typeof content === 'string') {
    return content
  }
  if (Array.isArray(content)) {
    return content
      .map(chunk => {
        switch (chunk.type) {
          case 'text':
            return chunk.text
          case 'image_url':
            if (options?.format == 'html') {
              return `<img src="${chunk.imageUrl}" />`
            }
            if (options?.format == 'markdown') {
              return ` ![${chunk.imageUrl}](${chunk.imageUrl}) `
            }
            return ` [image: ${chunk.imageUrl}] `
          case 'document_url':
            if (options?.format == 'html') {
              return `<a href="${chunk.documentUrl}">${chunk.documentName}</a>`
            }
            if (options?.format == 'markdown') {
              return ` [${chunk.documentName}](${chunk.documentUrl}) `
            }
            return ` [document: ${chunk.documentName}] `
          case 'reference':
            return ` [reference: ${chunk.referenceIds}] `
        }
      })
      .join('')
  }
  return JSON.stringify(content)
}
