import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar" | "es" | "zh" | "ru" | "de" | "ja";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    home: "Home",
    profile: "Profile",
    bookmarks: "Bookmarks",
    settings: "Settings",
    language: "Language",
    guide: "Guide",
    login: "Login",
    register: "Register",
    logout: "LogOut",
    myPosts: "My Posts",
    privacy: "Privacy & Password",
    guideTitle: "How to use the app",
    guideDesc: "Everything you need to know — no login required to read.",
    guideSearch: "search the guide... (e.g. share, password, reply)",
    guideNoResults: "no results for",
    quickLinks: "Quick Links",
    footerTagline:
      "Share posts, comment, follow friends and bookmark what you love — all in one place.",
    rights: "All rights reserved.",

    "guide.0.title": "Create a post",
    "guide.0.step.0": "Go to Home and write in “What's on your mind?”.",
    "guide.0.step.1": "Optionally attach one image using the Upload Image box.",
    "guide.0.step.2":
      "Press Post — it appears instantly at the top of the feed.",
    "guide.0.step.3":
      "On your own posts use the ⋮ menu → Edit (text + image) or Delete.",

    "guide.1.title": "Comments & replies",
    "guide.1.step.0":
      "Write in “Write a comment...” under any post and press the send button.",
    "guide.1.step.1":
      "Long comments are cut to 3 lines — press “See more” to read all.",
    "guide.1.step.2":
      "Press the reply icon to answer a comment; the box auto-fills @username (mention).",
    "guide.1.step.3":
      "You can also reply to a reply — it stays in the same thread with the @mention.",
    "guide.1.step.4":
      "Edit ✏️ and delete 🗑 appear only on YOUR own comments/replies.",

    "guide.2.title": "Like, Bookmark, Share",
    "guide.2.step.0":
      "Like: tap the thumbs icon — it turns blue and the count updates instantly.",
    "guide.2.step.1":
      "Bookmark: tap the ribbon icon (turns amber) → find it later in the Bookmarks page.",
    "guide.2.step.2":
      "Share: tap Share, optionally write a caption, press Share. Note: sharing allows ONE share per user per post.",

    "guide.3.title": "Follow & profiles",
    "guide.3.step.0": "Click any name/photo to open that user's profile.",
    "guide.3.step.1": "Press Follow / Unfollow — the button updates instantly.",
    "guide.3.step.2":
      "“Who to follow” suggestions are on the right side of Home (desktop).",
    "guide.3.step.3":
      "Your Profile page has tabs: My Posts / Settings / Privacy & Password.",

    "guide.4.title": "Notifications",
    "guide.4.step.0":
      "The bell in the navbar shows the unread count in a red badge.",
    "guide.4.step.1":
      "Open it to see who liked / commented / followed / mentioned you.",
    "guide.4.step.2": "Click a notification to jump to the related post.",
    "guide.4.step.3":
      "Use the ✓ button on one item, or “mark all as read” for everything.",

    "guide.5.title": "Photo & password",
    "guide.5.step.0":
      "Profile → click your avatar → the change-photo form opens → choose + upload.",
    "guide.5.step.1":
      "Uploading a new photo also auto-posts “updated profile picture.” to your feed.",
    "guide.5.step.2":
      "Privacy & Password tab → enter old + new password (8+ chars, A-Z, a-z, 0-9, symbol).",

    "guide.6.title": " limits (good to know)",
    "guide.6.step.0":
      "One share per user per post (“Post already shared” error otherwise).",
    "guide.6.step.1":
      "Replies are one level only — answering a reply posts into the same thread.",
    "guide.6.step.2":
      "Comment count on Home = top-level comments; the details page adds replies.",
    "guide.6.step.3":
      "There is NO forgot-password endpoint — keep your password safe!",

    "guide.7.title": "Editing & Images",
    "guide.7.step.0":
      "Edit a post/comment: Use the ⋮ menu (or ✏️ on comments) → Edit. The new text/image appears instantly for you and for all users.",
    "guide.7.step.1":
      "View images: Double-click any image in a post or comment to open it full-screen.",
    "guide.7.step.2":
      "In full-screen view: Click the X to close, or the 👍 button to react.",

    "guide.8.title": "Dark mode & language",
    "guide.8.step.0":
      "Navbar: tap the 🌙 / ☀️ button to flip dark/light — navbar, cards and menus all follow instantly.",
    "guide.8.step.1":
      "Profile → Settings → Language: choose from 7 languages (English, العربية, Español, 中文, Русский, Deutsch, 日本語).",
    "guide.8.step.2":
      "Picking العربية flips the whole layout to RTL automatically; other languages stay LTR.",
    "guide.8.step.3":
      "Theme + language are saved in your browser — refresh keeps both.",
    "guide.8.step.4":
      "The soft background blobs drift slowly and move with your scroll (disabled if your system prefers reduced motion).",
  },

  ar: {
    home: "الرئيسية",
    profile: "الملف الشخصي",
    bookmarks: "الإشارات المرجعية",
    settings: "الإعدادات",
    language: "اللغة",
    guide: "الدليل",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    myPosts: "منشوراتي",
    privacy: "الخصوصية وكلمة المرور",
    guideTitle: "كيف تستخدم التطبيق",
    guideDesc: "كل ما تحتاج معرفته — لا يحتاج تسجيل دخول للقراءة.",
    guideSearch: "ابحث في الدليل... (مثال: مشاركة، كلمة المرور، رد)",
    guideNoResults: "لا نتائج لـ",
    quickLinks: "روابط سريعة",
    footerTagline:
      "شارك المنشورات، علّق، تابع أصدقاءك واحفظ ما تحب — في مكان واحد.",
    rights: "جميع الحقوق محفوظة.",

    "guide.0.title": "إنشاء منشور",
    "guide.0.step.0": "اذهب إلى الرئيسية واكتب في «بمَ تفكر؟».",
    "guide.0.step.1": "اختياريًا أرفق صورة واحدة باستخدام مربع رفع الصورة.",
    "guide.0.step.2": "اضغط نشر — يظهر فورًا في أعلى التغذية.",
    "guide.0.step.3": "على منشوراتك استخدم قائمة ⋮ ← تعديل (نص + صورة) أو حذف.",

    "guide.1.title": "التعليقات والردود",
    "guide.1.step.0":
      "اكتب في «اكتب تعليقًا...» أسفل أي منشور واضغط زر الإرسال.",
    "guide.1.step.1":
      "التعليقات الطويلة تُقطع إلى 3 أسطر — اضغط «عرض المزيد» لقراءتها كاملة.",
    "guide.1.step.2":
      "اضغط أيقونة الرد للرد على تعليق؛ يُملأ الصندوق تلقائيًا بـ @اسم_المستخدم (إشارة).",
    "guide.1.step.3":
      "يمكنك أيضًا الرد على رد — يبقى في نفس السلسلة مع الإشارة @.",
    "guide.1.step.4": "تعديل ✏️ وحذف 🗑 تظهر فقط على تعليقاتك/ردودك الخاصة.",

    "guide.2.title": "الإعجاب والحفظ والمشاركة",
    "guide.2.step.0":
      "إعجاب: اضغط أيقونة الإبهام — تتحول إلى الأزرق ويتحدث العدد فورًا.",
    "guide.2.step.1":
      "حفظ: اضغط أيقونة الشريط (تتحول إلى الكهرماني) ← تجدها لاحقًا في صفحة الإشارات المرجعية.",
    "guide.2.step.2":
      "مشاركة: اضغط مشاركة، اختياريًا اكتب تعليقًا، ثم اضغط مشاركة. ملاحظة: المشاركة تسمح بمشاركة واحدة لكل مستخدم لكل منشور.",

    "guide.3.title": "المتابعة والملفات الشخصية",
    "guide.3.step.0": "اضغط على أي اسم/صورة لفتح ملف ذلك المستخدم.",
    "guide.3.step.1": "اضغط متابعة / إلغاء المتابعة — يتحدث الزر فورًا.",
    "guide.3.step.2":
      "اقتراحات «من تتابع» على الجانب الأيمن من الرئيسية (سطح المكتب).",
    "guide.3.step.3":
      "صفحة ملفك الشخصي بها تبويبات: منشوراتي / الإعدادات / الخصوصية وكلمة المرور.",

    "guide.4.title": "الإشعارات",
    "guide.4.step.0":
      "الجرس في الشريط العلوي يُظهر عدد غير المقروء في شارة حمراء.",
    "guide.4.step.1": "افتحه لترى من أعجب / علّق / تابع / أشار إليك.",
    "guide.4.step.2": "اضغط على إشعار للانتقال إلى المنشور ذي الصلة.",
    "guide.4.step.3":
      "استخدم زر ✓ على عنصر واحد، أو «تحديد الكل كمقروء» لكل الإشعارات.",

    "guide.5.title": "الصورة وكلمة المرور",
    "guide.5.step.0":
      "الملف الشخصي ← اضغط صورتك ← يفتح نموذج تغيير الصورة ← اختر + ارفع.",
    "guide.5.step.1":
      "رفع صورة جديدة ينشر تلقائيًا «قام بتحديث صورة الملف الشخصي.» في تغذيتك.",
    "guide.5.step.2":
      "تبويب الخصوصية وكلمة المرور ← أدخل كلمة المرور القديمة + الجديدة (8+ أحرف، A-Z، a-z، 0-9، رمز).",

    "guide.6.title": "الحدود (من الجيد معرفتها)",
    "guide.6.step.0":
      "مشاركة واحدة لكل مستخدم لكل منشور (وإلا خطأ «المنشور تمت مشاركته بالفعل»).",
    "guide.6.step.1":
      "الردود بمستوى واحد فقط — الرد على رد يُنشر في نفس السلسلة.",
    "guide.6.step.2":
      "عدد التعليقات في الرئيسية = التعليقات الرئيسية؛ صفحة التفاصيل تضيف الردود.",
    "guide.6.step.3":
      "لا يوجد رابط لنسيان كلمة المرور — احفظ كلمة مرورك بأمان!",

    "guide.7.title": "التعديل والصور",
    "guide.7.step.0":
      "تعديل منشور/تعليق: استخدم قائمة ⋮ (أو ✏️ على التعليقات) ← تعديل. يظهر النص/الصورة الجديد فورًا لك ولجميع المستخدمين.",
    "guide.7.step.1":
      "عرض الصور: انقر نقرًا مزدوجًا على أي صورة في منشور أو تعليق لفتحها بملء الشاشة.",
    "guide.7.step.2": "في العرض بملء الشاشة: اضغط X للإغلاق، أو زر 👍 للتفاعل.",

    "guide.8.title": "الوضع الداكن واللغة",
    "guide.8.step.0":
      "الشريط العلوي: اضغط زر 🌙 / ☀️ لتبديل الداكن/الفاتح — الشريط والبطاقات والقوائم تتبع فورًا.",
    "guide.8.step.1":
      "الملف الشخصي ← الإعدادات ← اللغة: اختر من 7 لغات (English, العربية, Español, 中文, Русский, Deutsch, 日本語).",
    "guide.8.step.2":
      "اختيار العربية يحول التخطيط بالكامل إلى RTL تلقائيًا؛ اللغات الأخرى تبقى LTR.",
    "guide.8.step.3": "المظهر + اللغة محفوظان في متصفحك — التحديث يحتفظ بهما.",
    "guide.8.step.4":
      "البقع الخلفية الناعمة تنجرف ببطء وتتحرك مع التمرير (معطلة إذا كان نظامك يفضل تقليل الحركة).",
  },

  es: {
    home: "Inicio",
    profile: "Perfil",
    bookmarks: "Marcadores",
    settings: "Configuración",
    language: "Idioma",
    guide: "Guía",
    login: "Iniciar sesión",
    register: "Registrarse",
    logout: "Cerrar sesión",
    myPosts: "Mis publicaciones",
    privacy: "Privacidad y contraseña",
    guideTitle: "Cómo usar la aplicación",
    guideDesc: "Todo lo que necesitas saber — no requiere inicio de sesión.",
    guideSearch: "busca en la guía... (ej. compartir, contraseña, responder)",
    guideNoResults: "sin resultados para",
    quickLinks: "Enlaces rápidos",
    footerTagline:
      "Comparte, comenta, sigue amigos y guarda lo que te gusta en un solo lugar.",
    rights: "Todos los derechos reservados.",

    "guide.0.title": "Crear una publicación",
    "guide.0.step.0": "Ve a Inicio y escribe en «¿Qué estás pensando?».",
    "guide.0.step.1":
      "Opcionalmente adjunta una imagen usando el cuadro Subir imagen.",
    "guide.0.step.2":
      "Presiona Publicar — aparece al instante en la parte superior del feed.",
    "guide.0.step.3":
      "En tus propias publicaciones usa el menú ⋮ → Editar (texto + imagen) o Eliminar.",

    "guide.1.title": "Comentarios y respuestas",
    "guide.1.step.0":
      "Escribe en «Escribe un comentario...» bajo cualquier publicación y presiona el botón enviar.",
    "guide.1.step.1":
      "Los comentarios largos se cortan a 3 líneas — presiona «Ver más» para leer todo.",
    "guide.1.step.2":
      "Presiona el icono de respuesta para responder a un comentario; el cuadro se rellena automáticamente con @usuario (mención).",
    "guide.1.step.3":
      "También puedes responder a una respuesta — permanece en el mismo hilo con la @mención.",
    "guide.1.step.4":
      "Editar ✏️ y eliminar 🗑 aparecen solo en TUS propios comentarios/respuestas.",

    "guide.2.title": "Me gusta, Guardar, Compartir",
    "guide.2.step.0":
      "Me gusta: toca el icono de pulgar — se vuelve azul y el contador se actualiza al instante.",
    "guide.2.step.1":
      "Guardar: toca el icono de cinta (se vuelve ámbar) → encuéntralo luego en la página de Marcadores.",
    "guide.2.step.2":
      "Compartir: toca Compartir, opcionalmente escribe un pie de foto, presiona Compartir. Nota: compartir permite UNA vez por usuario por publicación.",

    "guide.3.title": "Seguir y perfiles",
    "guide.3.step.0":
      "Haz clic en cualquier nombre/foto para abrir el perfil de ese usuario.",
    "guide.3.step.1":
      "Presiona Seguir / Dejar de seguir — el botón se actualiza al instante.",
    "guide.3.step.2":
      "Las sugerencias «A quién seguir» están en el lado derecho de Inicio (escritorio).",
    "guide.3.step.3":
      "Tu página de Perfil tiene pestañas: Mis publicaciones / Configuración / Privacidad y contraseña.",

    "guide.4.title": "Notificaciones",
    "guide.4.step.0":
      "La campana en la barra de navegación muestra el conteo no leído en una insignia roja.",
    "guide.4.step.1":
      "Ábrela para ver quién te dio me gusta / comentó / siguió / mencionó.",
    "guide.4.step.2":
      "Haz clic en una notificación para saltar a la publicación relacionada.",
    "guide.4.step.3":
      "Usa el botón ✓ en un elemento, o «marcar todo como leído» para todo.",

    "guide.5.title": "Foto y contraseña",
    "guide.5.step.0":
      "Perfil → haz clic en tu avatar → se abre el formulario de cambio de foto → elige + sube.",
    "guide.5.step.1":
      "Subir una nueva foto también publica automáticamente «actualizó la foto de perfil.» en tu feed.",
    "guide.5.step.2":
      "Pestaña Privacidad y contraseña → ingresa la contraseña antigua + nueva (8+ caracteres, A-Z, a-z, 0-9, símbolo).",

    "guide.6.title": "Límites (bueno saberlo)",
    "guide.6.step.0":
      "Una vez por usuario por publicación (si no, error «Publicación ya compartida»).",
    "guide.6.step.1":
      "Las respuestas son de un solo nivel — responder a una respuesta publica en el mismo hilo.",
    "guide.6.step.2":
      "El conteo de comentarios en Inicio = comentarios de nivel superior; la página de detalles añade las respuestas.",
    "guide.6.step.3":
      "NO hay endpoint de olvidé mi contraseña — ¡mantén tu contraseña segura!",

    "guide.7.title": "Edición e imágenes",
    "guide.7.step.0":
      "Editar una publicación/comentario: usa el menú ⋮ (o ✏️ en comentarios) → Editar. El nuevo texto/imagen aparece al instante para ti y para todos los usuarios.",
    "guide.7.step.1":
      "Ver imágenes: haz doble clic en cualquier imagen en una publicación o comentario para abrirla a pantalla completa.",
    "guide.7.step.2":
      "En vista de pantalla completa: haz clic en la X para cerrar, o el botón 👍 para reaccionar.",

    "guide.8.title": "Modo oscuro e idioma",
    "guide.8.step.0":
      "Barra de navegación: toca el botón 🌙 / ☀️ para alternar oscuro/claro — la barra, tarjetas y menús siguen al instante.",
    "guide.8.step.1":
      "Perfil → Configuración → Idioma: elige entre 7 idiomas (English, العربية, Español, 中文, Русский, Deutsch, 日本語).",
    "guide.8.step.2":
      "Elegir العربية cambia todo el diseño a RTL automáticamente; los otros idiomas permanecen LTR.",
    "guide.8.step.3":
      "El tema + idioma se guardan en tu navegador — actualizar mantiene ambos.",
    "guide.8.step.4":
      "Las burbujas de fondo suaves se desplazan lentamente y se mueven con tu desplazamiento (desactivado si tu sistema prefiere movimiento reducido).",
  },

  zh: {
    home: "首页",
    profile: "个人资料",
    bookmarks: "书签",
    settings: "设置",
    language: "语言",
    guide: "指南",
    login: "登录",
    register: "注册",
    logout: "退出登录",
    myPosts: "我的帖子",
    privacy: "隐私与密码",
    guideTitle: "如何使用本应用",
    guideDesc: "你需要知道的一切——无需登录即可阅读。",
    guideSearch: "搜索指南...（例如：分享、密码、回复）",
    guideNoResults: "没有找到",
    quickLinks: "快速链接",
    footerTagline: "在一个地方分享帖子、评论、关注朋友并收藏所爱。",
    rights: "版权所有。",

    "guide.0.title": "创建帖子",
    "guide.0.step.0": "前往首页，在「你在想什么？」中输入内容。",
    "guide.0.step.1": "可选择使用上传图片框附加一张图片。",
    "guide.0.step.2": "按发布 — 它会立即出现在动态顶部。",
    "guide.0.step.3":
      "在你自己的帖子上使用 ⋮ 菜单 → 编辑（文字 + 图片）或删除。",

    "guide.1.title": "评论和回复",
    "guide.1.step.0": "在任何帖子下方「写评论...」中书写，然后按发送按钮。",
    "guide.1.step.1": "长评论会截断为3行 — 按「查看更多」阅读全部。",
    "guide.1.step.2": "按回复图标回答评论；输入框会自动填入 @用户名（提及）。",
    "guide.1.step.3": "你也可以回复回复 — 它保留在同一线程中并带有 @提及。",
    "guide.1.step.4": "编辑 ✏️ 和删除 🗑 只出现在你自己的评论/回复上。",

    "guide.2.title": "点赞、收藏、分享",
    "guide.2.step.0": "点赞：点击拇指图标 — 它变为蓝色，计数立即更新。",
    "guide.2.step.1":
      "收藏：点击缎带图标（变为琥珀色）→ 稍后在书签页面找到它。",
    "guide.2.step.2":
      "分享：点击分享，可选择写标题，按分享。注意：每个用户每篇帖子只能分享一次。",

    "guide.3.title": "关注和个人资料",
    "guide.3.step.0": "点击任何名字/照片打开该用户的个人资料。",
    "guide.3.step.1": "按关注/取消关注 — 按钮立即更新。",
    "guide.3.step.2": "「推荐关注」建议在首页右侧（桌面端）。",
    "guide.3.step.3": "你的个人资料页面有标签：我的帖子/设置/隐私与密码。",

    "guide.4.title": "通知",
    "guide.4.step.0": "导航栏中的铃铛用红色徽章显示未读计数。",
    "guide.4.step.1": "打开它查看谁点赞/评论/关注/提到了你。",
    "guide.4.step.2": "点击通知跳转到相关帖子。",
    "guide.4.step.3": "使用单个项目上的 ✓ 按钮，或「全部标记为已读」。",

    "guide.5.title": "照片和密码",
    "guide.5.step.0":
      "个人资料 → 点击你的头像 → 更改照片表单打开 → 选择并上传。",
    "guide.5.step.1":
      "上传新照片还会自动发布「更新了个人资料图片。」到你的动态。",
    "guide.5.step.2":
      "隐私与密码标签 → 输入旧密码 + 新密码（8+ 字符，A-Z，a-z，0-9，符号）。",

    "guide.6.title": "限制（须知）",
    "guide.6.step.0":
      "每个用户每篇帖子只能分享一次（否则报「帖子已分享」错误）。",
    "guide.6.step.1": "回复只有一层 — 回复回复会发布到同一线程。",
    "guide.6.step.2": "首页评论数 = 顶级评论；详情页加上回复。",
    "guide.6.step.3": "没有忘记密码端点 — 请保管好你的密码！",

    "guide.7.title": "编辑和图片",
    "guide.7.step.0":
      "编辑帖子/评论：使用 ⋮ 菜单（或评论上的 ✏️）→ 编辑。新文字/图片会立即为你和所有用户显示。",
    "guide.7.step.1": "查看图片：双击帖子或评论中的任何图片以全屏打开。",
    "guide.7.step.2": "全屏视图中：点击 X 关闭，或点击 👍 按钮反应。",

    "guide.8.title": "深色模式和语言",
    "guide.8.step.0":
      "导航栏：点击 🌙 / ☀️ 按钮切换深色/浅色 — 导航栏、卡片和菜单立即跟随。",
    "guide.8.step.1":
      "个人资料 → 设置 → 语言：从7种语言中选择（English, العربية, Español, 中文, Русский, Deutsch, 日本語）。",
    "guide.8.step.2":
      "选择 العربية 会自动将整个布局翻转为 RTL；其他语言保持 LTR。",
    "guide.8.step.3": "主题 + 语言保存在你的浏览器中 — 刷新会保留两者。",
    "guide.8.step.4":
      "柔和的背景气泡缓慢漂移并随滚动移动（如果你的系统偏好减少动画则禁用）。",
  },

  ru: {
    home: "Главная",
    profile: "Профиль",
    bookmarks: "Закладки",
    settings: "Настройки",
    language: "Язык",
    guide: "Гид",
    login: "Войти",
    register: "Регистрация",
    logout: "Выйти",
    myPosts: "Мои посты",
    privacy: "Приватность и пароль",
    guideTitle: "Как пользоваться приложением",
    guideDesc: "Всё, что нужно знать — чтение без входа.",
    guideSearch: "поиск по гиду... (например: поделиться, пароль, ответ)",
    guideNoResults: "нет результатов для",
    quickLinks: "Быстрые ссылки",
    footerTagline: "Посты, комментарии, друзья и закладки — в одном месте.",
    rights: "Все права защищены.",

    "guide.0.title": "Создать пост",
    "guide.0.step.0": "Перейдите на Главную и напишите в «Что у вас на уме?».",
    "guide.0.step.1":
      "При желании прикрепите одно изображение через поле Загрузить изображение.",
    "guide.0.step.2":
      "Нажмите Опубликовать — он мгновенно появится вверху ленты.",
    "guide.0.step.3":
      "В своих постах используйте меню ⋮ → Редактировать (текст + изображение) или Удалить.",

    "guide.1.title": "Комментарии и ответы",
    "guide.1.step.0":
      "Напишите в «Написать комментарий...» под любым постом и нажмите кнопку отправки.",
    "guide.1.step.1":
      "Длинные комментарии обрезаются до 3 строк — нажмите «Показать больше», чтобы прочитать всё.",
    "guide.1.step.2":
      "Нажмите значок ответа, чтобы ответить на комментарий; поле автоматически заполняется @username (упоминание).",
    "guide.1.step.3":
      "Вы также можете ответить на ответ — он остаётся в той же ветке с @упоминанием.",
    "guide.1.step.4":
      "Редактировать ✏️ и удалить 🗑 появляются только на ВАШИХ собственных комментариях/ответах.",

    "guide.2.title": "Лайк, Закладка, Поделиться",
    "guide.2.step.0":
      "Лайк: нажмите значок большого пальца — он становится синим, счётчик обновляется мгновенно.",
    "guide.2.step.1":
      "Закладка: нажмите значок ленты (становится янтарным) → найдите позже на странице Закладок.",
    "guide.2.step.2":
      "Поделиться: нажмите Поделиться, при желании напишите подпись, нажмите Поделиться. Примечание: поделиться можно ОДИН раз на пользователя на пост.",

    "guide.3.title": "Подписки и профили",
    "guide.3.step.0":
      "Нажмите на любое имя/фото, чтобы открыть профиль этого пользователя.",
    "guide.3.step.1":
      "Нажмите Подписаться / Отписаться — кнопка обновляется мгновенно.",
    "guide.3.step.2":
      "Предложения «На кого подписаться» находятся справа на Главной (на компьютере).",
    "guide.3.step.3":
      "На вашей странице Профиля есть вкладки: Мои посты / Настройки / Приватность и пароль.",

    "guide.4.title": "Уведомления",
    "guide.4.step.0":
      "Колокольчик в навигации показывает количество непрочитанных в красном значке.",
    "guide.4.step.1":
      "Откройте его, чтобы увидеть, кто лайкнул / прокомментировал / подписался / упомянул вас.",
    "guide.4.step.2":
      "Нажмите на уведомление, чтобы перейти к связанному посту.",
    "guide.4.step.3":
      "Используйте кнопку ✓ на одном элементе или «отметить всё как прочитанное».",

    "guide.5.title": "Фото и пароль",
    "guide.5.step.0":
      "Профиль → нажмите на свой аватар → откроется форма смены фото → выберите + загрузите.",
    "guide.5.step.1":
      "Загрузка нового фото также автоматически публикует «обновил фото профиля.» в вашу ленту.",
    "guide.5.step.2":
      "Вкладка Приватность и пароль → введите старый + новый пароль (8+ символов, A-Z, a-z, 0-9, символ).",

    "guide.6.title": "Ограничения (полезно знать)",
    "guide.6.step.0":
      "Одна публикация на пользователя на пост (иначе ошибка «Пост уже опубликован»).",
    "guide.6.step.1":
      "Ответы только одного уровня — ответ на ответ публикуется в той же ветке.",
    "guide.6.step.2":
      "Счётчик комментариев на Главной = комментарии верхнего уровня; страница деталей добавляет ответы.",
    "guide.6.step.3":
      "НЕТ endpoint для забытого пароля — храните пароль в безопасности!",

    "guide.7.title": "Редактирование и изображения",
    "guide.7.step.0":
      "Редактировать пост/комментарий: используйте меню ⋮ (или ✏️ на комментариях) → Редактировать. Новый текст/изображение появляется мгновенно для вас и всех пользователей.",
    "guide.7.step.1":
      "Просмотр изображений: дважды щёлкните любое изображение в посте или комментарии, чтобы открыть его на весь экран.",
    "guide.7.step.2":
      "В полноэкранном режиме: нажмите X, чтобы закрыть, или кнопку 👍 для реакции.",

    "guide.8.title": "Тёмный режим и язык",
    "guide.8.step.0":
      "Навигация: нажмите кнопку 🌙 / ☀️, чтобы переключить тёмный/светлый — навигация, карточки и меню следуют мгновенно.",
    "guide.8.step.1":
      "Профиль → Настройки → Язык: выберите из 7 языков (English, العربية, Español, 中文, Русский, Deutsch, 日本語).",
    "guide.8.step.2":
      "Выбор العربية автоматически переворачивает весь макет в RTL; другие языки остаются LTR.",
    "guide.8.step.3":
      "Тема + язык сохраняются в вашем браузере — обновление сохраняет оба.",
    "guide.8.step.4":
      "Мягкие фоновые пятна медленно дрейфуют и движутся при прокрутке (отключено, если ваша система предпочитает уменьшенное движение).",
  },

  de: {
    home: "Startseite",
    profile: "Profil",
    bookmarks: "Lesezeichen",
    settings: "Einstellungen",
    language: "Sprache",
    guide: "Leitfaden",
    login: "Anmelden",
    register: "Registrieren",
    logout: "Abmelden",
    myPosts: "Meine Beiträge",
    privacy: "Privatsphäre & Passwort",
    guideTitle: "So verwendest du die App",
    guideDesc: "Alles Wichtige — kein Login zum Lesen nötig.",
    guideSearch: "Guide durchsuchen... (z. B. teilen, Passwort, Antwort)",
    guideNoResults: "keine Treffer für",
    quickLinks: "Schnellzugriff",
    footerTagline:
      "Teilen, kommentieren, folgen und speichern — alles an einem Ort.",
    rights: "Alle Rechte vorbehalten.",

    "guide.0.title": "Einen Beitrag erstellen",
    "guide.0.step.0":
      "Gehe zu Startseite und schreibe in „Was denkst du gerade?“.",
    "guide.0.step.1":
      "Optional ein Bild über das Feld Bild hochladen anhängen.",
    "guide.0.step.2": "Drücke Posten — er erscheint sofort oben im Feed.",
    "guide.0.step.3":
      "Bei deinen eigenen Beiträgen nutze das ⋮-Menü → Bearbeiten (Text + Bild) oder Löschen.",

    "guide.1.title": "Kommentare & Antworten",
    "guide.1.step.0":
      "Schreibe in „Kommentar schreiben...“ unter einem Beitrag und drücke den Senden-Button.",
    "guide.1.step.1":
      "Lange Kommentare werden auf 3 Zeilen gekürzt — drücke „Mehr anzeigen“, um alles zu lesen.",
    "guide.1.step.2":
      "Drücke das Antwort-Symbol, um auf einen Kommentar zu antworten; das Feld füllt sich automatisch mit @benutzername (Erwähnung).",
    "guide.1.step.3":
      "Du kannst auch auf eine Antwort antworten — sie bleibt im selben Thread mit der @Erwähnung.",
    "guide.1.step.4":
      "Bearbeiten ✏️ und Löschen 🗑 erscheinen nur bei DEINEN eigenen Kommentaren/Antworten.",

    "guide.2.title": "Gefällt mir, Lesezeichen, Teilen",
    "guide.2.step.0":
      "Gefällt mir: tippe auf das Daumen-Symbol — es wird blau und der Zähler aktualisiert sich sofort.",
    "guide.2.step.1":
      "Lesezeichen: tippe auf das Band-Symbol (wird bernsteinfarben) → finde es später auf der Lesezeichen-Seite.",
    "guide.2.step.2":
      "Teilen: tippe auf Teilen, schreibe optional eine Beschriftung, drücke Teilen. Hinweis: Teilen erlaubt EINMAL pro Benutzer pro Beitrag.",

    "guide.3.title": "Folgen & Profile",
    "guide.3.step.0":
      "Klicke auf einen Namen/ein Foto, um das Profil dieses Benutzers zu öffnen.",
    "guide.3.step.1":
      "Drücke Folgen / Entfolgen — der Button aktualisiert sich sofort.",
    "guide.3.step.2":
      "„Wem folgen“-Vorschläge sind rechts auf der Startseite (Desktop).",
    "guide.3.step.3":
      "Deine Profilseite hat Tabs: Meine Beiträge / Einstellungen / Privatsphäre & Passwort.",

    "guide.4.title": "Benachrichtigungen",
    "guide.4.step.0":
      "Die Glocke in der Navigationsleiste zeigt die ungelesene Anzahl in einem roten Badge.",
    "guide.4.step.1":
      "Öffne sie, um zu sehen, wer dich geliked / kommentiert / gefolgt / erwähnt hat.",
    "guide.4.step.2":
      "Klicke auf eine Benachrichtigung, um zum zugehörigen Beitrag zu springen.",
    "guide.4.step.3":
      "Nutze den ✓-Button bei einem Element oder „alle als gelesen markieren“ für alles.",

    "guide.5.title": "Foto & Passwort",
    "guide.5.step.0":
      "Profil → klicke auf deinen Avatar → das Formular zum Fotoändern öffnet sich → auswählen + hochladen.",
    "guide.5.step.1":
      "Das Hochladen eines neuen Fotos postet auch automatisch „hat das Profilbild aktualisiert.“ in deinen Feed.",
    "guide.5.step.2":
      "Tab Privatsphäre & Passwort → altes + neues Passwort eingeben (8+ Zeichen, A-Z, a-z, 0-9, Symbol).",

    "guide.6.title": "Grenzen (gut zu wissen)",
    "guide.6.step.0":
      "Einmal teilen pro Benutzer pro Beitrag (sonst Fehler „Beitrag bereits geteilt“).",
    "guide.6.step.1":
      "Antworten sind nur eine Ebene — das Antworten auf eine Antwort postet in denselben Thread.",
    "guide.6.step.2":
      "Kommentarzahl auf der Startseite = Top-Level-Kommentare; die Detailseite fügt Antworten hinzu.",
    "guide.6.step.3":
      "Es gibt KEINEN Passwort-vergessen-Endpunkt — bewahre dein Passwort sicher auf!",

    "guide.7.title": "Bearbeiten & Bilder",
    "guide.7.step.0":
      "Beitrag/Kommentar bearbeiten: Nutze das ⋮-Menü (oder ✏️ bei Kommentaren) → Bearbeiten. Der neue Text/das neue Bild erscheint sofort für dich und alle Benutzer.",
    "guide.7.step.1":
      "Bilder ansehen: Doppelklicke auf ein Bild in einem Beitrag oder Kommentar, um es im Vollbild zu öffnen.",
    "guide.7.step.2":
      "In der Vollbildansicht: Klicke auf X zum Schließen oder den 👍-Button zum Reagieren.",

    "guide.8.title": "Dunkelmodus & Sprache",
    "guide.8.step.0":
      "Navigationsleiste: tippe auf den 🌙 / ☀️-Button, um Dunkel/Hell umzuschalten — Navigationsleiste, Karten und Menüs folgen sofort.",
    "guide.8.step.1":
      "Profil → Einstellungen → Sprache: wähle aus 7 Sprachen (English, العربية, Español, 中文, Русский, Deutsch, 日本語).",
    "guide.8.step.2":
      "Die Wahl von العربية dreht das gesamte Layout automatisch auf RTL; andere Sprachen bleiben LTR.",
    "guide.8.step.3":
      "Theme + Sprache werden in deinem Browser gespeichert — Aktualisieren behält beide.",
    "guide.8.step.4":
      "Die weichen Hintergrundblasen driften langsam und bewegen sich mit deinem Scrollen (deaktiviert, wenn dein System reduzierte Bewegung bevorzugt).",
  },

  ja: {
    home: "ホーム",
    profile: "プロフィール",
    bookmarks: "ブックマーク",
    settings: "設定",
    language: "言語",
    guide: "ガイド",
    login: "ログイン",
    register: "登録",
    logout: "ログアウト",
    myPosts: "私の投稿",
    privacy: "プライバシーとパスワード",
    guideTitle: "アプリの使い方",
    guideDesc: "必要な情報はすべてここに — 閲覧にログインは不要です。",
    guideSearch: "ガイドを検索...（例: 共有、パスワード、返信）",
    guideNoResults: "結果がありません:",
    quickLinks: "クイックリンク",
    footerTagline: "投稿・コメント・フォロー・ブックマークをひとつの場所で。",
    rights: "無断転載禁止。",

    "guide.0.title": "投稿を作成",
    "guide.0.step.0": "ホームに移動し、「今何を考えていますか？」に書きます。",
    "guide.0.step.1":
      "任意で「画像をアップロード」ボックスを使って1枚の画像を添付します。",
    "guide.0.step.2": "投稿を押すと、フィードの上部にすぐに表示されます。",
    "guide.0.step.3":
      "自分の投稿では ⋮ メニュー → 編集（テキスト + 画像）または削除を使用します。",

    "guide.1.title": "コメントと返信",
    "guide.1.step.0":
      "任意の投稿の下の「コメントを書く...」に書き、送信ボタンを押します。",
    "guide.1.step.1":
      "長いコメントは3行に切り詰められます — 「もっと見る」を押して全部読みます。",
    "guide.1.step.2":
      "返信アイコンを押してコメントに答えます。ボックスには @ユーザー名（メンション）が自動入力されます。",
    "guide.1.step.3":
      "返信に返信することもできます — @メンション付きで同じスレッドに残ります。",
    "guide.1.step.4":
      "編集 ✏️ と削除 🗑 は自分のコメント/返信にのみ表示されます。",

    "guide.2.title": "いいね、ブックマーク、共有",
    "guide.2.step.0":
      "いいね：親指アイコンをタップ — 青色に変わり、カウントがすぐに更新されます。",
    "guide.2.step.1":
      "ブックマーク：リボンアイコンをタップ（琥珀色に変わる）→ 後でブックマークページで見つけます。",
    "guide.2.step.2":
      "共有：共有をタップし、任意でキャプションを書き、共有を押します。注意：共有はユーザーごと投稿ごとに1回のみです。",

    "guide.3.title": "フォローとプロフィール",
    "guide.3.step.0":
      "任意の名前/写真をクリックしてそのユーザーのプロフィールを開きます。",
    "guide.3.step.1":
      "フォロー/フォロー解除を押す — ボタンはすぐに更新されます。",
    "guide.3.step.2":
      "「フォローする人」の提案はホームの右側にあります（デスクトップ）。",
    "guide.3.step.3":
      "プロフィールページにはタブがあります：私の投稿/設定/プライバシーとパスワード。",

    "guide.4.title": "通知",
    "guide.4.step.0":
      "ナビゲーションバーのベルは未読数を赤いバッジで表示します。",
    "guide.4.step.1":
      "開いて、誰がいいね/コメント/フォロー/メンションしたかを確認します。",
    "guide.4.step.2": "通知をクリックして関連する投稿にジャンプします。",
    "guide.4.step.3":
      "1つの項目に ✓ ボタンを使用するか、すべてに「すべて既読にする」を使用します。",

    "guide.5.title": "写真とパスワード",
    "guide.5.step.0":
      "プロフィール → アバターをクリック → 写真変更フォームが開く → 選択 + アップロード。",
    "guide.5.step.1":
      "新しい写真をアップロードすると、「プロフィール写真を更新しました。」も自動的にフィードに投稿されます。",
    "guide.5.step.2":
      "プライバシーとパスワードタブ → 古い + 新しいパスワードを入力（8文字以上、A-Z、a-z、0-9、記号）。",

    "guide.6.title": "制限（知っておくと良い）",
    "guide.6.step.0":
      "ユーザーごと投稿ごとに1回の共有（そうでなければ「投稿は既に共有されています」エラー）。",
    "guide.6.step.1":
      "返信は1レベルだけ — 返信に答えると同じスレッドに投稿されます。",
    "guide.6.step.2":
      "ホームのコメント数 = トップレベルのコメント；詳細ページは返信を追加します。",
    "guide.6.step.3":
      "パスワード忘れのエンドポイントはありません — パスワードを安全に保管してください！",

    "guide.7.title": "編集と画像",
    "guide.7.step.0":
      "投稿/コメントを編集：⋮ メニュー（またはコメントの ✏️）→ 編集を使用します。新しいテキスト/画像はあなたとすべてのユーザーにすぐに表示されます。",
    "guide.7.step.1":
      "画像を表示：投稿またはコメント内の任意の画像をダブルクリックして全画面で開きます。",
    "guide.7.step.2":
      "全画面表示：X をクリックして閉じるか、👍 ボタンでリアクションします。",

    "guide.8.title": "ダークモードと言語",
    "guide.8.step.0":
      "ナビゲーションバー：🌙 / ☀️ ボタンをタップしてダーク/ライトを切り替え — ナビゲーションバー、カード、メニューすべてがすぐに従います。",
    "guide.8.step.1":
      "プロフィール → 設定 → 言語：7つの言語から選択（English, العربية, Español, 中文, Русский, Deutsch, 日本語）。",
    "guide.8.step.2":
      "العربية を選ぶとレイアウト全体が自動的に RTL に反転します。他の言語は LTR のままです。",
    "guide.8.step.3":
      "テーマ + 言語はブラウザに保存されます — 更新しても両方保持されます。",
    "guide.8.step.4":
      "柔らかい背景のブロブはゆっくり漂い、スクロールに合わせて動きます（システムが動きの削減を好む場合は無効）。",
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("lang") as Lang) || "en",
  );

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // Handle RTL for Arabic
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) =>
    translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
