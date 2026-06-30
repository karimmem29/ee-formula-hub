import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
export default function Notebook() {
  const router = useRouter()
  const { user, isPro, loading: authLoading } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeNote, setActiveNote] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) loadNotes()
  }, [user])

  const loadNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
    if (!error) setNotes(data || [])
    setLoading(false)
  }

  const selectNote = (note) => {
    setActiveNote(note)
    setTitle(note.title)
    setContent(note.content)
    setSavedMsg('')
  }

  const newNote = () => {
    setActiveNote(null)
    setTitle('')
    setContent('')
    setSavedMsg('')
  }

  const saveNote = async () => {
    if (!title.trim()) return
    setSaving(true)
    setSavedMsg('')

    if (activeNote) {
      const { error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('id', activeNote.id)
      if (!error) {
        await loadNotes()
        setSavedMsg('Saved')
      }
    } else {
      const { data, error } = await supabase
        .from('notes')
        .insert({ user_id: user.id, title, content })
        .select()
        .single()
      if (!error) {
        await loadNotes()
        setActiveNote(data)
        setSavedMsg('Saved')
      }
    }
    setSaving(false)
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return
    await supabase.from('notes').delete().eq('id', id)
    if (activeNote?.id === id) newNote()
    await loadNotes()
  }

  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-14 bg-[#0F1117] flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading...</p>
        </main>
      </>
    )
  }

  if (!isPro) {
    return (
      <>
        <Head><title>Notebook — EE Formula Hub</title></Head>
        <Navbar />
        <main className="min-h-screen pt-14 bg-[#0F1117] flex items-center justify-center px-4">
          <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-8 max-w-sm text-center">
            <div className="text-3xl mb-3">📓</div>
            <h1 className="text-lg font-bold text-white mb-2">Notebook is a Pro feature</h1>
            <p className="text-sm text-gray-500 mb-5">Save your own notes and worked problems for exam revision — available with Pro.</p>
            <a
              href="/pricing"
              className="inline-block bg-[#00D4FF] text-[#0F1117] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#00BBDD] transition-colors"
            >
              Upgrade to Pro — $4.99/mo
            </a>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Head><title>My Notebook — EE Formula Hub</title></Head>
      <Navbar />
      <main className="min-h-screen pt-14 bg-[#0F1117]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex gap-4" style={{ height: 'calc(100vh - 80px)' }}>

          <div className="w-64 shrink-0 flex flex-col gap-3">
            <button
              onClick={newNote}
              className="bg-[#00D4FF] text-[#0F1117] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#00BBDD] transition-colors"
            >
              + New note
            </button>
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5">
              {loading && <p className="text-xs text-gray-600 px-2">Loading...</p>}
              {!loading && notes.length === 0 && (
                <p className="text-xs text-gray-600 px-2">No notes yet. Create your first one!</p>
              )}
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note)}
                  className={`group p-3 rounded-lg cursor-pointer border transition-all ${
                    activeNote?.id === note.id
                      ? 'bg-[#00D4FF10] border-[#00D4FF40]'
                      : 'bg-[#1A1D27] border-[#2A2D3A] hover:border-[#00D4FF30]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-white font-medium truncate flex-1">{note.title}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                      className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-5 flex flex-col gap-3">
            <input
              className="bg-transparent text-xl font-bold text-white placeholder-gray-600 outline-none"
              placeholder="Note title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none resize-none font-mono leading-relaxed"
              placeholder="Write your notes here — formulas, reminders, worked problems, anything you need for exam revision..."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div className="flex items-center gap-3 pt-2 border-t border-[#2A2D3A]">
              <button
                onClick={saveNote}
                disabled={saving || !title.trim()}
                className="bg-[#00D4FF] text-[#0F1117] font-semibold text-sm px-5 py-2 rounded-lg hover:bg-[#00BBDD] transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save note'}
              </button>
              {savedMsg && <span className="text-xs text-[#00D4FF]">{savedMsg}</span>}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}