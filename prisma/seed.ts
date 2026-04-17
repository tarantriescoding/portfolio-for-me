import { db } from '@/lib/db';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create Profile
  const profile = await db.profile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Alex Chen',
      title: 'B.Tech CSE Student | AI/ML Specialist',
      bio: `I'm a passionate Computer Science Engineering student specializing in Artificial Intelligence and Machine Learning. Currently in my final year, I love building intelligent systems that solve real-world problems.\n\nMy journey in tech started with competitive programming and has evolved into deep learning, NLP, and computer vision. I believe in the power of AI to transform industries and improve lives.\n\nWhen I'm not coding, you'll find me reading research papers, contributing to open source, or exploring the latest in generative AI.`,
      avatarUrl: '',
      resumeUrl: '',
      github: 'https://github.com/alexchen',
      linkedin: 'https://linkedin.com/in/alexchen',
      twitter: 'https://twitter.com/alexchen',
      email: 'alex.chen@example.com',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      website: '',
    },
  });
  console.log('✅ Profile created');

  // Create Skills
  const skills = [
    // Programming
    { name: 'Python', category: 'Programming', level: 95, icon: '🐍', order: 1 },
    { name: 'JavaScript', category: 'Programming', level: 88, icon: '⚡', order: 2 },
    { name: 'TypeScript', category: 'Programming', level: 82, icon: '🔷', order: 3 },
    { name: 'C++', category: 'Programming', level: 78, icon: '⚙️', order: 4 },
    { name: 'Java', category: 'Programming', level: 75, icon: '☕', order: 5 },
    { name: 'SQL', category: 'Programming', level: 80, icon: '🗃️', order: 6 },
    // AI/ML
    { name: 'TensorFlow', category: 'AI/ML', level: 90, icon: '🧠', order: 1 },
    { name: 'PyTorch', category: 'AI/ML', level: 92, icon: '🔥', order: 2 },
    { name: 'Scikit-learn', category: 'AI/ML', level: 88, icon: '📊', order: 3 },
    { name: 'OpenCV', category: 'AI/ML', level: 85, icon: '👁️', order: 4 },
    { name: 'Hugging Face', category: 'AI/ML', level: 87, icon: '🤗', order: 5 },
    { name: 'LangChain', category: 'AI/ML', level: 80, icon: '🔗', order: 6 },
    { name: 'NLP', category: 'AI/ML', level: 86, icon: '💬', order: 7 },
    { name: 'Computer Vision', category: 'AI/ML', level: 84, icon: '🖼️', order: 8 },
    // Frameworks
    { name: 'Next.js', category: 'Frameworks', level: 85, icon: '▲', order: 1 },
    { name: 'React', category: 'Frameworks', level: 88, icon: '⚛️', order: 2 },
    { name: 'FastAPI', category: 'Frameworks', level: 82, icon: '🚀', order: 3 },
    { name: 'Django', category: 'Frameworks', level: 78, icon: '🎸', order: 4 },
    { name: 'Flask', category: 'Frameworks', level: 75, icon: '🍶', order: 5 },
    // Tools
    { name: 'Git', category: 'Tools', level: 90, icon: '📦', order: 1 },
    { name: 'Docker', category: 'Tools', level: 78, icon: '🐳', order: 2 },
    { name: 'AWS', category: 'Tools', level: 72, icon: '☁️', order: 3 },
    { name: 'Linux', category: 'Tools', level: 82, icon: '🐧', order: 4 },
    { name: 'VS Code', category: 'Tools', level: 95, icon: '💻', order: 5 },
    // Databases
    { name: 'PostgreSQL', category: 'Databases', level: 80, icon: '🐘', order: 1 },
    { name: 'MongoDB', category: 'Databases', level: 78, icon: '🍃', order: 2 },
    { name: 'Redis', category: 'Databases', level: 70, icon: '🔴', order: 3 },
    { name: 'Pinecone', category: 'Databases', level: 75, icon: '🌲', order: 4 },
  ];

  for (const skill of skills) {
    await db.skill.create({ data: skill });
  }
  console.log(`✅ ${skills.length} skills created`);

  // Create Projects
  const projects = [
    {
      title: 'AI-Powered Code Reviewer',
      description: 'An intelligent code review tool that uses GPT-4 and custom ML models to analyze pull requests, suggest improvements, and detect potential bugs with 94% accuracy.',
      imageUrl: '',
      githubUrl: 'https://github.com/alexchen/ai-code-reviewer',
      liveUrl: '',
      techStack: JSON.stringify(['Python', 'OpenAI', 'FastAPI', 'React', 'TypeScript', 'Docker']),
      featured: true,
      order: 1,
    },
    {
      title: 'Real-Time Object Detection System',
      description: 'A high-performance real-time object detection system using YOLOv8 with custom-trained models for industrial quality control, achieving 30 FPS on edge devices.',
      imageUrl: '',
      githubUrl: 'https://github.com/alexchen/realtime-detection',
      liveUrl: '',
      techStack: JSON.stringify(['Python', 'PyTorch', 'OpenCV', 'YOLOv8', 'TensorRT', 'C++']),
      featured: true,
      order: 2,
    },
    {
      title: 'Neural Style Transfer App',
      description: 'A web application that applies artistic style transfer to images using deep neural networks. Supports real-time preview and multiple art styles.',
      imageUrl: '',
      githubUrl: 'https://github.com/alexchen/style-transfer',
      liveUrl: 'https://style-transfer.demo.com',
      techStack: JSON.stringify(['Python', 'TensorFlow', 'Next.js', 'React', 'WebGL', 'Docker']),
      featured: true,
      order: 3,
    },
    {
      title: 'Smart Chatbot with RAG',
      description: 'An enterprise-grade chatbot using Retrieval-Augmented Generation (RAG) with vector embeddings, providing accurate answers from custom knowledge bases.',
      imageUrl: '',
      githubUrl: 'https://github.com/alexchen/rag-chatbot',
      liveUrl: '',
      techStack: JSON.stringify(['Python', 'LangChain', 'OpenAI', 'Pinecone', 'FastAPI', 'Next.js']),
      featured: false,
      order: 4,
    },
    {
      title: 'Sentiment Analysis Dashboard',
      description: 'A real-time social media sentiment analysis dashboard that processes tweets and news articles, displaying sentiment trends with interactive charts.',
      imageUrl: '',
      githubUrl: 'https://github.com/alexchen/sentiment-dash',
      liveUrl: 'https://sentiment.demo.com',
      techStack: JSON.stringify(['Python', 'Scikit-learn', 'NLTK', 'React', 'D3.js', 'Flask']),
      featured: false,
      order: 5,
    },
    {
      title: 'Gesture Recognition System',
      description: 'A hand gesture recognition system for touchless device control using MediaPipe and custom LSTM networks, supporting 20+ gestures with 97% accuracy.',
      imageUrl: '',
      githubUrl: 'https://github.com/alexchen/gesture-recognition',
      liveUrl: '',
      techStack: JSON.stringify(['Python', 'TensorFlow', 'MediaPipe', 'OpenCV', 'Keras', 'NumPy']),
      featured: false,
      order: 6,
    },
  ];

  for (const project of projects) {
    await db.project.create({ data: project });
  }
  console.log(`✅ ${projects.length} projects created`);

  // Create Education
  const educationEntries = [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'Indian Institute of Technology',
      field: 'Specialization in Artificial Intelligence & Machine Learning',
      startYear: '2021',
      endYear: '2025',
      grade: 'CGPA: 8.9/10',
      description: 'Core coursework in Machine Learning, Deep Learning, Computer Vision, NLP, Data Structures & Algorithms. Active member of the AI Research Lab and Google Developer Student Club.',
      logoUrl: '',
      order: 1,
    },
    {
      degree: 'Higher Secondary (XII)',
      institution: 'Delhi Public School',
      field: 'Science Stream (PCM with Computer Science)',
      startYear: '2019',
      endYear: '2021',
      grade: '96.4%',
      description: 'Scored highest in Computer Science and Mathematics. Won the National Science Olympiad and participated in the Indian Computing Olympiad.',
      logoUrl: '',
      order: 2,
    },
  ];

  for (const edu of educationEntries) {
    await db.education.create({ data: edu });
  }
  console.log(`✅ ${educationEntries.length} education entries created`);

  // Create Experience
  const experienceEntries = [
    {
      company: 'Google Summer of Code',
      position: 'ML Engineer Intern',
      startDate: '2024-05',
      endDate: '',
      current: true,
      description: 'Working on improving the TensorFlow Model Garden repository. Implementing state-of-the-art vision transformer architectures and optimizing training pipelines for large-scale distributed computing.',
      techStack: JSON.stringify(['Python', 'TensorFlow', 'JAX', 'Kubernetes', 'Docker', 'Git']),
      logoUrl: '',
      order: 1,
    },
    {
      company: 'AI Startup Inc.',
      position: 'Machine Learning Intern',
      startDate: '2023-06',
      endDate: '2023-12',
      current: false,
      description: 'Developed and deployed production ML models for document classification and information extraction. Built data pipelines processing 100K+ documents daily with 96% accuracy.',
      techStack: JSON.stringify(['Python', 'PyTorch', 'FastAPI', 'Docker', 'PostgreSQL', 'AWS']),
      logoUrl: '',
      order: 2,
    },
    {
      company: 'University AI Research Lab',
      position: 'Research Assistant',
      startDate: '2022-08',
      endDate: '2023-05',
      current: false,
      description: 'Assisted in research on multi-modal learning for healthcare applications. Published a paper on medical image segmentation using attention-based architectures at IEEE ICML workshop.',
      techStack: JSON.stringify(['Python', 'PyTorch', 'OpenCV', 'NumPy', 'Matplotlib', 'LaTeX']),
      logoUrl: '',
      order: 3,
    },
  ];

  for (const exp of experienceEntries) {
    await db.experience.create({ data: exp });
  }
  console.log(`✅ ${experienceEntries.length} experience entries created`);

  // Create Blog Posts
  const blogPosts = [
    {
      title: 'Building a RAG System from Scratch: A Complete Guide',
      slug: 'building-rag-system-from-scratch',
      content: '# Building a RAG System from Scratch\n\nRetrieval-Augmented Generation (RAG) has become one of the most popular patterns for building AI applications. In this post, we\'ll build a complete RAG system from scratch...',
      excerpt: 'Learn how to build a production-ready RAG system with vector databases, embeddings, and LLMs for accurate knowledge retrieval.',
      coverImage: '',
      published: true,
    },
    {
      title: 'Fine-tuning YOLOv8 for Custom Object Detection',
      slug: 'fine-tuning-yolov8-custom-detection',
      content: '# Fine-tuning YOLOv8\n\nObject detection is a fundamental computer vision task. YOLOv8 provides excellent out-of-the-box performance, but fine-tuning on your custom dataset can dramatically improve results...',
      excerpt: 'A step-by-step tutorial on fine-tuning YOLOv8 for custom object detection tasks with practical tips and tricks.',
      coverImage: '',
      published: true,
    },
    {
      title: 'Understanding Transformer Attention Mechanisms',
      slug: 'understanding-transformer-attention',
      content: '# Understanding Attention\n\nThe attention mechanism is the core innovation behind transformers. Let\'s dive deep into how self-attention, multi-head attention, and cross-attention work...',
      excerpt: 'Deep dive into transformer attention mechanisms with visual explanations and PyTorch implementations.',
      coverImage: '',
      published: true,
    },
    {
      title: 'Deploying ML Models with FastAPI and Docker',
      slug: 'deploying-ml-models-fastapi-docker',
      content: '# ML Model Deployment\n\nDeploying machine learning models to production requires careful consideration of latency, scalability, and reliability...',
      excerpt: 'Production-ready ML deployment guide using FastAPI with Docker containers and best practices.',
      coverImage: '',
      published: false,
    },
  ];

  for (const post of blogPosts) {
    await db.blogPost.create({ data: post });
  }
  console.log(`✅ ${blogPosts.length} blog posts created`);

  // Create Contact Messages
  const messages = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      subject: 'Collaboration on AI Project',
      message: 'Hi! I came across your portfolio and was really impressed by your work on the RAG chatbot. I\'m working on a similar project at my company and would love to collaborate. Are you open to discussing potential partnerships?',
      isRead: false,
    },
    {
      name: 'Prof. Raj Kumar',
      email: 'raj.kumar@university.edu',
      subject: 'Research Opportunity',
      message: 'Hello Alex, I\'m a professor at the CS department and I\'m looking for talented students to join my NLP research group. Your projects show great promise. Would you be interested in a research assistant position for the upcoming semester?',
      isRead: true,
    },
    {
      name: 'David Chen',
      email: 'david@startup.io',
      subject: 'Job Opportunity - ML Engineer',
      message: 'Hi Alex, we\'re a seed-stage startup building AI-powered developer tools. Your GitHub projects and blog posts are exactly what we\'re looking for. We\'d love to interview you for our ML Engineer position. The role involves building LLM-based code generation systems.',
      isRead: false,
    },
  ];

  for (const msg of messages) {
    await db.contactMessage.create({ data: msg });
  }
  console.log(`✅ ${messages.length} contact messages created`);

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
