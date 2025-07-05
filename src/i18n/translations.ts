import type { Language } from '../contexts/LanguageContext';

export interface Translations {
  // Header
  header: {
    new: string;
    about: string;
    terms: string;
  };
  
  // Main interface
  main: {
    title: string;
    subtitle: string;
    addLinks: string;
    addLinksDescription: string;
    urlPlaceholder: string;
    vanityUrl: string;
    vanityUrlPlaceholder: string;
    vanityUrlEmpty: string;
    vanityUrlError: string;
    description: string;
    descriptionPlaceholder: string;
    publishBundle: string;
    publishDescription: string;
    publish: string;
    publishing: string;
    publishedSuccess: string;
    publishedLiveAt: string;
    copyToClipboard: string;
    visitBundle: string;
    previewBundle: string;
    createNewBundle: string;
    newBundleConfirm: string;
  };
  
  // Link list
  links: {
    title: string;
    dragToReorder: string;
    noLinksYet: string;
    addFirstLink: string;
    openLink: string;
    removeLink: string;
  };
  
  // Bundle viewer
  viewer: {
    linkBundle: string;
    backToEditor: string;
    created: string;
    madeWith: string;
  };
  
  // Errors and states
  errors: {
    invalidUrl: string;
    fetchFailed: string;
    bundleNotFound: string;
    bundleNotFoundDescription: string;
    loadingBundle: string;
  };
  
  // About modal
  about: {
    title: string;
    description1: string;
    description2: string;
    description3: string;
    builtWith: string;
    close: string;
  };
  
  // Terms modal
  terms: {
    title: string;
    acceptance: {
      title: string;
      content: string;
    };
    service: {
      title: string;
      content: string;
    };
    responsibilities: {
      title: string;
      content: string;
    };
    privacy: {
      title: string;
      content: string;
    };
    liability: {
      title: string;
      content: string;
    };
    changes: {
      title: string;
      content: string;
    };
    close: string;
  };
  
