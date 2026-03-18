'use client';

import { useLanguage } from '@/contexts/language-context';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Users, CheckCircle, Globe, Headphones } from 'lucide-react';

const MermaidDiagram = dynamic(() => import('@/components/mermaid-diagram'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ),
});

const assistantFlowChart = `flowchart TD
    %% ===== ESTILOS =====
    classDef inicio fill:#003366,stroke:#003366,color:#fff
    classDef decision fill:#FFE082,stroke:#F57C00,color:#000
    classDef proceso fill:#E3F2FD,stroke:#1976D2,color:#000
    classDef transferencia fill:#00A651,stroke:#00A651,color:#fff
    classDef alerta fill:#D32F2F,stroke:#D32F2F,color:#fff
    classDef nota fill:#F5F5F5,stroke:#9E9E9E,color:#333

    START((Usuario accede<br/>a IQES)):::inicio
    
    START --> DEVICE_CHECK{Tipo de<br/>dispositivo?}:::decision

    subgraph WEB_DESKTOP ["ESCENARIO 1A: Computador / Tablet"]
        direction TB
        WD_BTN[Usuario presiona<br/>boton LLAMAR]:::proceso
        WD_AUDIO{Permiso de<br/>audio?}:::decision
        
        WD_AUDIO -->|SI| WD_VOZ_START[Iniciar agente<br/>en MODO VOZ]:::proceso
        WD_VOZ_START --> WD_IDIOMA_VOZ[Agente dice:<br/>Press 1 for English<br/>or 2 para espanol]:::proceso
        
        WD_AUDIO -->|NO| WD_OPCIONES[Mostrar opciones<br/>en pantalla]:::alerta
        WD_OPCIONES --> WD_OPC1[Opcion 1:<br/>Llamar directamente]:::proceso
        WD_OPCIONES --> WD_OPC2[Opcion 2:<br/>Iniciar chat texto]:::proceso
        WD_OPC2 --> WD_LANG_SELECT[Selector idioma:<br/>English / Espanol]:::proceso
    end

    subgraph WEB_MOBILE ["ESCENARIO 1B: Movil Android/iOS"]
        direction TB
        WM_BTN[Usuario presiona<br/>boton LLAMAR]:::proceso
        WM_DECISION{Accion<br/>seleccionada?}:::decision
        
        WM_DECISION -->|Llamada| WM_CALL[Iniciar llamada<br/>VoIP/click-to-call]:::proceso
        WM_CALL --> WM_VOZ[Agente contesta:<br/>Press 1 for English<br/>or 2 para espanol]:::proceso
        
        WM_DECISION -->|Chat| WM_CHAT[Abrir interfaz<br/>de chat texto]:::proceso
        WM_CHAT --> WM_LANG[Selector idioma]:::proceso
    end

    subgraph PHONE_DIRECT ["ESCENARIO 2: Llamada Directa"]
        direction TB
        PD_RING[Usuario marca<br/>numero de IQES]:::proceso
        PD_ANSWER[Agente virtual<br/>contesta]:::proceso
        PD_IDIOMA[Press 1 for English<br/>or 2 para espanol]:::proceso
        PD_DTMF[Detectar tecla DTMF]:::proceso
    end

    DEVICE_CHECK -->|Computador/Tablet| WD_BTN
    DEVICE_CHECK -->|Movil| WM_BTN
    DEVICE_CHECK -->|Llamada directa| PD_RING
    
    PD_RING --> PD_ANSWER --> PD_IDIOMA --> PD_DTMF

    WD_IDIOMA_VOZ --> LANG_SELECTED
    WD_LANG_SELECT --> LANG_SELECTED
    WD_OPC1 --> PD_RING
    WM_VOZ --> LANG_SELECTED
    WM_LANG --> LANG_SELECTED
    PD_DTMF --> LANG_SELECTED

    LANG_SELECTED{Idioma<br/>seleccionado}:::decision
    LANG_SELECTED -->|English| SET_EN[Configurar:<br/>INGLES]:::proceso
    LANG_SELECTED -->|Espanol| SET_ES[Configurar:<br/>ESPANOL]:::proceso

    SET_EN --> FC_SALUDO
    SET_ES --> FC_SALUDO

    subgraph FLUJO_COMUN ["FLUJO COMUN - Atencion al Cliente"]
        direction TB
        
        FC_SALUDO[SALUDO INICIAL<br/>Bienvenidos a IQES<br/>En que podemos ayudar?]:::proceso
        
        FC_RESPUESTA[Cliente responde<br/>necesidad, ciudad, servicio]:::proceso
        
        FC_EMPATIA[Respuesta empatica:<br/>Perfecto! Estamos<br/>para ayudarle]:::proceso
        
        FC_SALUDO --> FC_RESPUESTA --> FC_EMPATIA
    end

    subgraph DATOS ["RECOLECCION DE DATOS"]
        direction TB
        
        D_CHECK{Datos completos?}:::decision
        
        D_NOMBRE[Solicitar:<br/>Nombre completo]:::proceso
        D_TELEFONO[Solicitar:<br/>Telefono]:::proceso
        D_EMAIL[Solicitar:<br/>Correo electronico]:::proceso
        D_CIUDAD[Solicitar:<br/>Ciudad]:::proceso
        
        D_CHECK -->|Faltan datos| D_NOMBRE
        D_NOMBRE --> D_TELEFONO --> D_EMAIL --> D_CIUDAD
        D_CIUDAD --> D_VALIDAR[Validar datos]:::proceso
        D_VALIDAR --> D_CHECK
    end

    FC_EMPATIA --> D_CHECK
    D_CHECK -->|Completos| REQ_CHECK

    REQ_CHECK{Requerimiento<br/>claro?}:::decision
    
    REQ_CHECK -->|NO| REQ_ASK[Preguntar servicio:<br/>Fibra Optica, CCTV,<br/>Control Acceso, etc.]:::proceso
    REQ_ASK --> REQ_RESPONSE[Cliente especifica<br/>requerimiento]:::proceso
    REQ_RESPONSE --> REQ_CHECK
    
    REQ_CHECK -->|SI| TRANSFER_OFFER

    subgraph TRANSFERENCIA ["PROCESO DE TRANSFERENCIA"]
        direction TB
        
        TRANSFER_OFFER[Informar:<br/>Voy a transferirlo<br/>con un especialista]:::proceso
        
        TRANSFER_ASK{Acepta<br/>transferencia?}:::decision
        
        TRANSFER_OFFER --> TRANSFER_ASK
        
        TRANSFER_ASK -->|SI| TRANSFER_EXEC[Preparar transferencia]:::transferencia
        
        TRANSFER_ASK -->|NO| ALT_OFFER[Ofrecer alternativa:<br/>Ingeniero de Proyectos?]:::proceso
        
        ALT_OFFER --> ALT_DECISION{Acepta<br/>ingeniero?}:::decision
        ALT_DECISION -->|SI| TRANSFER_ING[Transferir a<br/>Ingeniero]:::transferencia
        ALT_DECISION -->|NO| SCHEDULE[Agendar llamada<br/>posterior]:::proceso
    end

    TRANSFER_EXEC --> LANG_FINAL
    TRANSFER_ING --> LANG_FINAL
    
    LANG_FINAL{Idioma<br/>del cliente?}:::decision
    
    LANG_FINAL -->|INGLES| TRANSFER_EN[TRANSFERIR A:<br/>Especialista Inglés]:::transferencia
    LANG_FINAL -->|ESPANOL| TRANSFER_ES[TRANSFERIR A:<br/>Especialista Español]:::transferencia

    subgraph POST_ACTIONS ["ACCIONES POST-LLAMADA"]
        direction TB
        
        PA_CLIENT[ENVIAR AL CLIENTE<br/>via Email + SMS]:::proceso
        PA_CLIENT_1[Confirmacion de datos]:::nota
        PA_CLIENT_2[PDF Presentacion IQES]:::nota
        
        PA_INTERNAL[ENVIAR INTERNAMENTE<br/>a equipo IQES]:::proceso
        PA_INTERNAL_1[Datos del cliente]:::nota
        PA_INTERNAL_2[Solicitud cotizacion]:::nota
        
        PA_CLIENT --> PA_CLIENT_1 --> PA_CLIENT_2
        PA_INTERNAL --> PA_INTERNAL_1 --> PA_INTERNAL_2
    end

    TRANSFER_EN --> POST_ACTIONS
    TRANSFER_ES --> POST_ACTIONS
    SCHEDULE --> POST_ACTIONS

    POST_ACTIONS --> FIN((FIN<br/>Proceso completado)):::inicio`;

