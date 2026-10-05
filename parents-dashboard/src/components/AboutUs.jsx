import React, { useState } from 'react';
import campusImg from '../assets/campus.jpg';

const coursesData = {
  ai: {
    title: 'Artificial Intelligence',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    shortDesc: 'Explore machine learning, neural networks, and intelligent systems.',
    longDesc: 'Artificial Intelligence is transforming the global tech landscape. This specialization course focuses on the mathematical foundations and programming methodologies used to build smart systems. You will gain hands-on experience in building predictive models, automating decisions, and understanding cognitive systems.',
    topics: ['Machine Learning Foundations', 'Deep Learning & Neural Networks', 'Natural Language Processing', 'Computer Vision & Image Processing', 'Robotics & Control Systems', 'AI Ethics & Algorithmic Bias'],
    careers: ['AI Research Engineer', 'Machine Learning Developer', 'Data Science Specialist', 'Automation Consultant']
  },
  fullstack: {
    title: 'Full Stack Development',
    icon: '💻',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
    shortDesc: 'Build responsive web applications from database to frontend UI.',
    longDesc: 'Become a versatile software engineer by mastering both frontend interface design and backend database systems. You will learn modern JavaScript architectures, state management, RESTful services creation, and database integration.',
    topics: ['Modern HTML5, CSS3, CSS Grid', 'JavaScript (ES6+) & DOM', 'React.js & Client State Management', 'Node.js & Express Framework', 'MongoDB & Relational Databases', 'API Security & Deployment'],
    careers: ['Full Stack Developer', 'Frontend Engineer', 'Backend Systems Developer', 'Software Architect']
  },
  bigdata: {
    title: 'Big Data',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    shortDesc: 'Process and analyze massive datasets using distributed systems.',
    longDesc: 'Big Data technologies allow organizations to store, process, and analyze huge volumes of data in real-time. This course covers the architectures and programming tools that power major cloud-scale data warehouses.',
    topics: ['Hadoop Ecosystem & HDFS', 'Apache Spark Processing Engine', 'MapReduce Programming Model', 'NoSQL Databases (Cassandra/HBase)', 'Data Warehousing & ETL Pipelines', 'Stream Processing (Kafka)'],
    careers: ['Big Data Engineer', 'Data Solutions Architect', 'Data Warehouse Engineer', 'Database Specialist']
  },
  datascience: {
    title: 'Data Science with Python',
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    shortDesc: 'Analyze and extract actionable insights from data using Python.',
    longDesc: 'Data Science combines statistical theory, coding, and business intelligence to solve complex business issues. This course leverages Python’s premier library ecosystem to transform raw data into predictive algorithms and dashboards.',
    topics: ['NumPy & Pandas for Data Manipulation', 'Matplotlib & Seaborn Data Visualization', 'Statistical Inference & Hypothesis Testing', 'Supervised & Unsupervised Learning', 'Time Series Analysis', 'Model Evaluation & Validation'],
    careers: ['Data Scientist', 'Data Analyst', 'Quantitative Business Analyst', 'Analytics Consultant']
  },
  crypto: {
    title: 'Cryptography',
    icon: '🔑',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    shortDesc: 'Master encryption algorithms and secure communications protocols.',
    longDesc: 'Cryptography is the cornerstone of information security in the digital age. This course introduces you to the concepts of cryptography, including digital signatures, security protocols, block ciphers, and cryptanalysis techniques.',
    topics: ['Symmetric Key Encryption (AES, DES)', 'Asymmetric Key Systems (RSA, ECC)', 'Cryptographic Hash Functions (SHA)', 'Public Key Infrastructure (PKI)', 'Network Security Protocols (SSL/TLS)', 'Introduction to Blockchain & Cryptography'],
    careers: ['Security Consultant', 'Cryptographer', 'Cybersecurity Specialist', 'Cryptographic Engineer']
  },
  cloud: {
    title: 'Cloud Computing',
    icon: '☁️',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    shortDesc: 'Architect and deploy scalable systems on AWS, Azure, and GCP.',
    longDesc: 'Cloud computing powers modern software infrastructure. In this course, you will learn the core concepts of virtualization, serverless computing, deployment pipelines, and building resilient systems on global public clouds.',
    topics: ['Cloud Architecture Principles', 'AWS, Azure, and GCP Overview', 'Containerization with Docker', 'Orchestration with Kubernetes', 'CI/CD & DevOps Automation', 'Serverless Architecture (Lambda)'],
    careers: ['Cloud Architect', 'DevOps Engineer', 'Cloud Infrastructure Administrator', 'Solutions Developer']
  },
  cybersecurity: {
    title: 'Cyber Security',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)',
    shortDesc: 'Secure networks, detect threats, and perform penetration tests.',
    longDesc: 'Defend organizational assets against digital attacks. This course provides comprehensive training on network defense mechanisms, malware analysis, incident handling, and ethical hacking protocols to keep applications secure.',
    topics: ['Network Defense & Firewalls', 'Ethical Hacking & Vulnerability Assessment', 'Penetration Testing Frameworks', 'Incident Response & Risk Management', 'Malware Analysis & Reverse Engineering', 'Compliance, Audits, & Governance'],
    careers: ['Cybersecurity Analyst', 'Information Security Officer', 'Ethical Hacker', 'SOC Analyst']
  },
  algorithms: {
    title: 'Design and Analysis of Algorithms',
    icon: '🧮',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
    shortDesc: 'Optimize code logic and solve complex computational problems.',
    longDesc: 'Algorithms are the heart of computer science. This course focuses on critical problem-solving design methodologies, analysis of time and space complexity, and advanced data structures to solve computational problems at scale.',
    topics: ['Divide and Conquer Methodology', 'Greedy Methodologies', 'Dynamic Programming Optimization', 'Graph Algorithms & Traversal (DFS/BFS)', 'NP-Completeness & Approximation', 'Complexity Notation (Big-O/Theta/Omega)'],
    careers: ['Algorithm Engineer', 'Backend Engineer', 'Systems Researcher', 'Core Libraries Developer']
  },
  webdev: {
    title: 'Web Development',
    icon: '🌐',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    shortDesc: 'Create accessible, fast, and responsive user experiences on the web.',
    longDesc: 'Discover the foundations of browser environments. This course details semantic layouts, stylesheets, accessibility standards, responsive techniques, and modern standards for creating accessible web designs.',
    topics: ['Semantic HTML5 Structure', 'CSS Layouts (Grid & Flexbox)', 'Responsive Web Design & Media Queries', 'Web Accessibility Standards (WCAG)', 'Modern JavaScript & Async Control Flow', 'Browser Performance & SEO Best Practices'],
    careers: ['Frontend Web Developer', 'UI/UX Developer', 'Web Producer', 'WordPress Specialist']
  },
  java: {
    title: 'Advanced Java',
    icon: '☕',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #db2777 100%)',
    shortDesc: 'Deep dive into enterprise Java frameworks and multithreaded apps.',
    longDesc: 'Java is a premier language for building scalable enterprise applications. This specialization course teaches you multithreaded concurrency, database connections, servlet architectures, and the Spring Boot framework.',
    topics: ['Java Collections & Generics', 'Multithreading & Concurrency Control', 'JDBC & Hibernate ORM Database Linking', 'Java Servlets & Server-Side Programming', 'Spring Framework & MVC architecture', 'Spring Boot Microservices & REST API creation'],
    careers: ['Enterprise Java Architect', 'Senior Java Backend Engineer', 'Spring Developer', 'Systems Software Developer']
  }
};

