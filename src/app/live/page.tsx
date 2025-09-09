'use client';

import { useEffect, useState, useRef } from 'react';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfilePhoto } from '@/components/ui/profile-photo';
import { 
  Play, 
  Pause, 
  Users, 
  Heart, 
  Send, 
  Video, 
  VideoOff,
  Mic,
  MicOff,
  MonitorPlay,
  Plus
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { formatDistanceToNow } from 'date-fns';
import {
  getLiveStreams,
  getAllStreams,
  subscribeToStreamMessages,
  sendStreamMessage,
  joinStream,
  leaveStream,
  SimpleWebRTC,
  STREAM_CATEGORIES,
  type LiveStream,
  type StreamMessage,
} from '@/lib/live-streaming';

export default function LivePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [liveStreams, setLiveStreams] = useState<(LiveStream & { id: string })[]>([]);
  const [allStreams, setAllStreams] = useState<(LiveStream & { id: string })[]>([]);
  const [selectedStream, setSelectedStream] = useState<(LiveStream & { id: string }) | null>(null);
  const [streamMessages, setStreamMessages] = useState<(StreamMessage & { id: string })[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [loading, setLoading] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const webRTCRef = useRef<SimpleWebRTC | null>(null);

  useEffect(() => {
    loadStreams();
  }, []);

  useEffect(() => {
    if (selectedStream && user) {
      // Join stream as viewer
      joinStream(selectedStream.id, user.uid);

      // Subscribe to messages
      const unsubscribe = subscribeToStreamMessages(selectedStream.id, setStreamMessages);

      return () => {
        unsubscribe();
        leaveStream(selectedStream.id, user.uid);
      };
    }
  }, [selectedStream, user]);

  const loadStreams = async () => {
    try {
      const [live, all] = await Promise.all([
        getLiveStreams(),
        getAllStreams(),
      ]);
      setLiveStreams(live);
      setAllStreams(all);
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStream || !user) return;

    try {
      await sendStreamMessage(selectedStream.id, user, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startWebcam = async () => {
    try {
      webRTCRef.current = new SimpleWebRTC(localVideoRef.current || undefined);
      await webRTCRef.current.startLocalStream();
      setIsVideoOn(true);
      setIsAudioOn(true);
    } catch (error) {
      console.error('Error starting webcam:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const stopWebcam = () => {
    if (webRTCRef.current) {
      webRTCRef.current.stopLocalStream();
      setIsVideoOn(false);
      setIsAudioOn(false);
    }
  };

  const startScreenShare = async () => {
    try {
      webRTCRef.current = new SimpleWebRTC(localVideoRef.current || undefined);
      await webRTCRef.current.startScreenShare();
      setIsVideoOn(true);
    } catch (error) {
      console.error('Error starting screen share:', error);
      alert('Could not start screen sharing. Please check permissions.');
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppShell>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </AppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Kaya Live</h1>
            <Button onClick={() => setActiveTab('create')} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Go Live
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Streams</TabsTrigger>
              <TabsTrigger value="live">Live Streams</TabsTrigger>
              <TabsTrigger value="create">Create Stream</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allStreams.map((stream) => (
                  <Card key={stream.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedStream(stream)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <ProfilePhoto 
                          imageUrl={stream.streamerPhotoURL} 
                          size={40} 
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground">{stream.streamerName}</p>
                        </div>
                        {stream.isLive && (
                          <Badge variant="destructive" className="animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {stream.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {STREAM_CATEGORIES[stream.category]?.icon} {STREAM_CATEGORIES[stream.category]?.label}
                        </Badge>
                        {stream.isLive && (
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {stream.viewerCount}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="live" className="space-y-6">
              {liveStreams.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Live Streams</h3>
                  <p className="text-muted-foreground">No one is streaming right now. Be the first to go live!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {liveStreams.map((stream) => (
                    <Card key={stream.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedStream(stream)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <ProfilePhoto 
                            imageUrl={stream.streamerPhotoURL} 
                            size={40} 
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{stream.title}</h3>
                            <p className="text-sm text-muted-foreground">{stream.streamerName}</p>
                          </div>
                          <Badge variant="destructive" className="animate-pulse">
                            LIVE
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {STREAM_CATEGORIES[stream.category]?.icon} {STREAM_CATEGORIES[stream.category]?.label}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            {stream.viewerCount}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Stream Setup */}
                <Card>
                  <CardHeader>
                    <CardTitle>Stream Setup</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video Preview */}
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                        style={{ display: isVideoOn ? 'block' : 'none' }}
                      />
                      {!isVideoOn && (
                        <div className="text-white text-center">
                          <VideoOff className="h-12 w-12 mx-auto mb-2" />
                          <p>Camera Off</p>
                        </div>
                      )}
                    </div>

                    {/* Stream Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={isVideoOn ? stopWebcam : startWebcam}
                      >
                        {isVideoOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" disabled>
                        {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" onClick={startScreenShare}>
                        <MonitorPlay className="h-4 w-4 mr-2" />
                        Share Screen
                      </Button>
                    </div>

                    {/* Stream Info */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Stream Title</label>
                        <Input
                          placeholder="What are you streaming about?"
                          value={streamTitle}
                          onChange={(e) => setStreamTitle(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        size="lg"
                        disabled={!isVideoOn || !streamTitle.trim()}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Live Stream
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stream Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Streaming Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">✨ Great Content Ideas</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Growing tips and plant care</li>
                        <li>• Strain reviews and tastings</li>
                        <li>• Cannabis cooking demos</li>
                        <li>• Educational discussions</li>
                        <li>• Dispensary tours</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">🎥 Technical Tips</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Good lighting is key</li>
                        <li>• Test audio before going live</li>
                        <li>• Engage with your viewers</li>
                        <li>• Keep it authentic</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Stream Viewer Modal */}
          {selectedStream && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                {/* Stream Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <ProfilePhoto imageUrl={selectedStream.streamerPhotoURL} size={40} />
                    <div>
                      <h2 className="font-semibold">{selectedStream.title}</h2>
                      <p className="text-sm text-muted-foreground">{selectedStream.streamerName}</p>
                    </div>
                    {selectedStream.isLive && (
                      <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      {selectedStream.viewerCount}
                    </div>
                    <Button variant="outline" onClick={() => setSelectedStream(null)}>
                      Close
                    </Button>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-[1fr_300px] min-h-0">
                  {/* Video Area */}
                  <div className="bg-black flex items-center justify-center">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      className="w-full h-full object-contain"
                      style={{ display: selectedStream.isLive ? 'block' : 'none' }}
                    />
                    {!selectedStream.isLive && (
                      <div className="text-white text-center">
                        <VideoOff className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Stream Offline</h3>
                        <p className="text-muted-foreground">This stream has ended</p>
                      </div>
                    )}
                  </div>

                  {/* Chat Area */}
                  <div className="border-l flex flex-col">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold">Live Chat</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {streamMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-2">
                          <ProfilePhoto imageUrl={message.userPhotoURL} size={24} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{message.userName}</span>
                              <span className="text-xs text-muted-foreground">
                                {message.createdAt && formatDistanceToNow(message.createdAt.toDate(), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm break-words">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedStream.isLive && (
                      <div className="p-3 border-t">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Say something..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button size="icon" onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}