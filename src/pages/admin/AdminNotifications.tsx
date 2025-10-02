import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";

export default function AdminNotifications() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications & Communication</h1>
          <p className="text-muted-foreground">Send notifications to users and manage communications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send Notification</CardTitle>
            <CardDescription>Broadcast messages to specific user groups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Group</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">All Students</SelectItem>
                  <SelectItem value="nto">All NTO Officers</SelectItem>
                  <SelectItem value="sto">All STO Officers</SelectItem>
                  <SelectItem value="dto">All DTO Officers</SelectItem>
                  <SelectItem value="tpo">All College TPOs</SelectItem>
                  <SelectItem value="recruiters">All Recruiters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter notification subject" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} placeholder="Enter your message..." />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
