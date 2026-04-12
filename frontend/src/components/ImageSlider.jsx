import { useEffect, useState } from "react";
import {ChevronLeft,ChevronRight} from "lucide-react";

const images = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30",     // Smartwatch
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",        // Leather Messenger Bag
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff",        // Running Shoes
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",     // Over-ear Headphones
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",     // Classic T-Shirt
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",        // Laptop Backpack
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8",     // Stainless Steel Water Bottle
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",     // Yoga Mat
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314",     // Analog Watch
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",     // Bluetooth Speaker
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",     // Adjustable Dumbbells
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",     // Desk Lamp
];

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