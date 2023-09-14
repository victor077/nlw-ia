import { FileVideo, Upload, Wand2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

export default function Aside() {
  return (
    <aside className="w-80 space-y-6">
      <form className="space-y-6">
        <label
          className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
          htmlFor="video"
        >
          <FileVideo className="w-4 h-4" />
          Selecione um vídeo
        </label>
        <input type="file" id="video" accept="video/mp4" className="sr-only" />
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="transcripton_prompt">Prompt de transcrição</Label>
          <Textarea
            id="transcripton_prompt"
            className="h-20 leading-relaxed resize-none"
            placeholder="Inclua palavras-chave mencionadas no vídeo separadas por virgula(,)"
          />
        </div>
        <Button className="w-full" type="submit">
          Carregar vídeo <Upload className="w-4 h-4 ml-4" />
        </Button>
      </form>
      <Separator />

      <form action="" className="space-y-6">
        <div className="space-y-2">
          <Label>Prompt</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um prompt..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Título do Youtube</SelectItem>
              <SelectItem value="description">Descrição do Youtube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Modelo</Label>
          <Select disabled defaultValue="gpt3.5">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
            </SelectContent>
          </Select>
          <span className="block text-xs text-muted-foreground italic">
            Você poderá customizar essa opção em breve
          </span>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label>Temperatura</Label>
          <Slider min={0} max={1} step={0.1} />
          <span className="block text-xs text-muted-foreground italic leading-relaxed">
            Valores mais alto tendem a deixar o resultado mais criativo e com
            possíveis erros
          </span>
          <Separator />
          <Button className="w-full" type="submit">
            Executar
            <Wand2 className="w-4 h-4 ml-4" />
          </Button>
        </div>
      </form>
    </aside>
  );
}
