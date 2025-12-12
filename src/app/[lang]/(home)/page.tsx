"use client";
import { ExternalLinkIcon, BookIcon, Link, Anchor } from "lucide-react";
import { FlipWords } from "@/components/ui/flip-words";
import { Spotlight } from "@/components/ui/spotlight-new";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { localizeHref } from "@/lib/locale";

import WulfrumProsthesis from "./(showcaseImages)/wulfrum_prosthesis.png";
import DragonFlyMount from "./(showcaseImages)/dragonfly_mount.gif";
import Melodium from "./(showcaseImages)/Melodium.gif";
import GaleWivern from "./(showcaseImages)/gale_wivern.gif";
import WulfrumArmor from "./(showcaseImages)/Wulfrum_Armor.gif";
import { DiscordButton } from "./discord-button";


interface CarouselItem {
  title: string;
  author: string;
  image: StaticImageData;
  link: string;
}

export default function HomePage({ params }: { params: { lang?: string } }) {
  const [isMobile, setIsMobile] = useState(false);
  const carouselItems: CarouselItem[] = [
    {
      title: "Dragonfly Mount",
      author: "by Nicolas | Tourne_Vis",
      image: DragonFlyMount,
      link: "",
    },
    {
      title: "[WIP] Hylamity: Wulfrum Prosthesis",
      author: "by alder_",
      image: WulfrumProsthesis,
      link: "",
    },
    {
      title: "[WIP] Soundscape: Melodium Chunk",
      author: "by 44Hydras",
      image: Melodium,
      link: "",
    },
    {
      title: "Gale Wivern",
      author: "by Nicolas | Tourne_Vis",
      image: GaleWivern,
      link: "",
    },
    {
      title: "[WIP] Hylamity: Wulfrum Armor",
      author: "by alder_",
      image: WulfrumArmor,
      link: "",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <Spotlight />
      <div className="container mx-auto flex flex-1 flex-col gap-8 px-12 py-8 lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <div className="w-lg space-y-6 max-lg:py-32 lg:max-w-2xl">
          <h1 className="text-4xl font-semibold text-balance">
            #1 Resource for Hytale Modding
            <FlipWords words={["Guides", "Documentation", "Resources"]} />
          </h1>
          <h2 className="text-muted-foreground text-lg text-balance">
            The number one community resource for modding Hytale, featuring
            comprehensive guides, detailed documentation, and essential tools to
            kickstart your modding journey.
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href={localizeHref("/docs", params.lang?.toString())}>
                <BookIcon /> Docs
              </a>
            </Button>
            <DiscordButton />
          </div>
        </div>

        <div className="relative w-full flex-1 lg:max-w-2xl lg:p-8">
          <Carousel
            opts={{
              align: "center",
            }}
            orientation={isMobile ? "horizontal" : "vertical"}
            className="w-full"
            plugins={[
              Autoplay({
                delay: 2000,
              })
            ]}
          >
            <CarouselContent className="-mt-1 h-96">
              {carouselItems.map((item, index) => (
                <CarouselItem key={index} className="pt-1 md:basis-2">
                  <div className="p-1">
                    <Card className="relative overflow-hidden">
                      <CardContent className="flex h-72 items-center justify-center p-6">
                        <div className="from-card absolute z-20 flex size-full items-end bg-linear-to-t from-15% to-transparent to-30% p-6">
                          <div className="flex flex-1 flex-col">
                            <h1 className="z-20 text-2xl font-bold">
                              {item.title}
                            </h1>
                            <h2 className="text-muted-foreground text-md z-20">
                              {item.author}
                            </h2>
                          </div>
                          <Button size="icon-lg">
                            <ExternalLinkIcon />
                          </Button>
                        </div>
                        <Image
                          src={item.image}
                          alt="test image"
                          className="absolute size-full object-cover opacity-30 blur-md"
                        />
                        <div className="z-10 flex size-full items-center justify-center">
                          <Image
                            src={item.image}
                            alt="test image"
                            className="h-full w-auto overflow-hidden rounded-md object-contain"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious alternativePosition />
            <CarouselNext alternativePosition />
          </Carousel>
        </div>
      </div>
    </div>
  );
}
