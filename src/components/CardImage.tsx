import { Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChangeEvent, MouseEventHandler, useRef } from "react";
import { Button } from "./ui/button";
import irisImage from "/iridology_64.png";

export const CardImage = ({
  src,
  onChange,
  onDelete,
}: {
  src: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  onDelete: MouseEventHandler<HTMLButtonElement>;
}) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const handlerFile = () => {
    inputFile.current?.click();
  };
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
      <CardHeader>
        <CardTitle>
          <img src={irisImage} className="inline ratio-square w-6 mr-2"></img>
          Iris check
        </CardTitle>
        <CardDescription>Seleziona una imagine iride</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="relative">
            {src && (
              <>
                <img
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src={src}
                  width="300"
                />
                <Button
                  variant={"outline"}
                  size="icon"
                  className="absolute top-0 m-2"
                  onClick={onDelete}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <input
          className="hidden"
          type="file"
          ref={inputFile}
          onChange={onChange}
        ></input>
        {!src && (
          <button
            className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
            onClick={handlerFile}
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Upload</span>
          </button>
        )}
      </CardContent>
    </Card>
  );
};
