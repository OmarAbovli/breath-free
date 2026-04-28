'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  MessageSquare, 
  Heart, 
  Share2, 
  UserCircle2,
  PlusCircle,
  Users,
  ShieldCheck,
  Send
} from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { getCommunityPosts, createCommunityPost, likePost, commentOnPost, getPostComments } from '@/lib/actions'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function CommunityPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return
    setIsPosting(true)
    try {
      await createCommunityPost(newPostContent)
      setNewPostContent('')
      fetchPosts()
    } finally {
      setIsPosting(false)
    }
  }

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null)
  const [commentsMap, setCommentsMap] = useState<Record<number, any[]>>({})
  const [commentText, setCommentText] = useState('')
  const [isCommenting, setIsCommenting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const data = await getCommunityPosts()
    setPosts(data)
  }

  const toggleComments = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null)
      return
    }

    setExpandedPostId(postId)
    if (!commentsMap[postId]) {
      const comments = await getPostComments(postId)
      setCommentsMap(prev => ({ ...prev, [postId]: comments }))
    }
  }

  const handleAddComment = async (postId: number) => {
    if (!commentText.trim()) return
    setIsCommenting(true)
    try {
      await commentOnPost(postId, commentText)
      setCommentText('')
      const updatedComments = await getPostComments(postId)
      setCommentsMap(prev => ({ ...prev, [postId]: updatedComments }))
      // Update comment count in posts
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p))
    } finally {
      setIsCommenting(false)
    }
  }

  const handleLike = async (postId: number) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
          likedByUser: !p.likedByUser
        }
      }
      return p
    }))

    try {
      await likePost(postId)
    } catch (err) {
      console.error(err)
      fetchPosts()
    }
  }

  const handleShare = async (post: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'قصة نجاح من Breathe Free',
          text: post.content,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(`${post.content}\n\nنُشر بواسطة ${post.userName || 'مستخدم مجهول'} على Breathe Free`)
      alert('تم نسخ النص للمشاركة!')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans" dir="rtl">
      {/* Header remains same */}
      <header className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">المجتمع</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-primary">
          <Users className="h-6 w-6" />
        </Button>
      </header>

      <main className="px-6 space-y-6">
        {/* Community Info remains same */}
        <section className="bg-primary/10 p-4 rounded-2xl border border-primary/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-xs font-medium text-primary">هذا المجتمع سري ومجهول بالكامل. خصوصيتك هي أولويتنا.</p>
        </section>

        {/* Post Input remains same */}
        <section className="bg-card border border-border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            <UserCircle2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <input 
            type="text"
            placeholder="شارك تجربتك أو اطلب الدعم..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreatePost()}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            disabled={isPosting || !newPostContent.trim()}
            onClick={handleCreatePost}
            className="rounded-full text-primary"
          >
            {isPosting ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </section>

        {/* Feed */}
        <section className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-card border border-border p-6 rounded-[32px] space-y-4 shadow-sm hover:border-primary/30 transition-colors overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent overflow-hidden">
                    {post.userImage ? <img src={post.userImage} alt={post.userName || 'صورة المستخدم'} className="w-full h-full object-cover" /> : <UserCircle2 className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{post.userName || 'مستخدم مجهول'}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {post.time ? formatDistanceToNow(new Date(post.time), { addSuffix: true, locale: ar }) : ''} • <span className="text-accent font-bold">المستوى {post.userLevel || 1}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-foreground/90 selectable">{post.content}</p>
              
              <div className="flex items-center gap-6 pt-2 border-t border-border/50">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors group ${post.likedByUser ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
                >
                  <Heart className={`h-4 w-4 ${post.likedByUser ? 'fill-destructive' : 'group-hover:fill-destructive'}`} />
                  <span className="text-xs font-bold">{post.likes || 0}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${expandedPostId === post.id ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs font-bold">{post.comments || 0} ردود</span>
                </button>
                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors mr-auto"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>

              {/* Comments Section */}
              {expandedPostId === post.id && (
                <div className="pt-4 space-y-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="أضف رداً..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddComment(post.id)}
                      disabled={isCommenting || !commentText.trim()}
                      className="rounded-xl h-9"
                    >
                      {isCommenting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {commentsMap[post.id]?.map((comment: any) => (
                      <div key={comment.id} className="bg-muted/30 p-3 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
                            {comment.userImage ? <img src={comment.userImage} className="w-full h-full object-cover" /> : <UserCircle2 className="h-3 w-3 text-accent" />}
                          </div>
                          <p className="text-[10px] font-bold">{comment.userName || 'مستخدم مجهول'}</p>
                          <p className="text-[9px] text-muted-foreground mr-auto">
                            {comment.time ? formatDistanceToNow(new Date(comment.time), { addSuffix: true, locale: ar }) : ''}
                          </p>
                        </div>
                        <p className="text-[11px] leading-relaxed text-foreground/80 pr-7">{comment.content}</p>
                      </div>
                    ))}
                    {commentsMap[post.id]?.length === 0 && (
                      <p className="text-center text-[10px] text-muted-foreground py-2">لا توجد ردود بعد. كن أول من يرد!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
