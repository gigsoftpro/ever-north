import { useState } from "react";
import starImg from "../assets/images/star_2.png";

const testimonials = [
  {
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    name: "Customer Name",
  },
  {
    text: "Working with Ever North has been an absolute pleasure. They manage our rental properties professionally and always communicate proactively. Our rental income has never been higher.",
    name: "Sarah Johnson",
  },
  {
    text: "The team at Ever North exceeded every expectation. From tenant screening to maintenance coordination, they handle it all with expertise and care. Highly recommended.",
    name: "Michael Chen",
  },
];

export default function Testimonial() {
  const [active, setActive] = useState(1);

  return (
    <section className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-8">
      <div className="max-w-[1044px] mx-auto text-center">
        {/* Stars */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starImg}
              alt="★"
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-[#303030] text-xl sm:text-2xl lg:text-[28px] italic font-semibold leading-9 transition-all duration-500">
          "{testimonials[active].text}"
        </blockquote>

        {/* Name */}
        <p className="text-[#b7a170] text-sm sm:text-base font-normal tracking-[0.4em] uppercase mt-6">
          {testimonials[active].name}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-8 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300"
              aria-label={`Testimonial ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 w-2.5 h-2.5 ${
                  i === active
                    ? "bg-[#b7a170]"
                    : "bg-[#303030]"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
