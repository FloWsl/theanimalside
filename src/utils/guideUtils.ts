// Guide URL generation utilities
// Generates context-dependent packing guide routes based on organization data

interface GuideContext {
  country: string;
  climate?: string;
  animalTypes?: string[];
  region?: string;
}

/**
 * Generate context-specific guide URL and button text
 */
export function generatePackingGuide(context: GuideContext) {
  const { country, climate, animalTypes, region } = context;
  
  // Normalize country name for URL
  const countrySlug = country?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'general';
  
  // Detect climate type from country or explicit climate data
  const isTropical = climate?.toLowerCase().includes('tropical') || 
    ['costa-rica', 'thailand', 'brazil', 'ecuador', 'peru', 'indonesia', 'malaysia', 'kenya', 'tanzania'].includes(countrySlug);
    
  const isArid = climate?.toLowerCase().includes('arid') || climate?.toLowerCase().includes('desert') ||
    ['namibia', 'botswana', 'south-africa', 'morocco', 'jordan'].includes(countrySlug);
    
  const isTemperate = !isTropical && !isArid;
  
  // Detect primary animal focus
  const hasMarineLife = animalTypes?.some(type => 
    type.toLowerCase().includes('turtle') || 
    type.toLowerCase().includes('whale') || 
    type.toLowerCase().includes('dolphin') ||
    type.toLowerCase().includes('marine')
  );
  
  const hasBigCats = animalTypes?.some(type =>
    type.toLowerCase().includes('lion') ||
    type.toLowerCase().includes('leopard') ||
    type.toLowerCase().includes('tiger') ||
    type.toLowerCase().includes('cheetah')
  );
  
  const hasElephants = animalTypes?.some(type =>
    type.toLowerCase().includes('elephant')
  );
  
  const hasPrimates = animalTypes?.some(type =>
    type.toLowerCase().includes('monkey') ||
    type.toLowerCase().includes('orangutan') ||
    type.toLowerCase().includes('gorilla') ||
    type.toLowerCase().includes('chimpanzee')
  );
  
  // Generate specific guide URL based on context
  let guideSlug = 'volunteer-packing-guide';
  let buttonText = '🎒 Complete Packing Guide';
  let emoji = '🌿';
  
  if (hasMarineLife) {
    guideSlug = 'marine-volunteer-packing';
    buttonText = '🌊 Marine Wildlife Packing';
    emoji = '🐢';
  } else if (hasBigCats) {
    guideSlug = 'safari-packing-guide';
    buttonText = '🦁 Safari Packing Guide';
    emoji = '🦁';
  } else if (hasElephants) {
    guideSlug = 'elephant-sanctuary-packing';
    buttonText = '🐘 Elephant Sanctuary Guide';
    emoji = '🐘';
  } else if (hasPrimates) {
    guideSlug = 'jungle-packing-guide';
    buttonText = '🐵 Jungle Packing Guide';
    emoji = '🐵';
  } else if (isTropical) {
    guideSlug = 'tropical-packing-guide';
    buttonText = '🌴 Tropical Climate Guide';
    emoji = '🌴';
  } else if (isArid) {
    guideSlug = 'desert-packing-guide';
    buttonText = '🌵 Desert Climate Guide';
    emoji = '🌵';
  } else if (isTemperate) {
    guideSlug = 'seasonal-packing-guide';
    buttonText = '🌲 Seasonal Climate Guide';
    emoji = '🌲';
  }
  
  // Country-specific variants for popular destinations
  if (countrySlug === 'costa-rica') {
    guideSlug = 'costa-rica-packing-guide';
    buttonText = '🦜 Costa Rica Packing Guide';
    emoji = '🦜';
  } else if (countrySlug === 'south-africa') {
    guideSlug = 'south-africa-packing-guide';
    buttonText = '🦏 South Africa Packing Guide';
    emoji = '🦏';
  } else if (countrySlug === 'thailand') {
    guideSlug = 'thailand-packing-guide';
    buttonText = '🐘 Thailand Packing Guide';
    emoji = '🐘';
  }
  
  return {
    url: `/guides/${guideSlug}`,
    buttonText,
    emoji,
    guideSlug,
    context: {
      country: countrySlug,
      climate: isTropical ? 'tropical' : isArid ? 'arid' : 'temperate',
      animalFocus: hasMarineLife ? 'marine' : hasBigCats ? 'big-cats' : hasElephants ? 'elephants' : hasPrimates ? 'primates' : 'general'
    }
  };
}

/**
 * Get button styling based on guide type
 */
export function getGuideButtonStyling(guideSlug: string) {
  if (guideSlug.includes('marine')) {
    return {
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-50'
    };
  } else if (guideSlug.includes('desert')) {
    return {
      borderColor: 'border-orange-400/30',
      textColor: 'text-orange-600',
      hoverBg: 'hover:bg-orange-50'
    };
  } else if (guideSlug.includes('big-cats')) {
    return {
      borderColor: 'border-amber-400/30',
      textColor: 'text-amber-700',
      hoverBg: 'hover:bg-amber-50'
    };
  } else {
    return {
      borderColor: 'border-sage-green/30',
      textColor: 'text-sage-green',
      hoverBg: 'hover:bg-sage-green/10'
    };
  }
}