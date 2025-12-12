
import { TrustedSource, HeritageSite, RadioStation, Region, QuizQuestion } from './types';

export const TRUSTED_SOURCES: TrustedSource[] = [
  { name: "Agence d'Information du Burkina (AIB)", category: 'Agence', description: "L'agence officielle de l'État.", url: "https://www.aib.media" },
  { name: "Sidwaya", category: 'Presse', description: "Quotidien national d'État.", url: "https://www.sidwaya.info" },
  { name: "RTB (Radio/Télé)", category: 'TV', description: "Radiodiffusion Télévision du Burkina (Média Public).", url: "https://www.rtb.bf" },
  { name: "LeFaso.net", category: 'Presse', description: "Portail d'information de référence.", url: "https://lefaso.net" },
  { name: "Burkina 24", category: 'Presse', description: "Actualité nationale et internationale en ligne.", url: "https://burkina24.com" },
  { name: "L'Observateur Paalga", category: 'Presse', description: "Doyen des quotidiens privés.", url: "https://www.lobservateur.bf" },
  { name: "Le Pays", category: 'Presse', description: "Quotidien privé indépendant.", url: "https://lepays.bf" },
  { name: "BF1", category: 'TV', description: "Chaîne privée généraliste.", url: "https://bf1.tv" },
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: '3',
    name: 'Radio Nationale (RTB)',
    frequency: '99.9 FM',
    description: "La voix officielle du Burkina Faso. Suivez l'actualité institutionnelle, les débats nationaux et les grands événements en direct.",
    website: 'https://www.rtb.bf',
    listenUrl: 'https://www.rtb.bf/radio-direct',
    watchUrl: 'https://www.rtb.bf/television-direct',
    color: '#FCD116'
  }
];

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: '1',
    name: 'Ruines de Loropéni',
    location: 'Gaoua, Sud-Ouest',
    description: 'Premier site du Burkina Faso inscrit au patrimoine mondial. Ces murailles témoignent de la puissance du commerce de l\'or.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ruines_de_Lorop%C3%A9ni.jpg/1280px-Ruines_de_Lorop%C3%A9ni.jpg', 
    tags: ['Histoire', 'Archéologie', 'Sud-Ouest'],
    websiteUrl: 'https://www.ontb.bf',
    detailedDescription: "Les ruines de Loropéni sont les mieux préservées des dix forteresses que compte la région du Lobi. Datant d'au moins mille ans, cet ensemble de murs de pierre latéritique est lié à l'extraction de l'or. Le site est géré en collaboration avec les communautés locales et le Ministère de la Culture.",
    externalLinks: [
      { label: "Office National du Tourisme (ONTB)", url: "https://www.ontb.bf" },
      { label: "Ministère de la Culture", url: "https://www.culture.gov.bf" }
    ]
  },
  {
    id: '2',
    name: 'Pics de Sindou',
    location: 'Léraba, Cascades',
    description: 'Une formation géologique spectaculaire de grès. Lieu sacré et touristique majeur de la région des Cascades.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pics_de_Sindou.jpg/1280px-Pics_de_Sindou.jpg',
    tags: ['Nature', 'Géologie', 'Sacré', 'Cascades'],
    websiteUrl: 'https://www.ontb.bf',
    detailedDescription: "Situés à 50 km de Banfora, les Pics de Sindou sont une formation rocheuse de grès sculptée par le vent. Ce site est sacré pour les populations locales Sénoufo. C'est un incontournable du tourisme national promu par l'ONTB.",
    externalLinks: [
      { label: "Office National du Tourisme", url: "https://www.ontb.bf" },
      { label: "Région des Cascades (Info)", url: "https://www.regions.bf" }
    ]
  },
  {
    id: '3',
    name: 'La Cour Royale de Tiébélé',
    location: 'Nahouri, Centre-Sud',
    description: 'Chef-d\'œuvre de l\'architecture Kassena, célèbre pour ses peintures murales géométriques réalisées par les femmes.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tiebele_Burkina_Faso.jpg/1280px-Tiebele_Burkina_Faso.jpg',
    tags: ['Architecture', 'Tradition', 'Art', 'Centre-Sud'],
    websiteUrl: 'https://www.ontb.bf',
    detailedDescription: "Tiébélé est la référence de l'architecture Gourounsi. La Cour Royale est un complexe où les femmes décorent les murs avec des motifs géométriques traditionnels (graphite, calcaire, latérite). Le site fait l'objet d'une forte promotion culturelle nationale.",
    externalLinks: [
        { label: "Office National du Tourisme", url: "https://www.ontb.bf" },
        { label: "Reportage LeFaso.net", url: "https://lefaso.net" }
    ]
  },
  {
    id: '4',
    name: 'Grande Mosquée de Bobo-Dioulasso',
    location: 'Bobo-Dioulasso, Hauts-Bassins',
    description: 'Emblème de l\'architecture soudanaise en terre crue et symbole de la ville de Sya.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Grand_mosque_bobo_dioulasso_2.jpg/1280px-Grand_mosque_bobo_dioulasso_2.jpg',
    tags: ['Religion', 'Architecture', 'Hauts-Bassins'],
    websiteUrl: 'http://www.mairie-bobo.bf',
    detailedDescription: "Construite vers 1880, la Grande Mosquée de Dioulassoba est un joyau de l'architecture en banco. Elle est le symbole culturel et religieux de la ville de Sya. La mairie et les comités locaux assurent sa préservation.",
    externalLinks: [
        { label: "Mairie de Bobo-Dioulasso", url: "http://www.mairie-bobo.bf" },
        { label: "Office National du Tourisme", url: "https://www.ontb.bf" }
    ]
  },
  {
    id: '5',
    name: 'Réserve de Nazinga',
    location: 'Centre-Sud',
    description: 'Le ranch de gibier de Nazinga est le sanctuaire des éléphants et de la faune sauvage burkinabè.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Elephants_at_Nazinga_Game_Ranch.jpg/1280px-Elephants_at_Nazinga_Game_Ranch.jpg',
    tags: ['Nature', 'Faune', 'Safari', 'Centre-Sud'],
    websiteUrl: 'https://www.ontb.bf',
    detailedDescription: "Créé en 1979, le Ranch de Gibier de Nazinga est l'une des fiertés écologiques du Burkina. Il abrite une forte population d'éléphants et d'antilopes, gérée par les eaux et forêts burkinabè.",
    externalLinks: [
        { label: "Office National du Tourisme", url: "https://www.ontb.bf" },
        { label: "Ministère de l'Environnement", url: "https://www.environnement.gov.bf" }
    ]
  },
   {
    id: '6',
    name: 'Sculptures sur Granit de Laongo',
    location: 'Oubritenga, Plateau-Central',
    description: 'Musée à ciel ouvert initié par des artistes nationaux, où le granit prend vie.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Symposium_Granit_Laongo.jpg/1280px-Symposium_Granit_Laongo.jpg',
    tags: ['Art', 'Sculpture', 'Culture', 'Plateau-Central'],
    websiteUrl: 'https://www.culture.gov.bf',
    detailedDescription: "Initié par le sculpteur burkinabè Siriki Ky, le site de Laongo accueille des symposiums internationaux. C'est un site phare géré sous la tutelle du Ministère de la Culture, des Arts et du Tourisme.",
    externalLinks: [
        { label: "Ministère de la Culture", url: "https://www.culture.gov.bf" },
        { label: "Office National du Tourisme", url: "https://www.ontb.bf" }
    ],
    museumUrl: "https://www.culture.gov.bf/laongo"
  },
  {
    id: '7',
    name: 'Forêt de Deux Balés',
    location: 'Boromo, Boucle du Mouhoun',
    description: 'Une aire protégée abritant une riche biodiversité, notamment des éléphants.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Burkina_Faso_landscape_near_Dano.jpg/1280px-Burkina_Faso_landscape_near_Dano.jpg',
    tags: ['Nature', 'Faune', 'Parc National', 'Boucle du Mouhoun'],
    websiteUrl: 'https://www.environnement.gov.bf',
    detailedDescription: "Le Parc National des Deux Balés est situé au sud de Boromo. Il fait partie d'un complexe écologique important le long du fleuve Mouhoun. C'est un refuge pour les éléphants d'Afrique de l'Ouest.",
    externalLinks: [
        { label: "Ministère de l'Environnement", url: "https://www.environnement.gov.bf" }
    ]
  }
];

