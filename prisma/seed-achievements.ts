import { db } from '@/lib/db';

async function seed() {
  console.log('🌱 Seeding achievements...');

  const achievements = [
    {
      title: 'Smart India Hackathon 2024 – Winner',
      description: 'Won the national-level hackathon with an AI-powered agricultural yield prediction system. Competed among 50,000+ participants.',
      date: 'Dec 2024',
      category: 'hackathon',
      icon: '🚀',
      credentialUrl: 'https://sih.gov.in',
      order: 1,
    },
    {
      title: 'Google Summer of Code 2024 – Selected',
      description: 'Selected as a GSoC contributor for TensorFlow Model Garden. Working on optimizing vision transformer architectures.',
      date: 'May 2024',
      category: 'award',
      icon: '🏆',
      credentialUrl: 'https://summerofcode.withgoogle.com',
      order: 2,
    },
    {
      title: 'AWS Certified Machine Learning – Specialty',
      description: 'Earned the AWS ML Specialty certification demonstrating expertise in building, training, tuning, and deploying ML models on AWS.',
      date: 'Mar 2024',
      category: 'certification',
      icon: '📜',
      credentialUrl: '',
      order: 3,
    },
    {
      title: 'Published Paper at IEEE ICML Workshop',
      description: 'Co-authored "Attention-Based Medical Image Segmentation with Limited Annotations" accepted at IEEE ICML Workshop 2023.',
      date: 'Jul 2023',
      category: 'publication',
      icon: '📄',
      credentialUrl: 'https://doi.ieee.org',
      order: 4,
    },
    {
      title: 'Kaggle Expert – Top 1% Globally',
      description: 'Achieved Kaggle Expert status with 5 gold and 3 silver medals in NLP and Computer Vision competitions.',
      date: 'Jan 2024',
      category: 'competition',
      icon: '⚔️',
      credentialUrl: 'https://kaggle.com',
      order: 5,
    },
    {
      title: 'Open Source – 500+ GitHub Contributions',
      description: 'Active open source contributor to PyTorch, Hugging Face Transformers, and LangChain. Maintained multiple projects with 1000+ stars.',
      date: '2023',
      category: 'open_source',
      icon: '💻',
      credentialUrl: 'https://github.com',
      order: 6,
    },
    {
      title: 'National Science Olympiad – Gold Medal',
      description: 'Won gold medal in the National Science Olympiad (NCO) during higher secondary education.',
      date: '2020',
      category: 'competition',
      icon: '🥇',
      credentialUrl: '',
      order: 7,
    },
    {
      title: 'Merit Scholarship – Academic Excellence',
      description: 'Received full merit scholarship for maintaining top 5% CGPA throughout the B.Tech program.',
      date: '2021–2025',
      category: 'scholarship',
      icon: '🎓',
      credentialUrl: '',
      order: 8,
    },
    {
      title: 'Google Developer Student Club – Lead',
      description: 'Led the university GDSC chapter, organized 20+ workshops on ML/AI, and mentored 200+ students in their tech journey.',
      date: '2022–2024',
      category: 'award',
      icon: '🌟',
      credentialUrl: '',
      order: 9,
    },
  ];

  for (const achievement of achievements) {
    await db.achievement.create({ data: achievement });
  }
  console.log(`✅ ${achievements.length} achievements created`);
  console.log('🎉 Seeding complete!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