const syllabusData = {
  1: [
    { type: 'DSC 1', name: 'Data Structures using C', lab: 'Yes' },
    { type: 'DSC 2', name: 'Database Management System', lab: 'Yes' },
    { type: 'DSC 3', name: 'Discrete Mathematical Structures', lab: 'No' },
    { type: 'SEC 1', name: 'Constitutional Values – I', lab: 'No' },
    { type: 'AECC 1', name: 'English', lab: 'No' },
    { type: 'AECC 2', name: 'Kannada / Hindi', lab: 'No' }
  ],
  2: [
    { type: 'DSC 1', name: 'Java Programming', lab: 'Yes' },
    { type: 'DSC 2', name: 'Python Programming', lab: 'Yes' },
    { type: 'DSC 3', name: 'Operating System', lab: 'No' },
    { type: 'SEC 1', name: 'Constitutional Values – I', lab: 'No' },
    { type: 'AECC 1', name: 'English', lab: 'No' },
    { type: 'AECC 2', name: 'Kannada / Hindi', lab: 'No' }
  ],
  3: [
    { type: 'DSC 1', name: 'Java Programming (Enterprise)', lab: 'Yes' },
    { type: 'DSC 2', name: 'Cloud Computing', lab: 'Yes' },
    { type: 'DSC 3', name: 'Design and Analysis of Algorithm', lab: 'No' },
    { type: 'DSC 4', name: 'Computer Networks', lab: 'Yes' },
    { type: 'SBC', name: 'UNIX Lab', lab: 'Yes' },
    { type: 'VBC', name: 'NSS/NCC, Cultural, Physical Education', lab: 'No' },
    { type: 'AECC 1', name: 'Professional Skill', lab: 'No' }
  ],
  4: [
    { type: 'DSC 1', name: 'J2EE with Frameworks', lab: 'Yes' },
    { type: 'DSC 2', name: 'Data Science using Python', lab: 'Yes' },
    { type: 'DSC 3', name: 'Computer Networks', lab: 'No' },
    { type: 'DSC 4', name: 'Software Engineering & Testing', lab: 'Yes' },
    { type: 'AECC 1', name: 'Personality Development & Communication', lab: 'No' },
    { type: 'AECC 2', name: 'Quantitative Aptitude & Logical Reasoning', lab: 'No' },
    { type: 'AECC 3', name: 'MTLR', lab: 'No' }
  ],
  5: [
    { type: 'DSC 1', name: 'Android Programming', lab: 'Yes' },
    { type: 'DSC 2', name: 'Software Testing and Automation', lab: 'Yes' },
    { type: 'DSC 3', name: 'Cyber Security', lab: 'No' },
    { type: 'DSC 4', name: 'Software Engineering', lab: 'No' },
    { type: 'DSE', name: 'Data Mining', lab: 'No' },
    { type: 'SEC', name: 'Full Stack Development', lab: 'No' },
    { type: 'VOC', name: 'Digital Marketing', lab: 'No' }
  ],
  6: [
    { type: 'DSC 1', name: 'Artificial Intelligence & Machine Learning', lab: 'Yes' },
    { type: 'DSC 2', name: 'Big Data using Hadoop', lab: 'Yes' },
    { type: 'DSE', name: 'Cryptography / Digital Image Processing', lab: 'No' },
    { type: 'SEC', name: 'Internship / Project Work', lab: 'Yes' },
    { type: 'VOC', name: 'Object Oriented System Development', lab: 'No' }
  ]
};

