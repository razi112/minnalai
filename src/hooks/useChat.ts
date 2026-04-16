import { useState, useCallback } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  images?: { base64: string; mimeType: string }[]
  generatedImages?: { base64: string; mimeType: string }[]
  canvasHtml?: string
  timestamp: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const API_KEY = 'AIzaSyBA_iRJYfs4ZRUxw4jPn1rlMjeZaVMOVvg'
const genAI = new GoogleGenerativeAI(API_KEY)

// Fallback chain — if a model is overloaded (503) we try the next one
const MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']

function buildHistory(messages: Message[]) {
  return messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [
      ...(m.images ?? []).map((img) => ({
        inlineData: { data: img.base64, mimeType: img.mimeType },
      })),
      { text: m.content },
    ],
  }))
}

function is503(err: unknown) {
  return err instanceof Error && err.message.includes('503')
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

// Detect if the user wants an image generated
const IMAGE_GEN_PATTERNS = [
  /\bgenerate\b.*\bimage\b/i,
  /\bcreate\b.*\bimage\b/i,
  /\bdraw\b/i,
  /\bpaint\b/i,
  /\billustrat/i,
  /\bimage of\b/i,
  /\bpicture of\b/i,
  /\bphoto of\b/i,
  /\brender\b.*\bimage\b/i,
  /\bmake.*\bimage\b/i,
  /\bshow me.*\bimage\b/i,
]

function isImageGenRequest(text: string): boolean {
  return IMAGE_GEN_PATTERNS.some((p) => p.test(text))
}

async function generateImages(prompt: string): Promise<{ base64: string; mimeType: string }[]> {
  const IMAGE_MODELS = [
    'gemini-3.1-flash-image-preview',
    'gemini-2.5-flash-image',
    'gemini-3-pro-image-preview',
  ]

  for (const modelName of IMAGE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg: string = err?.error?.message ?? ''
        if (res.status === 404 || msg.includes('not found') || msg.includes('not supported')) continue
        // Extract retry delay if quota error
        const retryMatch = msg.match(/retry in ([\d.]+)s/i)
        if (retryMatch) {
          const delaySec = Math.ceil(parseFloat(retryMatch[1]))
          throw new Error(`Image generation quota exceeded. Please retry in ${delaySec} seconds, or enable billing at aistudio.google.com.`)
        }
        if (msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('Image generation requires a paid Google AI plan. Enable billing at aistudio.google.com/billing.')
        }
        throw new Error(msg || `Image generation failed (${res.status})`)
      }

      const data = await res.json()
      const images: { base64: string; mimeType: string }[] = []

      for (const candidate of data.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData?.data) {
            images.push({
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? 'image/png',
            })
          }
        }
      }

      if (images.length > 0) return images
    } catch (err) {
      if (err instanceof Error && (err.message.includes('not found') || err.message.includes('not supported'))) continue
      throw err
    }
  }

  throw new Error('Image generation failed. Please try again with a different prompt.')
}

