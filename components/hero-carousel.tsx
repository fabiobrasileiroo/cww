"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  id: number
  title: string
  description?: string
  isView?: boolean
  image: string
}

interface HeroCarouselProps {
  items: CarouselItem[]
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full relative">
            <div className="relative h-[400px] w-full">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className={`transition-all duration-300 ${item.isView === false ? 'object-contain rounded-lg' : 'object-cover brightness-50'
                  }`}
                priority
              />

              {item.isView === true &&
                <div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-orange-500 mb-4">{item.title}</h1>
                    <p className="text-sm md:text-base text-gray-200 mb-6">{item.description}</p>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white w-fit">Ler mais</Button>
                  </div>
                </div>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-orange-500" : "bg-gray-400"}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
