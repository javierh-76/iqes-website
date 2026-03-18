import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Fiber Optic Testing Project
  const fiberProject = await prisma.project.create({
    data: {
      title: 'Fiber Optic Infrastructure Testing & Certification',
      titleEs: 'Pruebas y Certificación de Infraestructura de Fibra Óptica',
      description: 'Professional fiber optic testing and certification using Fluke Networks Versiv equipment. OTDR testing for OM3 multimode fiber at 850nm and 1300nm wavelengths. All installations certified to industry standards with detailed test reports.',
      descriptionEs: 'Pruebas y certificación profesional de fibra óptica usando equipos Fluke Networks Versiv. Pruebas OTDR para fibra multimodo OM3 a longitudes de onda de 850nm y 1300nm. Todas las instalaciones certificadas según estándares de la industria con informes detallados.',
      serviceType: 'Fiber Optic',
      location: 'South Florida',
      featured: true,
      images: ['/projects/fiber-test-equipment.jpg'],
      completedDate: new Date('2024-09-15'),
    },
  });
  console.log('Created fiber project:', fiberProject.id);

  // Data Center Networking Project
  const networkProject = await prisma.project.create({
    data: {
      title: 'Enterprise Data Center Network Infrastructure',
      titleEs: 'Infraestructura de Red para Centro de Datos Empresarial',
      description: 'Complete network infrastructure installation for enterprise data center. Includes server rack installations, cable management systems, patch panel configurations, and high-speed network switching equipment. Designed for maximum uptime and scalability.',
      descriptionEs: 'Instalación completa de infraestructura de red para centro de datos empresarial. Incluye instalaciones de racks de servidores, sistemas de gestión de cables, configuraciones de paneles de parcheo y equipos de conmutación de red de alta velocidad. Diseñado para máximo tiempo de actividad y escalabilidad.',
      serviceType: 'Networking',
      location: 'Fort Lauderdale, FL',
      featured: true,
      images: [
        '/projects/datacenter-1.jpg',
        '/projects/datacenter-2.jpg',
        '/projects/datacenter-3.jpg',
        '/projects/datacenter-4.jpg',
        '/projects/datacenter-5.jpg',
        '/projects/networking-1.jpg',
        '/projects/networking-2.jpg',
        '/projects/networking-3.jpg',
      ],
      completedDate: new Date('2024-08-20'),
    },
  });
  console.log('Created networking project:', networkProject.id);

  // Outdoor CCTV Project
  const cctvOutdoor = await prisma.project.create({
    data: {
      title: 'Sports Facility PTZ Camera System',
      titleEs: 'Sistema de Cámaras PTZ para Instalación Deportiva',
      description: 'Installation of Dahua PTZ (Pan-Tilt-Zoom) cameras for outdoor sports facility monitoring. High-resolution cameras with weather-resistant housing, capable of 360° rotation and optical zoom for comprehensive coverage of tennis courts and athletic fields.',
      descriptionEs: 'Instalación de cámaras PTZ (Pan-Tilt-Zoom) Dahua para monitoreo de instalaciones deportivas al aire libre. Cámaras de alta resolución con carcasa resistente a la intemperie, capaces de rotación 360° y zoom óptico para cobertura completa de canchas de tenis y campos deportivos.',
      serviceType: 'CCTV',
      location: 'Orlando, FL',
      featured: false,
      images: ['/projects/cctv-ptz-outdoor.jpg'],
      completedDate: new Date('2024-07-10'),
    },
  });
  console.log('Created outdoor CCTV project:', cctvOutdoor.id);

  // Warehouse Installation
  const warehouseProject = await prisma.project.create({
    data: {
      title: 'Warehouse Infrastructure Installation',
      titleEs: 'Instalación de Infraestructura en Almacén',
      description: 'Low voltage infrastructure installation for warehouse facility including conduit runs, electrical boxes, and equipment mounting. Professional installation using scissor lifts for high-ceiling work areas. All installations comply with commercial building codes.',
      descriptionEs: 'Instalación de infraestructura de bajo voltaje para almacén incluyendo ductos, cajas eléctricas y montaje de equipos. Instalación profesional usando plataformas elevadoras para áreas de techos altos. Todas las instalaciones cumplen con códigos de construcción comercial.',
      serviceType: 'Structured Cabling',
      location: 'Jacksonville, FL',
      featured: false,
      images: ['/projects/warehouse-install.jpg', '/projects/installation-lift.jpg'],
      completedDate: new Date('2024-06-25'),
    },
  });
  console.log('Created warehouse project:', warehouseProject.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