// Tries each model in the chain with up to 2 retries + exponential backoff on 503
async function streamWithFallback(
  history: ReturnType<typeof buildHistory>,
  userMessage: string,
  images: { base64: string; mimeType: string }[],
  onChunk: (text: string) => void
): Promise<string> {
  const userParts = [
    ...images.map((img) => ({ inlineData: { data: img.base64, mimeType: img.mimeType } })),
    { text: userMessage },
  ]
  for (const modelName of MODEL_CHAIN) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const chat = model.startChat({ history, generationConfig: { maxOutputTokens: 2048 } })
        const result = await chat.sendMessageStream(userParts)
        let fullText = ''
        for await (const chunk of result.stream) {
          fullText += chunk.text()
          onChunk(fullText)
        }
        return fullText
      } catch (err) {
        if (is503(err)) {
          if (attempt === 0) await sleep(2000)
          continue
        }
        throw err
      }
    }
  }
  throw new Error('All models are currently overloaded. Please try again in a moment.')
}

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  const createChat = useCallback(() => {
    const id = String(Date.now())
    const newChat: Chat = {
      id,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(id)
    return id
  }, [])

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id))
    setActiveChatId((prev) => (prev === id ? null : prev))
  }, [])

  const renameChat = useCallback((id: string, title: string) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)))
  }, [])

  const sendMessage = useCallback(
    async (content: string, images: { base64: string; mimeType: string }[] = [], mode: 'default' | 'image' | 'canvas' | 'deep-search' = 'default') => {
      let chatId = activeChatId
      let existingMessages: Message[] = []

      if (!chatId) {
        chatId = String(Date.now())
        const newChat: Chat = {
          id: chatId,
          title: content.slice(0, 40) || 'Image',
          messages: [],
          createdAt: new Date(),
        }
        setChats((prev) => [newChat, ...prev])
        setActiveChatId(chatId)
      } else {
        existingMessages = chats.find((c) => c.id === chatId)?.messages ?? []
      }

      const userMsg: Message = {
        id: String(Date.now()),
        role: 'user',
        content,
        images: images.length > 0 ? images : undefined,
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                title: c.messages.length === 0 ? (content.slice(0, 40) || 'Image') : c.title,
                messages: [...c.messages, userMsg],
              }
            : c
        )
      )

      setIsTyping(true)
      setStreamingContent('')

      try {
        // Image generation branch
        if ((mode === 'image' || (isImageGenRequest(content) && images.length === 0))) {
          setStreamingContent('Generating image…')
          const generated = await generateImages(content)
          const aiMsg: Message = {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: generated.length > 0 ? '' : 'Sorry, image generation failed. Try rephrasing your prompt.',
            generatedImages: generated.length > 0 ? generated : undefined,
            timestamp: new Date(),
          }
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
            )
          )
          return
        }

        const history = buildHistory(existingMessages)
        const effectiveContent = mode === 'deep-search'
          ? `You are performing a deep, thorough research task. Provide a comprehensive, well-structured, detailed response with multiple sections, key insights, examples, and sources where relevant.\n\nResearch topic: ${content}`
          : mode === 'canvas'
          ? `You are a web developer. Build exactly what the user asks. Return ONLY a single complete self-contained HTML file with embedded CSS and JS (CDN links allowed). Do not add any explanation outside the HTML. Start with <!DOCTYPE html>.\n\nUser request: ${content}`
          : content
        const fullText = await streamWithFallback(history, effectiveContent, images, setStreamingContent)

        // Extract HTML for canvas mode
        const htmlMatch = fullText.match(/<!DOCTYPE html[\s\S]*<\/html>/i)
        const canvasHtml = mode === 'canvas' && htmlMatch ? htmlMatch[0] : undefined

        const aiMsg: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: canvasHtml ? '' : fullText,
          canvasHtml,
          timestamp: new Date(),
        }

        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        )
      } catch (err) {
        const errorMsg: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Failed to get response. Check your API key.'}`,
          timestamp: new Date(),
        }
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId ? { ...c, messages: [...c.messages, errorMsg] } : c
          )
        )
      } finally {
        setIsTyping(false)
        setStreamingContent('')
      }
    },
    [activeChatId, chats]
  )

  const regenerate = useCallback(async () => {
    if (!activeChatId) return
    const chat = chats.find((c) => c.id === activeChatId)
    if (!chat || chat.messages.length < 2) return

    // Remove last AI message, re-send last user message
    const messagesWithoutLast = chat.messages.slice(0, -1)
    const lastUserMsg = messagesWithoutLast[messagesWithoutLast.length - 1]
    if (!lastUserMsg || lastUserMsg.role !== 'user') return

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, messages: messagesWithoutLast } : c
      )
    )

    setIsTyping(true)
    setStreamingContent('')

    try {
        const history = buildHistory(messagesWithoutLast.slice(0, -1))
        const fullText = await streamWithFallback(history, lastUserMsg.content, lastUserMsg.images ?? [], setStreamingContent)

      const aiMsg: Message = {
        id: String(Date.now()),
        role: 'assistant',
        content: fullText,
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c
        )
      )
    } catch (err) {
      const errorMsg: Message = {
        id: String(Date.now()),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Regeneration failed.'}`,
        timestamp: new Date(),
      }
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, messages: [...c.messages, errorMsg] } : c
        )
      )
    } finally {
      setIsTyping(false)
      setStreamingContent('')
    }
  }, [activeChatId, chats])

  const clearAllChats = useCallback(() => {
    setChats([])
    setActiveChatId(null)
  }, [])

  return {
    chats,
    activeChat,
    activeChatId,
    isTyping,
    streamingContent,
    setActiveChatId,
    createChat,
    deleteChat,
    renameChat,
    sendMessage,
    regenerate,
    clearAllChats,
  }
}