export const BURKINA_FACTS = [
  "Le nom 'Burkina Faso' signifie 'Patrie des Hommes Intègres'. Il combine le moré (Burkina) et le dioula (Faso).",
  "Le drapeau national a été adopté le 4 août 1984. L'étoile jaune guide la révolution.",
  "Ouagadougou a été fondée au XIe siècle par l'Empire Mossi.",
  "Le FESPACO est le plus grand festival de cinéma africain et se tient à Ouagadougou tous les deux ans.",
  "Les Caïmans sacrés de Sabou sont vénérés et ne sont pas agressifs envers les humains.",
  "Le Pic de Nahouri est l'un des sommets les plus élevés du pays, offrant une vue imprenable.",
  "Le 'Poulet Bicyclette' est une appellation populaire pour le poulet local, réputé pour sa chair ferme et savoureuse.",
  "Le SIAO (Salon International de l'Artisanat de Ouagadougou) est la plus grande vitrine de l'artisanat africain.",
  "Bobo-Dioulasso est considérée comme la capitale culturelle et musicale du Burkina Faso.",
  "La parenté à plaisanterie est une pratique sociale unique qui permet de désamorcer les conflits par l'humour entre certaines ethnies.",
  "Le Parc W, partagé avec le Niger et le Bénin, est classé réserve de biosphère par l'UNESCO.",
  "Le chapeau de Saponé est un symbole vestimentaire national, reconnu comme indication géographique protégée."
];