  // Language selector
  language: {
    selectLanguage: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    header: {
      new: 'New',
      about: 'About',
      terms: 'Terms',
    },
    main: {
      title: 'UrlList',
      subtitle: 'Bundle and Share Multiple URLs',
      addLinks: 'Add Links',
      addLinksDescription: 'Enter a URL and press Enter to add it to your bundle',
      urlPlaceholder: 'Enter a link and press enter',
      vanityUrl: 'Vanity URL',
      vanityUrlPlaceholder: 'my-awesome-links',
      vanityUrlEmpty: 'Leave empty for auto-generated friendly URL (e.g., amazing-links-123)',
      vanityUrlError: 'Only letters, numbers, hyphens, and underscores allowed (3-50 characters)',
      description: 'Description',
      descriptionPlaceholder: 'Describe your collection of links...',
      publishBundle: 'Publish Bundle',
      publishDescription: 'Make your link bundle available to share with anyone',
      publish: 'Publish',
      publishing: 'Publishing...',
      publishedSuccess: 'Published successfully!',
      publishedLiveAt: 'Your bundle is now live at:',
      copyToClipboard: 'Copy to clipboard',
      visitBundle: 'Visit bundle',
      previewBundle: 'Preview Bundle',
      createNewBundle: 'Create New Bundle',
      newBundleConfirm: 'Are you sure you want to create a new bundle? This will clear all your current links and settings.',
    },
    links: {
      title: 'Links',
      dragToReorder: 'Drag links to re-order',
      noLinksYet: 'No links added yet',
      addFirstLink: 'Add your first link above to get started',
      openLink: 'Open link',
      removeLink: 'Remove link',
    },
    viewer: {
      linkBundle: 'Link Bundle',
      backToEditor: 'Back to editor',
      created: 'Created',
      madeWith: 'Made with',
    },
    errors: {
      invalidUrl: 'Please enter a valid URL',
      fetchFailed: 'Failed to fetch link information',
      bundleNotFound: 'Bundle Not Found',
      bundleNotFoundDescription: "The bundle you're looking for doesn't exist or hasn't been published yet.",
      loadingBundle: 'Loading bundle...',
    },
    about: {
      title: 'About UrlList',
      description1: 'UrlList is a simple tool for bundling and sharing multiple URLs through a single, shareable link.',
      description2: 'Perfect for sharing collections of resources, articles, tools, or any group of links with friends, colleagues, or your audience.',
      description3: 'No sign-up required - just create your bundle and share it instantly!',
      builtWith: 'Built with React, TypeScript, and Tailwind CSS',
      close: 'Close',
    },
    terms: {
      title: 'Terms of Service',
      acceptance: {
        title: '1. Acceptance of Terms',
        content: 'By using UrlList, you agree to these terms of service. If you do not agree, please do not use our service.',
      },
      service: {
        title: '2. Service Description',
        content: 'UrlList allows users to create bundles of URLs and share them through a single link. The service is provided as-is without warranties.',
      },
      responsibilities: {
        title: '3. User Responsibilities',
        content: 'Users are responsible for the content they share and must not use the service for illegal, harmful, or inappropriate content.',
      },
      privacy: {
        title: '4. Privacy',
        content: 'We respect your privacy. Published bundles are publicly accessible via their share links. Unpublished bundles remain local to your browser.',
      },
      liability: {
        title: '5. Limitation of Liability',
        content: 'UrlList is provided without warranty. We are not liable for any damages arising from use of the service.',
      },
      changes: {
        title: '6. Changes to Terms',
        content: 'We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.',
      },
      close: 'Close',
    },
    language: {
      selectLanguage: 'Select language',
    },
  },
  es: {
    header: {
      new: 'Nuevo',
      about: 'Acerca de',
      terms: 'Términos',
    },
    main: {
      title: 'UrlList',
      subtitle: 'Agrupa y Comparte Múltiples URLs',
      addLinks: 'Agregar Enlaces',
      addLinksDescription: 'Ingresa una URL y presiona Enter para agregarla a tu paquete',
      urlPlaceholder: 'Ingresa un enlace y presiona enter',
      vanityUrl: 'URL Personalizada',
      vanityUrlPlaceholder: 'mis-enlaces-geniales',
      vanityUrlEmpty: 'Deja vacío para URL amigable auto-generada (ej., enlaces-geniales-123)',
      vanityUrlError: 'Solo se permiten letras, números, guiones y guiones bajos (3-50 caracteres)',
      description: 'Descripción',
      descriptionPlaceholder: 'Describe tu colección de enlaces...',
      publishBundle: 'Publicar Paquete',
      publishDescription: 'Haz que tu paquete de enlaces esté disponible para compartir con cualquiera',
      publish: 'Publicar',
      publishing: 'Publicando...',
      publishedSuccess: '¡Publicado exitosamente!',
      publishedLiveAt: 'Tu paquete ya está disponible en:',
      copyToClipboard: 'Copiar al portapapeles',
      visitBundle: 'Visitar paquete',
      previewBundle: 'Vista Previa del Paquete',
      createNewBundle: 'Crear Nuevo Paquete',
      newBundleConfirm: '¿Estás seguro de que quieres crear un nuevo paquete? Esto borrará todos tus enlaces y configuraciones actuales.',
    },
    links: {
      title: 'Enlaces',
      dragToReorder: 'Arrastra los enlaces para reordenar',
      noLinksYet: 'Aún no hay enlaces agregados',
      addFirstLink: 'Agrega tu primer enlace arriba para comenzar',
      openLink: 'Abrir enlace',
      removeLink: 'Eliminar enlace',
    },
    viewer: {
      linkBundle: 'Paquete de Enlaces',
      backToEditor: 'Volver al editor',
      created: 'Creado',
      madeWith: 'Hecho con',
    },
    errors: {
      invalidUrl: 'Por favor ingresa una URL válida',
      fetchFailed: 'Error al obtener información del enlace',
      bundleNotFound: 'Paquete No Encontrado',
      bundleNotFoundDescription: 'El paquete que buscas no existe o aún no ha sido publicado.',
      loadingBundle: 'Cargando paquete...',
    },
    about: {
      title: 'Acerca de UrlList',
      description1: 'UrlList es una herramienta simple para agrupar y compartir múltiples URLs a través de un solo enlace compartible.',
      description2: 'Perfecto para compartir colecciones de recursos, artículos, herramientas, o cualquier grupo de enlaces con amigos, colegas, o tu audiencia.',
      description3: '¡No se requiere registro - solo crea tu paquete y compártelo instantáneamente!',
      builtWith: 'Construido con React, TypeScript, y Tailwind CSS',
      close: 'Cerrar',
    },
    terms: {
      title: 'Términos de Servicio',
      acceptance: {
        title: '1. Aceptación de Términos',
        content: 'Al usar UrlList, aceptas estos términos de servicio. Si no estás de acuerdo, por favor no uses nuestro servicio.',
      },
      service: {
        title: '2. Descripción del Servicio',
        content: 'UrlList permite a los usuarios crear paquetes de URLs y compartirlos a través de un solo enlace. El servicio se proporciona tal como está, sin garantías.',
      },
      responsibilities: {
        title: '3. Responsabilidades del Usuario',
        content: 'Los usuarios son responsables del contenido que comparten y no deben usar el servicio para contenido ilegal, dañino o inapropiado.',
      },
      privacy: {
        title: '4. Privacidad',
        content: 'Respetamos tu privacidad. Los paquetes publicados son accesibles públicamente a través de sus enlaces de compartir. Los paquetes no publicados permanecen locales en tu navegador.',
      },
      liability: {
        title: '5. Limitación de Responsabilidad',
        content: 'UrlList se proporciona sin garantía. No somos responsables de ningún daño que surja del uso del servicio.',
      },
      changes: {
        title: '6. Cambios en los Términos',
        content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio constituye la aceptación de los términos actualizados.',
      },
      close: 'Cerrar',
    },
    language: {
      selectLanguage: 'Seleccionar idioma',
    },
  },
  // Fallback to English for unimplemented languages
  fr: {} as Translations,
  de: {} as Translations,
  pt: {} as Translations,
  ja: {} as Translations,
  ko: {} as Translations,
  zh: {} as Translations,
};

export function getTranslations(language: Language): Translations {
  console.log('=== GET TRANSLATIONS ===');
  console.log('Requested language:', language);
  
  const translation = translations[language];
  
  // If translation doesn't exist or is empty, fall back to English
  if (!translation || Object.keys(translation).length === 0) {
    console.log(`Translation for ${language} not found or empty, falling back to English`);
    return translations.en;
  }
  
  console.log(`Using translations for: ${language}`);
  return translation;
}

export { translations };