const seminarsData = {
  odd: [
    { topic: 'Cloud Computing', sem: 'I', resource: 'Mr. Gauri Nandan', company: 'AWS Trainer', hours: '3 Hrs/Div', attendance: '91.38%', feedback: '89.10%' },
    { topic: 'Firebase & Web App Development', sem: 'I', resource: 'Ms. Snehita Reddy', company: 'COO, MasterSolis Infotech', hours: '3 Hrs/Div', attendance: '91.66%', feedback: '73.00%' },
    { topic: 'Programming Logics', sem: 'I', resource: 'Ms. Snehita Reddy', company: 'COO, MasterSolis Infotech', hours: '3 Hrs/Div', attendance: '90.00%', feedback: '100%' },
    { topic: 'Internet of Things', sem: 'I', resource: 'Mr. Mahesh Vastrad', company: 'Founder & MD Agamya Tech', hours: '3 Hrs/Div', attendance: '94.16%', feedback: '79.2%' },
    { topic: 'Web Development & API Integration', sem: 'III', resource: 'Mr. Anvesh Reddy', company: 'CIO, Mastersolis InfoTech', hours: '3 Hrs/Div', attendance: '80.55%', feedback: '96.6%' },
    { topic: 'Various Cloud Platforms', sem: 'III', resource: 'Mr. Anvesh Reddy', company: 'CIO, MasterSolis Infotech', hours: '3 Hrs/Div', attendance: '94.16%', feedback: '75.0%' },
    { topic: 'Big Data and its Tools', sem: 'III', resource: 'Mr. Anvesh Reddy', company: 'CIO, MasterSolis Infotech', hours: '3 Hrs/Div', attendance: '91.66%', feedback: '55.6%' },
    { topic: 'Mobile Application Development', sem: 'III', resource: 'Mr. Siddharth Yalmali', company: 'Freelance Android Developer', hours: '3 Hrs/Div', attendance: '79.16%', feedback: '83.3%' },
    { topic: 'Advanced AI', sem: 'V', resource: 'Miss Snehitha Reddy', company: 'COE, Mastersolis InfoTech', hours: '3 Hrs/Div', attendance: '81.63%', feedback: '92.1%' },
    { topic: 'Natural Language Processing', sem: 'V', resource: 'Mr. Anvesh Reddy', company: 'CIO, MasterSolis Infotech', hours: '3 Hrs/Div', attendance: '90.00%', feedback: '93.3%' },
    { topic: 'Prompt Engineering', sem: 'V', resource: 'Mrs. Hifza Shaikh', company: 'Technical Trainer', hours: '3 Hrs/Div', attendance: '90.00%', feedback: '93.3%' },
    { topic: 'Generative AI', sem: 'V', resource: 'Mrs. Hifza Shaikh', company: 'Technical Trainer', hours: '3 Hrs/Div', attendance: '81.66%', feedback: '100%' }
  ],
  even: [
    { topic: 'LinkedIn Profile Building', sem: 'II', resource: 'Ms. Tejasvini Pesi', company: 'Founder SuccessR HR Tech', hours: '3 Hrs/Div', attendance: '91.66%', feedback: '77.8%' },
    { topic: 'Role of Artificial Intelligence', sem: 'II', resource: 'Mr. Khinchi Pratyaksh', company: 'Full Stack Dev Freelancer', hours: '3 Hrs/Div', attendance: '92.00%', feedback: '88.3%' }
  ]
};

