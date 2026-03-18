// Bilingual support for English and Spanish

export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      services: 'Services',
      serviceAreas: 'Service Areas',
      projects: 'Projects',
      payments: 'Payments',
      process: 'How It Works',
      analyze: 'AI Analysis',
      blog: 'Blog',
      contact: 'Contact',
      getQuote: 'Get Quote',
    },
    // Home page
    home: {
      heroTitle: 'Professional Low Voltage Solutions',
      heroSubtitle: 'Expert installation and service across Florida',
      heroCTA: 'Get Free Quote',
      servicesTitle: 'Our Services',
      servicesSubtitle: 'Comprehensive low voltage and telecommunications solutions',
      areasTitle: 'We Serve Florida',
      areasSubtitle: 'Professional service within 150 miles',
      projectsTitle: 'Recent Projects',
      projectsSubtitle: 'Quality work delivered on time',
      testimonialsTitle: 'What Our Clients Say',
      testimonialsSubtitle: 'Trusted by businesses across Florida',
      trustTitle: 'Why Choose Us',
      yearsExperience: 'Years Experience',
      projectsCompleted: 'Projects Completed',
      certifiedTechnicians: 'Certified Technicians',
      satisfactionRate: 'Satisfaction Rate',
    },
    // Services
    services: {
      fiberOptic: {
        name: 'Fiber Optic Installation',
        description: 'High-speed fiber optic installation and splicing services for maximum data transfer efficiency.',
        benefits: ['Lightning-fast data transfer', 'Minimal signal loss', 'Future-proof infrastructure', 'Expert splicing'],
        applications: ['Data centers', 'Corporate networks', 'Campus connectivity', 'Telecom infrastructure'],
      },
      cctv: {
        name: 'CCTV Systems',
        description: 'Advanced surveillance and security camera systems with remote monitoring capabilities.',
        benefits: ['24/7 monitoring', 'HD video quality', 'Remote access', 'Motion detection'],
        applications: ['Commercial buildings', 'Retail stores', 'Warehouses', 'Parking facilities'],
      },
      cabling: {
        name: 'Structured Cabling',
        description: 'Professional structured cabling for reliable network infrastructure.',
        benefits: ['Organized infrastructure', 'Easy maintenance', 'Scalable design', 'Industry standards'],
        applications: ['Office buildings', 'Data centers', 'Educational facilities', 'Healthcare'],
      },
      accessControl: {
        name: 'Access Control',
        description: 'Secure access control systems to protect your facilities and assets.',
        benefits: ['Enhanced security', 'User tracking', 'Integration capability', 'Easy management'],
        applications: ['Corporate offices', 'Government facilities', 'Multi-tenant buildings', 'Restricted areas'],
      },
      networking: {
        name: 'Networking Solutions',
        description: 'Complete networking solutions for seamless connectivity and communication.',
        benefits: ['Reliable connectivity', 'High performance', 'Secure infrastructure', 'Expert support'],
        applications: ['Business networks', 'WiFi systems', 'Server rooms', 'Cloud connectivity'],
      },
    },
    // Contact & Quote
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      subject: 'Subject',
      message: 'Message',
      serviceArea: 'Service Area',
      submit: 'Send Message',
      success: 'Thank you! We\'ll contact you soon.',
      error: 'Something went wrong. Please try again.',
    },
    quote: {
      title: 'Request a Quote',
      subtitle: 'Tell us about your project',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      company: 'Company Name (Optional)',
      serviceType: 'Service Type',
      projectDetails: 'Project Details',
      serviceArea: 'Service Area / City',
      budgetRange: 'Budget Range',
      preferredContact: 'Preferred Contact Method',
      attachments: 'Upload Files (PDF, Images, CAD, KMZ)',
      submit: 'Submit Quote Request',
      success: 'Quote request submitted! We\'ll respond within 24 hours.',
      error: 'Error submitting request. Please try again.',
    },
    // Footer
    footer: {
      tagline: 'Professional low voltage solutions across Florida',
      copyright: 'All rights reserved.',
      quickLinks: 'Quick Links',
    },
    // Common
    common: {
      loading: 'Loading...',
      viewAll: 'View All',
      learnMore: 'Learn More',
      readMore: 'Read More',
      viewProject: 'View Project',
      location: 'Location',
      completed: 'Completed',
      category: 'Category',
      tags: 'Tags',
    },
  },
  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      serviceAreas: 'Áreas de Servicio',
      projects: 'Proyectos',
      payments: 'Pagos',
      process: 'Cómo Funciona',
      analyze: 'Análisis IA',
      blog: 'Blog',
      contact: 'Contacto',
      getQuote: 'Cotización',
    },
    // Home page
    home: {
      heroTitle: 'Soluciones Profesionales de Bajo Voltaje',
      heroSubtitle: 'Instalación experta y servicio en toda Florida',
      heroCTA: 'Cotización Gratis',
      servicesTitle: 'Nuestros Servicios',
      servicesSubtitle: 'Soluciones integrales en cableado estructurado y telecomunicaciones',
      areasTitle: 'Servimos Florida',
      areasSubtitle: 'Servicio profesional dentro de 150 millas',
      projectsTitle: 'Proyectos Recientes',
      projectsSubtitle: 'Trabajo de calidad entregado a tiempo',
      testimonialsTitle: 'Lo Que Dicen Nuestros Clientes',
      testimonialsSubtitle: 'Confiado por empresas en toda Florida',
      trustTitle: 'Por Qué Elegirnos',
      yearsExperience: 'Años de Experiencia',
      projectsCompleted: 'Proyectos Completados',
      certifiedTechnicians: 'Técnicos Certificados',
      satisfactionRate: 'Tasa de Satisfacción',
    },
    // Services
    services: {
      fiberOptic: {
        name: 'Instalación de Fibra Óptica',
        description: 'Servicios de instalación y empalme de fibra óptica de alta velocidad para máxima eficiencia.',
        benefits: ['Transferencia de datos ultrarrápida', 'Pérdida mínima de señal', 'Infraestructura a prueba de futuro', 'Empalme experto'],
        applications: ['Centros de datos', 'Redes corporativas', 'Conectividad de campus', 'Infraestructura de telecomunicaciones'],
      },
      cctv: {
        name: 'Sistemas CCTV',
        description: 'Sistemas avanzados de vigilancia y cámaras de seguridad con capacidades de monitoreo remoto.',
        benefits: ['Monitoreo 24/7', 'Calidad de video HD', 'Acceso remoto', 'Detección de movimiento'],
        applications: ['Edificios comerciales', 'Tiendas minoristas', 'Almacenes', 'Estacionamientos'],
      },
      cabling: {
        name: 'Cableado Estructurado',
        description: 'Cableado estructurado profesional para infraestructura de red confiable.',
        benefits: ['Infraestructura organizada', 'Mantenimiento fácil', 'Diseño escalable', 'Estándares de la industria'],
        applications: ['Edificios de oficinas', 'Centros de datos', 'Instalaciones educativas', 'Atención médica'],
      },
      accessControl: {
        name: 'Control de Acceso',
        description: 'Sistemas seguros de control de acceso para proteger sus instalaciones y activos.',
        benefits: ['Seguridad mejorada', 'Seguimiento de usuarios', 'Capacidad de integración', 'Gestión fácil'],
        applications: ['Oficinas corporativas', 'Instalaciones gubernamentales', 'Edificios multi-inquilino', 'Áreas restringidas'],
      },
      networking: {
        name: 'Soluciones de Redes',
        description: 'Soluciones completas de redes para conectividad y comunicación sin problemas.',
        benefits: ['Conectividad confiable', 'Alto rendimiento', 'Infraestructura segura', 'Soporte experto'],
        applications: ['Redes empresariales', 'Sistemas WiFi', 'Salas de servidores', 'Conectividad en la nube'],
      },
    },
    // Contact & Quote
    contact: {
      title: 'Contáctenos',
      subtitle: 'Póngase en contacto con nuestro equipo',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      subject: 'Asunto',
      message: 'Mensaje',
      serviceArea: 'Área de Servicio',
      submit: 'Enviar Mensaje',
      success: '¡Gracias! Nos pondremos en contacto pronto.',
      error: 'Algo salió mal. Por favor, inténtelo de nuevo.',
    },
    quote: {
      title: 'Solicitar Cotización',
      subtitle: 'Cuéntenos sobre su proyecto',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      phone: 'Número de Teléfono',
      company: 'Nombre de la Empresa (Opcional)',
      serviceType: 'Tipo de Servicio',
      projectDetails: 'Detalles del Proyecto',
      serviceArea: 'Área de Servicio / Ciudad',
      budgetRange: 'Rango de Presupuesto',
      preferredContact: 'Método de Contacto Preferido',
      attachments: 'Subir Archivos (PDF, Imágenes, CAD, KMZ)',
      submit: 'Enviar Solicitud de Cotización',
      success: '¡Solicitud enviada! Responderemos en 24 horas.',
      error: 'Error al enviar la solicitud. Inténtelo de nuevo.',
    },
    // Footer
    footer: {
      tagline: 'Soluciones profesionales de bajo voltaje en toda Florida',
      copyright: 'Todos los derechos reservados.',
      quickLinks: 'Enlaces Rápidos',
    },
    // Common
    common: {
      loading: 'Cargando...',
      viewAll: 'Ver Todo',
      learnMore: 'Más Información',
      readMore: 'Leer Más',
      viewProject: 'Ver Proyecto',
      location: 'Ubicación',
      completed: 'Completado',
      category: 'Categoría',
      tags: 'Etiquetas',
    },
  },
};

export function getTranslation(lang: Language = 'en') {
  return translations[lang] || translations.en;
}
