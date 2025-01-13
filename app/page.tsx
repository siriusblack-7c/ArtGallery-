"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import GithubIcon from "@/components/icons/github-icon";
import PictureIcon from "@/components/icons/picture-icon";
import XIcon from "@/components/icons/x-icon";
import Logo from "@/components/logo";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import imagePlaceholder from "@/public/image-placeholder.png";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import popArtImage from "@/public/styles/pop-art.png";
import minimalImage from "@/public/styles/minimal.png";
import retroImage from "@/public/styles/retro.png";
import watercolorImage from "@/public/styles/watercolor.png";
import fantasyImage from "@/public/styles/fantasy.png";
import moodyImage from "@/public/styles/moody.png";
import vibrantImage from "@/public/styles/vibrant.png";
import cinematicImage from "@/public/styles/cinematic.png";
import CheckIcon from "@/components/icons/check-icon";

type ImageResponse = {
  b64_json: string;
  timings: { inference: number };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [iterativeMode, setIterativeMode] = useState(false);
  const [userAPIKey, setUserAPIKey] = useState("");
  const [selectedStyleValue, setSelectedStyleValue] = useState("");
  const debouncedPrompt = useDebounce(prompt, 100);
  const [generations, setGenerations] = useState<
    { prompt: string; image: ImageResponse }[]
  >([]);
  let [activeIndex, setActiveIndex] = useState<number>();

  const selectedStyle = imageStyles.find((s) => s.value === selectedStyleValue);

  const { data: image, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [debouncedPrompt + selectedStyleValue],
    queryFn: async () => {
      let res = await fetch("/api/generateImages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyleValue,
          userAPIKey,
          iterativeMode,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      return (await res.json()) as ImageResponse;
    },
    enabled: !!debouncedPrompt.trim(),
    staleTime: Infinity,
    retry: false,
  });

  let isDebouncing = prompt !== debouncedPrompt;

  useEffect(() => {
    if (image && !generations.map((g) => g.image).includes(image)) {
      setGenerations((images) => [...images, { prompt, image }]);
      setActiveIndex(generations.length);
    }
  }, [generations, image, prompt]);

  let activeImage =
    activeIndex !== undefined ? generations[activeIndex].image : undefined;

  return (
    <div className="flex h-full flex-col px-5">
      <header className="flex justify-center pt-20 md:justify-end md:pt-3">
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <a href="https://www.dub.sh/together-ai" target="_blank">
            <Logo />
          </a>
        </div>
        <div>
          <label className="text-xs text-gray-200">
            [Optional] Add your{" "}
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              Together API Key
            </a>{" "}
          </label>
          <Input
            placeholder="API Key"
            type="password"
            value={userAPIKey}
            className="mt-1 bg-gray-400 text-gray-200 placeholder:text-gray-300"
            onChange={(e) => setUserAPIKey(e.target.value)}
          />
        </div>
      </header>

      <div className="flex justify-center">
        <form className="mt-10 w-full max-w-lg">
          <fieldset>
            <div className="relative">
              <Textarea
                rows={4}
                spellCheck={false}
                placeholder="Describe your image..."
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full resize-none border-gray-300 border-opacity-50 bg-gray-400 px-4 text-base placeholder-gray-300"
              />
              <div
                className={`${isFetching || isDebouncing ? "flex" : "hidden"} absolute bottom-3 right-3 items-center justify-center`}
              >
                <Spinner className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-sm md:text-right">
              <div>
                <label
                  title="Use earlier images as references"
                  className="inline-flex items-center gap-2"
                >
                  Consistency mode
                  <Switch
                    checked={iterativeMode}
                    onCheckedChange={setIterativeMode}
                  />
                </label>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-1.5 rounded-sm border-[0.5px] border-gray-350 bg-gray-400 px-2 py-1.5 text-xs text-gray-200"
                    >
                      <PictureIcon className="size-[12px]" />
                      {selectedStyle
                        ? `Style: ${selectedStyle.label}`
                        : "Styles"}
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select a style</DialogTitle>
                      <DialogDescription>
                        Select a style to instantly transform your shots and
                        bring out the best in your creative ideas.{" "}
                        <span className="text-gray-350">
                          Experiment, explore, and make it yours!
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    <RadioGroup.Root
                      value={selectedStyleValue}
                      onValueChange={setSelectedStyleValue}
                      className="grid grid-cols-2 gap-2 md:grid-cols-4"
                    >
                      {imageStyles.map((style) => (
                        <RadioGroup.Item
                          value={style.value}
                          className="group relative"
                          key={style.value}
                        >
                          <Image
                            src={style.image}
                            alt=""
                            className="aspect-square rounded transition group-data-[state=unchecked]:grayscale"
                          />
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/75 to-transparent p-2">
                            <p className="text-xs font-bold text-white">
                              {style.label}
                            </p>
                            <RadioGroup.Indicator className="inline-flex size-[14px] items-center justify-center rounded-full bg-white">
                              <CheckIcon />
                            </RadioGroup.Indicator>
                          </div>
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </fieldset>
        </form>
      </div>

      <div className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center">
        {!activeImage || !prompt ? (
          <div className="max-w-xl md:max-w-4xl lg:max-w-3xl">
            <p className="text-xl font-semibold text-gray-200 md:text-3xl lg:text-4xl">
              Generate images in real-time
            </p>
            <p className="mt-4 text-balance text-sm text-gray-300 md:text-base lg:text-lg">
              Enter a prompt and generate images in milliseconds as you type.
              Powered by Flux on Together AI.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex w-full max-w-4xl flex-col justify-center">
            <div>
              <Image
                placeholder="blur"
                blurDataURL={imagePlaceholder.blurDataURL}
                width={1024}
                height={768}
                src={`data:image/png;base64,${activeImage.b64_json}`}
                alt=""
                className={`${isFetching ? "animate-pulse" : ""} max-w-full rounded-lg object-cover shadow-sm shadow-black`}
              />
            </div>

            <div className="mt-4 flex gap-4 overflow-x-scroll pb-4">
              {generations.map((generatedImage, i) => (
                <button
                  key={i}
                  className="w-32 shrink-0 opacity-50 hover:opacity-100"
                  onClick={() => setActiveIndex(i)}
                >
                  <Image
                    placeholder="blur"
                    blurDataURL={imagePlaceholder.blurDataURL}
                    width={1024}
                    height={768}
                    src={`data:image/png;base64,${generatedImage.image.b64_json}`}
                    alt=""
                    className="max-w-full rounded-lg object-cover shadow-sm shadow-black"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 w-full items-center pb-10 text-center text-gray-300 md:mt-4 md:flex md:justify-between md:pb-5 md:text-xs lg:text-sm">
        <p>
          Powered by{" "}
          <a
            href="https://www.dub.sh/together-ai"
            target="_blank"
            className="underline underline-offset-4 transition hover:text-blue-500"
          >
            Together.ai
          </a>{" "}
          &{" "}
          <a
            href="https://dub.sh/together-flux"
            target="_blank"
            className="underline underline-offset-4 transition hover:text-blue-500"
          >
            Flux
          </a>
        </p>

        <div className="mt-8 flex items-center justify-center md:mt-0 md:justify-between md:gap-6">
          <p className="hidden whitespace-nowrap md:block">
            100% free and{" "}
            <a
              href="https://github.com/Nutlope/blinkshot"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              open source
            </a>
          </p>

          <div className="flex gap-6 md:gap-2">
            <a href="https://github.com/Nutlope/blinkshot" target="_blank">
              <Button
                variant="outline"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <GithubIcon className="size-4" />
                GitHub
              </Button>
            </a>
            <a href="https://x.com/nutlope" target="_blank">
              <Button
                size="sm"
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <XIcon className="size-3" />
                Twitter
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const imageStyles = [
  {
    label: "Pop Art",
    value: "pop-art",
    image: popArtImage,
  },
  {
    label: "Minimal",
    value: "minimal",
    image: minimalImage,
  },
  { label: "Retro", value: "retro", image: retroImage },
  {
    label: "Watercolor",
    value: "watercolor",
    image: watercolorImage,
  },
  {
    label: "Fantasy",
    value: "fantasy",
    image: fantasyImage,
  },
  { label: "Moody", value: "moody", image: moodyImage },
  {
    label: "Vibrant",
    value: "vibrant",
    image: vibrantImage,
  },
  {
    label: "Cinematic",
    value: "cinematic",
    image: cinematicImage,
  },
];
