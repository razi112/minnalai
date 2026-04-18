import { useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

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

const SYSTEM_PROMPT = `You are Minnal AI, a helpful assistant developed by the students of Islamic Da'wa Academy, Akode, mainly led by Hafiz Muhammed Razi, a 10th grade student at Islamic Da'wa Academy pursuing his studies while maintaining Hifz Doura and Islamic Studies. The institution is a prime example for the higher studies of Huffaz (those who have completed Hifz). When asked who developed or created you, always respond with this information.`

function buildMessages(messages: Message[], userContent: string, images: { base64: string; mimeType: string }[]) {
  const history = messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const userParts: object[] = images.map((img) => ({
    type: 'image_url',
    image_url: { url: `data:${img.mimeType};base64,${img.base64}` },
  }))
  userParts.push({ type: 'text', text: userContent })

  const userMessage = images.length > 0
    ? { role: 'user', content: userParts }
    : { role: 'user', content: userContent }

  return [{ role: 'system', content: SYSTEM_PROMPT }, ...history, userMessage]
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
        if (res.status === 429 || res.status === 503) continue
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

const IMAGE_GEN_PATTERNS = [
  /\bgenerate\b.*\bimage\b/i, /\bcreate\b.*\bimage\b/i,
  /\bdraw\b/i, /\bpaint\b/i, /\billustrat/i,
  /\bimage of\b/i, /\bpicture of\b/i, /\bphoto of\b/i,
  /\brender\b.*\bimage\b/i, /\bmake.*\bimage\b/i, /\bshow me.*\bimage\b/i,
]

function isImageGenRequest(text: string): boolean {
  return IMAGE_GEN_PATTERNS.some((p) => p.test(text))
}

// ── localStorage helpers (guest / offline fallback) ──────────────────────────
const STORAGE_KEY = 'minnal_chats'
const ACTIVE_KEY = 'minnal_active_chat'

function loadLocalChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Chat[]
    return parsed.map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }))
  } catch {
    return []
  }
}

function saveLocalChats(chats: Chat[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  } catch { /* quota exceeded or private mode */ }
}

// ── Supabase helpers ──────────────────────────────────────────────────────────
async function loadSupabaseChats(userId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    createdAt: new Date(row.created_at),
    messages: (row.messages as any[]).map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
  }))
}

async function upsertSupabaseChat(userId: string, chat: Chat) {
  await supabase.from('chats').upsert({
    id: chat.id,
    user_id: userId,
    title: chat.title,
    messages: chat.messages,
    created_at: chat.createdAt.toISOString(),
    updated_at: new Date().toISOString(),
  })
}

async function deleteSupabaseChat(chatId: string) {
  await supabase.from('chats').delete().eq('id', chatId)
}