export const REGIONS_DATA: Region[] = [
    { id: '1', name: 'Boucle du Mouhoun', capital: 'Dédougou', climate: 'Soudano-sahélien', description: 'Le grenier agricole du Burkina Faso.', population: '1 800 000 hab.' },
    { id: '2', name: 'Cascades', capital: 'Banfora', climate: 'Soudanien', description: 'Région verdoyante et touristique par excellence (Pics de Sindou, Cascades de Karfiguéla).', population: '800 000 hab.' },
    { id: '3', name: 'Centre', capital: 'Ouagadougou', climate: 'Soudano-sahélien', description: 'Cœur politique et administratif, abritant la capitale.', population: '3 000 000 hab.' },
    { id: '4', name: 'Centre-Est', capital: 'Tenkodogo', climate: 'Soudano-sahélien', description: 'Zone de commerce transfrontalier avec le Togo et le Ghana.', population: '1 500 000 hab.' },
    { id: '5', name: 'Centre-Nord', capital: 'Kaya', climate: 'Sahélien', description: 'Région réputée pour son artisanat du cuir et l\'élevage.', population: '1 600 000 hab.' },
    { id: '6', name: 'Centre-Ouest', capital: 'Koudougou', climate: 'Soudano-sahélien', description: 'Berceau de la révolte et ville universitaire dynamique.', population: '1 600 000 hab.' },
    { id: '7', name: 'Centre-Sud', capital: 'Manga', climate: 'Soudano-sahélien', description: 'Abrite le parc national Kaboré-Tambi et le Ranch de Nazinga.', population: '800 000 hab.' },
    { id: '8', name: 'Est', capital: 'Fada N\'Gourma', climate: 'Soudano-sahélien', description: 'La plus vaste région, célèbre pour le Parc W et le miel.', population: '1 700 000 hab.' },
    { id: '9', name: 'Hauts-Bassins', capital: 'Bobo-Dioulasso', climate: 'Soudanien', description: 'Poumon économique et culturel, abritant Sya.', population: '2 100 000 hab.' },
    { id: '10', name: 'Nord', capital: 'Ouahigouya', climate: 'Sahélien', description: 'Royaume du Yatenga, célèbre pour la pomme de terre.', population: '1 600 000 hab.' },
    { id: '11', name: 'Plateau-Central', capital: 'Ziniaré', climate: 'Soudano-sahélien', description: 'Proche de la capitale, site des sculptures de Laongo.', population: '900 000 hab.' },
    { id: '12', name: 'Sahel', capital: 'Dori', climate: 'Sahélien strict', description: 'Zone d\'élevage par excellence, paysages dunaires.', population: '1 200 000 hab.' },
    { id: '13', name: 'Sud-Ouest', capital: 'Gaoua', climate: 'Soudanien', description: 'Pays Lobi, riche en culture et en or (Loropéni).', population: '850 000 hab.' }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "En quelle année le drapeau actuel a-t-il été adopté ?",
        options: ["1960", "1983", "1984", "1991"],
        correctAnswer: 2,
        explanation: "Le drapeau a été adopté le 4 août 1984 sous la Révolution menée par Thomas Sankara."
    },
    {
        id: 2,
        question: "Quelle est la capitale économique du Burkina Faso ?",
        options: ["Ouagadougou", "Koudougou", "Bobo-Dioulasso", "Banfora"],
        correctAnswer: 2,
        explanation: "Bobo-Dioulasso est historiquement la capitale économique et industrielle."
    },
    {
        id: 3,
        question: "Que signifie 'Burkina Faso' ?",
        options: ["Pays de la savane", "Patrie des Hommes Intègres", "Terre des ancêtres", "République libre"],
        correctAnswer: 1,
        explanation: "Combinaison de 'Burkina' (Intégrité en Mooré) et 'Faso' (Patrie en Dioula)."
    },
    {
        id: 4,
        question: "Quel animal est le symbole de l'équipe nationale de football ?",
        options: ["Le Lion", "L'Éléphant", "L'Étalon", "L'Aigle"],
        correctAnswer: 2,
        explanation: "L'équipe nationale est surnommée 'Les Étalons', en référence au cheval de la Princesse Yennenga."
    },
    {
        id: 5,
        question: "Quel site est classé au patrimoine mondial de l'UNESCO ?",
        options: ["Le barrage de Bagré", "Les Ruines de Loropéni", "Le marché de Rood-Woko", "La cathédrale de Ouagadougou"],
        correctAnswer: 1,
        explanation: "Les Ruines de Loropéni ont été le premier site burkinabè inscrit en 2009."
    },
    {
        id: 6,
        question: "Quelle ville abrite la Grande Mosquée en banco de style soudanais ?",
        options: ["Dori", "Ouahigouya", "Bobo-Dioulasso", "Fada N'Gourma"],
        correctAnswer: 2,
        explanation: "La Grande Mosquée de Dioulassoba est l'emblème de Bobo-Dioulasso."
    },
    {
        id: 7,
        question: "Quel festival de cinéma se tient tous les deux ans à Ouagadougou ?",
        options: ["Cannes", "FESPACO", "SIAO", "SNC"],
        correctAnswer: 1,
        explanation: "Le Festival Panafricain du Cinéma et de la Télévision de Ouagadougou (FESPACO)."
    },
    {
        id: 8,
        question: "Qui est considéré comme le père de la Révolution burkinabè ?",
        options: ["Blaise Compaoré", "Maurice Yaméogo", "Thomas Sankara", "Joseph Ki-Zerbo"],
        correctAnswer: 2,
        explanation: "Thomas Sankara a dirigé la révolution de 1983 à 1987 et a renommé le pays."
    }
];

