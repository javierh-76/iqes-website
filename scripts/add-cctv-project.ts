import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const project = await prisma.project.create({
    data: {
      title: 'Commercial CCTV Security System',
      titleEs: 'Sistema de Seguridad CCTV Comercial',
      description: 'Comprehensive CCTV security camera installation for a commercial facility in Miami. The project included multiple IP cameras with 4K resolution, NVR setup, remote viewing configuration, and professional cable concealment. Full coverage of entrances, parking areas, and critical zones.',
      descriptionEs: 'Instalación integral de cámaras de seguridad CCTV para una instalación comercial en Miami. El proyecto incluyó múltiples cámaras IP con resolución 4K, configuración de NVR, acceso remoto y ocultamiento profesional de cables. Cobertura completa de entradas, áreas de estacionamiento y zonas críticas.',
      serviceType: 'CCTV',
      location: 'Miami, FL',
      featured: true,
      images: [
        '/projects/cctv-miami-1.jpg',
        '/projects/cctv-miami-2.jpg',
        '/projects/cctv-miami-3.jpg',
        '/projects/cctv-miami-4.jpg',
        '/projects/cctv-miami-5.jpg',
        '/projects/cctv-miami-6.jpg',
        '/projects/cctv-miami-7.jpg',
        '/projects/cctv-miami-8.jpg',
        '/projects/cctv-miami-9.jpg',
        '/projects/cctv-miami-10.jpg',
      ],
      completedDate: new Date('2024-10-20'),
    },
  });

  console.log('Created CCTV project:', project.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
