// i18n/i18n.js
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

await i18next.use(Backend).init({
  fallbackLng: 'en',
  lng: 'en',
  backend: {
    loadPath: './i18n/{{lng}}/{{ns}}.json'
  },
  ns: ['excel'],
  defaultNS: 'excel',
  interpolation: {
    escapeValue: false
  }
});

export default i18next;
