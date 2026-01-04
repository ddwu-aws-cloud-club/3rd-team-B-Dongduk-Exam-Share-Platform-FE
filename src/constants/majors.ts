// 동덕여대 대학 및 전공 정보

export interface Major {
  value: string;
  label: string;
}

export interface College {
  name: string;
  majors: Major[];
}

export const COLLEGES: College[] = [
  {
    name: '인문대학',
    majors: [
      { value: 'korean-literature', label: '국어국문학전공' },
      { value: 'korean-history', label: '국사학전공' },
      { value: 'creative-writing', label: '문예창작전공' },
      { value: 'english', label: '영어전공' },
      { value: 'japanese', label: '일어일본학전공' },
      { value: 'chinese', label: '중어중국학전공' },
      { value: 'european-studies', label: '유러피언스터디즈전공' },
      { value: 'korean-culture', label: '한국어문화전공' },
    ],
  },
  {
    name: '사회과학대학',
    majors: [
      { value: 'business-admin', label: '경영학전공' },
      { value: 'international-business', label: '국제경영학전공' },
      { value: 'economics', label: '경제학전공' },
      { value: 'library-info', label: '문헌정보학전공' },
      { value: 'social-welfare', label: '사회복지학전공' },
      { value: 'child-studies', label: '아동학전공' },
    ],
  },
  {
    name: '경영대학',
    majors: [],
  },
  {
    name: '자연정보과학대학',
    majors: [
      { value: 'food-nutrition', label: '식품영양학전공' },
      { value: 'health-management', label: '보건관리학전공' },
      { value: 'applied-chemistry', label: '응용화학전공' },
      { value: 'cosmetics', label: '화장품학전공' },
      { value: 'physical-education', label: '체육학전공' },
      { value: 'computer-science', label: '컴퓨터학전공' },
      { value: 'info-statistics', label: '정보통계학전공' },
    ],
  },
  {
    name: '약학대학',
    majors: [],
  },
  {
    name: '예술대학',
    majors: [
      { value: 'painting', label: '회화전공' },
      { value: 'digital-craft', label: '디지털공예전공' },
      { value: 'curator', label: '큐레이터학전공' },
      { value: 'piano', label: '피아노전공' },
      { value: 'orchestra', label: '관현악전공' },
      { value: 'vocal', label: '성악전공' },
    ],
  },
  {
    name: '디자인이노베이션대학',
    majors: [
      { value: 'fashion-design', label: '패션디자인전공' },
      { value: 'visual-interior-design', label: '시각&실내디자인전공' },
      { value: 'media-design', label: '미디어디자인전공' },
      { value: 'fashion-design-night', label: '패션디자인전공(야)' },
    ],
  },
  {
    name: '공연예술대학',
    majors: [
      { value: 'broadcasting', label: '방송연예전공' },
      { value: 'practical-music', label: '실용음악전공' },
      { value: 'dance', label: '무용전공' },
      { value: 'model', label: '모델전공' },
      { value: 'broadcasting-night', label: '방송연예전공(야)' },
    ],
  },
  {
    name: '문화지식융합대학',
    majors: [
      { value: 'communication-contents', label: '커뮤니케이션콘텐츠전공' },
      { value: 'hci-science', label: 'HCI사이언스전공' },
      { value: 'data-science', label: '데이터사이언스전공' },
      { value: 'culture-arts-management', label: '문화예술경영전공' },
      { value: 'global-mice-fusion', label: '글로벌MICE융합전공' },
      { value: 'entrepreneurship', label: '앙트러프러너십전공' },
    ],
  },
  {
    name: '미래인재융합대학',
    majors: [
      { value: 'tax-accounting', label: '세무회계학전공' },
      { value: 'financial-convergence', label: '금융융합경영학전공' },
    ],
  },
  {
    name: 'ARETE 교양대학',
    majors: [
      { value: 'liberal-arts', label: '자율전공학부' },
      { value: 'general-education', label: '교양과정' },
      { value: 'teaching', label: '교직과정' },
      { value: 'fashion-marketing', label: '패션마케팅연계전공' },
      { value: 'global-multicultural', label: '글로벌다문화학연계전공' },
      { value: 'social-big-data', label: '소셜빅데이터연계전공' },
      { value: 'lifelong-education', label: '평생교육연계전공' },
    ],
  },
];

// 전체 전공 목록을 플랫하게 가져오기
export const getAllMajors = (): Major[] => {
  return COLLEGES.flatMap((college) => college.majors);
};
