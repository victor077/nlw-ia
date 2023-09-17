import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

interface Prompts {
  id: string;
  title: string;
  template: string;
}

interface PromptSelectProps {
  onPromptSelect: (template: string) => void;
}

export default function PromptSelect({ onPromptSelect }: PromptSelectProps) {
  const [prompts, setPrompts] = useState<Prompts[] | null>(null);
  useEffect(() => {
    api.get("/prompts").then((response) => {
      setPrompts(response.data);
    });
  }, []);

  const handlePromptSelect = (idPrompt: string) => {
    const selectedPrompt = prompts?.find((prompt) => prompt.id === idPrompt);

    if (!selectedPrompt) {
      return;
    }

    onPromptSelect(selectedPrompt.template);
  };

  return (
    <div className="space-y-2">
      <Label>Prompt</Label>
      <Select onValueChange={handlePromptSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um prompt..." />
        </SelectTrigger>
        <SelectContent>
          {prompts?.map((value) => (
            <SelectItem key={value.id} value={value.id}>
              {value.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
