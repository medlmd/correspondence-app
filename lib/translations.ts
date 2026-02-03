export type Language = 'ar';

export const translations = {
  ar: {
    // Navigation
    sidebar: {
      home: 'لوحة التحكم',
      incoming: 'الواردة',
      outgoing: 'الصادرة',
      internal: 'الداخلية',
      archive: 'الأرشيف',
      settings: 'الإعدادات',
    },
    // Pages
    pages: {
      home: {
        title: 'لوحة التحكم',
        description: 'نظرة عامة على إحصائيات الوثائق والمراسلات',
      },
      incoming: {
        title: 'الواردة',
        description: 'الوثائق المستلمة من الخارج (Word, Excel, PDF)',
        upload: 'رفع وثيقة',
        searchTopic: 'بحث بالموضوع...',
        searchDocNumber: 'بحث برقم الوثيقة...',
        allDepartments: 'جميع الإدارات',
      },
      outgoing: {
        title: 'الصادرة',
        description: 'الوثائق المرسلة إلى الخارج (Word, Excel, PDF)',
        upload: 'رفع وثيقة',
        searchTopic: 'بحث بالموضوع...',
        searchDocNumber: 'بحث برقم الوثيقة...',
        allDepartments: 'جميع الإدارات',
      },
      internal: {
        title: 'الداخلية',
        description: 'الوثائق المتبادلة بين الإدارات (Word, Excel, PDF)',
        upload: 'رفع وثيقة',
        searchTopic: 'بحث بالموضوع...',
        searchDocNumber: 'بحث برقم الوثيقة...',
        allDepartments: 'جميع الإدارات',
      },
      archive: {
        title: 'الأرشيف',
        description: 'الوثائق القديمة الممسوحة ضوئياً (Word, Excel, PDF)',
        scanUpload: 'مسح ضوئي ورفع',
        searchTopic: 'بحث بالموضوع...',
        searchDocNumber: 'بحث برقم الوثيقة...',
        allDepartments: 'جميع الإدارات',
        date: 'التاريخ',
      },
      settings: {
        title: 'الإعدادات',
        userManagement: 'إدارة المستخدمين',
        departments: 'الأقسام والإدارات',
        roles: 'الأدوار والصلاحيات',
      },
    },
    // Common
    common: {
      view: 'عرض',
      download: 'تحميل',
      print: 'طباعة',
      delete: 'حذف',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      upload: 'رفع',
      close: 'إغلاق',
      save: 'حفظ',
      edit: 'تعديل',
      search: 'بحث',
      filter: 'تصفية',
      all: 'الكل',
      date: 'التاريخ',
      time: 'التوقيت',
      documentNumber: 'رقم الوثيقة',
      department: 'الإدارة',
      topic: 'الموضوع',
      category: 'الفئة',
      role: 'الدور',
      fileName: 'اسم الملف',
      fileSize: 'حجم الملف',
      fileType: 'نوع الملف',
      deleteConfirm: 'تأكيد الحذف',
      deleteConfirmMessage: 'هل أنت متأكد من حذف هذه الوثيقة؟',
      deleteWarning: 'سيتم حذف هذه الوثيقة بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.',
      document: 'الوثيقة',
      file: 'الملف',
      noDocuments: 'لا توجد وثائق',
      documents: 'الوثائق',
      unspecified: 'غير محدد',
    },
    // Categories
    categories: {
      all: 'جميع الفئات',
      procurement: 'المشتريات',
      contracts: 'العقود',
      legal: 'الشؤون القانونية',
      invoices: 'الفواتير',
    },
    // Roles
    roles: {
      select: 'اختر الدور',
      all: 'الكل',
      director: 'المدير',
      employee: 'موظف',
    },
    // Departments
    departments: {
      all: 'جميع الإدارات',
      it: 'المعلوماتية',
      hr: 'المصادر البشرية',
      management: 'الإدارة العامة',
      admin: 'الإدارة',
      finance: 'المالية',
    },
    // Upload Modal
    upload: {
      selectDepartment: 'اختر الإدارة',
      enterTopic: 'أدخل موضوع الوثيقة...',
      selectCategory: 'اختر الفئة',
      selectRole: 'اختر الدور',
      files: 'الملفات (Word, Excel, PDF)',
      clickToSelect: 'انقر لاختيار الملفات',
      dragFiles: 'أو اسحب الملفات هنا',
      fileTypes: 'PDF, Word, Excel (حتى 10MB لكل ملف)',
      uploadFiles: 'رفع الملفات',
      required: '*',
    },
    // Toast messages
    toast: {
      uploadSuccess: 'تم رفع الوثيقة بنجاح!',
      uploadError: 'حدث خطأ أثناء رفع الملفات',
      deleteSuccess: 'تم حذف الوثيقة بنجاح!',
      uploadFilesSuccess: (count: number) => `تم رفع ${count} وثيقة بنجاح!`,
    },
  },
};

export type TranslationKey = keyof typeof translations.ar;
