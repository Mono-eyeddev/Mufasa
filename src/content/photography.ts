
export type PhotographyImage = {
  src: string;
  alt: string;
};

export type PhotographyCollection = {
  slug: string;
  title: string;
  cover: PhotographyImage;
  images: PhotographyImage[];
};

export type PhotographyCategory = {
  slug: string;
  title: string;
  cover?: PhotographyImage;
  collections: PhotographyCollection[];
};

export const photographyCategories: PhotographyCategory[] = [
{
  slug: "weddings",
  title: "Weddings",
  collections: [
    {
      slug: "Cliff-and-Alice",
      title: "Cliff & Alice",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391313/DSC04798_result.webp",
        alt: "Wedding celebration",
      },
      images: [
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391336/DSC05450_result.webp",
          alt: "Wedding celebration",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391355/DSC05666_result.webp",
          alt: "Wedding couple portrait",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391334/DSC05449_result.webp",
          alt: "Wedding ceremony",
        },
          {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391320/DSC04837_result.webp",
          alt: "Wedding ceremony",
        },
             {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391309/DSC04778_result.webp",
          alt: "Wedding ceremony",
        },
             {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391324/DSC05030_result.webp",
          alt: "Wedding ceremony",
        },
             {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391347/DSC05600_result.webp",
          alt: "Wedding ceremony",
        },
             {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794391333/DSC05419_result.webp",
          alt: "Wedding ceremony",
        },
      ],
    },
  ],
},
  {
    slug: "graduations",
    title: "Graduations",
    collections: [
         {
      slug: "Faith",
      title: "Faith",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316450/_MG_1231_result.webp",
        alt: "Wedding celebration",
      },
      images: [
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316457/_MG_1200_result.webp",
          alt: "Wedding celebration",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload//q_auto/f_auto/v1794316457/_MG_1218_result.webp",
          alt: "Wedding couple portrait",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316448/_MG_1244_result.webp",
          alt: "Wedding ceremony",
        },
          {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316448/_MG_1213_result.webp",
          alt: "Wedding ceremony",
        },
      ],
    },

          {
      slug: "Tunda",
      title: "Tunda",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316432/_MG_9269_result.webp",
        alt: "Wedding celebration",
      },
      images: [
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316446/_MG_9351_result.webp",
          alt: "Wedding celebration",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316446/_MG_9344_result.webp",
          alt: "Wedding couple portrait",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316446/_MG_9335_result.webp",
          alt: "Wedding ceremony",
        },
          {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316437/_MG_9283_result.webp",
          alt: "Wedding ceremony",
        },
      ],
    },

     {
      slug: "Mumo",
      title: "Mumo",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316447/IMG_8862_result.webp",
        alt: "Wedding celebration",
      },
      images: [
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316453/IMG_8871_result.webp",
          alt: "Wedding celebration",
        }, 
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316453/IMG_8870_result.webp",
          alt: "Wedding couple portrait",
        },
        {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316471/IMG_8825_result.webp",
          alt: "Wedding ceremony",
        },
          {
          src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316451/IMG_8861_result.webp",
          alt: "Wedding ceremony",
        },
      ],
    },
    ],
  },



  {
    slug: "Concepts",
    title: "Concepts",
    collections: [
       {
      slug: "Tina",
      title: "Tina",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316857/_MG_7557_result.webp",
        alt: "Wedding celebration",
      },
    images: [
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316868/_MG_7472_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316857/_MG_7539_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316850/_MG_7338_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316850/_MG_7340_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316868/_MG_7513_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316866/_MG_7424_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316866/_MG_7463_result.webp",
    alt: "Wedding celebration",
  },
   {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316854/_MG_7499_result.webp",
    alt: "Wedding celebration",
  },
],
    },
           {
      slug: "eve-and-glo",
      title: "Eve&Glo",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316855/IMG_2431_result.webp",
        alt: "Wedding celebration",
      },
    images: [
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316868/_MG_7472_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316857/_MG_7539_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316850/_MG_7338_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316850/_MG_7340_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316868/_MG_7513_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316866/_MG_7424_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316866/_MG_7463_result.webp",
    alt: "Wedding celebration",
  },
   {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316854/_MG_7499_result.webp",
    alt: "Wedding celebration",
  },
],
    },
     {
      slug: "okumu",
      title: "okumu",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316885/_MG_1051_result.webp",
        alt: "Wedding celebration",
      },
  images: [
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316895/_MG_0950_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316886/_MG_1086_1_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316863/_MG_1005_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316887/_MG_1105_1_result.webp",
    alt: "Wedding celebration",
  },
],
    },
    ],
  },
  {
    slug: "Events",
    title: "Events",
    collections: [
     {
      slug: "Yaba",
      title: "Yaba",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316400/_MG_0780_result.webp",
        alt: "Wedding celebration",
      },
     images: [
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316412/_MG_0606_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316404/_MG_0781_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316394/_MG_0751_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316344/_MG_0807_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316321/_MG_0712_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316321/_MG_0740_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316320/_MG_0803_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316354/_MG_0742_result.webp",
    alt: "Wedding celebration",
  },
],
    },
     {
      slug: "TG",
      title: "TG",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316350/REY02379_result.webp",
        alt: "Wedding celebration",
      },
    images: [
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316347/9W7A6342_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316342/REY02375_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316341/9W7A6505_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316336/9W7A6450_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316333/9W7A6319_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316335/9W7A6379_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316324/9W7A6359_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316333/9W7A6275_result.webp",
    alt: "Wedding celebration",
  },
],
    },

     {
      slug: "SeamlessHits",
      title: "SeamlessHits",
      cover: {
        src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316217/_MG_1522_result.webp",
        alt: "Wedding celebration",
      },
   images: [
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316205/_MG_1466_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316205/_MG_1451_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316203/_MG_1370_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316197/_MG_1317_result.webp",
    alt: "Wedding ceremony",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316197/_MG_1319_result.webp",
    alt: "Wedding celebration",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316212/_MG_1487_result.webp",
    alt: "Wedding couple portrait",
  },
  {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316201/_MG_1380_result.webp",
    alt: "Wedding ceremony",
  },
    {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316213/_MG_1497_result.webp",
    alt: "Wedding ceremony",
  },
      {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316247/IMG_8674_result.webp",
    alt: "Wedding ceremony",
  },
      {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316239/IMG_8636_result.webp",
    alt: "Wedding ceremony",
  },
      {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316232/IMG_8604_result.webp",
    alt: "Wedding ceremony",
  },
      {
    src: "https://res.cloudinary.com/iqflnx83/image/upload/q_auto/f_auto/v1794316227/IMG_8572_result.webp",
    alt: "Wedding ceremony",
  },
],
     },
    ],
  },
];
