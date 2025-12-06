import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Clock,
  Users,
  User,
  Bell,
  BellOff,
  Pin,
  Trash2,
  Plus,
  BookOpen,
  GraduationCap,
  Calendar,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock data
const mockStudent = {
  matricule: "66800001A",
  name: "Kouassi Jean-Marc",
  class: "6ème A"
};

const conversations = [
  {
    id: 1,
    type: "teacher",
    name: "M. Konan",
    subject: "Mathématiques",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Konan",
    lastMessage: "Les devoirs pour la semaine prochaine sont disponibles.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unread: 2,
    online: true,
    pinned: true
  },
  {
    id: 2,
    type: "teacher",
    name: "Mme Bamba",
    subject: "Français",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bamba",
    lastMessage: "Excellente rédaction de Jean-Marc !",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 0,
    online: false,
    pinned: false
  },
  {
    id: 3,
    type: "admin",
    name: "Administration",
    subject: "Secrétariat",
    avatar: null,
    lastMessage: "Rappel: réunion parents-professeurs le 15 décembre.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 1,
    online: true,
    pinned: true
  },
  {
    id: 4,
    type: "teacher",
    name: "M. Yao",
    subject: "Anglais",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yao",
    lastMessage: "Jean-Marc participe bien en classe.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
    unread: 0,
    online: false,
    pinned: false
  },
  {
    id: 5,
    type: "group",
    name: "Classe 6ème A",
    subject: "Parents d'élèves",
    avatar: null,
    lastMessage: "Mme Touré: N'oubliez pas les fournitures pour l'atelier.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72),
    unread: 5,
    online: false,
    pinned: false
  }
];

const messagesData: Record<number, Array<{
  id: number;
  sender: string;
  content: string;
  time: Date;
  read: boolean;
  isMe: boolean;
  attachment?: { name: string; type: string };
}>> = {
  1: [
    { id: 1, sender: "M. Konan", content: "Bonjour M. Kouassi,\n\nJe souhaitais vous informer des progrès de Jean-Marc en mathématiques.", time: new Date(Date.now() - 1000 * 60 * 60 * 24), read: true, isMe: false },
    { id: 2, sender: "Moi", content: "Bonjour M. Konan,\n\nMerci pour votre message. Comment se comporte-t-il en classe ?", time: new Date(Date.now() - 1000 * 60 * 60 * 23), read: true, isMe: true },
    { id: 3, sender: "M. Konan", content: "Jean-Marc est très attentif et participe activement. Sa dernière note de 16/20 est très encourageante.", time: new Date(Date.now() - 1000 * 60 * 60 * 22), read: true, isMe: false },
    { id: 4, sender: "Moi", content: "C'est une excellente nouvelle ! Nous sommes très fiers de lui.", time: new Date(Date.now() - 1000 * 60 * 60 * 21), read: true, isMe: true },
    { id: 5, sender: "M. Konan", content: "Les devoirs pour la semaine prochaine sont disponibles.", time: new Date(Date.now() - 1000 * 60 * 30), read: false, isMe: false, attachment: { name: "Devoirs_Maths_Semaine12.pdf", type: "pdf" } },
    { id: 6, sender: "M. Konan", content: "N'hésitez pas si vous avez des questions.", time: new Date(Date.now() - 1000 * 60 * 28), read: false, isMe: false },
  ],
  3: [
    { id: 1, sender: "Administration", content: "Chers parents,\n\nNous vous informons que la réunion parents-professeurs aura lieu le 15 décembre 2024 à 14h00.", time: new Date(Date.now() - 1000 * 60 * 60 * 24), read: false, isMe: false },
  ]
};

const announcements = [
  { 
    id: 1, 
    title: "Réunion Parents-Professeurs", 
    content: "La réunion du 1er trimestre aura lieu le 15 décembre à 14h00 dans la salle polyvalente.", 
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: "event",
    important: true
  },
  { 
    id: 2, 
    title: "Fermeture pour les fêtes", 
    content: "L'établissement sera fermé du 21 décembre au 6 janvier inclus.", 
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    type: "info",
    important: false
  },
  { 
    id: 3, 
    title: "Sortie pédagogique", 
    content: "Une sortie au musée des civilisations est prévue pour la classe de 6ème A le 18 décembre.", 
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    type: "event",
    important: true
  },
];

