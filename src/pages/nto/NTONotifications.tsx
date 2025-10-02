import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { NTOSidebar } from "@/components/nto/NTOSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function NTONotifications() {
  const [recipientGroup, setRecipientGroup] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendNotification = async () => {
    if (!recipientGroup || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      let userIds: string[] = [];
      
      if (recipientGroup === 'sto') {
        const { data } = await supabase.from('sto_officers').select('user_id').eq('approved', true);
        userIds = data?.map(s => s.user_id) || [];
      } else if (recipientGroup === 'dto') {
        const { data } = await supabase.from('dto_officers').select('user_id').eq('approved', true);
        userIds = data?.map(s => s.user_id) || [];
      } else if (recipientGroup === 'tpo') {
        const { data } = await supabase.from('college_tpo').select('user_id').eq('approved', true);
        userIds = data?.map(s => s.user_id) || [];
      } else if (recipientGroup === 'students') {
        const { data } = await supabase.from('students').select('user_id').eq('approved', true);
        userIds = data?.map(s => s.user_id) || [];
      }

      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: subject,
        message: message,
        type: 'info'
      }));

      const { error } = await supabase.from('notifications').insert(notifications);
      
      if (error) throw error;
      
      toast.success(`Notification sent to ${userIds.length} users`);
      setSubject("");
      setMessage("");
      setRecipientGroup("");
    } catch (error) {
      toast.error("Failed to send notification");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout sidebar={<NTOSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communication Center</h1>
          <p className="text-muted-foreground">Send notifications to STOs, DTOs, colleges, and students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Broadcast Notification</CardTitle>
            <CardDescription>Send messages via portal notification, email, or SMS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Group</Label>
              <Select value={recipientGroup} onValueChange={setRecipientGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sto">All STOs</SelectItem>
                  <SelectItem value="dto">All DTOs</SelectItem>
                  <SelectItem value="tpo">All College TPOs</SelectItem>
                  <SelectItem value="students">All Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                placeholder="Enter notification subject" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                rows={6} 
                placeholder="Enter your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSendNotification} disabled={sending}>
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending..." : "Send Notification"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
