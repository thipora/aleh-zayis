import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

await i18next
  .use(Backend)
  .init({
    fallbackLng: 'he',
    preload: ['en', 'he'],
    ns: ['createMonthlyEmployeeReport'],
    backend: {
      loadPath: path.join(process.cwd(), 'i18n', 'locales', '{{lng}}', '{{ns}}.json')
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
