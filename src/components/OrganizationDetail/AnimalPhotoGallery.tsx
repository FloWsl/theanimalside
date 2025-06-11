import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import { AnimalCare } from "../../types";

interface AnimalPhotoGalleryProps {
  animalTypes: AnimalCare[];
}

const AnimalPhotoGallery: React.FC<AnimalPhotoGalleryProps> = ({ animalTypes }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (selectedAnimal !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAnimal]);

  // When a new animal is selected, scroll to its panel in the modal carousel
  useEffect(() => {
    if (selectedAnimal !== null && carouselRef.current) {
      const container = carouselRef.current;
      const panelWidth = container.clientWidth;
      container.scrollTo({ left: panelWidth * selectedAnimal, behavior: "instant" });
    }
  }, [selectedAnimal]);

  return (
    <div className="space-y-0 ">
      {/* Header */}
      <div className="">
        <div className="text-center space-y-4">

          <p className="text-body-large text-forest/90 max-w-xl mx-auto">
            Discover the amazing animals you’ll help care for.
          </p>
        </div>

        {/* Immersive Animal List/Grid */}
        <div className="flex overflow-y-hidden overflow-x-auto snap-x snap-mandatory space-x-3 md:space-x-4 py-6 scrollbar-hide md:grid md:grid-cols-4 md:gap-4 md:space-x-0">
          {animalTypes.map((animal, index) => {
            const animalSlug = animal.animalType.toLowerCase().replace(/\s+/g, "-");
            const isSelected = selectedAnimal === index;

            return (
              <div
                key={index}
                className="relative flex-shrink-0 w-4/6 max-w-[240px] md:w-auto snap-start"
              >
                {/* Card */}
                <div
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedAnimal(isSelected ? null : index)}
                >
                  {/* Image */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img
                      src={animal.image}
                      alt={`${animal.animalType} volunteer opportunities`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-base md:text-lg drop-shadow-lg leading-tight">
                        {animal.animalType}
                      </h3>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlay on Hover/Tap */}
                <div 
                  className={`absolute inset-0 z-10 transition-all duration-300 ${
                    isSelected
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none md:group-hover:opacity-100 md:group-hover:pointer-events-auto"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-center">
                    {/* Close on Mobile */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAnimal(null);
                      }}
                      className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 md:hidden"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="text-center space-y-3">
                      <h4 className="text-white font-bold text-lg">{animal.animalType}</h4>
                      <div className="space-y-2">
                        <p className="text-white/80 text-xs font-medium">Example species:</p>
                        <div className="space-y-1">
                          {animal.species.slice(0, 2).map((species, idx) => (
                            <div key={idx} className="text-white text-sm font-medium">
                              • {species}
                            </div>
                          ))}
                          {animal.species.length > 2 && (
                            <div className="text-white/70 text-xs">
                              + {animal.species.length - 2} more varieties
                            </div>
                          )}
                        </div>
                      </div>
                      <a
                        href={`/opportunities/${animalSlug}`}
                        className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-forest px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Explore Opportunities
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-forest/60 max-w-md mx-auto">
            <span className="md:hidden">Swipe left or right</span>
            <span className="hidden md:inline">Hover or click</span> any animal to see details and
            explore opportunities.
          </p>
        </div>
      </div>

      {/* Full-Screen Modal Carousel for Selected Animal(s) */}
      {selectedAnimal !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center touch-none p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-auto shadow-2xl">
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex h-full overflow-x-auto snap-x snap-mandatory touch-pan-x scrollbar-hide"
            >
              {animalTypes.map((animal, idx) => {
                return (
                  <div
                    key={idx}
                    className="snap-start flex-shrink-0 w-full h-full flex flex-col"
                  >
                    {/* Modal Header Image */}
                    <div className="relative h-52 md:h-64 overflow-hidden">
                      <img
                        src={animal.image}
                        alt={`${animal.animalType} details`}
                        className="w-full h-full object-cover"
                      />
                      {selectedAnimal === idx && (
                        <button
                          onClick={() => setSelectedAnimal(null)}
                          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors duration-200 focus:outline-none"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                        <h3 className="text-white font-bold text-2xl leading-tight">
                          {animal.animalType}
                        </h3>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6 overflow-y-auto touch-pan-y">
                      <div>
                        <p className="text-forest/80 leading-relaxed">
                          {animal.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-forest mb-3">Species you’ll work with:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {animal.species.map((species, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center gap-3 p-3 bg-cream rounded-lg"
                            >
                              <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0" />
                              <span className="text-forest font-medium">{species}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4">
                        <a
                          href={`/opportunities/${animal.animalType.toLowerCase().replace(/\s+/g, "-")}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-rich-earth hover:bg-rich-earth/90 text-white px-6 py-4 rounded-2xl font-semibold transition-colors duration-200 focus:outline-none"
                        >
                          More {animal.animalType} Opportunities
                          <ChevronRight className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalPhotoGallery;
