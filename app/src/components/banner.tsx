import { Textarea } from "./ui/textarea";

interface BannerProps {}
export default function Banner(props: BannerProps) {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="grid grid-rows-2 gap-4 flex-1">
        <Textarea
          className="resize-none p-4 leading-relaxed"
          placeholder="Inclua o prompt para a IA..."
        />
        <Textarea
          className="resize-none p-4 leading-relaxed"
          readOnly
          placeholder="Resultado gerado pela a IA..."
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Lembre-se: você pode utilizar a variável{" "}
        <code className="text-violet-900">{`{transcription}`}</code> no prompt
        para adicionar o conteúdo da transcrição do vídeo selecionado
      </p>
    </div>
  );
}
