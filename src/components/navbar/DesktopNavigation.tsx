
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

const DesktopNavigation = () => {
  const location = useLocation();
  
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link to="/" className={`bg-transparent text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/" ? "bg-white/20" : ""}`}>Start</Link>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-slate-50 bg-transparent hover:bg-white hover:text-black">Oferta</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-2 gap-3 p-4 w-[500px] bg-slate-800 text-white">
                <div className="space-y-2">
                  <h3 className="font-medium">Strony www</h3>
                  <Link to="/tworzenie-stron-www" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Tworzenie stron www
                  </Link>
                  <Link to="/sklepy-internetowe" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Tworzenie sklepów internetowych
                  </Link>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Pozycjonowanie (SEO)</h3>
                  <Link to="/pozycjonowanie-stron" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Pozycjonowanie stron internetowych
                  </Link>
                  <Link to="/pozycjonowanie-lokalne" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Pozycjonowanie lokalne
                  </Link>
                  <Link to="/audyt-seo" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Audyt SEO
                  </Link>
                  <Link to="/optymalizacja-seo" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Optymalizacja SEO
                  </Link>
                  <Link to="/copywriting-seo" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Copywriting SEO
                  </Link>
                  <Link to="/content-plan" className="block p-2 hover:bg-slate-700 hover:text-white rounded">
                    Content Plan
                  </Link>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <Link to="/projects" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/projects" ? "bg-white/20" : ""}`}>Portfolio</Link>
      <Link to="/about" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/about" ? "bg-white/20" : ""}`}>O nas</Link>
      
      <Link to="/blog" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname.includes("/blog") ? "bg-white/20" : ""}`}>
        Blog
      </Link>
      
      <Link to="/contact" className={`text-white hover:bg-white hover:text-black px-3 py-2 rounded transition-colors ${location.pathname === "/contact" ? "bg-white/20" : ""}`}>Kontakt</Link>
    </div>
  );
};

export default DesktopNavigation;
