// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Gallery from './Gallery';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  
  // Refs for animation targets
  const heroRef = useRef(null);
  const heroContentRef = useRef(null);
  const aboutRef = useRef(null);
  const programsRef = useRef(null);
  const galleryRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const navRef = useRef(null);
  const programCardsRef = useRef([]);
  const statItemsRef = useRef([]);
  const floatingElementsRef = useRef([]);

  // School stats
  const schoolStats = [
    { number: '25+', label: 'Years of Excellence', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { number: '500+', label: 'Happy Students', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { number: '40+', label: 'Expert Teachers', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { number: '100%', label: 'Pass Rate', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  // Programs offered
  const programs = [
    {
      title: 'Early Years (Ages 3-5)',
      description: 'Nurturing young minds through play-based learning, creativity, and social development in a safe environment.',
      ageGroup: 'Nursery & Kindergarten',
      image: '🏫',
      color: 'from-pink-500 to-rose-500',
      features: ['Play-Based Learning', 'Creative Arts', 'Social Skills']
    },
    {
      title: 'Primary School (Ages 6-11)',
      description: 'Building strong foundations in literacy, numeracy, and character development with modern teaching methods.',
      ageGroup: 'Grades 1-6',
      image: '📚',
      color: 'from-blue-500 to-cyan-500',
      features: ['Core Academics', 'STEM Education', 'Character Building']
    },
    {
      title: 'After-School Programs',
      description: 'Enrichment activities including sports, arts, music, and homework support for working parents.',
      ageGroup: 'All Grades',
      image: '⚽',
      color: 'from-purple-500 to-indigo-500',
      features: ['Sports', 'Music & Arts', 'Homework Help']
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Mrs. Adebayo',
      role: 'Parent of Primary 3 Student',
      content: 'IG-Besthood Academy has transformed my child\'s love for learning. The teachers are incredibly dedicated and the facilities are top-notch.',
      rating: 5,
      image: '👩'
    },
    {
      name: 'Mr. Okonkwo',
      role: 'Parent of Kindergarten Student',
      content: 'The caring environment and excellent curriculum have helped my daughter grow confidently. Best decision we made for her education.',
      rating: 5,
      image: '👨'
    },
    {
      name: 'Dr. Williams',
      role: 'Education Consultant',
      content: 'One of the finest elementary schools I\'ve encountered. Their holistic approach to education is truly commendable.',
      rating: 5,
      image: '👩‍⚕️'
    }
  ];

  // Gallery images data for the new Gallery component
  const galleryImages = [
    {
      id: 1,
      title: 'Modern Classrooms',
      category: 'Classroom',
      description: 'Bright, spacious classrooms designed for interactive learning',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🏛️'
    },
    {
      id: 2,
      title: 'Safe Play Area',
      category: 'Playground',
      description: 'Secure outdoor space with modern playground equipment',
      image: 'https://images.unsplash.com/photo-1587653263896-f5a5c888c4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🛝'
    },
    {
      id: 3,
      title: 'Reading Corner',
      category: 'Library',
      description: 'Cozy library with diverse collection of children\'s books',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '📖'
    },
    {
      id: 4,
      title: 'Sports Facilities',
      category: 'Sports',
      description: 'Multi-purpose court for physical education and sports',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '⚽'
    },
    {
      id: 5,
      title: 'Science Lab',
      category: 'Science Lab',
      description: 'Hands-on learning with age-appropriate science equipment',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🔬'
    },
    {
      id: 6,
      title: 'Creative Space',
      category: 'Art Room',
      description: 'Inspiring space for artistic expression and creativity',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🎨'
    },
    {
      id: 7,
      title: 'Music Room',
      category: 'Music',
      description: 'Instruments and space for musical exploration',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🎵'
    },
    {
      id: 8,
      title: 'Computer Lab',
      category: 'Technology',
      description: 'Modern computers for digital literacy',
      image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '💻'
    },
    {
      id: 9,
      title: 'Cafeteria',
      category: 'Dining',
      description: 'Nutritious meals in a friendly environment',
      image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🍎'
    },
    {
      id: 10,
      title: 'Gardening Area',
      category: 'Outdoor Learning',
      description: 'Hands-on nature and gardening activities',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🌱'
    },
    {
      id: 11,
      title: 'Assembly Hall',
      category: 'Events',
      description: 'Space for gatherings, performances, and events',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🎪'
    },
    {
      id: 12,
      title: 'Nurse\'s Office',
      category: 'Health',
      description: 'Well-equipped facility for student healthcare',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🏥'
    }
  ];

  useEffect(() => {
    // Smooth scroll initialization
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initial animations on mount
    const ctx = gsap.context(() => {
      // Navbar animation
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Hero section animations with timeline
      const heroTimeline = gsap.timeline();
      
      heroTimeline
        .from(heroContentRef.current.querySelector('.hero-badge'), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        .from(heroContentRef.current.querySelector('h1'), {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        }, "-=0.4")
        .from(heroContentRef.current.querySelector('p'), {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.6")
        .from(heroContentRef.current.querySelectorAll('a'), {
          scale: 0,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }, "-=0.4");

      // Floating elements animation
      floatingElementsRef.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            y: "+=30",
            x: index % 2 === 0 ? "+=20" : "-=20",
            rotation: index % 2 === 0 ? 5 : -5,
            duration: 4 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      });

      // Stats counter animation
      statItemsRef.current.forEach((stat, index) => {
        if (stat) {
          gsap.from(stat, {
            scrollTrigger: {
              trigger: stat,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            scale: 0.5,
            opacity: 0,
            duration: 1,
            delay: index * 0.2,
            ease: "back.out(1.2)"
          });
        }
      });

      // Program cards staggered animation
      programCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });

          // Hover animations
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.05,
              y: -15,
              boxShadow: "0 30px 60px rgba(0,0,0,0.15)",
              duration: 0.4,
              ease: "power2.out"
            });
            gsap.to(card.querySelector('.program-icon'), {
              scale: 1.2,
              rotate: 5,
              duration: 0.3,
              ease: "power2.out"
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              y: 0,
              boxShadow: "0 10px 30px -5px rgba(0,0,0,0.1)",
              duration: 0.4,
              ease: "power2.out"
            });
            gsap.to(card.querySelector('.program-icon'), {
              scale: 1,
              rotate: 0,
              duration: 0.3,
              ease: "power2.out"
            });
          });
        }
      });

      // About section animation
      gsap.from(aboutRef.current, {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Testimonials animation
      gsap.from(testimonialsRef.current, {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // CTA section animation
      gsap.from(ctaRef.current, {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Parallax effect for hero
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5
        },
        y: 150,
        scale: 1.1
      });

    });

    return () => {
      ctx.revert();
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-yellow-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div ref={el => floatingElementsRef.current[0] = el} className="absolute top-20 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div ref={el => floatingElementsRef.current[1] = el} className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div ref={el => floatingElementsRef.current[2] = el} className="absolute bottom-20 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="shrink-0 flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-orange-400 to-yellow-400 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                    IG
                  </div>
                </div>
                <div className="ml-3">
                  <span className="block text-xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    IG-Besthood
                  </span>
                  <span className="block text-xs text-gray-500">Academy</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all"></span>
              </a>
              <a href="#programs" className="text-gray-700 hover:text-orange-600 transition-colors relative group">
                Programs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all"></span>
              </a>
              <a href="#gallery" className="text-gray-700 hover:text-orange-600 transition-colors relative group">
                Gallery
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all"></span>
              </a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all"></span>
              </a>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <Link
                  to={`/${user?.role?.toLowerCase()}/dashboard`}
                  className="relative group overflow-hidden rounded-full bg-linear-to-r from-orange-600 to-yellow-600 text-white px-6 py-2.5 transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <span className="relative z-10">Dashboard</span>
                </Link>
              ) : (
                <div className="space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-orange-600 px-4 py-2 rounded-full text-sm font-medium relative group"
                  >
                    Sign In
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all"></span>
                  </Link>
                  <Link
                    to="/register"
                    className="relative overflow-hidden rounded-full bg-linear-to-r from-orange-600 to-yellow-600 text-white px-6 py-2.5 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span className="relative z-10">Enroll Now</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>
        <div ref={heroContentRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <span className="hero-badge inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-6">
              🌟 Where Young Minds Blossom
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-linear-to-r from-orange-600 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                IG-Besthood Academy
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Nurturing curious minds, building character, and creating a foundation for lifelong learning 
              in a safe, caring, and stimulating environment for children aged 3-11 years.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="group relative overflow-hidden rounded-full bg-linear-to-r from-orange-600 to-yellow-600 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    <span className="relative z-10">Schedule a Visit</span>
                  </Link>
                  <Link
                    to="/about"
                    className="group relative overflow-hidden rounded-full border-2 border-orange-600 text-orange-600 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <span className="relative z-10">Explore Programs</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {schoolStats.map((stat, index) => (
            <div
              key={index}
              ref={el => statItemsRef.current[index] = el}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="w-16 h-16 mx-auto bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Tour/Achievements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">Virtual Tour</span>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Take a Peek Inside Our School</h3>
              <p className="text-gray-600 mb-6">Experience our vibrant learning environment through this interactive glimpse into daily life at IG-Besthood Academy.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">15+</div>
                  <div className="text-sm text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-3xl font-bold text-yellow-600">95%</div>
                  <div className="text-sm text-gray-600">Parent Satisfaction</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">1:8</div>
                  <div className="text-sm text-gray-600">Teacher-Student Ratio</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600">Extracurriculars</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-linear-to-br from-orange-400 to-yellow-400 rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🎥</div>
                    <p className="text-white font-semibold">Watch Our School Video</p>
                  </div>
                </div>
              </div>
              {/* Play button overlay */}
              <button className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-12 border-t-transparent border-l-20 border-l-orange-600 border-b-12 border-b-transparent ml-1"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" ref={aboutRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-w-4 aspect-h-3 bg-linear-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                <span className="text-9xl">🏛️</span>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold">Our Beautiful Campus</h3>
                <p className="text-sm opacity-90">Where learning comes alive</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-200 rounded-full -z-10 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-200 rounded-full -z-10 animate-pulse animation-delay-1000"></div>
          </div>
          <div>
            <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">About Us</span>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Building Bright Futures Since 1998
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At IG-Besthood Academy, we believe every child is unique and deserves an education that 
              nurtures their individual talents while building strong academic foundations. Our child-centered 
              approach combines modern teaching methods with traditional values.
            </p>
            <div className="space-y-4">
              {['Qualified and caring teachers', 'Small class sizes for individual attention', 'Modern facilities and resources', 'Safe and secure environment'].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div id="programs" ref={programsRef} className="bg-linear-to-r from-orange-50 to-yellow-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">Our Programs</span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Learning Programs for Every Stage
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Age-appropriate curriculum designed to inspire and challenge young learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                ref={el => programCardsRef.current[index] = el}
                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className={`absolute inset-0 bg-linear-to-br ${program.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-8">
                  <div className="program-icon text-7xl mb-6 transform transition-transform">
                    {program.image}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{program.title}</h3>
                  <p className="text-orange-600 font-semibold mb-4">{program.ageGroup}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>
                  <div className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" ref={galleryRef}>
        <Gallery images={galleryImages} />
      </div>

      {/* Meet Our Teachers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">Our Team</span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Dedicated Teachers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate educators committed to nurturing every child's potential
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Mrs. Grace Adebayo', role: 'Head Teacher', experience: '15 years', emoji: '👩‍🏫', specialty: 'Early Childhood' },
            { name: 'Mr. John Okonkwo', role: 'Primary Coordinator', experience: '12 years', emoji: '👨‍🏫', specialty: 'STEM Education' },
            { name: 'Ms. Sarah Williams', role: 'Kindergarten Lead', experience: '10 years', emoji: '👩‍🎨', specialty: 'Creative Arts' },
            { name: 'Mr. David Okafor', role: 'PE Instructor', experience: '8 years', emoji: '🏃‍♂️', specialty: 'Sports Development' }
          ].map((teacher, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-yellow-600 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-6 text-center shadow-xl hover:shadow-2xl transition-all">
                <div className="w-24 h-24 mx-auto bg-linear-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {teacher.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
                <p className="text-orange-600 font-semibold mb-2">{teacher.role}</p>
                <p className="text-sm text-gray-500 mb-2">{teacher.experience} experience</p>
                <p className="text-xs text-gray-400 bg-gray-50 rounded-full px-3 py-1 inline-block">
                  {teacher.specialty}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="bg-linear-to-r from-orange-600 to-yellow-600 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What Parents Say</h2>
            <p className="text-xl text-orange-100">Trusted by families in our community</p>
          </div>

          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === activeTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute top-0 left-0 right-0'
                }`}
              >
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-5xl bg-linear-to-br from-orange-100 to-yellow-100 rounded-full w-20 h-20 flex items-center justify-center">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-orange-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg italic mb-4">"{testimonial.content}"</p>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-white w-6' : 'bg-orange-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* News & Announcements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">Stay Updated</span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest News & Announcements</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Keep up with exciting events and important updates from our school
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              date: 'Mar 15, 2024',
              title: 'Annual Sports Day',
              excerpt: 'Join us for a day of fun, games, and athletic activities.',
              emoji: '🏆',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              date: 'Mar 20, 2024',
              title: 'Parent-Teacher Conference',
              excerpt: 'Schedule your meeting to discuss your child\'s progress.',
              emoji: '📅',
              color: 'from-purple-500 to-pink-500'
            },
            {
              date: 'Apr 1, 2024',
              title: 'Summer Enrollment Opens',
              excerpt: 'Limited slots available for our summer programs.',
              emoji: '☀️',
              color: 'from-yellow-500 to-orange-500'
            }
          ].map((news, index) => (
            <div key={index} className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              <div className={`h-2 bg-linear-to-r ${news.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{news.date}</span>
                  <span className="text-3xl">{news.emoji}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                  {news.title}
                </h3>
                <p className="text-gray-600 mb-4">{news.excerpt}</p>
                <a href="#" className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700">
                  Read More
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-semibold text-sm tracking-wider uppercase mb-2 block">FAQ</span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about IG-Besthood Academy</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What are your school hours?',
              a: 'Our school day runs from 8:00 AM to 3:00 PM, Monday through Friday. We offer early drop-off from 7:30 AM and after-school care until 5:30 PM.'
            },
            {
              q: 'Do you provide meals and snacks?',
              a: 'Yes, we provide nutritious breakfast, lunch, and afternoon snacks prepared in our kitchen. We accommodate dietary restrictions and allergies.'
            },
            {
              q: 'What is your teacher-to-student ratio?',
              a: 'We maintain small class sizes with ratios of 1:8 in Early Years and 1:12 in Primary grades, ensuring individual attention for every child.'
            },
            {
              q: 'How do you handle discipline?',
              a: 'We use positive reinforcement and restorative practices, teaching children to make good choices while maintaining a nurturing environment.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-orange-600 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 text-gray-600 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div id="contact" ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-600 via-yellow-500 to-green-500 p-16 text-center">
          {/* Animated particles */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 7}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Begin Your Child's Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us for a tour of our facilities and meet our dedicated teachers. 
              Limited spaces available for the upcoming academic year.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-block overflow-hidden rounded-full bg-white text-orange-600 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    <span className="relative z-10">Enroll Now</span>
                  </Link>
                  <a
                    href="#contact"
                    className="group relative inline-block overflow-hidden rounded-full border-2 border-white text-white px-10 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white/10 hover:scale-105"
                  >
                    <span className="relative z-10">Contact Us</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  IG
                </div>
                <span className="text-xl font-bold">IG-Besthood Academy</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nurturing young minds and building bright futures since 1998.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-orange-400 transition">About Us</a></li>
                <li><a href="#programs" className="hover:text-orange-400 transition">Programs</a></li>
                <li><a href="#gallery" className="hover:text-orange-400 transition">Gallery</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 123 Education Avenue</li>
                <li>📞 (234) 801-234-5678</li>
                <li>✉️ info@igbesthood.edu.ng</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-all transform hover:scale-110"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} IG-Besthood Academy. All rights reserved.</p>
            <p className="mt-2 text-gray-500 text-sm">Where every child's potential is nurtured with care</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;