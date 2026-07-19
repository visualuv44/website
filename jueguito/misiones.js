/* ══════════════════════════════════════
   REVELADO · Contenido de niveles y misiones
   Lightroom Classic (Mac) — núcleo gratis
   ══════════════════════════════════════ */

const NIVELES = [
  {
    id: "autosync",
    num: "01",
    titulo: "Editá una, revelá cien",
    tema: "Sincronización automática",
    intro: "El truco que casi nadie usa y que más tiempo ahorra. En un evento con la misma luz, editás UNA foto y Lightroom aplica cada cambio al resto, en vivo.",
    misiones: [
      {
        titulo: "Editá la foto guía",
        porque: "Toda tanda con luz parecida necesita una sola foto bien editada: la guía.",
        pasos: [
          "Abrí una sesión reciente con muchas fotos de luz parecida (un evento sirve perfecto).",
          "Andá al módulo Revelado (tecla D).",
          "Elegí una foto representativa de la tanda y editala como siempre: exposición, color, curva."
        ]
      },
      {
        titulo: "Encendé la sincronización automática",
        porque: "Acá está la magia: cada slider que muevas se aplica a todas las seleccionadas al mismo tiempo.",
        pasos: [
          "Con la foto guía activa, seleccioná las demás de la tanda en la tira de abajo (clic en la primera, Mayús + clic en la última).",
          "Mirá abajo a la derecha: el botón «Sincronizar» tiene un interruptor chiquito a su izquierda. Activalo — ahora dice «Sincronización automática».",
          "Mové un slider cualquiera y mirá la tira: todas las fotos cambian juntas."
        ],
        tip: "Si el botón dice «Sincronizar» a secas, es porque hay una sola foto seleccionada. Necesitás dos o más. Atajo para el interruptor: Cmd + Opción + Mayús + A."
      },
      {
        titulo: "La prueba de fuego (y el botón de apagar)",
        porque: "El error clásico: dejar Auto Sync prendido y editar «una foto» que en realidad son ochenta.",
        pasos: [
          "Editá una tanda completa de 20+ fotos con Auto Sync: guía primero, resto sincronizado.",
          "Pensá cuánto tardabas antes foto por foto. Ese es tu tiempo recuperado.",
          "Apagá el interruptor apenas termines. Siempre."
        ],
        tip: "Regla de oro: Auto Sync se prende para la tanda y se apaga al terminar, como una hornalla."
      }
    ]
  },
  {
    id: "copiar",
    num: "02",
    titulo: "Copiar con criterio",
    tema: "Copy / paste selectivo",
    intro: "Copiar TODOS los ajustes de una foto a otra rompe más de lo que arregla. La jugada pro es copiar solo lo que viaja bien entre fotos.",
    misiones: [
      {
        titulo: "El copiado quirúrgico",
        porque: "Curva, color, máscaras y detalle viajan bien. El recorte y el balance de blancos, no.",
        pasos: [
          "En Revelado, con una foto bien editada, apretá Cmd + Mayús + C.",
          "En el diálogo «Copiar ajustes», destildá todo (hay un botón para deseleccionar todas las casillas) y tildá solo: Curva de tonos, Color, Máscaras y Detalle.",
          "Destildá siempre: Recorte y Balance de blancos (si la luz cambia entre fotos, el BB copiado arruina todo)."
        ]
      },
      {
        titulo: "Pegá y comprobá",
        porque: "Ver la diferencia entre copiar todo y copiar con criterio te convence para siempre.",
        pasos: [
          "Elegí 5 fotos de otra tanda (otra luz, otro momento) y pegá con Cmd + Mayús + V.",
          "Ahora probá lo contrario: copiá TODO de la foto original y pegalo en una sola de esas fotos.",
          "Compará. ¿Viste el balance de blancos? Por eso se copia con criterio."
        ]
      }
    ]
  },
  {
    id: "presets",
    num: "03",
    titulo: "Tu set de presets",
    tema: "Presets propios por situación",
    intro: "No sirve un preset universal ni cuarenta bajados de internet. Sirven 6 u 8 tuyos, uno por situación real de trabajo, con nombres que digan cuándo usarlos.",
    misiones: [
      {
        titulo: "Mapeá tus situaciones reales",
        porque: "Tus presets tienen que salir de tu trabajo real, no de un pack de moda.",
        pasos: [
          "Anotá (papel, notas, donde sea) tus situaciones de sesión típicas. Por ejemplo: evento con luz cálida, evento de noche, producto en interior, retrato exterior, exterior nublado de El Bolsón, atardecer.",
          "Quedate con 6 a 8 máximo. Si tenés doce, agrupá."
        ]
      },
      {
        titulo: "Creá un preset por situación",
        porque: "Un preset tuyo, hecho desde una foto que ya te encanta, vale más que cualquier pack.",
        pasos: [
          "Buscá una foto BIEN editada de una de esas situaciones.",
          "En Revelado, panel izquierdo, al lado de «Ajustes preestablecidos» apretá el + → «Nuevo ajuste preestablecido» (atajo: Cmd + Mayús + N).",
          "Tildá lo que define el look (curva, color, detalle) y destildá exposición si varía mucho entre fotos.",
          "Nombralo por situación: «Evento — luz cálida», no «Vibes 04».",
          "Repetí para cada situación de tu lista."
        ],
        tip: "Guardalos en una carpeta propia, por ejemplo «VISUALUV», así aparecen todos juntos arriba."
      },
      {
        titulo: "La gran purga",
        porque: "Cuarenta presets que no usás son ruido que te hace dudar en cada foto.",
        pasos: [
          "Creá una carpeta de presets llamada «Archivo» (clic derecho en el panel de presets → Nueva carpeta).",
          "Arrastrá ahí todos los presets que no usaste en los últimos meses.",
          "Tu panel queda: tu carpeta con 6-8 presets, y el archivo escondido abajo."
        ]
      }
    ]
  },
  {
    id: "mascaras",
    num: "04",
    titulo: "Máscaras que se hacen solas",
    tema: "Selecciones con IA + presets adaptativos",
    intro: "Lightroom ya sabe encontrar el cielo, el sujeto y la piel por su cuenta. Y lo mejor: podés guardar esas máscaras dentro de un preset, y se recalculan solas en cada foto.",
    misiones: [
      {
        titulo: "Domá un cielo",
        porque: "El cielo quemado es el enemigo número uno de las fotos de exterior.",
        pasos: [
          "Abrí una foto de exterior con cielo.",
          "Apretá Mayús + W (o el circulito punteado de la barra de herramientas) → «Seleccionar cielo».",
          "Bajale la exposición unos -0,50 y el realce. Mirá cómo respira la foto."
        ]
      },
      {
        titulo: "Separá al sujeto del fondo",
        porque: "Iluminar al sujeto y apagar el fondo es el retoque que más se nota en retrato y evento.",
        pasos: [
          "En un retrato, creá una máscara → «Seleccionar sujeto».",
          "Subile un toque la exposición o la claridad al sujeto.",
          "Creá otra máscara → «Seleccionar sujeto» → botón «Invertir»: ahora tenés el fondo. Bajale un poco la exposición."
        ],
        tip: "También existe «Seleccionar personas» con partes específicas: piel de la cara, ojos, dientes, pelo. Probalo en la misma foto."
      },
      {
        titulo: "El preset que piensa",
        porque: "Esta es la técnica estrella: un preset que incluye la máscara de cielo y la recalcula en CADA foto donde lo apliques.",
        pasos: [
          "Con la foto del cielo editado abierta, creá un preset nuevo (+ → «Nuevo ajuste preestablecido»).",
          "En el diálogo, tildá también la casilla de máscaras — ahí viaja tu máscara de cielo.",
          "Nombralo «Exterior — cielo controlado».",
          "Abrí OTRA foto de exterior distinta y aplicáselo. El cielo se selecciona solo, en la forma de ESA foto."
        ]
      }
    ]
  },
  {
    id: "importar",
    num: "05",
    titulo: "Importar en piloto automático",
    tema: "Preset + copyright + nombres al importar",
    intro: "Todo lo que configures en el diálogo de importación pasa solo, para siempre, en cada sesión. Un rato de setup hoy = cero trabajo repetido mañana.",
    misiones: [
      {
        titulo: "Tu copyright en cada foto",
        porque: "Cada archivo que sale de tu catálogo debería llevar tu nombre adentro, sin que lo pienses.",
        pasos: [
          "Abrí el diálogo de importación (botón «Importar» en Biblioteca).",
          "A la derecha, buscá el panel «Aplicar durante la importación».",
          "En Metadatos → «Nuevo» → creá un preset con: Copyright «© Lucía Rocca — VISUALUV», estado de copyright «Con copyright».",
          "Guardalo como «VISUALUV base»."
        ]
      },
      {
        titulo: "Preset de revelado desde el minuto cero",
        porque: "Que las fotos ya entren con tu look base en vez de grises y planas.",
        pasos: [
          "En el mismo panel «Aplicar durante la importación», en «Ajustes de revelado» elegí uno de tus presets del Nivel 03 (el más neutro/versátil).",
          "Agregá también palabras clave de la sesión (ej.: «evento, nombre-cliente, 2026»)."
        ],
        tip: "Lightroom recuerda esta configuración: la próxima importación ya viene armada."
      },
      {
        titulo: "Nombres que se ordenan solos",
        porque: "«IMG_4832» no dice nada. «ClienteX_0047» se ordena, se busca y se entrega mejor.",
        pasos: [
          "En el diálogo de importación, panel «Cambio de nombre de archivo» → tildá «Cambiar nombre de archivos».",
          "En Plantilla elegí «Nombre personalizado - secuencia» y escribí el nombre de la sesión.",
          "Resultado: Cliente_0001, Cliente_0002… desde el origen."
        ]
      }
    ]
  },
  {
    id: "exportar",
    num: "06",
    titulo: "Exportar sin pensar",
    tema: "Presets de exportación por destino",
    intro: "Configurar la exportación a mano cada vez es tiempo perdido con riesgo de error. Se configura una vez por destino y nunca más.",
    misiones: [
      {
        titulo: "Armá tus cuatro salidas",
        porque: "Cada destino tiene su tamaño y su compresión ideales. Que queden grabados.",
        pasos: [
          "Seleccioná una foto y apretá Cmd + Mayús + E.",
          "Configurá para Instagram: JPEG, sRGB, borde largo 2160 px, calidad 85. A la izquierda → «Añadir» → guardalo como «01 · Instagram».",
          "Repetí y guardá: «02 · Web» (1600 px, calidad 80), «03 · Cliente» (JPEG calidad 100, tamaño completo), «04 · Impresión» (TIFF o JPEG 100, resolución 300 ppp)."
        ],
        tip: "El número adelante los mantiene ordenados en el panel."
      },
      {
        titulo: "Una tanda, dos destinos, un clic",
        porque: "Podés exportar a varios destinos AL MISMO TIEMPO. Poca gente lo sabe.",
        pasos: [
          "Seleccioná 10 fotos terminadas.",
          "Abrí Exportar y en el panel izquierdo tildá la casilla de «01 · Instagram» Y la de «03 · Cliente».",
          "Un solo «Exportar»: dos carpetas, dos formatos, cero configuración."
        ]
      }
    ]
  },
  {
    id: "catalogo",
    num: "07",
    titulo: "Catálogo que vuela",
    tema: "Previsualizaciones inteligentes + orden",
    intro: "Un catálogo gigante y desordenado hace que Lightroom se arrastre. Dos hábitos lo mantienen rápido para siempre.",
    misiones: [
      {
        titulo: "Editá sin el disco conectado",
        porque: "Las previsualizaciones inteligentes te dejan editar aunque los RAW vivan en un disco externo que quedó en casa.",
        pasos: [
          "Seleccioná una sesión entera en Biblioteca.",
          "Menú Biblioteca → «Previsualizaciones» → «Generar previsualizaciones inteligentes».",
          "Desconectá el disco (o imaginalo) y editá igual: los cambios se aplican a los RAW cuando vuelva."
        ]
      },
      {
        titulo: "Elegí tu esquema y anotalo",
        porque: "La decisión de cómo se parte el catálogo se toma una vez y ordena todo lo que viene.",
        pasos: [
          "Decidí: ¿un catálogo por año (2026, 2027…) o por rubro (Eventos, Producto, Retrato)?",
          "Para volumen de estudio, por año suele ganar: se archiva solo.",
          "Anotá el esquema donde lo veas (una nota fija). Cuando arranque el próximo año/rubro, catálogo nuevo."
        ]
      },
      {
        titulo: "Servicio de mantenimiento",
        porque: "Optimizar el catálogo es el «reiniciá y probá» de Lightroom: gratis y efectivo.",
        pasos: [
          "Menú Archivo → «Optimizar catálogo». Dale que sí.",
          "Aprovechá y en Ajustes del catálogo poné las previsualizaciones 1:1 a descartarse a los 30 días.",
          "Hacelo una vez por mes, o cuando lo notes lento."
        ]
      }
    ]
  }
];

/* ─── JEFE FINAL ─── */
const JEFE = {
  titulo: "La sesión de 20 minutos",
  intro: "Todo lo que desbloqueaste, junto, con una sesión real y el reloj corriendo. De la tarjeta a la entrega. El objetivo de hoy: menos de 30 minutos. El objetivo de siempre: 15-20.",
  pasos: [
    "Copiá los RAW de la tarjeta a tu carpeta de sesión.",
    "Importá con TODO aplicado: preset base, copyright, palabras clave y renombrado (Nivel 05).",
    "Pasada de selección rápida: P para las elegidas, X para las descartadas. Sin dudar más de 2 segundos por foto.",
    "Editá UNA foto guía por tanda de luz (Nivel 01).",
    "Auto Sync al resto de cada tanda. Apagalo al terminar.",
    "Retocá a mano SOLO las mejores — el 10-20% que va a portfolio o entrega destacada (Nivel 04).",
    "Exportá con tus presets, los destinos que necesites en un solo clic (Nivel 06).",
    "Backup de la sesión y a otra cosa."
  ]
};
