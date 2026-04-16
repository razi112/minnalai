import { useState, useCallback } from 'react'

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

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Fallback model chain
const MODEL_CHAIN = [
  'google/gemini-2.5-flash-preview',
  'google/gemini-2.0-flash-001',
  'google/gemini-flash-1.5',
]

function buildMessages(messages: Message[], userContent: string, images: { base64: string; mimeType: string }[]) {
  const history = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  // Build user message — include images as base64 if present
  const userParts: object[] = images.map((img) => ({
    type: 'image_url',
    image_url: { url: `data:${img.mimeType};base64,${img.base64}` },
  }))
  userParts.push({ type: 'text', text: userContent })

  const userMessage = images.length > 0
    ? { role: 'user', content: userParts }
    : { role: 'user', content: userContent }

  return [...history, userMessage]
}

async function streamWithFallback(
  messages: Message[],
  userContent: string,
  images: { base64: string; mimeType: string }[],
  onChunk: (text: string) => void
): Promise<string> {
  const builtMessages = buildMessages(messages, userContent, images)

  for (const model of MODEL_CHAIN) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Minnal AI',
        },
        body: JSON.stringify({
          model,
          messages: builtMessages,
          stream: true,
          max_tokens: 2048,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg: string = err?.error?.message ?? `Request failed (${res.status})`
        if (res.status === 429 || res.status === 503) continue // try next model
        throw new Error(msg)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          const trimmed = line.replace(/^data: /, '').trim()
          if (!trimmed || trimmed === '[DONE]') continue
          try {
            const json = JSON.parse(trimmed)
            const delta = json.choices?.[0]?.delta?.content ?? ''
            if (delta) {
              fullText += delta
              onChunk(fullText)
            }
          } catch { /* skip malformed lines */ }
        }
      }

      return fullText
    } catch (err) {
      if (MODEL_CHAIN.indexOf(model) < MODEL_CHAIN.length - 1) continue
      throw err
    }
  }

  throw new Error('All models are currently unavailable. Please try again.')
}

// Detect image generation requests
const IMAGE_GEN_PATTERNS = [
  /\bgenerate\b.*\bimage\b/i, /\bcreate\b.*\bimage\b/i,
  /\bdraw\b/i, /\bpaint\b/i, /\billustrat/i,
  /\bimage of\b/i, /\bpicture of\b/i, /\bphoto of\b/i,
  /\brender\b.*\bimage\b/i, /\bmake.*\bimage\b/i, /\bshow me.*\bimage\b/i,
]

function isImageGenRequest(text: string): boolean {
  return IMAGE_GEN_PATTERNS.some((p) => p.test(text))
}

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  const createChat = useCallback(() => {
    const id = String(Date.now())
    const newChat: Chat = { id, title: 'New Chat', messages: [], createdAt: new Date() }
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
        const newChat: Chat = { id: chatId, title: content.slice(0, 40) || 'New Chat', messages: [], createdAt: new Date() }
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
            ? { ...c, title: c.messages.length === 0 ? (content.slice(0, 40) || 'New Chat') : c.title, messages: [...c.messages, userMsg] }
            : c
        )
      )

      setIsTyping(true)
      setStreamingContent('')

      try {
        if (mode === 'image' || (isImageGenRequest(content) && images.length === 0)) {
          // OpenRouter doesn't support image generation — inform user
          const aiMsg: Message = {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: 'Image generation is not supported with the current AI provider. Please describe what you want and I can help with text-based creative descriptions instead.',
            timestamp: new Date(),
          }
          setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c))
          return
        }

        const effectiveContent = mode === 'deep-search'
          ? `You are performing a deep, thorough research task. Provide a comprehensive, well-structured, detailed response with multiple sections, key insights, examples, and sources where relevant.\n\nResearch topic: ${content}`
          : mode === 'canvas'
          ? `You are a web developer. Build exactly what the user asks. Return ONLY a single complete self-contained HTML file with embedded CSS and JS (CDN links allowed). Do not add any explanation outside the HTML. Start with <!DOCTYPE html>.\n\nUser request: ${content}`
          : content

        const fullText = await streamWithFallback(existingMessages, effectiveContent, images, setStreamingContent)

        const htmlMatch = fullText.match(/<!DOCTYPE html[\s\S]*<\/html>/i)
        const canvasHtml = mode === 'canvas' && htmlMatch ? htmlMatch[0] : undefined

        const aiMsg: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: canvasHtml ? '' : fullText,
          canvasHtml,
          timestamp: new Date(),
        }

        setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      } catch (err) {
        const errorMsg: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Failed to get response. Check your API key.'}`,
          timestamp: new Date(),
        }
        setChats((prev) => prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, errorMsg] } : c))
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

    const messagesWithoutLast = chat.messages.slice(0, -1)
    const lastUserMsg = messagesWithoutLast[messagesWithoutLast.length - 1]
    if (!lastUserMsg || lastUserMsg.role !== 'user') return

    setChats((prev) => prev.map((c) => c.id === activeChatId ? { ...c, messages: messagesWithoutLast } : c))
    setIsTyping(true)
    setStreamingContent('')

    try {
      const history = messagesWithoutLast.slice(0, -1)
      const fullText = await streamWithFallback(history, lastUserMsg.content, lastUserMsg.images ?? [], setStreamingContent)
      const aiMsg: Message = { id: String(Date.now()), role: 'assistant', content: fullText, timestamp: new Date() }
      setChats((prev) => prev.map((c) => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c))
    } catch (err) {
      const errorMsg: Message = {
        id: String(Date.now()),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Regeneration failed.'}`,
        timestamp: new Date(),
      }
      setChats((prev) => prev.map((c) => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMsg] } : c))
    } finally {
      setIsTyping(false)
      setStreamingContent('')
    }
  }, [activeChatId, chats])

  const clearAllChats = useCallback(() => {
    setChats([])
    setActiveChatId(null)
  }, [])

  return { chats, activeChat, activeChatId, isTyping, streamingContent, setActiveChatId, createChat, deleteChat, renameChat, sendMessage, regenerate, clearAllChats }
}
