import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function DTONotifications() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('all');
  const [sending, setSending] = useState(false);

  const sendNotification = async () => {
    if (!title || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      // TODO: Implement notification sending logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Notification sent successfully');
      setTitle('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout title="DTO Notifications" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Communication Center</h1>
          <p className="text-muted-foreground">Send notifications to colleges, departments, and students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Send Notification
            </CardTitle>
            <CardDescription>
              Broadcast messages to all or specific recipients in your district
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Send To</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges in District</SelectItem>
                  <SelectItem value="colleges">Specific College</SelectItem>
                  <SelectItem value="departments">Specific Department</SelectItem>
                  <SelectItem value="students">Individual Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={sendNotification} disabled={sending}>
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setTitle('');
                  setMessage('');
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