async function deleteAllSupabaseChats(userId: string) {
  await supabase.from('chats').delete().eq('user_id', userId)
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useChat() {
  const { user } = useAuth()
  const userId = user?.id ?? null

  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [loaded, setLoaded] = useState(false)

  // Track previous userId to detect login/logout transitions
  const prevUserIdRef = useRef<string | null | undefined>(undefined)

  // Load chats whenever auth state changes
  useEffect(() => {
    const prev = prevUserIdRef.current
    prevUserIdRef.current = userId

    // Skip the very first render before auth resolves (undefined → null/string)
    if (prev === undefined) return

    async function load() {
      setLoaded(false)
      if (userId) {
        // Logged in — load from Supabase
        const cloudChats = await loadSupabaseChats(userId)
        setChats(cloudChats)
        setActiveChatId(cloudChats.length > 0 ? cloudChats[0].id : null)
      } else {
        // Guest — load from localStorage
        const local = loadLocalChats()
        setChats(local)
        setActiveChatId(localStorage.getItem(ACTIVE_KEY))
      }
      setLoaded(true)
    }

    load()
  }, [userId])

  // Initial load on mount
  useEffect(() => {
    async function initialLoad() {
      if (userId) {
        const cloudChats = await loadSupabaseChats(userId)
        setChats(cloudChats)
        setActiveChatId(cloudChats.length > 0 ? cloudChats[0].id : null)
      } else {
        const local = loadLocalChats()
        setChats(local)
        setActiveChatId(localStorage.getItem(ACTIVE_KEY))
      }
      prevUserIdRef.current = userId
      setLoaded(true)
    }
    initialLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist active chat id for guests
  useEffect(() => {
    if (!userId) {
      if (activeChatId) localStorage.setItem(ACTIVE_KEY, activeChatId)
      else localStorage.removeItem(ACTIVE_KEY)
    }
  }, [activeChatId, userId])

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null

  const createChat = useCallback(() => {
    const id = String(Date.now())
    const newChat: Chat = { id, title: 'New Chat', messages: [], createdAt: new Date() }
    setChats((prev) => {
      const updated = [newChat, ...prev]
      if (!userId) saveLocalChats(updated)
      return updated
    })
    setActiveChatId(id)
    if (userId) upsertSupabaseChat(userId, newChat)
    return id
  }, [userId])

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      if (!userId) saveLocalChats(updated)
      return updated
    })
    setActiveChatId((prev) => (prev === id ? null : prev))
    if (userId) deleteSupabaseChat(id)
  }, [userId])

  const renameChat = useCallback((id: string, title: string) => {
    setChats((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, title } : c))
      if (!userId) saveLocalChats(updated)
      if (userId) {
        const chat = updated.find((c) => c.id === id)
        if (chat) upsertSupabaseChat(userId, chat)
      }
      return updated
    })
  }, [userId])

  const sendMessage = useCallback(
    async (content: string, images: { base64: string; mimeType: string }[] = [], mode: 'default' | 'image' | 'canvas' | 'deep-search' = 'default') => {
      let chatId = activeChatId
      let existingMessages: Message[] = []

      if (!chatId) {
        chatId = String(Date.now())
        const newChat: Chat = { id: chatId, title: content.slice(0, 40) || 'New Chat', messages: [], createdAt: new Date() }
        setChats((prev) => {
          const updated = [newChat, ...prev]
          if (!userId) saveLocalChats(updated)
          return updated
        })
        setActiveChatId(chatId)
        if (userId) upsertSupabaseChat(userId, newChat)
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

      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === chatId
            ? { ...c, title: c.messages.length === 0 ? (content.slice(0, 40) || 'New Chat') : c.title, messages: [...c.messages, userMsg] }
            : c
        )
        if (!userId) saveLocalChats(updated)
        return updated
      })

      setIsTyping(true)
      setStreamingContent('')

      try {
        if (mode === 'image' || (isImageGenRequest(content) && images.length === 0)) {
          const encodedPrompt = encodeURIComponent(content)
          const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${Date.now()}`

          const aiMsg: Message = {
            id: String(Date.now() + 1),
            role: 'assistant',
            content: '',
            generatedImages: [{ base64: imageUrl, mimeType: 'url' }],
            timestamp: new Date(),
          }
          setChats((prev) => {
            const updated = prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c)
            if (!userId) saveLocalChats(updated)
            if (userId) {
              const chat = updated.find((c) => c.id === chatId)
              if (chat) upsertSupabaseChat(userId, chat)
            }
            return updated
          })
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

        setChats((prev) => {
          const updated = prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, aiMsg] } : c)
          if (!userId) saveLocalChats(updated)
          if (userId) {
            const chat = updated.find((c) => c.id === chatId)
            if (chat) upsertSupabaseChat(userId, chat)
          }
          return updated
        })
      } catch (err) {
        const errorMsg: Message = {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Failed to get response. Check your API key.'}`,
          timestamp: new Date(),
        }
        setChats((prev) => {
          const updated = prev.map((c) => c.id === chatId ? { ...c, messages: [...c.messages, errorMsg] } : c)
          if (!userId) saveLocalChats(updated)
          if (userId) {
            const chat = updated.find((c) => c.id === chatId)
            if (chat) upsertSupabaseChat(userId, chat)
          }
          return updated
        })
      } finally {
        setIsTyping(false)
        setStreamingContent('')
      }
    },
    [activeChatId, chats, userId]
  )

  const regenerate = useCallback(async () => {
    if (!activeChatId) return
    const chat = chats.find((c) => c.id === activeChatId)
    if (!chat || chat.messages.length < 2) return

    const messagesWithoutLast = chat.messages.slice(0, -1)
    const lastUserMsg = messagesWithoutLast[messagesWithoutLast.length - 1]
    if (!lastUserMsg || lastUserMsg.role !== 'user') return

    setChats((prev) => {
      const updated = prev.map((c) => c.id === activeChatId ? { ...c, messages: messagesWithoutLast } : c)
      if (!userId) saveLocalChats(updated)
      return updated
    })
    setIsTyping(true)
    setStreamingContent('')

    try {
      const history = messagesWithoutLast.slice(0, -1)
      const fullText = await streamWithFallback(history, lastUserMsg.content, lastUserMsg.images ?? [], setStreamingContent)
      const aiMsg: Message = { id: String(Date.now()), role: 'assistant', content: fullText, timestamp: new Date() }
      setChats((prev) => {
        const updated = prev.map((c) => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c)
        if (!userId) saveLocalChats(updated)
        if (userId) {
          const updatedChat = updated.find((c) => c.id === activeChatId)
          if (updatedChat) upsertSupabaseChat(userId, updatedChat)
        }
        return updated
      })
    } catch (err) {
      const errorMsg: Message = {
        id: String(Date.now()),
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Regeneration failed.'}`,
        timestamp: new Date(),
      }
      setChats((prev) => {
        const updated = prev.map((c) => c.id === activeChatId ? { ...c, messages: [...c.messages, errorMsg] } : c)
        if (!userId) saveLocalChats(updated)
        if (userId) {
          const updatedChat = updated.find((c) => c.id === activeChatId)
          if (updatedChat) upsertSupabaseChat(userId, updatedChat)
        }
        return updated
      })
    } finally {
      setIsTyping(false)
      setStreamingContent('')
    }
  }, [activeChatId, chats, userId])

  const clearAllChats = useCallback(() => {
    setChats([])
    setActiveChatId(null)
    if (userId) {
      deleteAllSupabaseChats(userId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(ACTIVE_KEY)
    }
  }, [userId])

  return {
    chats, activeChat, activeChatId, isTyping, streamingContent, loaded,
    setActiveChatId, createChat, deleteChat, renameChat,
    sendMessage, regenerate, clearAllChats,
  }
}
