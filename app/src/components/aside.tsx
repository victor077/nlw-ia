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
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";
import PromptSelect from "./prompt-select";
import { useCompletion } from "ai/react";

type Status =
  | "waiting"
  | "converting"
  | "uploading"
  | "generating"
  | "sucess"
  | "error";

const statusMessage = {
  converting: "Convertendo..",
  generating: "Transcrevendo..",
  uploading: "Carregando...",
  sucess: "Sucesso!",
  error: "Falha no upload do arquivo...",
};

interface AsideProps {
  promptValue: string;
}

export default function Aside({ promptValue }: AsideProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const [temperatura, setTemperatura] = useState(0.5);
  const [videoId, setVideoID] = useState();
  const [prompt, setPrompt] = useState("");

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  };

  const convertVideoToAudio = async (video: File) => {
    console.log("Convertendo video...");

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ffmpeg.on("log", (log) => {
    //   console.log(log);
    // });

    ffmpeg.on("progress", ({ progress }) => {
      console.log("convertendo progresso: " + Math.round(progress * 100));
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });

    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("Conversão finalizada");

    return audioFile;
  };

  const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();

    data.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", data);

    const videoId = response.data.video.id;

    setStatus("generating");

    try {
      await api.post(`videos/${videoId}/transcription`, {
        prompt,
      });
      setStatus("sucess");
    } catch (error) {
      setVideoID(videoId);
      return setStatus("error");
    }
    setVideoID(videoId);

    console.log("finalizou");
  };
  const previewURL = useMemo(() => {
    if (!videoFile) {
      return;
    }
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  if (status !== "waiting") console.log(statusMessage[status]);

  const { input, setInput } = useCompletion({
    api: "http://localhost:3333/ai/complete",
    body: {
      videoId,
      temperatura,
    },
  });

  setPrompt(input);

  return (
    <aside className="w-80 space-y-6">
      <form onSubmit={handleUploadVideo} className="space-y-6">
        <label
          className=" relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
          htmlFor="video"
        >
          {previewURL ? (
            <video
              src={previewURL}
              controls={false}
              className="pointer-events-none absolute inset-0 h-[180px] w-full"
            />
          ) : (
            <>
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </>
          )}
        </label>
        <input
          type="file"
          id="video"
          accept="video/mp4"
          className="sr-only"
          onChange={handleFileSelected}
        />
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="transcripton_prompt">Prompt de transcrição</Label>
          <Textarea
            disabled={status !== "waiting"}
            id="transcripton_prompt"
            className="h-20 leading-relaxed resize-none"
            placeholder="Inclua palavras-chave mencionadas no vídeo separadas por virgula(,)"
            ref={promptInputRef}
          />
        </div>
        <Button
          data-success={status === "sucess"}
          data-error={status === "error"}
          disabled={status !== "waiting"}
          className="w-full data-[success=true]:bg-emerald-400 data-[error=true]:bg-red-400"
          type="submit"
        >
          {status === "waiting" ? (
            <>
              Carregar vídeo <Upload className="w-4 h-4 ml-4" />
            </>
          ) : (
            statusMessage[status]
          )}
        </Button>
      </form>
      <Separator />

      <form action="" className="space-y-6">
        <PromptSelect onPromptSelect={setInput} />
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
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[temperatura]}
            onValueChange={(value) => setTemperatura(value[0])}
          />
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
