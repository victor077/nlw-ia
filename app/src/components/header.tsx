import { Github } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Header() {
  return (
    <header className="px-6 py-3 flex items-center justify-between border-b">
      <h1 className="text-xl font-bold">upload.ui</h1>
      <nav className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Desenvolvido com 💜 no NLW da Rocketseat
        </span>

        <Separator className="h-6" orientation="vertical" />
        <Button variant="outline">
          <Github className="w-4 h-4 mr-2"></Github> Github
        </Button>
      </nav>
    </header>
  );
}
