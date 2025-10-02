import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function AdminHelp() {
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Helpdesk</h1>
          <p className="text-muted-foreground">Manage user queries and support tickets</p>
        </div>

        <Tabs defaultValue="open" className="space-y-4">
          <TabsList>
            <TabsTrigger value="open">Open Tickets (5)</TabsTrigger>
            <TabsTrigger value="pending">Pending (3)</TabsTrigger>
            <TabsTrigger value="resolved">Resolved (12)</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <CardTitle className="text-lg">Login Issue - Student Portal</CardTitle>
                      </div>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <CardDescription>Submitted by: student@example.com • 2 hours ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">Unable to login to student portal. Getting "Invalid credentials" error even with correct password.</p>
                    <div className="flex gap-2">
                      <Button size="sm">Respond</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">Close Ticket</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-2" />
                <p>No pending tickets</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resolved">
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <p>12 tickets resolved this month</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
