import React from 'react';
import { useTranslation } from 'react-i18next';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language || 'he');

  const handleChange = (event, newLang) => {
    if (newLang) {
      setLang(newLang);
      i18n.changeLanguage(newLang);
      document.body.dir = newLang === 'he' ? 'rtl' : 'ltr';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <LanguageIcon />
      <ToggleButtonGroup
        value={lang}
        exclusive
        onChange={handleChange}
        size="small"
        color="primary"
        aria-label="Language selection"
      >
        <ToggleButton value="he">עברית</ToggleButton>
        <ToggleButton value="en">English</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default LanguageSwitcher;
