import { Textarea } from "./ui/textarea";

interface BannerProps {
  valuesTextArea: string;
}
export default function Banner({ valuesTextArea }: BannerProps) {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="grid grid-rows-2 gap-4 flex-1">
        <Textarea
          className="resize-none p-4 leading-relaxed"
          placeholder="Inclua o prompt para a IA..."
          value={valuesTextArea}
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
