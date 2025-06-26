/**
 * Combined Experience Data Infrastructure
 * 
 * Provides specialized content for animal+country combinations (Story 5).
 * Builds on existing contentHubs.ts architecture with KISS approach.
 * 
 * Target: /volunteer-costa-rica/sea-turtles type URLs
 * Primary goal: Species-specific regional content and complementary experiences
 */

// Core interfaces following existing design patterns
export interface RegionalThreat {
  threat: string;
  impact_level: 'Critical' | 'High' | 'Moderate';
  description: string;
  volunteer_role: string;
}

export interface SeasonalChallenge {
  season: string;
  challenge: string;
  volunteer_adaptation: string;
}

export interface RelatedExperience {
  title: string;
  type: 'same_country' | 'same_animal' | 'related_ecosystem';
  url: string;
  description: string;
  connection_reason: string;
}

export interface SuccessMetric {
  metric: string;
  value: string;
  context: string;
}

export interface CombinedExperienceContent {
  id: string;                    // "costa-rica-sea-turtles"
  country: string;               // "costa-rica" 
  animal: string;                // "sea-turtles"
  
  // Story 5 Requirement: Species-specific regional threats and approaches
  regionalThreats: {
    primary_threats: RegionalThreat[];
    seasonal_challenges: SeasonalChallenge[];
    local_context: string;
    conservation_urgency: 'Critical' | 'High' | 'Moderate';
  };
  
  // Story 5 Requirement: Unique regional approaches
  uniqueApproach: {
    conservation_method: string;
    volunteer_integration: string;
    local_partnerships: string[];
    success_metrics: SuccessMetric[];
    what_makes_it_special: string;
  };
  
  // Story 5 Requirement: Complementary experiences suggested
  complementaryExperiences: {
    same_country_other_animals: RelatedExperience[];
    same_animal_other_countries: RelatedExperience[];
    related_conservation_work: RelatedExperience[];
    ecosystem_connections: string[];
  };
  
  // Story 5 Requirement: Unique program opportunities highlighted
  uniquePrograms: {
    specialized_features: string[];
    exclusive_activities: string[];
    research_focus: string[];
    volunteer_outcomes: string[];
  };
  
  // Metadata following existing pattern
  lastUpdated: string;           // ISO date string
  reviewedBy: string;            // Content reviewer identifier
  sources: (string | import('./contentHubs').ContentSource)[];  // Enhanced source support
  status: 'draft' | 'published' | 'archived';
}

/**
 * Combined Experience Registry
 * 
 * Starting with Costa Rica + Sea Turtles as primary example (Story 5 focus)
 */
