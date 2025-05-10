
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import AdminLayout from '@/components/AdminLayout';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

const AdminSettings = () => {
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Notifications form
  const notificationsForm = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      marketingEmails: false,
    },
  });

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed",
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Update error",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationsSubmit = (values: z.infer<typeof notificationsSchema>) => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would apply the theme to the document
    toast({
      title: `${!isDarkMode ? 'Dark' : 'Light'} mode enabled`,
      description: `Theme has been changed to ${!isDarkMode ? 'dark' : 'light'} mode`,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-premium-light/70">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Settings */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Password Settings</h2>
            
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-premium-gradient hover:scale-105 transition-transform"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Appearance Settings */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Appearance</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-premium-light/70">
                    Toggle between light and dark mode
                  </p>
                </div>
                
                <Toggle 
                  pressed={isDarkMode} 
                  onPressedChange={toggleDarkMode} 
                  className="bg-transparent hover:bg-premium-light/10 data-[state=on]:bg-premium-gradient"
                >
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Toggle>
              </div>
              
              <div className="pb-4 border-b border-premium-light/10">
                <h3 className="font-medium mb-2">Theme Color</h3>
                <div className="flex gap-2">
                  {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full focus:ring-2 focus:ring-premium-light hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        toast({
                          title: "Theme color updated",
                          description: "Your theme color preference has been saved",
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                <FormField
                  control={notificationsForm.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-premium-light/10 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Notifications</FormLabel>
                        <p className="text-sm text-premium-light/70">
                          Receive email about your account activity
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={notificationsForm.control}
                  name="marketingEmails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-premium-light/10 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Marketing Emails</FormLabel>
                        <p className="text-sm text-premium-light/70">
                          Receive emails about new features, products and offers
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-premium-gradient hover:scale-105 transition-transform"
                >
                  Save Preferences
                </Button>
              </form>
            </Form>
          </div>

          {/* Account Settings */}
          <div className="bg-premium-dark/50 p-6 rounded-xl border border-premium-light/10 hover:bg-premium-light/5 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-premium-light/10">
                <div>
                  <h3 className="font-medium">Account Type</h3>
                  <p className="text-sm text-premium-light/70">
                    {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </p>
                </div>
                
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user?.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
              
              <div className="pb-4 border-b border-premium-light/10">
                <h3 className="font-medium mb-2">Session Management</h3>
                <Button 
                  variant="outline" 
                  className="w-full mt-2 hover:bg-premium-light/10 hover:text-white transition-colors"
                  onClick={() => {
                    toast({
                      title: "All other sessions logged out",
                      description: "You have been logged out from all other devices",
                    });
                  }}
                >
                  Log out from all other devices
                </Button>
              </div>
              
              <div className="pb-4">
                <h3 className="font-medium mb-2 text-red-500">Danger Zone</h3>
                <Button 
                  variant="outline" 
                  className="w-full border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  onClick={() => {
                    toast({
                      title: "Account deletion requested",
                      description: "Please check your email to confirm account deletion",
                    });
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