const workshopsData = {
  odd: [
    { title: 'Introduction to Front-end', sem: 'I', resource: 'Mr. Lohitha Kumar A Bhattangi', company: 'Corporate Trainer', duration: '8 Hrs/Day (2 Days/Div)', attendance: '86.66%', feedback: '97%' },
    { title: 'Data Analytics with Power BI', sem: 'III', resource: 'Mr. Abdullah Hasan', company: 'Trainer, First Source Solutions', duration: '8 Hrs/Day (2 Days/Div)', attendance: '91.66%', feedback: '100%' },
    { title: 'Node.js', sem: 'V', resource: 'Mr. Prashant N Astekar', company: 'Founder & CEO Amba Software', duration: '8 Hrs/Day (2 Days/Div)', attendance: '89.11%', feedback: '98.5%' }
  ],
  even: [
    { title: 'Data Analytics using Power BI', sem: 'II', resource: 'Mr. Abdullah Hasan & Mrs. Hifza Shaikh', company: 'Trainers, First Source Solutions', duration: '8 & 2 Days/Div', attendance: '95.55%', feedback: '96.9%' },
    { title: 'Flask & Django Framework', sem: 'IV', resource: 'Anvesh Reddy & Snehita Reddy', company: 'Mastersolis InfoTech', duration: '8 & 2 Days/Div', attendance: '93.33%', feedback: '85.6%' },
    { title: 'Data Analytics using R', sem: 'VI', resource: 'Ajay S, Suraj M & Puneet Tiwari', company: 'Corporate Trainers', duration: '8 & 2 Days/Div', attendance: '95.23%', feedback: '90.9%' }
  ]
};

const certificationsData = {
  odd: [
    { title: 'UI/UX', sem: 'I', resource: 'Mr. Partha Subhash', company: 'Product Designer Freelancer', duration: '7 Hrs/Day (6 Days/Div)', attendance: '95.27%', feedback: '99.4%' },
    { title: 'AI and ML Using Python', sem: 'III', resource: 'Dr. T. Rajesh & Team', company: 'Skill Trainers IEP & MyBean Infotech', duration: '7 Hrs/Day (6 Days/Div)', attendance: '87.50%', feedback: '96.9%' },
    { title: 'Cyber Security', sem: 'V', resource: 'Mr. Hari Mypala & Mr. Mukesh Pyda', company: 'Cyber Security Researchers', duration: '7 Hrs/Day (6 Days/Div)', attendance: '83.67%', feedback: '96.8%' }
  ],
  even: [
    { title: 'Front End Development', sem: 'II', resource: 'Puneet S, Attar Shaikh & Team', company: 'Corporate Trainers', duration: '6 Hrs/Day (7 Days/Div)', attendance: '100%', feedback: '88.3%' },
    { title: 'Full Stack Development', sem: 'IV', resource: 'Mr. Rahul P & Mr. Hari B', company: 'Senior Engineers & Specialists', duration: '6 Hrs/Day (7 Days/Div)', attendance: '100%', feedback: '95.2%' },
    { title: 'AI ML Foundations & Practical AI', sem: 'VI', resource: 'Sakthi A Sivam & Rajeeshkumar KS', company: 'Senior Software Engineers', duration: '6 Hrs/Day (7 Days/Div)', attendance: '100%', feedback: '88.3%' }
  ]
};