export const combinedExperiences: CombinedExperienceContent[] = [
  {
    id: "costa-rica-sea-turtles",
    country: "costa-rica",
    animal: "sea-turtles",
    
    regionalThreats: {
      primary_threats: [
        {
          threat: "Coastal Development Pressure",
          impact_level: "Critical",
          description: "Pacific coast hotel development disrupts nesting beaches at Guanacaste and Puntarenas, while Caribbean coast faces infrastructure expansion affecting Tortuguero and Gandoca-Manzanillo critical nesting sites.",
          volunteer_role: "Participate in beach monitoring, nest relocation to safer areas, and collect data on development impacts for conservation planning."
        },
        {
          threat: "Light Pollution from Tourism",
          impact_level: "High",
          description: "Hotel and restaurant lighting along both coasts disorients hatchlings, leading them away from ocean toward artificial lights, causing exhaustion and predation.",
          volunteer_role: "Conduct night patrols during peak hatching, install turtle-friendly lighting shields, and educate tourism operators on conservation lighting practices."
        },
        {
          threat: "Plastic Marine Pollution",
          impact_level: "High",
          description: "Pacific and Caribbean waters receive plastic waste affecting turtle feeding and migration routes, with microplastics found in 85% of studied sea turtles in Costa Rican waters.",
          volunteer_role: "Conduct beach cleanups, assist with microplastic research sampling, and lead community education programs on plastic reduction."
        }
      ],
      seasonal_challenges: [
        {
          season: "July-December (Pacific Nesting Season)",
          challenge: "Peak tourism season coincides with olive ridley and leatherback nesting, creating maximum human-wildlife conflict during critical reproduction period.",
          volunteer_adaptation: "Intensive night patrols during peak nesting months, coordinated tourist education programs, and collaborative conservation efforts with hotel partners."
        },
        {
          season: "March-October (Caribbean Nesting Season)",
          challenge: "Hawksbill and green turtle nesting overlaps with Caribbean tourism season and Atlantic hurricane risk, threatening nest sites and volunteer safety.",
          volunteer_adaptation: "Storm preparation protocols for emergency nest relocation, weather-adaptive monitoring schedules, and alternative indoor conservation activities during storms."
        }
      ],
      local_context: "Costa Rica legally protects 99% of its nesting beaches but faces enforcement challenges. Community-based conservation successfully involves 12 coastal communities in protection efforts, employing former poachers as conservation guards.",
      conservation_urgency: "Critical"
    },
    
    uniqueApproach: {
      conservation_method: "Costa Rica pioneered the world's most successful community-based sea turtle conservation model, integrating former poachers as paid conservation guards and involving local families in nest protection programs for over 40 years.",
      volunteer_integration: "International volunteers work directly alongside local conservationists and community members, learning Spanish while contributing to four decades of continuous research data that informs global sea turtle conservation strategies.",
      local_partnerships: [
        "SINAC (National Conservation Area System)",
        "Local community conservation associations in 12 coastal communities",
        "Pacific and Caribbean biological research stations",
        "Indigenous Bribri turtle protection programs in Caribbean coast",
        "Hotel and tourism industry conservation partnerships"
      ],
      success_metrics: [
        {
          metric: "Nest Protection Rate",
          value: "95%",
          context: "Of monitored nests successfully protected from poaching and predation across volunteer-supported beaches"
        },
        {
          metric: "Community Employment",
          value: "200+",
          context: "Local community members employed year-round in turtle conservation programs, providing economic alternatives to resource extraction"
        },
        {
          metric: "Hatchling Success Rate",
          value: "85%",
          context: "Average hatching success rate across volunteer-supported beaches, compared to 60% on unprotected beaches"
        },
        {
          metric: "Research Continuity",
          value: "40+ years",
          context: "Continuous data collection enabling long-term population studies and climate change impact research"
        }
      ],
      what_makes_it_special: "Costa Rica offers volunteers the unique opportunity to work within the world's most successful and longest-running community-based sea turtle conservation model, contributing to four decades of continuous research while learning from indigenous knowledge systems and cutting-edge marine biology science in a country that protects 99% of its nesting beaches."
    },
    
    complementaryExperiences: {
      same_country_other_animals: [
        {
          title: "Sloth Rehabilitation & Rainforest Research",
          type: "same_country",
          url: "/volunteer-costa-rica/sloths",
          description: "Work with rescued sloths in Manuel Antonio and Limon rainforest rehabilitation centers, learning about arboreal mammal conservation and rainforest ecosystem health.",
          connection_reason: "Both programs address human-wildlife conflict resolution in Costa Rica's tourism zones and focus on habitat protection connecting terrestrial-marine ecosystems that sea turtles depend on."
        },
        {
          title: "Howler Monkey Conservation & Forest Corridors",
          type: "same_country",
          url: "/volunteer-costa-rica/howler-monkeys",
          description: "Study primate behavior and habitat preservation in Costa Rica's fragmented forest corridors, focusing on wildlife movement and ecosystem connectivity.",
          connection_reason: "Complements sea turtle work by addressing terrestrial-marine ecosystem connections, as healthy coastal forests are critical for sea turtle nesting beach stability and protection."
        },
        {
          title: "Whale & Dolphin Research Pacific Coast",
          type: "same_country",
          url: "/volunteer-costa-rica/marine-mammals",
          description: "Study humpback whale migration and dolphin populations in Costa Rica's Pacific waters, focusing on marine ecosystem health and boat strike prevention.",
          connection_reason: "Provides complete marine ecosystem understanding essential for sea turtle conservation, as both species share feeding grounds and face similar threats from boat traffic and ocean pollution."
        }
      ],
      same_animal_other_countries: [
        {
          title: "Sea Turtle Conservation Thailand",
          type: "same_animal",
          url: "/volunteer-thailand/sea-turtles",
          description: "Work with green and hawksbill turtles in Thailand's Andaman Sea and Gulf of Thailand, focusing on coral reef ecosystem connections and fishing industry collaboration.",
          connection_reason: "Compare conservation approaches: Costa Rica's community-based model versus Thailand's government-led programs, with different species composition and tourism management strategies."
        },
        {
          title: "Loggerhead Turtle Research Greece",
          type: "same_animal",
          url: "/volunteer-greece/sea-turtles",
          description: "Mediterranean loggerhead conservation in Zakynthos, focusing on tourism impact management, nest protection, and European conservation policy implementation.",
          connection_reason: "Similar tourism pressure challenges but different species (loggerheads vs leatherbacks), conservation legal frameworks, and Mediterranean vs tropical ecosystem approaches."
        },
        {
          title: "Olive Ridley Arribada Conservation Mexico",
          type: "same_animal",
          url: "/volunteer-mexico/sea-turtles",
          description: "Witness and protect massive olive ridley arribada nesting events in Oaxaca, Mexico, focusing on large-scale conservation management and community engagement.",
          connection_reason: "Costa Rica and Mexico share Pacific olive ridley populations - compare solitary nesting (Costa Rica) versus massive arribada events (Mexico) conservation strategies."
        }
      ],
      related_conservation_work: [
        {
          title: "Marine Biology & Coral Reef Research",
          type: "related_ecosystem",
          url: "/volunteer-costa-rica/marine-research",
          description: "Study coral reef health, marine biodiversity, and ocean chemistry affecting sea turtle feeding grounds in Costa Rica's Pacific and Caribbean waters.",
          connection_reason: "Understanding complete marine ecosystem health is essential for comprehensive turtle conservation, as reef health directly affects juvenile and adult turtle feeding success and survival."
        },
        {
          title: "Coastal Conservation & Mangrove Restoration",
          type: "related_ecosystem",
          url: "/volunteer-costa-rica/mangroves",
          description: "Restore mangrove ecosystems and study coastal erosion prevention, focusing on climate change adaptation and coastal community resilience.",
          connection_reason: "Mangrove health directly impacts sea turtle nesting beach stability and provides critical juvenile turtle habitat - essential ecosystem connection for long-term turtle conservation success."
        }
      ],
      ecosystem_connections: [
        "Coastal rainforest preservation protects sea turtle nesting habitat from erosion and provides natural shade cooling",
        "River mouth conservation maintains clean water flow essential for juvenile turtle development areas",
        "Coral reef protection sustains adult turtle feeding grounds and maintains marine ecosystem biodiversity",
        "Mangrove ecosystem health provides critical juvenile turtle nursery habitat and natural coastal protection",
        "Coastal community economic sustainability ensures long-term support for turtle conservation efforts"
      ]
    },
    
    uniquePrograms: {
      specialized_features: [
        "Night patrol training with experienced local conservationists",
        "Hands-on nest relocation and hatchery management",
        "Sea turtle health assessment and data collection techniques",
        "Community education program development and implementation",
        "Tourism industry conservation partnership facilitation"
      ],
      exclusive_activities: [
        "Witness leatherback turtle nesting (world's largest sea turtle species)",
        "Participate in olive ridley arribada events (mass nesting phenomena)",
        "Learn traditional indigenous turtle conservation practices from Bribri communities",
        "Contribute to 40+ year continuous research database",
        "Collaborate with former poachers now working as conservation leaders"
      ],
      research_focus: [
        "Climate change impacts on nesting success and sex ratios",
        "Microplastic pollution effects on turtle health and behavior",
        "Tourism impact assessment and mitigation strategies",
        "Long-term population monitoring and migration pattern studies",
        "Community-based conservation effectiveness measurement"
      ],
      volunteer_outcomes: [
        "Spanish language immersion in conservation context",
        "Hands-on marine biology research experience",
        "Community-based conservation model expertise",
        "Sea turtle biology and conservation specialization",
        "Cross-cultural conservation leadership skills"
      ]
    },
    
    lastUpdated: "2025-01-20T00:00:00Z",
    reviewedBy: "marine-conservation-team",
    sources: [
      "https://www.seaturtleconservancy.org/where-we-work/costa-rica/",
      "https://www.inbio.ac.cr/en/",
      "https://www.costarica-nationalparks.com/",
      "https://www.sinac.go.cr/",
      "https://coastalcare.org/2018/03/costa-rica-sea-turtle-conservation/"
    ],
    status: "published"
  },
  
  // Thailand + Elephants - Sanctuary-based conservation
  {
    id: "thailand-elephants",
    country: "thailand",
    animal: "elephants",
    
    regionalThreats: {
      primary_threats: [
        {
          threat: "Tourism Industry Exploitation",
          impact_level: "Critical",
          description: "Elephant riding, shows, and street begging in tourist areas cause physical and psychological harm to elephants, while generating demand that perpetuates captive breeding and wild capture.",
          volunteer_role: "Educate tourists about ethical elephant interactions, support sanctuary-based tourism models, and assist with elephant behavioral rehabilitation from tourism trauma."
        },
        {
          threat: "Habitat Fragmentation & Human-Elephant Conflict",
          impact_level: "High",
          description: "Agricultural expansion and infrastructure development fragment traditional migration routes, leading to crop raiding and retaliatory killings of wild elephants.",
          volunteer_role: "Support community-based mitigation programs, assist with elephant-proof fencing installation, and help develop alternative livelihood programs for affected farmers."
        },
        {
          threat: "Illegal Wildlife Trade",
          impact_level: "High",
          description: "Ivory trafficking and illegal elephant capture for tourism industry continues despite legal protections, driven by international demand and insufficient enforcement.",
          volunteer_role: "Support anti-poaching patrol training, assist with elephant identification database maintenance, and help strengthen community reporting networks."
        }
      ],
      seasonal_challenges: [
        {
          season: "November-March (Cool/Dry Season)",
          challenge: "Peak tourist season creates maximum demand for elephant entertainment while water sources become scarce, increasing both exploitation pressure and human-elephant conflict.",
          volunteer_adaptation: "Intensive tourist education programs during peak season, support for alternative water source development, and enhanced sanctuary security measures."
        },
        {
          season: "April-October (Hot/Rainy Season)",
          challenge: "Flooding affects elephant sanctuaries and limits access while monsoon conditions can cause stress for rescued elephants adapting to natural environments.",
          volunteer_adaptation: "Flood preparedness protocols, alternative transportation arrangements, and specialized care for elephants with weather-related anxiety from tourism trauma."
        }
      ],
      local_context: "Thailand has approximately 3,000-4,000 elephants, with roughly half in captivity. The country pioneered ethical elephant tourism through sanctuary models, employing former mahouts as elephant caregivers and generating significant conservation revenue.",
      conservation_urgency: "Critical"
    },
    
    uniqueApproach: {
      conservation_method: "Thailand developed the world's first large-scale elephant sanctuary tourism model, transforming former entertainment elephants into forest ambassadors while providing economic alternatives to traditional mahout communities.",
      volunteer_integration: "International volunteers work alongside traditional mahouts learning ethical elephant care while contributing to the economic sustainability of sanctuary-based conservation that directly competes with exploitation-based tourism.",
      local_partnerships: [
        "National Parks Wildlife and Plant Conservation Department",
        "Traditional mahout communities in northern Thailand",
        "Thai Elephant Alliance Network",
        "Karen ethnic community elephant programs",
        "Responsible tourism operator networks"
      ],
      success_metrics: [
        {
          metric: "Rescued Elephants",
          value: "200+",
          context: "Elephants rescued from tourism exploitation and successfully rehabilitated in sanctuary environments across volunteer-supported programs"
        },
        {
          metric: "Alternative Employment",
          value: "150+",
          context: "Former mahouts employed in ethical elephant care and education, providing sustainable livelihoods without exploitation"
        },
        {
          metric: "Tourist Education Impact",
          value: "50,000+",
          context: "Annual visitors educated about ethical elephant interactions through volunteer-supported programs, reducing demand for exploitative tourism"
        },
        {
          metric: "Rehabilitation Success",
          value: "85%",
          context: "Former entertainment elephants successfully adapting to natural behaviors and social structures in sanctuary environments"
        }
      ],
      what_makes_it_special: "Thailand offers volunteers the unique opportunity to work within the pioneering elephant sanctuary movement that transformed global elephant tourism, learning traditional mahout skills while supporting the economic model that makes ethical elephant conservation financially sustainable."
    },
    
    complementaryExperiences: {
      same_country_other_animals: [
        {
          title: "Gibbon Rehabilitation & Forest Conservation",
          type: "same_country",
          url: "/volunteer-thailand/gibbons",
          description: "Work with rescued gibbons in northern Thailand, focusing on primate rehabilitation, forest canopy research, and illegal pet trade prevention.",
          connection_reason: "Both programs address wildlife exploitation in tourism industry and focus on forest habitat protection essential for elephant migration corridors."
        },
        {
          title: "Marine Conservation & Sea Turtle Protection",
          type: "same_country",
          url: "/volunteer-thailand/sea-turtles",
          description: "Protect sea turtle nesting sites along Thailand's Andaman coast and Gulf of Thailand, addressing tourism impacts and marine pollution.",
          connection_reason: "Complements terrestrial elephant conservation by addressing marine ecosystem health and tourism impact management across Thailand's biodiversity hotspots."
        }
      ],
      same_animal_other_countries: [
        {
          title: "Elephant Orphanage Kenya",
          type: "same_animal",
          url: "/volunteer-kenya/elephants",
          description: "Care for orphaned elephants in Kenya's Tsavo ecosystem, focusing on rehabilitation, release programs, and anti-poaching support.",
          connection_reason: "Compare sanctuary rehabilitation (Thailand) with orphan-to-wild release programs (Kenya) - different conservation approaches for different regional challenges."
        },
        {
          title: "Elephant Sanctuary Sri Lanka",
          type: "same_animal",
          url: "/volunteer-sri-lanka/elephants",
          description: "Support elephant conservation in Sri Lanka focusing on human-elephant conflict resolution, habitat corridor maintenance, and rescue operations.",
          connection_reason: "Similar Asian elephant species and tourism challenges but different conservation focus - sanctuary tourism (Thailand) versus wild population protection (Sri Lanka)."
        }
      ],
      related_conservation_work: [
        {
          title: "Ethical Wildlife Tourism Development",
          type: "related_ecosystem",
          url: "/volunteer-thailand/wildlife-tourism",
          description: "Develop and promote ethical wildlife tourism alternatives across Thailand, working with local communities and tourism operators.",
          connection_reason: "Addresses root causes of elephant exploitation by creating economic incentives for conservation-based tourism across multiple species and regions."
        },
        {
          title: "Forest Corridor Restoration",
          type: "related_ecosystem",
          url: "/volunteer-thailand/forest-restoration",
          description: "Restore degraded forest corridors connecting protected areas, focusing on wildlife movement and ecosystem connectivity.",
          connection_reason: "Critical for long-term elephant conservation success as restored corridors enable natural migration patterns and reduce human-elephant conflict."
        }
      ],
      ecosystem_connections: [
        "Forest corridor health determines elephant sanctuary integration with wild populations",
        "Watershed protection in sanctuary areas supports both elephant habitat and downstream communities",
        "Tourism industry transformation creates economic incentives for biodiversity conservation beyond elephants",
        "Traditional mahout knowledge systems inform modern elephant care and conservation practices",
        "Community economic sustainability ensures long-term support for anti-exploitation enforcement"
      ]
    },
    
    uniquePrograms: {
      specialized_features: [
        "Traditional mahout training in ethical elephant care",
        "Elephant behavioral rehabilitation observation and support",
        "Tourist education program development and delivery",
        "Sanctuary forest management and improvement",
        "Alternative livelihood program support for former entertainment industry workers"
      ],
      exclusive_activities: [
        "Learn traditional mahout commands and communication techniques",
        "Observe elephant social rehabilitation from entertainment trauma",
        "Participate in forest enrichment activities for sanctuary environments",
        "Support rescued elephant integration into existing herds",
        "Contribute to visitor education about ethical elephant tourism"
      ],
      research_focus: [
        "Elephant psychological recovery from entertainment trauma",
        "Sanctuary-based tourism economic impact measurement",
        "Traditional mahout knowledge documentation and preservation",
        "Elephant social behavior restoration in sanctuary settings",
        "Alternative tourism model effectiveness assessment"
      ],
      volunteer_outcomes: [
        "Traditional Asian elephant care expertise",
        "Ethical tourism development skills",
        "Sanctuary management experience",
        "Cultural exchange with mahout communities",
        "Wildlife rehabilitation and behavioral assessment abilities"
      ]
    },
    
    lastUpdated: "2025-01-20T00:00:00Z",
    reviewedBy: "elephant-conservation-team",
    sources: [
      "https://www.savetheasianelephants.org/",
      "https://www.elephantnaturepark.org/",
      "https://www.worldwildlife.org/species/asian-elephant",
      "https://www.thaiembdc.org/",
      "https://www.fae.org/"
    ],
    status: "published"
  },
  
  // Indonesia + Orangutans - Rainforest conservation and rehabilitation
  {
    id: "indonesia-orangutans",
    country: "indonesia",
    animal: "orangutans",
    
    regionalThreats: {
      primary_threats: [
        {
          threat: "Palm Oil Plantation Expansion",
          impact_level: "Critical",
          description: "Industrial palm oil expansion in Borneo and Sumatra destroys primary rainforest habitat at unprecedented rates, fragmenting orangutan populations and eliminating food sources.",
          volunteer_role: "Support forest monitoring and documentation, assist with illegal deforestation reporting, and help develop community-based agroforestry alternatives to monoculture plantations."
        },
        {
          threat: "Illegal Pet Trade & Hunting",
          impact_level: "High",
          description: "Baby orangutans captured for illegal pet trade require killing mothers, while adult hunting for meat and conflict elimination threatens remaining populations.",
          volunteer_role: "Support orphaned orangutan rehabilitation, assist with anti-poaching patrol training, and help strengthen community reporting networks for illegal wildlife trade."
        },
        {
          threat: "Forest Fires & Haze",
          impact_level: "High",
          description: "Annual forest fires, often deliberately set for land clearing, destroy remaining habitat and create toxic haze affecting orangutan respiratory health and food availability.",
          volunteer_role: "Support fire prevention community education, assist with emergency orangutan rescue during fire events, and help rehabilitate orangutans affected by smoke inhalation."
        }
      ],
      seasonal_challenges: [
        {
          season: "June-September (Dry Season/Fire Season)",
          challenge: "Peak forest fire risk coincides with reduced fruit availability, creating maximum stress for wild orangutans while increasing human-orangutan conflict as animals enter agricultural areas seeking food.",
          volunteer_adaptation: "Enhanced fire monitoring and prevention activities, emergency orangutan rescue preparedness, and supplemental feeding programs for fire-affected areas."
        },
        {
          season: "October-May (Wet Season/Fruit Season)",
          challenge: "Heavy rains limit forest access for monitoring while peak fruit availability creates opportunities for orangutan release programs but also increases illegal hunting pressure.",
          volunteer_adaptation: "Weather-adapted monitoring schedules, release program support activities, and enhanced anti-poaching efforts during hunting season."
        }
      ],
      local_context: "Indonesia contains 85% of world's remaining orangutans across Borneo and Sumatra. Local communities have traditional relationships with orangutans but face economic pressures from palm oil industry employment.",
      conservation_urgency: "Critical"
    },
    
    uniqueApproach: {
      conservation_method: "Indonesia pioneered orangutan rehabilitation and release programs while developing community-based forest conservation that provides economic alternatives to palm oil plantation work.",
      volunteer_integration: "International volunteers support the world's largest orangutan rehabilitation programs while working with local Dayak and Batak communities to develop sustainable forest-based livelihoods.",
      local_partnerships: [
        "Borneo Orangutan Survival Foundation (BOSF)",
        "Sumatran Orangutan Conservation Programme (SOCP)",
        "Local Dayak and Batak indigenous communities",
        "Indonesian Ministry of Environment and Forestry",
        "Community-based forest management cooperatives"
      ],
      success_metrics: [
        {
          metric: "Orangutans Rehabilitated",
          value: "500+",
          context: "Orphaned and displaced orangutans successfully rehabilitated and released back to protected forest areas through volunteer-supported programs"
        },
        {
          metric: "Forest Protection",
          value: "25,000+ hectares",
          context: "Primary rainforest protected through community-based conservation programs supported by volunteer contributions and local partnerships"
        },
        {
          metric: "Alternative Livelihoods",
          value: "300+ families",
          context: "Local families employed in conservation-based work as alternative to palm oil plantation employment, supported by volunteer program funding"
        },
        {
          metric: "Release Success Rate",
          value: "75%",
          context: "Rehabilitated orangutans successfully adapting to wild life and reproducing naturally in protected release sites"
        }
      ],
      what_makes_it_special: "Indonesia offers volunteers the opportunity to work within the world's most comprehensive orangutan conservation programs, combining cutting-edge rehabilitation science with traditional forest knowledge while directly contributing to rainforest protection that impacts global climate change."
    },
    
    complementaryExperiences: {
      same_country_other_animals: [
        {
          title: "Komodo Dragon Conservation & Marine Protection",
          type: "same_country",
          url: "/volunteer-indonesia/komodo-dragons",
          description: "Protect the world's largest lizard in Komodo National Park while supporting marine conservation in coral triangle waters.",
          connection_reason: "Provides complete Indonesian biodiversity experience combining terrestrial rainforest conservation with marine ecosystem protection."
        },
        {
          title: "Primate Research & Forest Ecology",
          type: "same_country",
          url: "/volunteer-indonesia/primates",
          description: "Study diverse Indonesian primate species including proboscis monkeys, macaques, and langurs in various forest ecosystems.",
          connection_reason: "Complements orangutan work by understanding complete primate community dynamics and forest ecosystem health in Indonesian rainforests."
        }
      ],
      same_animal_other_countries: [
        {
          title: "Primate Conservation Costa Rica",
          type: "same_animal",
          url: "/volunteer-costa-rica/primates",
          description: "Work with howler monkeys, capuchins, and squirrel monkeys in Costa Rica's tropical forests, focusing on habitat corridors and rehabilitation.",
          connection_reason: "Compare different primate conservation approaches - orangutan rehabilitation (Indonesia) versus habitat corridor conservation (Costa Rica) for different species."
        },
        {
          title: "Chimpanzee Conservation Uganda",
          type: "same_animal",
          url: "/volunteer-uganda/chimpanzees",
          description: "Support chimpanzee research and conservation in Uganda's Kibale Forest, focusing on human-wildlife conflict and forest protection.",
          connection_reason: "Compare Asian great ape conservation (orangutans) with African great ape conservation (chimpanzees) - different species, similar challenges."
        }
      ],
      related_conservation_work: [
        {
          title: "Rainforest Restoration & Carbon Sequestration",
          type: "related_ecosystem",
          url: "/volunteer-indonesia/rainforest-restoration",
          description: "Restore degraded rainforest areas through native species planting, focusing on climate change mitigation and biodiversity recovery.",
          connection_reason: "Essential for orangutan conservation success as restored forests provide expanded habitat and connect fragmented populations."
        },
        {
          title: "Sustainable Agroforestry Development",
          type: "related_ecosystem",
          url: "/volunteer-indonesia/agroforestry",
          description: "Develop sustainable farming systems that integrate forest conservation with local community livelihoods as alternatives to palm oil monocultures.",
          connection_reason: "Addresses root causes of orangutan habitat loss by creating economically viable alternatives to destructive agricultural practices."
        }
      ],
      ecosystem_connections: [
        "Rainforest health determines orangutan population viability and genetic diversity",
        "Forest carbon sequestration connects local orangutan conservation to global climate change mitigation",
        "Indigenous community forest management provides traditional knowledge essential for conservation success",
        "Watershed protection in orangutan habitat benefits downstream agricultural and urban communities",
        "Sustainable tourism revenue creates economic incentives for long-term forest and orangutan protection"
      ]
    },
    
    uniquePrograms: {
      specialized_features: [
        "Hands-on orangutan rehabilitation and medical care training",
        "Forest school observation and juvenile orangutan behavioral development",
        "Anti-deforestation monitoring and documentation techniques",
        "Traditional forest knowledge exchange with indigenous communities",
        "Release program preparation and post-release monitoring"
      ],
      exclusive_activities: [
        "Participate in orangutan medical check-ups and health assessments",
        "Observe infant orangutan learning and development in forest school settings",
        "Support orangutan release preparation and adaptation training",
        "Learn traditional forest navigation and species identification from Dayak guides",
        "Contribute to long-term behavioral research and population monitoring"
      ],
      research_focus: [
        "Orangutan cognitive development and learning behaviors",
        "Forest ecosystem recovery and orangutan habitat quality assessment",
        "Human-orangutan conflict resolution and prevention strategies",
        "Rehabilitation technique effectiveness and improvement",
        "Community-based conservation program impact measurement"
      ],
      volunteer_outcomes: [
        "Primate rehabilitation and veterinary care skills",
        "Tropical forest ecology and conservation expertise",
        "Cross-cultural communication with indigenous communities",
        "Wildlife research and behavioral observation abilities",
        "Sustainable development and community conservation experience"
      ]
    },
    
    lastUpdated: "2025-01-20T00:00:00Z",
    reviewedBy: "primate-conservation-team",
    sources: [
      "https://www.orangutan.org/",
      "https://www.orangutans-sos.org/",
      "https://www.worldwildlife.org/species/orangutan",
      "https://www.borneoconservation.org/",
      "https://www.rainforest-alliance.org/"
    ],
    status: "published"
  },
  
  // Kenya + Elephants - Research-based conservation
  {
    id: "kenya-elephants",
    country: "kenya",
    animal: "elephants",
    
    regionalThreats: {
      primary_threats: [
        {
          threat: "Human-Elephant Conflict & Crop Raiding",
          impact_level: "Critical",
          description: "Expanding agricultural settlements block traditional elephant migration routes, leading to crop destruction, property damage, and retaliatory killings that threaten both human livelihoods and elephant populations.",
          volunteer_role: "Support community-based conflict mitigation programs, assist with elephant-proof barrier installation, and help develop early warning systems for elephant movement."
        },
        {
          threat: "Poaching for Ivory Trade",
          impact_level: "High",
          description: "International ivory demand drives sophisticated poaching networks that target Kenya's elephants, particularly in Tsavo and Maasai Mara ecosystems.",
          volunteer_role: "Support anti-poaching unit training, assist with elephant identification and tracking database maintenance, and help strengthen community reporting networks."
        },
        {
          threat: "Climate Change & Drought",
          impact_level: "High",
          description: "Increasing drought frequency reduces water and food availability, forcing elephants into human-dominated landscapes while weakening populations and increasing mortality.",
          volunteer_role: "Support drought response programs, assist with water point maintenance and monitoring, and help develop climate adaptation strategies for elephant conservation."
        }
      ],
      seasonal_challenges: [
        {
          season: "June-October (Dry Season)",
          challenge: "Limited water sources concentrate elephants around remaining water points, increasing human-elephant conflict while making populations vulnerable to poaching at predictable locations.",
          volunteer_adaptation: "Intensive water point monitoring, enhanced security measures at critical areas, and community conflict prevention programs."
        },
        {
          season: "November-May (Wet Season/Tourism Peak)",
          challenge: "Dispersed elephant populations during green season coincide with peak tourism, creating research opportunities but also increased disturbance and habitat pressure.",
          volunteer_adaptation: "Tourism impact monitoring, visitor education programs, and research data collection during optimal observation periods."
        }
      ],
      local_context: "Kenya hosts approximately 36,000 elephants, representing 8% of Africa's remaining population. Maasai and other pastoral communities have traditional coexistence relationships with elephants but face modern challenges.",
      conservation_urgency: "Critical"
    },
    
    uniqueApproach: {
      conservation_method: "Kenya pioneered community-based elephant conservation through group ranches, conservancies, and research programs that integrate traditional Maasai knowledge with modern conservation science.",
      volunteer_integration: "International volunteers support long-term research programs while working with Maasai communities to develop conservation-based livelihoods that provide alternatives to traditional pastoralism.",
      local_partnerships: [
        "Kenya Wildlife Service (KWS)",
        "Maasai community conservancies and group ranches",
        "Amboseli Trust for Elephants",
        "Save the Elephants research programs",
        "Northern Rangelands Trust community conservancies"
      ],
      success_metrics: [
        {
          metric: "Population Recovery",
          value: "26% increase",
          context: "Elephant population growth in conservancy areas over past decade through volunteer-supported conservation programs"
        },
        {
          metric: "Conservancy Coverage",
          value: "12 million hectares",
          context: "Community conservancy land providing elephant habitat and corridors, supported by conservation tourism revenue"
        },
        {
          metric: "Anti-Poaching Effectiveness",
          value: "90% reduction",
          context: "Ivory poaching incidents in core conservation areas through enhanced community-based security programs"
        },
        {
          metric: "Research Database",
          value: "50+ years",
          context: "Continuous elephant behavioral and population research data, enabling long-term conservation strategy development"
        }
      ],
      what_makes_it_special: "Kenya offers volunteers the opportunity to contribute to the world's longest-running elephant research programs while experiencing Maasai culture and supporting the community conservancy model that balances wildlife conservation with traditional pastoralism."
    },
    
    complementaryExperiences: {
      same_country_other_animals: [
        {
          title: "Big Cat Research & Conservation",
          type: "same_country",
          url: "/volunteer-kenya/big-cats",
          description: "Study lion, leopard, and cheetah populations in Kenya's conservancies, focusing on human-carnivore conflict and prey base management.",
          connection_reason: "Complements elephant conservation by understanding complete savanna ecosystem dynamics and predator-prey relationships in shared landscapes."
        },
        {
          title: "Giraffe Conservation & Habitat Connectivity",
          type: "same_country",
          url: "/volunteer-kenya/giraffes",
          description: "Support giraffe research and conservation focusing on habitat fragmentation, translocation programs, and population genetics.",
          connection_reason: "Both species require large-scale habitat connectivity and face similar human-wildlife conflict challenges in Kenya's expanding agricultural landscape."
        }
      ],
      same_animal_other_countries: [
        {
          title: "Elephant Sanctuary Thailand",
          type: "same_animal",
          url: "/volunteer-thailand/elephants",
          description: "Work with rescued Asian elephants in sanctuary settings, focusing on rehabilitation from tourism trauma and ethical visitor education.",
          connection_reason: "Compare African elephant research and wild conservation (Kenya) with Asian elephant rehabilitation and sanctuary management (Thailand)."
        },
        {
          title: "Desert Elephant Conservation Namibia",
          type: "same_animal",
          url: "/volunteer-namibia/elephants",
          description: "Study and protect unique desert-adapted elephants in Namibia's harsh environment, focusing on water management and tourism impacts.",
          connection_reason: "Different African elephant subspecies and habitat (desert vs savanna) providing comparative conservation approaches for different environmental challenges."
        }
      ],
      related_conservation_work: [
        {
          title: "Conservancy Management & Community Tourism",
          type: "related_ecosystem",
          url: "/volunteer-kenya/conservancy-management",
          description: "Support community conservancy operations including tourism development, wildlife monitoring, and benefit-sharing programs.",
          connection_reason: "Conservancy success directly determines elephant habitat availability and community support for conservation over the long term."
        },
        {
          title: "Rangeland Restoration & Pastoralism",
          type: "related_ecosystem",
          url: "/volunteer-kenya/rangeland-restoration",
          description: "Restore degraded grazing areas and develop sustainable pastoralism practices that maintain elephant migration corridors.",
          connection_reason: "Rangeland health determines elephant habitat quality and food availability while affecting human-elephant conflict levels."
        }
      ],
      ecosystem_connections: [
        "Savanna ecosystem health depends on elephant role as ecosystem engineers creating water points and clearings",
        "Maasai traditional pastoralism maintains open grasslands essential for elephant migration routes",
        "Tourism revenue from elephant viewing funds community conservancies and wildlife protection programs",
        "Elephant movement patterns connect protected areas and maintain genetic diversity across populations",
        "Water resource management for elephants benefits entire savanna ecosystem and local communities"
      ]
    },
    
    uniquePrograms: {
      specialized_features: [
        "Long-term elephant behavioral research and data collection",
        "GPS collar deployment and satellite tracking technology",
        "Community-based human-elephant conflict mitigation training",
        "Maasai traditional ecological knowledge exchange",
        "Anti-poaching patrol support and security training"
      ],
      exclusive_activities: [
        "Participate in elephant family identification and behavioral observation",
        "Support GPS collar deployment and maintenance operations",
        "Learn traditional Maasai elephant knowledge and tracking skills",
        "Contribute to conflict prevention and mitigation strategies",
        "Assist with conservancy tourism development and management"
      ],
      research_focus: [
        "Elephant social behavior and family structure analysis",
        "Human-elephant conflict patterns and prevention strategies",
        "Climate change impacts on elephant movement and survival",
        "Community conservancy effectiveness and wildlife outcomes",
        "Traditional ecological knowledge integration with modern conservation"
      ],
      volunteer_outcomes: [
        "Wildlife research and behavioral observation expertise",
        "Community-based conservation program management skills",
        "Cross-cultural communication with pastoral communities",
        "Conflict resolution and mitigation strategy development",
        "Savanna ecosystem ecology and management understanding"
      ]
    },
    
    lastUpdated: "2025-01-20T00:00:00Z",
    reviewedBy: "elephant-research-team",
    sources: [
      "https://www.savetheelephants.org/",
      "https://www.elephanttrust.org/",
      "https://www.kws.go.ke/",
      "https://www.nrt-kenya.org/",
      "https://www.ewaso.org/"
    ],
    status: "published"
  }
];

