
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useForm as useFormspree } from '@formspree/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, { message: "Imię musi mieć co najmniej 2 znaki" }),
  company: z.string().min(1, { message: "Nazwa firmy jest wymagana" }),
  email: z.string().email({ message: "Nieprawidłowy format email" }),
  phone: z.string().min(9, { message: "Nieprawidłowy numer telefonu" }),
  service: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  // Replace with your valid Formspree form ID
  const [formspreeState, sendToFormspree] = useFormspree("xvqggdkp"); 
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Log form submission
      console.log("Wysyłanie formularza do:", data.email);
      console.log("Dane formularza:", data);
      
      // Send form to Formspree
      await sendToFormspree(data);
      
      // Check for errors
      if (formspreeState.errors) {
        throw new Error("Błąd wysyłania formularza");
      }
      
      // Show success message
      toast({
        title: "Wiadomość wysłana",
        description: "Dziękujemy za kontakt. Odezwiemy się wkrótce.",
        variant: "default",
      });
      
      form.reset();
    } catch (error) {
      console.error("Błąd wysyłania formularza:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      {formspreeState.errors && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Błąd wysyłania formularza</AlertTitle>
          <AlertDescription>
            {formspreeState.errors && "Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie."}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Imię i nazwisko*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jan Kowalski"
                    className="bg-white border-gray-300 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Nazwa firmy*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nazwa firmy"
                    className="bg-white border-gray-300 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jan@example.com"
                    className="bg-white border-gray-300 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Telefon*</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+48 123 456 789"
                    className="bg-white border-gray-300 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Usługa, którą jesteś zainteresowany</FormLabel>
              <FormControl>
                <select
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-black focus:outline-none focus:border-premium-purple focus:ring-1 focus:ring-premium-purple/20"
                  {...field}
                >
                  <option value="">Wybierz usługę</option>
                  <option value="web-dev">Tworzenie stron www</option>
                  <option value="ecommerce">Tworzenie sklepów internetowych</option>
                  <option value="seo">Pozycjonowanie stron internetowych</option>
                  <option value="local-seo">Pozycjonowanie lokalne</option>
                  <option value="google-ads">Kampanie Google Ads</option>
                  <option value="meta-ads">Kampanie Meta Ads</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Wiadomość</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Opisz swoje potrzeby..."
                  rows={5}
                  className="bg-white border-gray-300 text-black resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-premium-gradient hover:bg-black hover:text-white transition-colors"
          disabled={form.formState.isSubmitting || formspreeState.submitting}
        >
          <Send size={16} className="mr-2" />
          {form.formState.isSubmitting || formspreeState.submitting ? "Wysyłanie..." : "Wyślij wiadomość"}
        </Button>
        
        <p className="text-xs text-center text-premium-light/70 mt-4">
          {formspreeState.succeeded ? "Wiadomość została wysłana!" : ""}
        </p>
      </form>
    </Form>
  );
};

export default ContactForm;
