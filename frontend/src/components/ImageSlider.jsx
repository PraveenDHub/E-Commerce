import { useEffect, useState } from "react";
import {ChevronLeft,ChevronRight} from "lucide-react";

const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJVjdfNf40AwaxAmTg4VoYuDFyxDxo_qXLVg&s",
    "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhAqKjbJUl-RRQSbrFprjGGbHB5-gPrZqrxg&s",
]

const ImageSlider = () => {
    const [current,setCurrent] = useState(0);

    //if we give blindly without clear the old state
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    }

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    }

  return (
    <div className="relative w-full shadow-lg overflow-hidden">
        <div className="flex transition-transform duration-700 ease-in-out" style = {{transform: `translateX(-${current * 100}%)`}}>
            {images.map((image, index) => (
                <img key={index} src={image} alt={`image`} className="w-full h-75 object-cover md:h-112.5 shrink-0" />
            ))}
            {/* You can't put button here because it will not be visible at all img slider it just show on 1st img*/}
        </div>
        {/*Left button*/}
        <button onClick={prevSlide} className="absolute top-1/2 left-4 text-white/80 p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors">
            <ChevronLeft/>
        </button>
        {/*Right button*/}
        <button onClick={nextSlide} className="absolute top-1/2 right-4 text-white/80 p-1 bg-black/30 hover:bg-black/50 rounded-full transition-colors">
            <ChevronRight/>
        </button>

        {/*Dots*/}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 space-x-2">
            {images.map((_,index) => (
                <button key={index} onClick={() => setCurrent(index)} className={`h-2 rounded-full transition-all duration-400 ${index === current ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}></button>
            ))}
        </div>
    </div>
  )
}

export default ImageSlider