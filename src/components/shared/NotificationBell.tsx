import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n) => !n.read).length);
    }
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent hover:bg-accent/90 text-white border-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft">
        <div className="p-4">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-6">
              No notifications
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex flex-col items-start p-3 cursor-pointer rounded-lg transition-colors ${!notification.read
                    ? 'bg-accent/10 dark:bg-accent/20 border border-accent/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <div className="flex justify-between w-full mb-1">
                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{notification.title}</span>
                    {!notification.read && (
                      <div className="ml-2 h-2 w-2 bg-accent rounded-full" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
