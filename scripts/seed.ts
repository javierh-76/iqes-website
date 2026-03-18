import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user (test account)
  const hashedPassword = await bcrypt.hash('johndoe123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✓ Admin user created:', adminUser.email);

  // Create main admin as requested by user  
  const hashedAdminPassword = await bcrypt.hash('Admin2026@', 10);
  const mainAdmin = await prisma.user.upsert({
    where: { email: 'admin@iqeslowvoltage.com' },
    update: {
      password: hashedAdminPassword,
    },
    create: {
      email: 'admin@iqeslowvoltage.com',
      name: 'IQES Administrator',
      password: hashedAdminPassword,
      role: 'admin',
    },
  });
  console.log('✓ Main admin created:', mainAdmin.email);

  // Create service areas
  const serviceAreas = [
    { city: 'Jacksonville', state: 'Florida', latitude: 30.3322, longitude: -81.6557 },
    { city: 'Orlando', state: 'Florida', latitude: 28.5383, longitude: -81.3792 },
    { city: 'Tampa', state: 'Florida', latitude: 27.9506, longitude: -82.4572 },
    { city: 'Tallahassee', state: 'Florida', latitude: 30.4383, longitude: -84.2807 },
    { city: 'Miami', state: 'Florida', latitude: 25.7617, longitude: -80.1918 },
    { city: 'West Palm Beach', state: 'Florida', latitude: 26.7153, longitude: -80.0534 },
  ];

  for (const area of serviceAreas) {
    await prisma.serviceArea.upsert({
      where: { city: area.city },
      update: {},
      create: {
        ...area,
        featured: true,
        active: true,
        description: `Professional low voltage services in ${area.city}`,
        descriptionEs: `Servicios profesionales de bajo voltaje en ${area.city}`,
      },
    });
  }
  console.log('✓ Service areas created');

  // Create sample projects
  const projects = [
    {
      title: 'Corporate Office Fiber Network',
      titleEs: 'Red de Fibra para Oficina Corporativa',
      description: 'Complete fiber optic network installation for a 10-story corporate office building. High-speed connectivity for 500+ employees.',
      descriptionEs: 'Instalación completa de red de fibra óptica para un edificio de oficinas corporativas de 10 pisos. Conectividad de alta velocidad para más de 500 empleados.',
      serviceType: 'Fiber Optic',
      location: 'Jacksonville',
      featured: true,
      published: true,
      completedDate: new Date('2024-01-15'),
    },
    {
      title: 'Retail CCTV Security System',
      titleEs: 'Sistema de Seguridad CCTV Minorista',
      description: '32-camera surveillance system with remote monitoring for a retail chain. HD cameras with motion detection and night vision.',
      descriptionEs: 'Sistema de vigilancia de 32 cámaras con monitoreo remoto para una cadena minorista. Cámaras HD con detección de movimiento y visión nocturna.',
      serviceType: 'CCTV',
      location: 'Orlando',
      featured: true,
      published: true,
      completedDate: new Date('2024-02-01'),
    },
    {
      title: 'Hospital Access Control System',
      titleEs: 'Sistema de Control de Acceso Hospitalario',
      description: 'Comprehensive access control system for a 200-bed hospital. Card-based entry for restricted areas and emergency override capabilities.',
      descriptionEs: 'Sistema integral de control de acceso para un hospital de 200 camas. Entrada por tarjeta para áreas restringidas y capacidades de anulación de emergencia.',
      serviceType: 'Access Control',
      location: 'Tampa',
      featured: true,
      published: true,
      completedDate: new Date('2023-12-10'),
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    });
  }
  console.log('✓ Sample projects created');

  // Create sample testimonials
  const testimonials = [
    {
      clientName: 'Sarah Johnson',
      companyName: 'Tech Solutions Inc.',
      rating: 5,
      text: 'Exceptional service! The team completed our fiber optic installation ahead of schedule and within budget. Highly professional and knowledgeable.',
      textEs: '¡Servicio excepcional! El equipo completó nuestra instalación de fibra óptica antes de lo previsto y dentro del presupuesto. Muy profesionales y conocedores.',
      serviceType: 'Fiber Optic',
      location: 'Jacksonville',
      featured: true,
      published: true,
    },
    {
      clientName: 'Michael Rodriguez',
      companyName: 'Secure Retail Group',
      rating: 5,
      text: 'Our new CCTV system has been flawless. The installation was quick, and the training provided was excellent. Great team!',
      textEs: 'Nuestro nuevo sistema CCTV ha sido impecable. La instalación fue rápida y la capacitación proporcionada fue excelente. ¡Gran equipo!',
      serviceType: 'CCTV',
      location: 'Orlando',
      featured: true,
      published: true,
    },
    {
      clientName: 'Dr. Emily Chen',
      companyName: 'Florida Medical Center',
      rating: 5,
      text: 'The access control system has greatly improved our security. The team understood our unique healthcare requirements perfectly.',
      textEs: 'El sistema de control de acceso ha mejorado enormemente nuestra seguridad. El equipo comprendió perfectamente nuestros requisitos únicos de atención médica.',
      serviceType: 'Access Control',
      location: 'Tampa',
      featured: true,
      published: true,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }
  console.log('✓ Sample testimonials created');

  // Seed Price Items
  const priceItems = [
    // FIBER OPTIC
    { category: 'fiber', name: 'Fiber Splicing', nameEs: 'Fusión de Fibra', unit: 'per_splice', unitLabel: 'per splice', unitLabelEs: 'por empalme', priceMin: 150, priceMax: 300, priceAvg: 225, sortOrder: 1 },
    { category: 'fiber', name: 'OTDR Certification', nameEs: 'Certificación OTDR', unit: 'per_link', unitLabel: 'per link', unitLabelEs: 'por enlace', priceMin: 75, priceMax: 150, priceAvg: 100, sortOrder: 2 },
    { category: 'fiber', name: 'Fiber Installation', nameEs: 'Instalación de Fibra', unit: 'per_foot', unitLabel: 'per linear foot', unitLabelEs: 'por pie lineal', priceMin: 3, priceMax: 8, priceAvg: 5, sortOrder: 3 },
    { category: 'fiber', name: 'Emergency Fiber Repair', nameEs: 'Reparación de Emergencia', unit: 'flat', unitLabel: 'minimum charge', unitLabelEs: 'cargo mínimo', priceMin: 350, priceMax: 500, priceAvg: 400, sortOrder: 4 },
    { category: 'fiber', name: 'Connector Termination', nameEs: 'Terminación de Conectores', unit: 'per_connector', unitLabel: 'per connector', unitLabelEs: 'por conector', priceMin: 25, priceMax: 50, priceAvg: 35, sortOrder: 5 },
    
    // CCTV / SECURITY
    { category: 'cctv', name: '4K IP Camera + Installation', nameEs: 'Cámara IP 4K + Instalación', unit: 'per_camera', unitLabel: 'per camera', unitLabelEs: 'por cámara', priceMin: 350, priceMax: 600, priceAvg: 450, sortOrder: 1 },
    { category: 'cctv', name: '4-Camera Complete System', nameEs: 'Sistema Completo 4 Cámaras', unit: 'flat', unitLabel: 'complete system', unitLabelEs: 'sistema completo', priceMin: 1500, priceMax: 2500, priceAvg: 2000, sortOrder: 2 },
    { category: 'cctv', name: '8-Camera Complete System', nameEs: 'Sistema Completo 8 Cámaras', unit: 'flat', unitLabel: 'complete system', unitLabelEs: 'sistema completo', priceMin: 2800, priceMax: 4500, priceAvg: 3500, sortOrder: 3 },
    { category: 'cctv', name: '16-Camera Commercial System', nameEs: 'Sistema Comercial 16 Cámaras', unit: 'flat', unitLabel: 'complete system', unitLabelEs: 'sistema completo', priceMin: 5000, priceMax: 8000, priceAvg: 6500, sortOrder: 4 },
    { category: 'cctv', name: 'NVR/DVR with Storage', nameEs: 'NVR/DVR con Almacenamiento', unit: 'flat', unitLabel: 'included in system', unitLabelEs: 'incluido en sistema', priceMin: 0, priceMax: 0, priceAvg: 0, notes: 'Included with camera systems', sortOrder: 5 },
    
    // ACCESS CONTROL
    { category: 'access', name: 'Basic Electronic Lock', nameEs: 'Cerradura Electrónica Básica', unit: 'per_door', unitLabel: 'per door', unitLabelEs: 'por puerta', priceMin: 400, priceMax: 700, priceAvg: 550, sortOrder: 1 },
    { category: 'access', name: 'Biometric System', nameEs: 'Sistema Biométrico', unit: 'per_door', unitLabel: 'per door', unitLabelEs: 'por puerta', priceMin: 800, priceMax: 1500, priceAvg: 1100, sortOrder: 2 },
    { category: 'access', name: 'Enterprise Access Control', nameEs: 'Control de Acceso Empresarial', unit: 'flat', unitLabel: 'starting price', unitLabelEs: 'precio inicial', priceMin: 2000, priceMax: 5000, priceAvg: 3000, sortOrder: 3 },
    { category: 'access', name: 'CCTV Integration', nameEs: 'Integración con CCTV', unit: 'flat', unitLabel: 'add-on', unitLabelEs: 'adicional', priceMin: 300, priceMax: 500, priceAvg: 400, sortOrder: 4 },
    { category: 'access', name: 'Video Intercom/Doorbell', nameEs: 'Intercomunicador/Video Portero', unit: 'per_unit', unitLabel: 'per unit', unitLabelEs: 'por unidad', priceMin: 500, priceMax: 1200, priceAvg: 800, sortOrder: 5 },
    
    // STRUCTURED CABLING
    { category: 'cabling', name: 'Cat6 Network Drop', nameEs: 'Punto de Red Cat6', unit: 'per_point', unitLabel: 'per drop', unitLabelEs: 'por punto', priceMin: 150, priceMax: 250, priceAvg: 200, sortOrder: 1 },
    { category: 'cabling', name: 'Cat6a Network Drop', nameEs: 'Punto de Red Cat6a', unit: 'per_point', unitLabel: 'per drop', unitLabelEs: 'por punto', priceMin: 200, priceMax: 350, priceAvg: 275, sortOrder: 2 },
    { category: 'cabling', name: 'Backbone Between Floors', nameEs: 'Backbone Entre Pisos', unit: 'per_run', unitLabel: 'per run', unitLabelEs: 'por corrida', priceMin: 500, priceMax: 1500, priceAvg: 900, sortOrder: 3 },
    { category: 'cabling', name: 'Patch Panel + Rack', nameEs: 'Patch Panel + Rack', unit: 'flat', unitLabel: 'starting price', unitLabelEs: 'precio inicial', priceMin: 800, priceMax: 2000, priceAvg: 1200, sortOrder: 4 },
    { category: 'cabling', name: 'Fluke Certification', nameEs: 'Certificación Fluke', unit: 'per_point', unitLabel: 'per point', unitLabelEs: 'por punto', priceMin: 50, priceMax: 75, priceAvg: 60, sortOrder: 5 },
    { category: 'cabling', name: 'Complete MDF/IDF', nameEs: 'MDF/IDF Completo', unit: 'flat', unitLabel: 'starting price', unitLabelEs: 'precio inicial', priceMin: 2000, priceMax: 5000, priceAvg: 3000, sortOrder: 6 },
    
    // NETWORKING & WIFI
    { category: 'wifi', name: 'Enterprise Access Point', nameEs: 'Access Point Empresarial', unit: 'per_unit', unitLabel: 'installed', unitLabelEs: 'instalado', priceMin: 400, priceMax: 800, priceAvg: 600, sortOrder: 1 },
    { category: 'wifi', name: 'Small Office WiFi Coverage', nameEs: 'Cobertura WiFi Oficina Pequeña', unit: 'flat', unitLabel: 'complete setup', unitLabelEs: 'instalación completa', priceMin: 1200, priceMax: 2500, priceAvg: 1800, sortOrder: 2 },
    { category: 'wifi', name: 'Enterprise WiFi (10,000+ sqft)', nameEs: 'WiFi Empresarial (10,000+ sqft)', unit: 'flat', unitLabel: 'starting price', unitLabelEs: 'precio inicial', priceMin: 5000, priceMax: 15000, priceAvg: 8000, sortOrder: 3 },
    { category: 'wifi', name: 'PoE Switch + Configuration', nameEs: 'Switch PoE + Configuración', unit: 'flat', unitLabel: 'starting price', unitLabelEs: 'precio inicial', priceMin: 500, priceMax: 1500, priceAvg: 800, sortOrder: 4 },
    { category: 'wifi', name: 'Enterprise Firewall/Router', nameEs: 'Firewall/Router Empresarial', unit: 'flat', unitLabel: 'installed', unitLabelEs: 'instalado', priceMin: 800, priceMax: 2500, priceAvg: 1500, sortOrder: 5 },
  ];

  for (const item of priceItems) {
    await prisma.priceItem.upsert({
      where: { id: `${item.category}-${item.sortOrder}` },
      update: { ...item },
      create: {
        id: `${item.category}-${item.sortOrder}`,
        ...item,
        isActive: true,
        showInChat: true,
        showInQuote: true,
      },
    });
  }
  console.log('✓ Price items created');

  console.log('Database seed completed successfully! ✓');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
