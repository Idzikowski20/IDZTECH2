
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LucideHome, ArrowLeft, AlertTriangle } from "lucide-react";
import { useTheme } from "@/utils/themeContext";

type ErrorType = "404" | "500" | "403" | "unknown";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Extract error type from location state if available
  const errorType: ErrorType = location.state?.errorType || "404";

  useEffect(() => {
    console.error(
      `Error: User attempted to access ${errorType === "404" ? "non-existent route" : "restricted/error page"}:`,
      location.pathname
    );
  }, [location.pathname, errorType]);

  // Get error details based on error type
  const getErrorDetails = () => {
    switch (errorType) {
      case "404":
        return {
          title: "404",
          message: "Oops! Strona nie została znaleziona",
          description: "Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona."
        };
      case "500":
        return {
          title: "500",
          message: "Błąd serwera",
          description: "Przepraszamy, wystąpił wewnętrzny błąd serwera. Spróbuj ponownie później."
        };
      case "403":
        return {
          title: "403",
          message: "Dostęp zabroniony",
          description: "Nie masz uprawnień do przeglądania tej strony."
        };
      default:
        return {
          title: "Error",
          message: "Coś poszło nie tak",
          description: "Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj ponownie później."
        };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark">
      <div className="max-w-md w-full px-6 py-12 bg-premium-dark/60 backdrop-blur-sm border border-white/10 rounded-xl text-center">
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
          </div>
          <h1 className="text-5xl font-bold my-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            {errorDetails.title}
          </h1>
          <p className="text-xl text-gray-400 mb-4">{errorDetails.message}</p>
          <p className="text-gray-500">{errorDetails.description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button 
              className={`${
                theme === 'dark' 
                  ? 'bg-white text-black hover:bg-gray-300' 
                  : 'bg-premium-gradient text-white hover:opacity-90'
              } transition-all duration-300 w-full sm:w-auto`}
            >
              <LucideHome className="mr-2 h-4 w-4" />
              Strona główna
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="border-white/10 hover:bg-white/5 text-gray-300 w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Wróć
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