const translations = {
  en: {
    title: 'Our Customer Service Process',
    subtitle: 'Learn how our intelligent virtual assistant handles your inquiries',
    description: 'At IQES Low Voltage Solutions, we use cutting-edge AI technology to ensure you receive fast, professional, and personalized attention 24/7.',
    diagramTitle: 'Complete Service Flow',
    features: {
      title: 'Key Features',
      items: [
        {
          icon: Globe,
          title: 'Bilingual Support',
          description: 'Full support in English and Spanish with native-quality voice assistance.',
        },
        {
          icon: Phone,
          title: 'Multi-Channel Access',
          description: 'Contact us via web, mobile app, or direct phone call.',
        },
        {
          icon: MessageSquare,
          title: 'Voice & Text',
          description: 'Choose between voice interaction or text chat based on your preference.',
        },
        {
          icon: Users,
          title: 'Expert Transfer',
          description: 'Seamless transfer to specialized technicians when needed.',
        },
        {
          icon: Headphones,
          title: '24/7 Availability',
          description: 'Our virtual assistant is always ready to help, day or night.',
        },
        {
          icon: CheckCircle,
          title: 'Instant Follow-up',
          description: 'Automatic confirmation emails and documentation sent to you.',
        },
      ],
    },
    callNumbers: {
      title: 'Direct Contact Numbers',
      english: 'English Support',
      spanish: 'Spanish Support',
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Contact us now and experience our professional service.',
      button: 'Contact Us',
    },
  },
  es: {
    title: 'Nuestro Proceso de Atención',
    subtitle: 'Conozca cómo nuestro asistente virtual inteligente maneja sus consultas',
    description: 'En IQES Low Voltage Solutions, utilizamos tecnología de IA de vanguardia para garantizar que reciba una atención rápida, profesional y personalizada las 24 horas del día, los 7 días de la semana.',
    diagramTitle: 'Flujo Completo de Servicio',
    features: {
      title: 'Características Principales',
      items: [
        {
          icon: Globe,
          title: 'Soporte Bilingüe',
          description: 'Soporte completo en inglés y español con asistencia de voz de calidad nativa.',
        },
        {
          icon: Phone,
          title: 'Acceso Multi-Canal',
          description: 'Contáctenos por web, aplicación móvil o llamada telefónica directa.',
        },
        {
          icon: MessageSquare,
          title: 'Voz y Texto',
          description: 'Elija entre interacción por voz o chat de texto según su preferencia.',
        },
        {
          icon: Users,
          title: 'Transferencia a Expertos',
          description: 'Transferencia fluida a técnicos especializados cuando sea necesario.',
        },
        {
          icon: Headphones,
          title: 'Disponibilidad 24/7',
          description: 'Nuestro asistente virtual siempre está listo para ayudar, día y noche.',
        },
        {
          icon: CheckCircle,
          title: 'Seguimiento Instantáneo',
          description: 'Correos de confirmación y documentación enviados automáticamente.',
        },
      ],
    },
    callNumbers: {
      title: 'Números de Contacto Directo',
      english: 'Soporte en Inglés',
      spanish: 'Soporte en Español',
    },
    cta: {
      title: '¿Listo para Comenzar?',
      subtitle: 'Contáctenos ahora y experimente nuestro servicio profesional.',
      button: 'Contáctenos',
    },
  },
};

export default function ProcessPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #003366 0%, #002244 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{t.title}</h1>
            <p className="text-xl mb-6" style={{ color: 'rgba(255,255,255,0.9)' }}>{t.subtitle}</p>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>{t.description}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t.features.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.features.items.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Diagram Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-8">{t.diagramTitle}</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl p-4 md:p-8 shadow-lg overflow-x-auto"
          >
            <div className="min-w-[800px]">
              <MermaidDiagram chart={assistantFlowChart} className="w-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Number */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t.callNumbers.title}</h2>
          <div className="flex justify-center">
            <motion.a
              href="tel:+13866039541"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">📞</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{language === 'es' ? 'Llámenos / Call Us' : 'Call Us / Llámenos'}</p>
                <p className="text-3xl font-bold text-primary">386-603-9541</p>
                <p className="text-sm text-gray-400">{language === 'es' ? 'Inglés y Español' : 'English & Spanish'}</p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #00A651 0%, #008040 100%)' }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>{t.cta.title}</h2>
            <p className="text-xl mb-8" style={{ color: 'rgba(255,255,255,0.9)' }}>{t.cta.subtitle}</p>
            <a
              href="/contact"
              className="inline-block bg-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              style={{ color: '#00A651' }}
            >
              {t.cta.button}
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
