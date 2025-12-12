import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, Plus, ThumbsUp, MessageCircle, Clock, User, 
  Pin, Lock, Search, Eye, Tag, Send, ArrowLeft, CheckCircle,
  Filter, TrendingUp, Users, Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { forumDiscussions, forumCategories, ForumDiscussion } from "@/data/mockMessaging";

export default function Forum() {
  const [selectedDiscussion, setSelectedDiscussion] = useState<ForumDiscussion | null>(null);
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    category: "",
    content: "",
    tags: ""
  });

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title || !newDiscussion.category || !newDiscussion.content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Discussion créée avec succès");
    setIsNewDiscussionOpen(false);
    setNewDiscussion({ title: "", category: "", content: "", tags: "" });
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    toast.success("Réponse publiée");
    setReplyContent("");
  };

  const filteredDiscussions = forumDiscussions
    .filter(disc => {
      const matchesSearch = disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           disc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           disc.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || disc.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (sortBy === "recent") return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      if (sortBy === "popular") return b.views - a.views;
      if (sortBy === "replies") return b.replies.length - a.replies.length;
      return 0;
    });

  const totalDiscussions = forumDiscussions.length;
  const totalReplies = forumDiscussions.reduce((sum, d) => sum + d.replies.length, 0);
  const activeDiscussions = forumDiscussions.filter(d => d.status === 'active').length;

  if (selectedDiscussion) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedDiscussion(null)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux discussions
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedDiscussion.isPinned && (
                    <Pin className="h-4 w-4 text-primary" />
                  )}
                  {selectedDiscussion.isLocked && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <CardTitle className="text-xl">{selectedDiscussion.title}</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{selectedDiscussion.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{selectedDiscussion.author.name}</span>
                  </div>
                  <Badge variant="outline">{selectedDiscussion.author.role}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedDiscussion.createdAt}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{selectedDiscussion.category}</Badge>
                <Badge variant={
                  selectedDiscussion.status === 'active' ? 'default' :
                  selectedDiscussion.status === 'resolved' ? 'secondary' : 'outline'
                }>
                  {selectedDiscussion.status === 'active' ? 'Actif' :
                   selectedDiscussion.status === 'resolved' ? 'Résolu' : 'Fermé'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="whitespace-pre-wrap">{selectedDiscussion.content}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {selectedDiscussion.views} vues
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {selectedDiscussion.likes} j'aime
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {selectedDiscussion.replies.length} réponses
              </span>
              {selectedDiscussion.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {selectedDiscussion.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>

            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" />
              J'aime
            </Button>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Réponses ({selectedDiscussion.replies.length})
          </h3>

          {selectedDiscussion.replies.map((reply) => (
            <Card key={reply.id} className={reply.isAccepted ? "border-green-500 border-2" : ""}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{reply.author.name}</span>
                      <Badge variant="outline" className="text-xs">{reply.author.role}</Badge>
                      {reply.isAccepted && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Réponse acceptée
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{reply.createdAt}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        Répondre
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Form */}
        {!selectedDiscussion.isLocked && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ajouter une réponse</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Votre réponse..."
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleReply}>
                <Send className="mr-2 h-4 w-4" />
                Publier la réponse
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedDiscussion.isLocked && (
          <Card className="bg-muted">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p>Cette discussion est verrouillée. Vous ne pouvez plus y répondre.</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forum Interne</h1>
          <p className="text-muted-foreground">Espace d'échange et de collaboration entre le personnel</p>
        </div>
        <Dialog open={isNewDiscussionOpen} onOpenChange={setIsNewDiscussionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une Discussion</DialogTitle>
              <DialogDescription>Lancez un nouveau sujet de discussion</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input 
                  placeholder="Titre de la discussion"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select 
                  value={newDiscussion.category}
                  onValueChange={(value) => setNewDiscussion(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {forumCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea 
                  placeholder="Décrivez votre sujet en détail..."
                  rows={8}
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (séparés par des virgules)</Label>
                <Input 
                  placeholder="ex: sortie, histoire, 3ème"
                  value={newDiscussion.tags}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewDiscussionOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateDiscussion}>
                <Send className="mr-2 h-4 w-4" />
                Publier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discussions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDiscussions}</div>
            <p className="text-xs text-muted-foreground">{activeDiscussions} actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réponses</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReplies}</div>
            <p className="text-xs text-muted-foreground">Contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">Membres actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette Semaine</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+24</div>
            <p className="text-xs text-green-600">Nouvelles contributions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Catégories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div 
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${categoryFilter === 'all' ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setCategoryFilter('all')}
              >
                <span className="font-medium">Toutes</span>
                <Badge variant="secondary">{totalDiscussions}</Badge>
              </div>
              {forumCategories.map((cat) => (
                <div 
                  key={cat.id} 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${categoryFilter === cat.name ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => setCategoryFilter(cat.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discussions List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une discussion..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récentes</SelectItem>
                <SelectItem value="popular">Plus vues</SelectItem>
                <SelectItem value="replies">Plus de réponses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredDiscussions.map((disc) => (
              <Card 
                key={disc.id} 
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedDiscussion(disc)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{disc.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {disc.isPinned && (
                          <Pin className="h-4 w-4 text-primary shrink-0" />
                        )}
                        {disc.isLocked && (
                          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <h3 className="font-semibold truncate">{disc.title}</h3>
                        <Badge variant={
                          disc.status === 'active' ? 'default' :
                          disc.status === 'resolved' ? 'secondary' : 'outline'
                        } className="shrink-0">
                          {disc.status === 'active' ? 'Actif' :
                           disc.status === 'resolved' ? 'Résolu' : 'Fermé'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {disc.author.name}
                        </span>
                        <Badge variant="outline">{disc.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {disc.lastActivity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{disc.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {disc.replies.length}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {disc.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {disc.likes}
                        </span>
                        {disc.tags.length > 0 && (
                          <div className="flex gap-1 ml-auto">
                            {disc.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDiscussions.length === 0 && (
            <Card>
              <CardContent className="pt-12 pb-12 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Aucune discussion trouvée</p>
                <p className="text-sm">Modifiez vos filtres ou créez une nouvelle discussion</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
