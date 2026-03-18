import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing sample projects
  await prisma.project.deleteMany({});
  
  // Add real project with uploaded images
  const project = await prisma.project.create({
    data: {
      title: 'Data Center Structured Cabling',
      titleEs: 'Cableado Estructurado de Centro de Datos',
      description: 'Complete Cat6 structured cabling installation for a data center facility. Over 200 cable runs with professional cable management, patch panels, and wire basket cable trays. All installations certified to TIA/EIA standards.',
      descriptionEs: 'Instalación completa de cableado estructurado Cat6 para un centro de datos. Más de 200 corridas de cable con gestión profesional de cables, paneles de parcheo y bandejas de cables tipo canasta. Todas las instalaciones certificadas según estándares TIA/EIA.',
      serviceType: 'Structured Cabling',
      location: 'West Palm Beach, FL',
      featured: true,
      images: [
        '/projects/cabling-wpb-1.jpg',
        '/projects/cabling-wpb-2.jpg',
        '/projects/cabling-wpb-3.jpg',
        '/projects/cabling-wpb-4.jpg',
        '/projects/cabling-wpb-5.jpg',
      ],
      completedDate: new Date('2024-11-15'),
      clientTestimonial: null,
      clientName: null,
    },
  });

  console.log('Created project:', project.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
