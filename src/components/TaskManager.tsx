
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Plus, Edit2, Trash, CheckSquare } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  user_id: string;
}

const taskSchema = z.object({
  title: z.string().min(3, { message: 'Tytuł musi zawierać co najmniej 3 znaki' }),
  description: z.string().optional(),
  priority: z.string(),
  status: z.string(),
  due_date: z.string().optional(),
});

// Mock data for tasks since we don't have a tasks table in Supabase yet
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Stworzyć stronę główną',
    description: 'Zaprojektować i zaimplementować nową stronę główną',
    status: 'in-progress',
    priority: 'high',
    due_date: '2025-05-25',
    created_at: '2025-05-10T10:00:00Z',
    user_id: '1'
  },
  {
    id: '2',
    title: 'Optymalizacja SEO',
    description: 'Przeprowadzić audyt SEO i wdrożyć zalecenia',
    status: 'pending',
    priority: 'medium',
    due_date: '2025-06-01',
    created_at: '2025-05-12T10:00:00Z',
    user_id: '1'
  },
  {
    id: '3',
    title: 'Testowanie aplikacji',
    description: 'Wykonać testy funkcjonalne i wydajnościowe',
    status: 'completed',
    priority: 'medium',
    due_date: '2025-05-15',
    created_at: '2025-05-05T10:00:00Z',
    user_id: '1'
  }
];

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Use mock data instead of fetching from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setTasks(mockTasks);
        setLoading(false);
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Błąd przy pobieraniu zadań',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const openAddDialog = () => {
    form.reset({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      due_date: '',
    });
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    form.reset({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      due_date: task.due_date || '',
    });
    setEditingTask(task);
    setDialogOpen(true);
  };

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      due_date: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    if (!user) return;

    try {
      if (editingTask) {
        // Update task in mock data
        const updatedTask = {
          ...editingTask,
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          status: values.status,
          due_date: values.due_date || null,
          updated_at: new Date().toISOString(),
        };
        
        const updatedTasks = tasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        );
        
        setTasks(updatedTasks);

        toast({
          title: 'Zadanie zaktualizowane',
          description: 'Zadanie zostało pomyślnie zaktualizowane',
        });
      } else {
        // Add new task to mock data
        const newTask: Task = {
          id: uuidv4(),
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          status: values.status,
          due_date: values.due_date || null,
          created_at: new Date().toISOString(),
          user_id: user.id,
        };
        
        setTasks([newTask, ...tasks]);

        toast({
          title: 'Zadanie dodane',
          description: 'Nowe zadanie zostało pomyślnie dodane',
        });
      }

      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) return;

    try {
      // Remove task from mock data
      const filteredTasks = tasks.filter(task => task.id !== id);
      setTasks(filteredTasks);

      toast({
        title: 'Zadanie usunięte',
        description: 'Zadanie zostało pomyślnie usunięte',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      // Update task status in mock data
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, status: 'completed' } : task
      );
      
      setTasks(updatedTasks);

      toast({
        title: 'Zadanie zakończone',
        description: 'Zadanie zostało oznaczone jako zakończone',
      });
    } catch (error: any) {
      toast({
        title: 'Błąd',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-premium-light/70';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs">Zakończone</span>;
      case 'in-progress':
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-500 text-xs">W trakcie</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs">Oczekujące</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">{status}</span>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd MMM yyyy', { locale: pl });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Zadania</h2>
        <Button onClick={openAddDialog} className="bg-premium-gradient hover:bg-black hover:text-white">
          <Plus size={16} className="mr-2" /> Dodaj zadanie
        </Button>
      </div>

      <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-premium-purple"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-premium-light/70">Nie masz jeszcze żadnych zadań</p>
            <Button onClick={openAddDialog} variant="outline" className="mt-4 hover:bg-black hover:text-white">
              Dodaj pierwsze zadanie
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-premium-light/10">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-premium-light/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(task.priority)}`}></span>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-premium-light/70 text-sm">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-premium-light/60">
                      <div>{getStatusBadge(task.status)}</div>
                      {task.due_date && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(task.due_date)}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDate(task.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status !== 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsCompleted(task.id)}
                        className="text-green-400 hover:text-white hover:bg-green-500"
                      >
                        <CheckSquare size={14} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(task)}
                      className="text-blue-400 hover:text-white hover:bg-blue-500"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 hover:text-white hover:bg-red-500"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edytuj zadanie' : 'Dodaj nowe zadanie'}</DialogTitle>
            <DialogDescription>
              {editingTask
                ? 'Zaktualizuj szczegóły zadania'
                : 'Wypełnij formularz, aby utworzyć nowe zadanie'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł</FormLabel>
                    <FormControl>
                      <Input placeholder="Wprowadź tytuł zadania..." className="bg-slate-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dodaj szczegóły zadania..."
                        className="bg-slate-950"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorytet</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950">
                            <SelectValue placeholder="Wybierz priorytet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Niski</SelectItem>
                          <SelectItem value="medium">Średni</SelectItem>
                          <SelectItem value="high">Wysoki</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-950">
                            <SelectValue placeholder="Wybierz status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Oczekujące</SelectItem>
                          <SelectItem value="in-progress">W trakcie</SelectItem>
                          <SelectItem value="completed">Zakończone</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Termin</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-slate-950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="hover:bg-black hover:text-white"
                >
                  Anuluj
                </Button>
                <Button type="submit" className="bg-premium-gradient hover:bg-black hover:text-white">
                  {editingTask ? 'Zapisz zmiany' : 'Dodaj zadanie'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;