export default function ChatParents() {
  const [selectedConversation, setSelectedConversation] = useState<typeof conversations[0] | null>(conversations[0]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageDialog, setNewMessageDialog] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast.success("Message envoyé");
    setMessage("");
  };

  const handleNewMessage = () => {
    if (!selectedRecipient || !newMessageContent.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Nouveau message envoyé");
    setNewMessageDialog(false);
    setSelectedRecipient("");
    setNewMessageContent("");
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });

  const messages = selectedConversation ? messagesData[selectedConversation.id] || [] : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "teacher": return <BookOpen className="h-3 w-3" />;
      case "admin": return <GraduationCap className="h-3 w-3" />;
      case "group": return <Users className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] p-6">
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              Messagerie
            </h1>
            <p className="text-muted-foreground mt-1">
              Communication avec les enseignants et l'administration
            </p>
          </div>
          <Button onClick={() => setNewMessageDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau message
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Annonces
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-22rem)]">
              {/* Conversations List */}
              <Card className="md:col-span-1 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="space-y-1 p-2">
                      {sortedConversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            selectedConversation?.id === conv.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={conv.avatar || undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {conv.type === "group" ? (
                                  <Users className="h-5 w-5" />
                                ) : conv.type === "admin" ? (
                                  <GraduationCap className="h-5 w-5" />
                                ) : (
                                  conv.name.charAt(0)
                                )}
                              </AvatarFallback>
                            </Avatar>
                            {conv.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-background" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                {conv.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                                <span className="font-medium truncate">{conv.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(conv.lastMessageTime, { addSuffix: false, locale: fr })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {getTypeIcon(conv.type)}
                                <span className="ml-1">{conv.subject}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {conv.lastMessage}
                            </p>
                          </div>
                          {conv.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                              {conv.unread}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="md:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={selectedConversation.avatar || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {selectedConversation.type === "group" ? (
                                <Users className="h-5 w-5" />
                              ) : selectedConversation.type === "admin" ? (
                                <GraduationCap className="h-5 w-5" />
                              ) : (
                                selectedConversation.name.charAt(0)
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{selectedConversation.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              {selectedConversation.online ? (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-success" />
                                  En ligne
                                </>
                              ) : (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-muted" />
                                  Hors ligne
                                </>
                              )}
                              <span className="mx-1">•</span>
                              {selectedConversation.subject}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 p-4 overflow-hidden">
                      <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex gap-3",
                                msg.isMe ? "flex-row-reverse" : "flex-row"
                              )}
                            >
                              {!msg.isMe && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={selectedConversation.avatar || undefined} />
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {msg.sender.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={cn(
                                  "max-w-[70%] rounded-lg p-3",
                                  msg.isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                )}
                              >
                                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                {msg.attachment && (
                                  <div className={cn(
                                    "mt-2 p-2 rounded flex items-center gap-2 text-xs",
                                    msg.isMe ? "bg-primary-foreground/10" : "bg-background"
                                  )}>
                                    <Paperclip className="h-3 w-3" />
                                    {msg.attachment.name}
                                  </div>
                                )}
                                <div className={cn(
                                  "flex items-center gap-1 mt-1 text-xs",
                                  msg.isMe ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                                )}>
                                  <span>{format(msg.time, "HH:mm")}</span>
                                  {msg.isMe && (
                                    msg.read ? (
                                      <CheckCheck className="h-3 w-3" />
                                    ) : (
                                      <Clock className="h-3 w-3" />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>
                    </CardContent>

                    {/* Input */}
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Écrivez votre message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Sélectionnez une conversation</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="flex-1 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Annonces de l'Établissement</CardTitle>
                <CardDescription>Informations importantes de l'école</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      announcement.important
                        ? "border-warning/50 bg-warning/5"
                        : "border-border bg-muted/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center",
                          announcement.type === "event"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {announcement.type === "event" ? (
                            <Calendar className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{announcement.title}</h4>
                            {announcement.important && (
                              <Badge className="bg-warning/10 text-warning border-warning/20">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Important
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(announcement.date, { addSuffix: true, locale: fr })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Message Dialog */}
      <Dialog open={newMessageDialog} onOpenChange={setNewMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Message</DialogTitle>
            <DialogDescription>
              Envoyez un message à un enseignant ou à l'administration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destinataire</Label>
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un destinataire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="konan">M. Konan - Mathématiques</SelectItem>
                  <SelectItem value="bamba">Mme Bamba - Français</SelectItem>
                  <SelectItem value="yao">M. Yao - Anglais</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                  <SelectItem value="direction">Direction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Écrivez votre message..."
                rows={5}
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Pièce jointe (optionnel)</Label>
              <Input type="file" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMessageDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleNewMessage}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
