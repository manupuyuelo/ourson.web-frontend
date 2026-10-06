// Sources institutionnelles d’Ourson, reprises des référentiels de l’app (ourson-app/references/*/sources).
// Le site ne liste que les autorités de santé ; les études (plus d’une centaine) sont citées dans l’app,
// Profil › Nos sources. Les liens viennent des référentiels, aucun n’est déduit.

export type Source = { citation: string; lien?: string };

export const SOURCES_REPAS: Source[] = [
  {
    citation: "Anses, 2019. Actualisation des repères alimentaires du PNNS pour les enfants de 0 à 3 ans.",
    lien: "https://www.anses.fr/fr/system/files/NUT2017SA0145.pdf",
  },
  {
    citation:
      "Santé publique France, 2023. Nouvelles recommandations pour la diversification alimentaire des enfants de moins de 3 ans : l’essentiel.",
    lien: "https://www.santepubliquefrance.fr/nutrition-et-activite-physique/depliantflyer/nouvelles-recommandations-pour-la-diversification-alimentaire-des-enfants-de-moins-de-3-ans",
  },
  {
    citation:
      "Haut Conseil de la santé publique, 2020. Avis relatif à la révision des repères alimentaires pour les enfants âgés de 0-36 mois et de 3-17 ans.",
    lien: "https://www.hcsp.fr/Explore.cgi/Telecharger?NomFichier=hcspa20200630_rvisidesreprealimepourlesenfan.pdf",
  },
  {
    citation:
      "Organisation mondiale de la santé, 2023. Guideline for complementary feeding of infants and young children 6–23 months of age.",
    lien: "https://www.ncbi.nlm.nih.gov/books/NBK596427/",
  },
  {
    citation: "Anses, 2025. Table de composition nutritionnelle des aliments Ciqual.",
    lien: "https://doi.org/10.57745/RDMHWY",
  },
  {
    citation: "Open Food Facts. Base de données ouverte des aliments.",
    lien: "https://world.openfoodfacts.org",
  },
];

export const SOURCES_SOMMEIL: Source[] = [
  {
    citation:
      "Organisation mondiale de la santé, 2019. Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age.",
    lien: "https://www.ncbi.nlm.nih.gov/books/NBK541173/",
  },
  {
    citation:
      "American Academy of Sleep Medicine, 2016. Recommended amount of sleep for pediatric populations (Paruthi et al., J Clin Sleep Med 12:785).",
    lien: "https://doi.org/10.5664/jcsm.5866",
  },
  {
    citation:
      "American Academy of Pediatrics, 2022. Sleep-related infant deaths: updated 2022 recommendations for reducing infant deaths in the sleep environment (Moon et al., Pediatrics 150:e2022057990).",
    lien: "https://doi.org/10.1542/peds.2022-057990",
  },
  {
    citation:
      "Haute Autorité de santé, 2020. Fiche mémo : prévention des déformations crâniennes positionnelles et mort inattendue du nourrisson.",
    lien: "https://www.has-sante.fr/upload/docs/application/pdf/2020-02/reco276_fiche_memo_deformatons_craniennes_min_cd_2020_02_05_v11_fev.pdf",
  },
  {
    citation: "Santé publique France. 1000 premiers jours — Le sommeil de bébé.",
    lien: "https://www.1000-premiers-jours.fr/fr/le-sommeil-de-bebe",
  },
  {
    citation: "Ministère de la Santé, 2025. Carnet de santé de l’enfant.",
    lien: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000050500762",
  },
];

export const SOURCES_EVEIL: Source[] = [
  {
    citation:
      "Centers for Disease Control and Prevention (CDC), 2022. Learn the Signs. Act Early. Milestone checklists.",
    lien: "https://www.cdc.gov/act-early/milestones/index.html",
  },
  {
    citation:
      "Organisation mondiale de la santé, 2006. WHO Motor Development Study: windows of achievement for six gross motor development milestones.",
    lien: "https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/motor-development-milestones/who-motor-development-study-windows-of-achievement-for-six-gross-motor-development-milestones.pdf",
  },
  {
    citation:
      "Délégation interministérielle à l’autisme et aux troubles du neurodéveloppement, 2024. Détecter les signes d’un développement inhabituel chez les enfants de moins de 7 ans.",
    lien: "https://handicap.gouv.fr/sites/handicap/files/2024-03/Brochure-reperage-precoce-TND-moins-de-7-ans-version-a-remplir.pdf",
  },
];