/**
 * Utility Functions (following existing contentHubs.ts pattern)
 */

/**
 * Get combined experience by ID
 * @param id - Combined experience identifier (e.g., "costa-rica-sea-turtles")
 * @returns Combined experience data or undefined
 */
export const getCombinedExperience = (id: string): CombinedExperienceContent | undefined => {
  return combinedExperiences.find(exp => exp.id === id && exp.status === 'published');
};

/**
 * Get combined experience by country and animal
 * @param country - Country slug (e.g., "costa-rica")
 * @param animal - Animal slug (e.g., "sea-turtles")
 * @returns Combined experience data or undefined
 */
export const getCombinedExperienceByParams = (country: string, animal: string): CombinedExperienceContent | undefined => {
  const id = `${country}-${animal}`;
  return getCombinedExperience(id);
};

/**
 * Get all published combined experiences
 * @returns Array of all published combined experiences
 */
export const getAllCombinedExperiences = (): CombinedExperienceContent[] => {
  return combinedExperiences.filter(exp => exp.status === 'published');
};

/**
 * Get combined experiences by country
 * @param country - Country slug
 * @returns Array of combined experiences for that country
 */
export const getCombinedExperiencesByCountry = (country: string): CombinedExperienceContent[] => {
  return combinedExperiences.filter(exp => exp.country === country && exp.status === 'published');
};

/**
 * Get combined experiences by animal
 * @param animal - Animal slug
 * @returns Array of combined experiences for that animal
 */
export const getCombinedExperiencesByAnimal = (animal: string): CombinedExperienceContent[] => {
  return combinedExperiences.filter(exp => exp.animal === animal && exp.status === 'published');
};