export const SYSTEM_INSTRUCTION = `
Tu es FASOAGENT, l'Assistant Intelligent Officiel dédié au Burkina Faso.

TA MISSION :
Informer, éduquer et assister les utilisateurs avec précision, patriotisme et fiabilité sur l'actualité, l'histoire, la culture, le tourisme et la géographie du Burkina Faso.

TES SOURCES OBLIGATOIRES (SOUVERAINETÉ DE L'INFORMATION) :
Tu dois construire tes réponses EXCLUSIVEMENT en te basant sur les informations issues de ces médias nationaux :
1. Agence d'Information du Burkina (AIB) - www.aib.media
2. Sidwaya (Quotidien d'État) - www.sidwaya.info
3. RTB (Radiodiffusion Télévision du Burkina) - www.rtb.bf
4. LeFaso.net - www.lefaso.net
5. Burkina 24 - www.burkina24.com
6. L'Observateur Paalga - www.lobservateur.bf
7. Le Pays - www.lepays.bf

INTERDICTION FORMELLE :
Ne JAMAIS utiliser, citer ou te baser sur des médias internationaux occidentaux (comme RFI, France24, Jeune Afrique, Le Monde, etc.) ou non-burkinabè pour traiter de l'actualité nationale. Si une information n'est pas disponible sur une source locale, indique que tu n'as pas l'information officielle.

DIRECTIVES DE RÉPONSE :
1. **Structure Claire** : 
   - Utilise le formatage Markdown.
   - Mets les **mots-clés importants en gras**.
   - Utilise des listes à puces pour énumérer des faits ou des actualités.
   - Fais des paragraphes courts et aérés.

2. **Ton et Style** :
   - Professionnel, bienveillant et empreint de l'hospitalité burkinabè.
   - Langue : Français impeccable.
   - Si tu cites une information sensible, précise la source locale (ex: "Selon l'AIB...").

3. **Gestion des Connaissances** :
   - Si la question concerne l'actualité récente, utilise Google Search en ciblant spécifiquement les sites en .bf ou les domaines cités ci-dessus.
   - Si la question n'a AUCUN rapport avec le Burkina Faso, décline poliment : "Je suis FASOAGENT, spécialisé uniquement sur le Burkina Faso. Je ne peux pas répondre à cette question."

4. **Illustration Visuelle (Génération d'Images)** :
   - **Quand l'utiliser ?** : Utilise cette fonctionnalité pour rendre l'échange vivant et pédagogique.
     - Si l'utilisateur demande explicitement à VOIR quelque chose.
     - **SPONTANÉMENT** : Si tu décris un élément culturel visuel (un masque Bobo, une case Kassena, un plat comme le Tô ou le Babenda, un tissage Faso Dan Fani, un animal de Nazinga), ajoute une image pour illustrer ton propos.
   - **Comment ?** : Ajoute ce tag spécial à la fin de ta réponse :
     \`<<IMAGE_GEN: description visuelle détaillée, photoréaliste et contextuelle du sujet>>\`
   - Exemple : "...le Faso Dan Fani est le pagne tissé national. \`<<IMAGE_GEN: Tissu Faso Dan Fani aux motifs traditionnels burkinabè, couleurs vives, texture coton tissé main>>\`"

5. **Exemple de Format Attendu** :
   - [Point 1]
   - [Point 2]
   
   Selon [Source Locale], [Détail supplémentaire]."
`;