const AboutUs = ({ onStartAdmission }) => {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState('academics');
  const [activeSemTab, setActiveSemTab] = useState(1);
  const [activeProgramSubTab, setActiveProgramSubTab] = useState('seminars');
  const [activeSemestersFilter, setActiveSemestersFilter] = useState('odd');

  const fourCs = [
    { name: 'Competent', icon: '🏆', desc: 'Equipped with the technical and professional skills required to excel in the IT industry.' },
    { name: 'Committed', icon: '🤝', desc: 'Dedicated to ethical practices, lifelong learning, and professional excellence.' },
    { name: 'Creative', icon: '💡', desc: 'Encouraging innovation, out-of-the-box thinking, and modern problem solving.' },
    { name: 'Compassionate', icon: '❤️', desc: 'Fostering empathy, societal value, and positive community contribution.' }
  ];

  const whyChooseUsData = [
    { title: 'Be Acquainted', desc: 'We keep students engaged in new activities and skill development.' },
    { title: 'Growth', desc: 'We grow together is our motto, which help us stand out of the box.' },
    { title: 'Build Rapport', desc: 'Help students to learn cooperate skills and ethics.' },
    { title: 'Leverage Skills', desc: 'The ability to explore and sustain the talents.' },
    { title: 'Dive Deep', desc: 'We provide in depth knowledge which helps student industry ready.' },
    { title: 'Assess & Evaluate', desc: 'Continuous evaluation and assessment improves performance of students.' }
  ];

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If a course is selected, render the detail view
  if (selectedCourseId && coursesData[selectedCourseId]) {
    const course = coursesData[selectedCourseId];
    return (
      <div className="card animate-scale-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem' }}>
        {/* Back Button */}
        <button 
          onClick={() => setSelectedCourseId(null)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: 'white',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateX(-3px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          ← Back to About Us
        </button>

        {/* Course Header */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '16px',
            background: course.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            color: 'white',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            {course.icon}
          </div>
          <div>
            <span style={{ color: 'var(--color-primary-hover)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Specialization Course
            </span>
            <h2 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '800', margin: '0.1rem 0 0 0' }}>
              {course.title}
            </h2>
          </div>
        </div>

        {/* Detailed Description */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem', marginBottom: '2.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.15rem', marginBottom: '0.75rem' }}>Course Overview</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.7', margin: 0 }}>
            {course.longDesc}
          </p>
        </div>

        {/* Curriculum & Careers Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Syllabus */}
          <div>
            <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              📚 Core Topics
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {course.topics.map((t, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.92rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-primary-hover)' }}>✓</span> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h3 style={{ color: 'white', fontWeight: '700', fontSize: '1.2rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              💼 Career Pathways
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {course.careers.map((c, idx) => (
                <span 
                  key={idx} 
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: 'var(--color-primary-hover)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
            
            {/* Quick call to action inside details */}
            <div style={{ marginTop: '2.5rem', background: 'radial-gradient(circle at top left, rgba(99,102,241,0.1) 0%, transparent 80%)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
              <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>Ready to specialize?</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Join KLE's BCA to pursue the {course.title} pathway.
              </p>
              <button 
                onClick={onStartAdmission}
                className="btn btn-primary"
                style={{ width: '100%', borderRadius: '8px', padding: '0.6rem', fontSize: '0.85rem' }}
              >
                Apply for Admission
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem' }}>
      <h2 style={{ 
        fontSize: '2.2rem', 
        fontWeight: '800', 
        textAlign: 'center', 
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        About KLE's BCA P. C. Jabin Science College Hubballi
      </h2>

      {/* Main Info Columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2.5rem',
        alignItems: 'start',
        marginBottom: '3rem'
      }}>
        {/* Left Column: Campus Photo Card */}
        <div className="about-campus-card" style={{ 
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ position: 'relative', width: '100%', paddingTop: '80%', overflow: 'hidden' }}>
            <img 
              src={campusImg} 
              alt="K.L.E. Society's P. C. Jabin Science College Campus" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              padding: '1.25rem 1rem 0.8rem 1rem',
              color: 'white',
              textAlign: 'left'
            }}>
              <span style={{ 
                background: 'var(--color-primary-hover)', 
                color: 'white', 
                fontSize: '0.7rem', 
                fontWeight: '700', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Autonomous • CPE Phase III • Grade A NAAC
              </span>
              <h4 style={{ color: 'white', fontWeight: '800', margin: '0.4rem 0 0 0', fontSize: '1.05rem', lineHeight: '1.3' }}>
                K.L.E. Society's P. C. Jabin Science College
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', margin: '0.2rem 0 0 0' }}>
                Vidyanagar, Hubballi
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Text content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
            <strong>K.L.E.S’s B.C.A</strong> was started as a department of Computer Science in 1999. Now it has come up with its own wings in P. C. Jabin Science College Campus with more facility for the students relating to Computer and the department has highly qualified faculties and has excellent hardware and software resources.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
            In K.L.E.S’s Bachelor of Computer Application, we look at education differently. For us, education does not lie in the qualification of knowledge, it lies in the quality of knowledge that helps form the character of students.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
            Affiliated to Karnataka University, Dharwad but does not follow its syllabus or curriculum. Academic independence, which gives it the freedom to revise the syllabus with time and follow a schedule which is more suitable for the curriculum.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
            Exams are conducted by the institute itself and are in accordance with what is being taught during the session. Degrees finally awarded by the affiliated University which generally carries a lot of reputation.
          </p>
        </div>
      </div>

      {/* 4 C's Section */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', marginBottom: '3.5rem' }}>
        <h3 style={{ 
          fontSize: '1.4rem', 
          fontWeight: '700', 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '1.75rem',
          letterSpacing: '0.02em'
        }}>
          Our Core Pillars: The 4 C's
        </h3>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.25rem'
        }}>
          {fourCs.map((c, idx) => (
            <div 
              key={idx} 
              className="four-cs-card"
              style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '1.25rem',
                textAlign: 'center'
              }}
            >
              <span className="pillar-icon" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{c.icon}</span>
              <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '0.4rem', fontSize: '1rem' }}>{c.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{ 
            background: 'rgba(99, 102, 241, 0.12)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            color: 'var(--color-primary-hover)', 
            padding: '0.35rem 1rem', 
            borderRadius: '50px', 
            fontSize: '0.75rem', 
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Why Choose Us
          </span>
        </div>
        <h3 style={{ 
          fontSize: '1.6rem', 
          fontWeight: '800', 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '0.75rem'
        }}>
          Why Choose Us?
        </h3>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.9rem', 
          textAlign: 'center', 
          maxWidth: '650px', 
          margin: '0 auto 2.5rem auto',
          lineHeight: '1.6'
        }}>
          We build and enhance the talents in each student, further making them Committed, Compassion, Respectable in their career.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.25rem'
        }}>
          {whyChooseUsData.map((item, idx) => (
            <div 
              key={idx} 
              className="why-choose-card"
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                padding: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div className="check-circle" style={{
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--color-primary-hover)',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                ✓
              </div>
              <div>
                <h4 style={{ color: 'white', fontWeight: '700', fontSize: '1rem', marginBottom: '0.4rem', marginTop: '0.2rem' }}>
                  {item.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialization Courses Section */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '0.5rem',
          letterSpacing: '0.02em'
        }}>
          Specialization Courses
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          Select a course below to explore its curriculum, core topics, and professional career pathways.
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem'
        }}>
          {Object.keys(coursesData).map((key) => {
            const course = coursesData[key];
            const isHovered = hoveredCourseId === key;
            return (
              <div 
                key={key} 
                className="course-hover-card"
                onClick={() => handleCourseClick(key)}
                onMouseEnter={() => setHoveredCourseId(key)}
                onMouseLeave={() => setHoveredCourseId(null)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: isHovered ? '1px solid var(--color-primary)' : '1px solid var(--border-color)', 
                  borderRadius: '14px', 
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: isHovered ? '0 10px 25px -5px rgba(99, 102, 241, 0.15)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="course-icon-badge" style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: course.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}>
                    {course.icon}
                  </div>
                  <h4 style={{ color: 'white', fontWeight: '750', fontSize: '1.05rem', margin: 0, flex: 1, lineHeight: '1.3' }}>
                    {course.title}
                  </h4>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, flex: 1 }}>
                  {course.shortDesc}
                </p>
                <div style={{ 
                  color: isHovered ? 'var(--color-primary-hover)' : 'var(--text-muted)', 
                  fontSize: '0.8rem', 
                  fontWeight: '600', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  marginTop: '0.5rem',
                  transition: 'color 0.2s ease'
                }}>
                  Explore Course Details <span className="course-arrow" style={{ transition: 'transform 0.2s ease', transform: isHovered ? 'translateX(3px)' : 'translateX(0)' }}>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Highlights Dashboard */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', marginTop: '3.5rem' }}>
        <h3 style={{ 
          fontSize: '1.6rem', 
          fontWeight: '850', 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '0.5rem',
          letterSpacing: '0.01em'
        }}>
          College Highlights & Portals
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '2.5rem' }}>
          Explore academics, admissions, training, fests, seminars, and sports highlights.
        </p>

        {/* Dashboard Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Dashboard Left Sidebar Navigation */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}>
            {[
              { id: 'academics', label: '📖 Academics & Syllabus' },
              { id: 'admissions', label: '🎓 Admissions Eligibility' },
              { id: 'placements', label: '💼 Training & Placements' },
              { id: 'seminars_workshops', label: '🔬 Seminars & Workshops' },
              { id: 'events_sports', label: '🏆 Events & Student Corner' }
            ].map((tab) => (
              <button
                key={tab.id}
                className="dashboard-tab-btn"
                onClick={() => setActiveDashboardTab(tab.id)}
                style={{
                  background: activeDashboardTab === tab.id ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: activeDashboardTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  color: activeDashboardTab === tab.id ? 'white' : 'var(--text-muted)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'block',
                  width: '100%'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Active Content Window */}
          <div style={{
            gridColumn: 'span 2',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '2rem',
            minHeight: '420px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {activeDashboardTab === 'academics' && (
              <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>
                  Curriculum & Semester Syllabus
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                  Our curriculum is updated in alignment with Karnataka University Dharwad's guidelines, revised regularly to reflect standard software engineering paradigms. Select a semester:
                </p>
                {/* Sem Sub-tab Selector */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setActiveSemTab(num)}
                      style={{
                        background: activeSemTab === num ? 'var(--color-primary-hover)' : 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid',
                        borderColor: activeSemTab === num ? 'var(--color-primary)' : 'var(--border-color)',
                        color: 'white',
                        padding: '0.5rem 1.1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Sem {num}
                    </button>
                  ))}
                </div>
                {/* Syllabus Table */}
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '0.9rem', color: 'white', fontWeight: '700' }}>Subject Type</th>
                        <th style={{ padding: '0.9rem', color: 'white', fontWeight: '700' }}>Course Syllabus Name</th>
                        <th style={{ padding: '0.9rem', color: 'white', fontWeight: '700', textAlign: 'center' }}>Lab Component</th>
                      </tr>
                    </thead>
                    <tbody>
                      {syllabusData[activeSemTab].map((sub, idx) => (
                        <tr key={idx} className="syllabus-table-row" style={{ borderBottom: idx < syllabusData[activeSemTab].length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <td style={{ padding: '0.85rem', color: 'var(--color-primary-hover)', fontWeight: '700' }}>{sub.type}</td>
                          <td style={{ padding: '0.85rem', color: 'white' }}>{sub.name}</td>
                          <td style={{ padding: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            <span style={{
                              background: sub.lab === 'Yes' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                              color: sub.lab === 'Yes' ? '#10b981' : 'var(--text-muted)',

                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700'
                            }}>
                              {sub.lab}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeDashboardTab === 'admissions' && (
              <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>
                  Eligibility & Admission Criteria
                </h4>
                <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h5 style={{ color: 'white', margin: '0 0 0.5rem 0', fontWeight: '700', fontSize: '1rem' }}>Qualifying Exams</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    Any student who has passed **PUC-II** (Pre-University Course Class 12) or equivalent examination in **Science** or **Commerce** streams is eligible for direct admission to the Bachelor of Computer Application (BCA) program.
                  </p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h5 style={{ color: 'white', margin: '0 0 0.5rem 0', fontWeight: '700', fontSize: '1rem' }}>Application Instructions</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                    Admissions are managed through the centralized **Unified University College Management System (UUCMS)** portal of Karnataka. Click the button below to register online and choose KLE's BCA PC Jabin College.
                  </p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href="https://uucms.karnataka.gov.in/Login/OnlineStudentRegistrationForm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '700'
                    }}
                  >
                    Apply on UUCMS Portal ↗
                  </a>
                </div>
              </div>
            )}

            {activeDashboardTab === 'placements' && (
              <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>
                  Training & Placement Cell
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                  KLE BCA's dedicated Placement Cell approaches prospective employers, registers MoUs with leading companies, and conducts extensive pre-placement training modules to enhance student employability.
                </p>
                
                {/* Placement Objectives */}
                <h5 style={{ color: 'white', fontWeight: '700', fontSize: '1rem', margin: '0.5rem 0 0 0' }}>Core Objectives</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {[
                    'Arranging campus interview opportunities',
                    'Pre-Placement training modules & mock interviews',
                    'Signing MOUs with leading technology brands',
                    'Organizing industrial visits & training workshops',
                    'Enhancing student personality & communication profiles'
                  ].map((obj, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ color: '#10b981' }}>✔</span> {obj}
                    </div>
                  ))}
                </div>

                {/* Recruiting Partners */}
                <h5 style={{ color: 'white', fontWeight: '700', fontSize: '1rem', margin: '0.5rem 0 0 0' }}>Recruiting Partners</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    'TCS', 'Infosys', 'Capgemini', 'Wipro', 'Accenture', 'Deloitte', 'Cognizant', 
                    'Tech Mahindra', 'Mphasis', 'NTT Data', 'Salesforce', 'LTI Mindtree', 'HP', 
                    'CSS Corp', 'AWS Cloud', 'Atos', 'Akrithi Solutions'
                  ].map((comp, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-color)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeDashboardTab === 'seminars_workshops' && (
              <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>
                  Seminars, Workshops & Certifications
                </h4>
                
                {/* Sub Tab: Program Types */}
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  {[
                    { id: 'seminars', label: '📢 Seminars' },
                    { id: 'workshops', label: '🛠️ Workshops' },
                    { id: 'certifications', label: '📜 Certifications' }
                  ].map(prog => (
                    <button
                      key={prog.id}
                      onClick={() => setActiveProgramSubTab(prog.id)}
                      style={{
                        background: activeProgramSubTab === prog.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                        border: 'none',
                        color: activeProgramSubTab === prog.id ? 'white' : 'var(--text-muted)',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {prog.label}
                    </button>
                  ))}
                </div>

                {/* Filter Semester Tab */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => setActiveSemestersFilter('odd')}
                    style={{
                      background: activeSemestersFilter === 'odd' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid',
                      borderColor: activeSemestersFilter === 'odd' ? 'var(--color-primary)' : 'var(--border-color)',
                      color: 'white',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    Odd Semester (2024-2025)
                  </button>
                  <button
                    onClick={() => setActiveSemestersFilter('even')}
                    style={{
                      background: activeSemestersFilter === 'even' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid',
                      borderColor: activeSemestersFilter === 'even' ? 'var(--color-primary)' : 'var(--border-color)',
                      color: 'white',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    Even Semester (2024-2025)
                  </button>
                </div>

                {/* Seminars List Content */}
                {activeProgramSubTab === 'seminars' && (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Topic</th>
                          <th style={{ padding: '0.75rem', color: 'white', textAlign: 'center' }}>Sem</th>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Resource Person</th>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seminarsData[activeSemestersFilter].map((s, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < seminarsData[activeSemestersFilter].length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <td style={{ padding: '0.75rem', color: 'white', fontWeight: '600' }}>{s.topic}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--color-primary-hover)', textAlign: 'center', fontWeight: '700' }}>{s.sem}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                              <div>{s.resource}</div>
                              <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{s.company}</div>
                            </td>
                            <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: '700' }}>{s.feedback}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Workshops List Content */}
                {activeProgramSubTab === 'workshops' && (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Workshop Title</th>
                          <th style={{ padding: '0.75rem', color: 'white', textAlign: 'center' }}>Sem</th>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Resource Person & Organization</th>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workshopsData[activeSemestersFilter].map((w, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < workshopsData[activeSemestersFilter].length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <td style={{ padding: '0.75rem', color: 'white', fontWeight: '600' }}>{w.title}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--color-primary-hover)', textAlign: 'center', fontWeight: '700' }}>{w.sem}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                              <div>{w.resource}</div>
                              <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{w.company}</div>
                            </td>
                            <td style={{ padding: '0.75rem', color: 'white' }}>{w.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Certifications List Content */}
                {activeProgramSubTab === 'certifications' && (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Course Title</th>
                          <th style={{ padding: '0.75rem', color: 'white', textAlign: 'center' }}>Sem</th>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Resource details</th>
                          <th style={{ padding: '0.75rem', color: 'white' }}>Avg Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificationsData[activeSemestersFilter].map((c, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < certificationsData[activeSemestersFilter].length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <td style={{ padding: '0.75rem', color: 'white', fontWeight: '600' }}>{c.title}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--color-primary-hover)', textAlign: 'center', fontWeight: '700' }}>{c.sem}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                              <div>{c.resource}</div>
                              <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{c.company}</div>
                            </td>
                            <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: '700' }}>{c.feedback}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeDashboardTab === 'events_sports' && (
              <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h4 style={{ color: 'white', fontWeight: '800', fontSize: '1.3rem', margin: 0 }}>
                  Cultural Fests & Sports Events
                </h4>
                
                {/* Events Banners Carousel */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {[
                    { name: 'Aakruti 2026', desc: 'Orientation Programme', date: '11 July 2026', time: '10:00am to 12:00pm', location: 'PC Jabin College Campus', banner: 'https://www.klebcahubli.in/wp-content/uploads/2026/07/Final-Banners-7-scaled.png' },
                    { name: 'Acumen 2026', desc: 'Intercollegiate Cultural Fest', date: '27 Feb 2026', time: '10:00am to 5:00pm', location: 'College Quadrangle', banner: 'https://www.klebcahubli.in/wp-content/uploads/2026/07/Final-Kakakrithi-2026-9-scaled.png' },
                    { name: 'Kalakriti 2026', desc: 'Intracollegiate Cultural Fest', date: '25 Feb 2026', time: '10:00am to 4:00pm', location: 'Main Seminar Hall', banner: 'https://www.klebcahubli.in/wp-content/uploads/2026/07/Final-scaled.png' },
                    { name: 'I2E2', desc: 'In-House Science & IT Fest', date: '13 Oct 2025', time: '2:00pm to 5:00pm', location: 'IT Labs Wing', banner: 'https://www.klebcahubli.in/wp-content/uploads/2025/10/IMG-20251009-WA0001.jpg' },
                    { name: 'Investiture Ceremony', desc: 'Student Council Pinning Ceremony', date: '08 Oct 2025', time: '10:00am to 12:30pm', location: 'Auditorium', banner: 'https://www.klebcahubli.in/wp-content/uploads/2025/11/Screenshot-2025-11-05-114434.png' },
                    { name: 'Dandiya Night', desc: 'Navratri Social & Cultural Evening', date: '27 Sept 2025', time: '5:00pm to 8:00pm', location: 'Open Grounds', banner: 'https://www.klebcahubli.in/wp-content/uploads/2025/10/Dandiya-Banner-.png' },
                    { name: 'Annual Sports Day 2025', desc: 'College Athletic Meets & Tournaments', date: '31 Oct 2025', time: '9:00am onwards', location: 'College Playgrounds', banner: 'https://www.klebcahubli.in/wp-content/uploads/photo-gallery/IMG20251031121007.jpg' }
                  ].map((evt, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.25s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ height: '140px', background: 'rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={evt.banner}
                          alt={evt.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(99, 102, 241, 0.85)',
                          color: 'white',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          {evt.date}
                        </div>
                      </div>
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                        <h5 style={{ color: 'white', margin: 0, fontWeight: '750', fontSize: '0.98rem' }}>{evt.name}</h5>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: '1.4', flex: 1 }}>{evt.desc}</p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-hover)', display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem' }}>
                          <span>🕒 {evt.time}</span>
                          <span>📍 {evt.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
