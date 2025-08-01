import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, X } from "lucide-react";
import { AnimalCare } from "../../types";

interface AnimalPhotoGalleryProps {
  animalTypes: AnimalCare[];
}

const AnimalPhotoGallery: React.FC<AnimalPhotoGalleryProps> = ({ animalTypes }) => {
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);

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
                  onClick={() => setSelectedAnimal(index)}
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
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-forest/60 max-w-md mx-auto">
            Click any animal to learn more about the species and find opportunities to work with them.
          </p>
        </div>
      </div>

      {/* Full-Screen Modal for Selected Animal */}
      {selectedAnimal !== null && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            {(() => {
              const animal = animalTypes[selectedAnimal];
              if (!animal) return null;
              
              return (
                <>
                    {/* Modal Header Image */}
                    <div className="relative h-52 md:h-64 overflow-hidden">
                      <img
                        src={animal.image}
                        alt={`${animal.animalType} details`}
                        className="w-full h-full object-cover"
                      />
                    <button
                      onClick={() => setSelectedAnimal(null)}
                      className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors duration-200 focus:outline-none"
                    >
                      <X className="w-5 h-5" />
                    </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                        <h3 className="text-white font-bold text-2xl leading-tight">
                          {animal.animalType}
                        </h3>
                      </div>
                    </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-6 max-h-[40vh] overflow-y-auto">
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
                              className="flex items-center gap-3 p-3 bg-warm-beige/30 rounded-lg"
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
                </>
              );
            })()}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AnimalPhotoGallery;
