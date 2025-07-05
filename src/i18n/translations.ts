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
    vanityUrlTaken: string;
    vanityUrlAvailable: string;
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
      vanityUrlTaken: 'This URL is already taken. Please choose a different one.',
      vanityUrlAvailable: 'This URL is available!',
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
      vanityUrlTaken: 'Esta URL ya está en uso. Por favor elige otra diferente.',
      vanityUrlAvailable: '¡Esta URL está disponible!',
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
  // French translations
  fr: {
    header: {
      new: 'Nouveau',
      about: 'À propos',
      terms: 'Conditions',
    },
    main: {
      title: 'UrlList',
      subtitle: 'Grouper et Partager des Liens Multiples',
      addLinks: 'Ajouter des Liens',
      addLinksDescription: 'Entrez une URL et appuyez sur Entrée pour l\'ajouter à votre collection',
      urlPlaceholder: 'Entrez un lien et appuyez sur entrée',
      vanityUrl: 'URL Personnalisée',
      vanityUrlPlaceholder: 'mes-liens-super',
      vanityUrlEmpty: 'Laissez vide pour une URL générée automatiquement (ex : liens-super-123)',
      vanityUrlError: 'Seules les lettres, chiffres, tirets et tirets bas sont autorisés (3-50 caractères)',
      vanityUrlTaken: 'Cette URL est déjà utilisée. Veuillez en choisir une autre.',
      vanityUrlAvailable: 'Cette URL est disponible !',
      description: 'Description',
      descriptionPlaceholder: 'Décrivez votre collection de liens...',
      publishBundle: 'Publier la Collection',
      publishDescription: 'Rendez votre collection de liens disponible pour le partage',
      publish: 'Publier',
      publishing: 'Publication en cours...',
      publishedSuccess: 'Publication réussie !',
      publishedLiveAt: 'Votre collection est maintenant disponible à l\'adresse :',
      copyToClipboard: 'Copier dans le presse-papier',
      visitBundle: 'Voir la collection',
      previewBundle: 'Aperçu de la Collection',
      createNewBundle: 'Créer une Nouvelle Collection',
      newBundleConfirm: 'Êtes-vous sûr de vouloir créer une nouvelle collection ? Cela effacera tous vos liens et paramètres actuels.',
    },
    links: {
      title: 'Liens',
      dragToReorder: 'Glissez pour réorganiser les liens',
      noLinksYet: 'Aucun lien ajouté pour le moment',
      addFirstLink: 'Ajoutez votre premier lien ci-dessus pour commencer',
      openLink: 'Ouvrir le lien',
      removeLink: 'Supprimer le lien',
    },
    viewer: {
      linkBundle: 'Collection de Liens',
      backToEditor: 'Retour à l\'éditeur',
      created: 'Créé',
      madeWith: 'Fait avec',
    },
    errors: {
      invalidUrl: 'Veuillez entrer une URL valide',
      fetchFailed: 'Échec de la récupération des informations du lien',
      bundleNotFound: 'Collection Introuvable',
      bundleNotFoundDescription: 'La collection que vous recherchez n\'existe pas ou n\'a pas encore été publiée.',
      loadingBundle: 'Chargement de la collection...',
    },
    about: {
      title: 'À propos de UrlList',
      description1: 'UrlList est un outil simple pour grouper et partager plusieurs liens via une seule URL partageable.',
      description2: 'Idéal pour partager des collections de ressources, articles, outils ou tout groupe de liens avec des amis, collègues ou votre public.',
      description3: 'Aucune inscription requise - créez simplement votre collection et partagez-la instantanément !',
      builtWith: 'Construit avec React, TypeScript et Tailwind CSS',
      close: 'Fermer',
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      acceptance: {
        title: '1. Acceptation des Conditions',
        content: 'En utilisant UrlList, vous acceptez ces conditions d\'utilisation. Si vous n\'êtes pas d\'accord, veuillez ne pas utiliser notre service.',
      },
      service: {
        title: '2. Description du Service',
        content: 'UrlList permet aux utilisateurs de créer des collections de liens et de les partager via une seule URL. Le service est fourni tel quel, sans garantie.',
      },
      responsibilities: {
        title: '3. Responsabilités de l\'Utilisateur',
        content: 'Les utilisateurs sont responsables du contenu qu\'ils partagent et ne doivent pas utiliser le service pour du contenu illégal, nuisible ou inapproprié.',
      },
      privacy: {
        title: '4. Confidentialité',
        content: 'Nous respectons votre vie privée. Les collections publiées sont accessibles publiquement via leurs liens de partage. Les collections non publiées restent locales à votre navigateur.',
      },
      liability: {
        title: '5. Limitation de Responsabilité',
        content: 'UrlList est fourni sans garantie. Nous ne sommes pas responsables des dommages résultant de l\'utilisation du service.',
      },
      changes: {
        title: '6. Modifications des Conditions',
        content: 'Nous nous réservons le droit de modifier ces conditions à tout moment. L\'utilisation continue du service constitue l\'acceptation des conditions mises à jour.',
      },
      close: 'Fermer',
    },
    language: {
      selectLanguage: 'Choisir la langue',
    },
  },
  // German translations
  de: {
    header: {
      new: 'Neu',
      about: 'Über uns',
      terms: 'Nutzungsbedingungen',
    },
    main: {
      title: 'UrlList',
      subtitle: 'Mehrere Links bündeln und teilen',
      addLinks: 'Links hinzufügen',
      addLinksDescription: 'Geben Sie eine URL ein und drücken Sie die Eingabetaste, um sie zu Ihrem Bundle hinzuzufügen',
      urlPlaceholder: 'Link eingeben und Enter drücken',
      vanityUrl: 'Benutzerdefinierte URL',
      vanityUrlPlaceholder: 'meine-tollen-links',
      vanityUrlEmpty: 'Leer lassen für eine automatisch generierte URL (z.B. tolle-links-123)',
      vanityUrlError: 'Nur Buchstaben, Zahlen, Bindestriche und Unterstriche erlaubt (3-50 Zeichen)',
      vanityUrlTaken: 'Diese URL ist bereits vergeben. Bitte wählen Sie eine andere.',
      vanityUrlAvailable: 'Diese URL ist verfügbar!',
      description: 'Beschreibung',
      descriptionPlaceholder: 'Beschreiben Sie Ihre Linksammlung...',
      publishBundle: 'Bundle veröffentlichen',
      publishDescription: 'Machen Sie Ihr Link-Bundle für jeden zum Teilen verfügbar',
      publish: 'Veröffentlichen',
      publishing: 'Wird veröffentlicht...',
      publishedSuccess: 'Erfolgreich veröffentlicht!',
      publishedLiveAt: 'Ihr Bundle ist jetzt verfügbar unter:',
      copyToClipboard: 'In die Zwischenablage kopieren',
      visitBundle: 'Bundle besuchen',
      previewBundle: 'Vorschau des Bundles',
      createNewBundle: 'Neues Bundle erstellen',
      newBundleConfirm: 'Sind Sie sicher, dass Sie ein neues Bundle erstellen möchten? Dadurch werden alle aktuellen Links und Einstellungen gelöscht.',
    },
    links: {
      title: 'Links',
      dragToReorder: 'Zum Sortieren ziehen',
      noLinksYet: 'Noch keine Links hinzugefügt',
      addFirstLink: 'Fügen Sie oben Ihren ersten Link hinzu',
      openLink: 'Link öffnen',
      removeLink: 'Link entfernen',
    },
    viewer: {
      linkBundle: 'Link-Bundle',
      backToEditor: 'Zurück zum Editor',
      created: 'Erstellt',
      madeWith: 'Erstellt mit',
    },
    errors: {
      invalidUrl: 'Bitte geben Sie eine gültige URL ein',
      fetchFailed: 'Fehler beim Abrufen der Link-Informationen',
      bundleNotFound: 'Bundle nicht gefunden',
      bundleNotFoundDescription: 'Das gesuchte Bundle existiert nicht oder wurde noch nicht veröffentlicht.',
      loadingBundle: 'Lade Bundle...',
    },
    about: {
      title: 'Über UrlList',
      description1: 'UrlList ist ein einfaches Tool zum Bündeln und Teilen mehrerer URLs über einen einzigen, teilbaren Link.',
      description2: 'Perfekt zum Teilen von Sammlungen mit Ressourcen, Artikeln, Tools oder beliebigen Linkgruppen mit Freunden, Kollegen oder Ihrem Publikum.',
      description3: 'Keine Anmeldung erforderlich - einfach Ihr Bundle erstellen und sofort teilen!',
      builtWith: 'Erstellt mit React, TypeScript und Tailwind CSS',
      close: 'Schließen',
    },
    terms: {
      title: 'Nutzungsbedingungen',
      acceptance: {
        title: '1. Annahme der Bedingungen',
        content: 'Durch die Nutzung von UrlList stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie nicht einverstanden sind, nutzen Sie bitte unseren Dienst nicht.',
      },
      service: {
        title: '2. Dienstbeschreibung',
        content: 'UrlList ermöglicht es Benutzern, Sammlungen von URLs zu erstellen und über einen einzigen Link zu teilen. Der Dienst wird ohne jegliche Gewährleistung angeboten.',
      },
      responsibilities: {
        title: '3. Benutzerverantwortung',
        content: 'Benutzer sind für die von ihnen geteilten Inhalte verantwortlich und dürfen den Dienst nicht für illegale, schädliche oder unangemessene Inhalte nutzen.',
      },
      privacy: {
        title: '4. Datenschutz',
        content: 'Wir respektieren Ihre Privatsphäre. Veröffentlichte Bundles sind über ihre Teilen-Links öffentlich zugänglich. Nicht veröffentlichte Bundles verbleiben lokal in Ihrem Browser.',
      },
      liability: {
        title: '5. Haftungsbeschränkung',
        content: 'UrlList wird ohne Gewährleistung angeboten. Wir übernehmen keine Haftung für Schäden, die aus der Nutzung des Dienstes entstehen.',
      },
      changes: {
        title: '6. Änderungen der Bedingungen',
        content: 'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Die weitere Nutzung des Dienstes stellt die Annahme der aktualisierten Bedingungen dar.',
      },
      close: 'Schließen',
    },
    language: {
      selectLanguage: 'Sprache auswählen',
    },
  },
  // Portuguese translations
  pt: {
    header: {
      new: 'Novo',
      about: 'Sobre',
      terms: 'Termos',
    },
    main: {
      title: 'UrlList',
      subtitle: 'Agrupe e Compartilhe Múltiplos Links',
      addLinks: 'Adicionar Links',
      addLinksDescription: 'Digite uma URL e pressione Enter para adicionar ao seu pacote',
      urlPlaceholder: 'Digite um link e pressione enter',
      vanityUrl: 'URL Personalizada',
      vanityUrlPlaceholder: 'meus-links-incriveis',
      vanityUrlEmpty: 'Deixe em branco para gerar uma URL automática (ex: links-incriveis-123)',
      vanityUrlError: 'Apenas letras, números, hífens e sublinhados são permitidos (3-50 caracteres)',
      vanityUrlTaken: 'Esta URL já está em uso. Por favor, escolha outra.',
      vanityUrlAvailable: 'Esta URL está disponível!',
      description: 'Descrição',
      descriptionPlaceholder: 'Descreva sua coleção de links...',
      publishBundle: 'Publicar Pacote',
      publishDescription: 'Torne seu pacote de links disponível para compartilhamento',
      publish: 'Publicar',
      publishing: 'Publicando...',
      publishedSuccess: 'Publicado com sucesso!',
      publishedLiveAt: 'Seu pacote está disponível em:',
      copyToClipboard: 'Copiar para a área de transferência',
      visitBundle: 'Visitar pacote',
      previewBundle: 'Visualizar Pacote',
      createNewBundle: 'Criar Novo Pacote',
      newBundleConfirm: 'Tem certeza de que deseja criar um novo pacote? Isso limpará todos os seus links e configurações atuais.',
    },
    links: {
      title: 'Links',
      dragToReorder: 'Arraste para reordenar os links',
      noLinksYet: 'Nenhum link adicionado ainda',
      addFirstLink: 'Adicione seu primeiro link acima para começar',
      openLink: 'Abrir link',
      removeLink: 'Remover link',
    },
    viewer: {
      linkBundle: 'Pacote de Links',
      backToEditor: 'Voltar ao editor',
      created: 'Criado',
      madeWith: 'Feito com',
    },
    errors: {
      invalidUrl: 'Por favor, insira uma URL válida',
      fetchFailed: 'Falha ao buscar informações do link',
      bundleNotFound: 'Pacote Não Encontrado',
      bundleNotFoundDescription: 'O pacote que você está procurando não existe ou ainda não foi publicado.',
      loadingBundle: 'Carregando pacote...',
    },
    about: {
      title: 'Sobre o UrlList',
      description1: 'UrlList é uma ferramenta simples para agrupar e compartilhar múltiplas URLs através de um único link compartilhável.',
      description2: 'Perfeito para compartilhar coleções de recursos, artigos, ferramentas ou qualquer grupo de links com amigos, colegas ou seu público.',
      description3: 'Não é necessário cadastro - basta criar seu pacote e compartilhar instantaneamente!',
      builtWith: 'Construído com React, TypeScript e Tailwind CSS',
      close: 'Fechar',
    },
    terms: {
      title: 'Termos de Serviço',
      acceptance: {
        title: '1. Aceitação dos Termos',
        content: 'Ao usar o UrlList, você concorda com estes termos de serviço. Se você não concordar, por favor, não use nosso serviço.',
      },
      service: {
        title: '2. Descrição do Serviço',
        content: 'O UrlList permite que os usuários criem pacotes de URLs e os compartilhem através de um único link. O serviço é fornecido como está, sem garantias.',
      },
      responsibilities: {
        title: '3. Responsabilidades do Usuário',
        content: 'Os usuários são responsáveis pelo conteúdo que compartilham e não devem usar o serviço para conteúdo ilegal, prejudicial ou inadequado.',
      },
      privacy: {
        title: '4. Privacidade',
        content: 'Respeitamos sua privacidade. Os pacotes publicados são acessíveis publicamente através de seus links de compartilhamento. Pacotes não publicados permanecem locais em seu navegador.',
      },
      liability: {
        title: '5. Limitação de Responsabilidade',
        content: 'O UrlList é fornecido sem garantia. Não somos responsáveis por quaisquer danos decorrentes do uso do serviço.',
      },
      changes: {
        title: '6. Alterações nos Termos',
        content: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. O uso contínuo do serviço constitui aceitação dos termos atualizados.',
      },
      close: 'Fechar',
    },
    language: {
      selectLanguage: 'Selecionar idioma',
    },
  },
  // Japanese translations
  ja: {
    header: {
      new: '新規',
      about: 'アバウト',
      terms: '利用規約',
    },
    main: {
      title: 'UrlList',
      subtitle: '複数のURLをまとめて共有',
      addLinks: 'リンクを追加',
      addLinksDescription: 'URLを入力してEnterキーを押すと、バンドルに追加されます',
      urlPlaceholder: 'リンクを入力してEnterキーを押してください',
      vanityUrl: 'カスタムURL',
      vanityUrlPlaceholder: 'my-awesome-links',
      vanityUrlEmpty: '自動生成されるURLを使用する場合は空欄のままにしてください（例：amazing-links-123）',
      vanityUrlError: '使用できるのは英数字、ハイフン、アンダースコアのみです（3〜50文字）',
      vanityUrlTaken: 'このURLは既に使用されています。別のURLを選択してください。',
      vanityUrlAvailable: 'このURLは利用可能です！',
      description: '説明',
      descriptionPlaceholder: 'リンクのコレクションについて説明...',
      publishBundle: 'バンドルを公開',
      publishDescription: 'リンクのバンドルを誰とでも共有できるようにします',
      publish: '公開する',
      publishing: '公開中...',
      publishedSuccess: '公開に成功しました！',
      publishedLiveAt: 'バンドルは以下のURLで公開されました：',
      copyToClipboard: 'クリップボードにコピー',
      visitBundle: 'バンドルを表示',
      previewBundle: 'バンドルをプレビュー',
      createNewBundle: '新しいバンドルを作成',
      newBundleConfirm: '新しいバンドルを作成しますか？現在のすべてのリンクと設定が削除されます。',
    },
    links: {
      title: 'リンク',
      dragToReorder: 'ドラッグして並べ替え',
      noLinksYet: 'リンクがまだ追加されていません',
      addFirstLink: '上記に最初のリンクを追加して開始',
      openLink: 'リンクを開く',
      removeLink: 'リンクを削除',
    },
    viewer: {
      linkBundle: 'リンクバンドル',
      backToEditor: 'エディターに戻る',
      created: '作成日',
      madeWith: '作成：',
    },
    errors: {
      invalidUrl: '有効なURLを入力してください',
      fetchFailed: 'リンク情報の取得に失敗しました',
      bundleNotFound: 'バンドルが見つかりません',
      bundleNotFoundDescription: 'お探しのバンドルは存在しないか、まだ公開されていません。',
      loadingBundle: 'バンドルを読み込み中...',
    },
    about: {
      title: 'UrlListについて',
      description1: 'UrlListは、複数のURLを1つの共有可能なリンクでまとめて共有できるシンプルなツールです。',
      description2: 'リソース、記事、ツール、または任意のリンクのコレクションを友人、同僚、または視聴者と共有するのに最適です。',
      description3: '登録不要 - バンドルを作成してすぐに共有できます！',
      builtWith: 'React、TypeScript、Tailwind CSSで構築',
      close: '閉じる',
    },
    terms: {
      title: '利用規約',
      acceptance: {
        title: '1. 利用規約の同意',
        content: 'UrlListをご利用いただくことで、これらの利用規約に同意いただいたものとみなされます。同意いただけない場合は、当サービスをご利用いただけません。',
      },
      service: {
        title: '2. サービスの説明',
        content: 'UrlListは、ユーザーがURLのバンドルを作成し、1つのリンクで共有できるようにするサービスです。本サービスは現状のまま提供され、いかなる保証もありません。',
      },
      responsibilities: {
        title: '3. ユーザーの責任',
        content: 'ユーザーは、共有するコンテンツについて責任を負うものとし、違法、有害、または不適切なコンテンツに本サービスを使用してはなりません。',
      },
      privacy: {
        title: '4. プライバシー',
        content: '当社はあなたのプライバシーを尊重します。公開されたバンドルは、共有リンクを通じて誰でもアクセス可能です。非公開のバンドルは、ブラウザにローカルに保存されます。',
      },
      liability: {
        title: '5. 責任の制限',
        content: 'UrlListは無保証で提供されます。当社は、本サービスの利用に起因するいかなる損害についても責任を負いません。',
      },
      changes: {
        title: '6. 規約の変更',
        content: '当社は、いつでもこれらの規約を変更する権利を有します。本サービスの継続的な利用は、更新された規約の受諾を意味します。',
      },
      close: '閉じる',
    },
    language: {
      selectLanguage: '言語を選択',
    },
  },
  // Korean translations
  ko: {
    header: {
      new: '새로 만들기',
      about: '소개',
      terms: '이용약관',
    },
    main: {
      title: 'UrlList',
      subtitle: '여러 링크를 한 번에 공유하세요',
      addLinks: '링크 추가',
      addLinksDescription: 'URL을 입력하고 엔터를 눌러 번들에 추가하세요',
      urlPlaceholder: '링크를 입력하고 엔터를 누르세요',
      vanityUrl: '사용자 정의 URL',
      vanityUrlPlaceholder: '내-멋진-링크들',
      vanityUrlEmpty: '자동 생성되는 URL을 원하시면 비워두세요 (예: 멋진-링크들-123)',
      vanityUrlError: '영문자, 숫자, 하이픈, 언더스코어만 사용 가능합니다 (3-50자)',
      vanityUrlTaken: '이미 사용 중인 URL입니다. 다른 URL을 선택해주세요.',
      vanityUrlAvailable: '사용 가능한 URL입니다!',
      description: '설명',
      descriptionPlaceholder: '링크 모음에 대한 설명을 입력하세요...',
      publishBundle: '번들 공개',
      publishDescription: '링크 모음을 공유할 수 있게 만드세요',
      publish: '공개하기',
      publishing: '공개 중...',
      publishedSuccess: '성공적으로 공개되었습니다!',
      publishedLiveAt: '번들이 다음 주소에서 확인 가능합니다:',
      copyToClipboard: '클립보드에 복사',
      visitBundle: '번들 보기',
      previewBundle: '미리보기',
      createNewBundle: '새 번들 만들기',
      newBundleConfirm: '새 번들을 만들겠습니까? 현재의 모든 링크와 설정이 삭제됩니다.',
    },
    links: {
      title: '링크',
      dragToReorder: '드래그하여 순서 변경',
      noLinksYet: '아직 추가된 링크가 없습니다',
      addFirstLink: '위에 첫 번째 링크를 추가해보세요',
      openLink: '링크 열기',
      removeLink: '링크 삭제',
    },
    viewer: {
      linkBundle: '링크 번들',
      backToEditor: '편집기로 돌아가기',
      created: '생성일',
      madeWith: '만든이',
    },
    errors: {
      invalidUrl: '유효한 URL을 입력해주세요',
      fetchFailed: '링크 정보를 가져오는데 실패했습니다',
      bundleNotFound: '번들을 찾을 수 없음',
      bundleNotFoundDescription: '요청하신 번들이 존재하지 않거나 아직 공개되지 않았습니다.',
      loadingBundle: '번들 불러오는 중...',
    },
    about: {
      title: 'UrlList 소개',
      description1: 'UrlList는 여러 URL을 하나의 공유 가능한 링크로 모아주는 간단한 도구입니다.',
      description2: '리소스, 기사, 도구 또는 모든 종류의 링크 모음을 친구, 동료 또는 팔로워들과 공유하기에 완벽합니다.',
      description3: '가입 없이도 바로 사용 가능 - 지금 바로 번들을 만들어 공유해보세요!',
      builtWith: 'React, TypeScript, Tailwind CSS로 제작됨',
      close: '닫기',
    },
    terms: {
      title: '이용약관',
      acceptance: {
        title: '1. 약관 동의',
        content: 'UrlList를 사용함으로써 귀하는 본 이용약관에 동의하는 것으로 간주됩니다. 동의하지 않으시면 서비스를 이용하실 수 없습니다.',
      },
      service: {
        title: '2. 서비스 설명',
        content: 'UrlList는 사용자가 여러 URL을 하나의 링크로 묶어 공유할 수 있게 해주는 서비스입니다. 본 서비스는 있는 그대로 제공되며 어떠한 보증도 제공하지 않습니다.',
      },
      responsibilities: {
        title: '3. 사용자 책임',
        content: '사용자는 공유하는 콘텐츠에 대한 책임이 있으며, 불법적이거나 유해한 콘텐츠에는 본 서비스를 사용해서는 안 됩니다.',
      },
      privacy: {
        title: '4. 개인정보 보호',
        content: '귀하의 개인정보를 존중합니다. 공개된 번들은 공유 링크를 통해 누구나 접근할 수 있습니다. 비공개 번들은 귀하의 브라우저에 로컬로 저장됩니다.',
      },
      liability: {
        title: '5. 책임 제한',
        content: 'UrlList는 어떠한 보증 없이 제공됩니다. 당사는 본 서비스 사용으로 인해 발생하는 어떠한 손해에 대해서도 책임을 지지 않습니다.',
      },
      changes: {
        title: '6. 약관 변경',
        content: '당사는 언제든지 본 약관을 변경할 권리를 가집니다. 변경 후에도 서비스를 계속 사용하시면 변경된 약관에 동의하는 것으로 간주됩니다.',
      },
      close: '닫기',
    },
    language: {
      selectLanguage: '언어 선택',
    },
  },
  // Chinese (Simplified) translations
  zh: {
    header: {
      new: '新建',
      about: '关于',
      terms: '服务条款',
    },
    main: {
      title: '链接集合',
      subtitle: '批量分享多个链接',
      addLinks: '添加链接',
      addLinksDescription: '输入网址并按回车键添加到集合',
      urlPlaceholder: '输入链接并按回车',
      vanityUrl: '自定义链接',
      vanityUrlPlaceholder: '我的链接集合',
      vanityUrlEmpty: '留空将自动生成链接（例如：awesome-links-123）',
      vanityUrlError: '只能使用字母、数字、连字符和下划线（3-50个字符）',
      vanityUrlTaken: '该链接已被使用，请选择其他链接',
      vanityUrlAvailable: '该链接可用！',
      description: '描述',
      descriptionPlaceholder: '描述您的链接集合...',
      publishBundle: '发布集合',
      publishDescription: '将您的链接集合发布为可分享的链接',
      publish: '发布',
      publishing: '发布中...',
      publishedSuccess: '发布成功！',
      publishedLiveAt: '您的集合已发布至：',
      copyToClipboard: '复制到剪贴板',
      visitBundle: '访问集合',
      previewBundle: '预览集合',
      createNewBundle: '创建新集合',
      newBundleConfirm: '确定要创建新集合吗？当前所有链接和设置将被清空。',
    },
    links: {
      title: '链接',
      dragToReorder: '拖拽以重新排序',
      noLinksYet: '尚未添加链接',
      addFirstLink: '在上方添加第一个链接开始',
      openLink: '打开链接',
      removeLink: '删除链接',
    },
    viewer: {
      linkBundle: '链接集合',
      backToEditor: '返回编辑器',
      created: '创建于',
      madeWith: '使用',
    },
    errors: {
      invalidUrl: '请输入有效的网址',
      fetchFailed: '获取链接信息失败',
      bundleNotFound: '未找到集合',
      bundleNotFoundDescription: '您查找的链接集合不存在或尚未发布。',
      loadingBundle: '正在加载集合...',
    },
    about: {
      title: '关于链接集合',
      description1: '链接集合是一个简单工具，可将多个网址合并为一个可分享的链接。',
      description2: '非常适合与朋友、同事或关注者分享资源、文章、工具或任何链接集合。',
      description3: '无需注册 - 立即创建并分享您的链接集合！',
      builtWith: '使用 React、TypeScript 和 Tailwind CSS 构建',
      close: '关闭',
    },
    terms: {
      title: '服务条款',
      acceptance: {
        title: '1. 条款接受',
        content: '使用链接集合即表示您同意本服务条款。如果您不同意，请不要使用我们的服务。',
      },
      service: {
        title: '2. 服务说明',
        content: '链接集合允许用户创建网址集合并通过单个链接分享。本服务按"原样"提供，不提供任何形式的保证。',
      },
      responsibilities: {
        title: '3. 用户责任',
        content: '用户应对其分享的内容负责，不得将本服务用于非法、有害或不适当的内容。',
      },
      privacy: {
        title: '4. 隐私',
        content: '我们尊重您的隐私。已发布的集合可通过其分享链接公开访问。未发布的集合仅保存在您的浏览器本地。',
      },
      liability: {
        title: '5. 责任限制',
        content: '链接集合不提供任何保证。对于因使用本服务而产生的任何损害，我们不承担任何责任。',
      },
      changes: {
        title: '6. 条款变更',
        content: '我们保留随时修改本条款的权利。继续使用本服务即表示您接受更新后的条款。',
      },
      close: '关闭',
    },
    language: {
      selectLanguage: '选择语言',
    },
  },
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