import { useEffect, useState } from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { APIrequests } from "../../APIrequests";

// const EmployeeCurrencySelector = ({ employeeId }) => {
//   const [currency, setCurrency] = useState('ILS');
//   const api = new APIrequests();
//   const { t } = useTranslation();

//   // מביא את המטבע מהשרת ברגע שהקומפוננטה נטענת או שה־employeeId משתנה
//   useEffect(() => {
//       console.log("EmployeeCurrencySelector loaded with employeeId:", employeeId);

//     const fetchCurrency = async () => {
//       if (!employeeId) return; // בטוח - אם employeeId לא קיים עדיין
//       try {
//         const employeeDetails = await api.getRequest(`/employees/${employeeId}`);
//         setCurrency(employeeDetails.currency || 'ILS');
//       } catch (err) {
//         console.error('Error fetching employee currency:', err);
//       }
//     };

//     fetchCurrency();
//   }, [employeeId]);

//   // שינוי המטבע → שליחה מיידית לשרת
//   const handleCurrencyChange = async (e) => {
//     const newCurrency = e.target.value;
//     setCurrency(newCurrency);
//     try {
//       await api.putRequest(`/employees/${employeeId}/currency`, {
//         currency: newCurrency
//       });
//     } catch (err) {
//       console.error('Error updating employee currency:', err);
//     }
//   };

//   return (
//     <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
//       <FormLabel component="legend">{t('RateManagement.currencyLabel')}</FormLabel>
//       <RadioGroup
//         row
//         value={currency}
//         onChange={handleCurrencyChange}
//       >
//         <FormControlLabel value="ILS" control={<Radio />} label={t('RateManagement.currency.ils')} />
//         <FormControlLabel value="USD" control={<Radio />} label={t('RateManagement.currency.usd')} />
//       </RadioGroup>
//     </FormControl>
//   );
const EmployeeCurrencySelector = ({ employeeId, initialCurrency }) => {
    const [currency, setCurrency] = useState(initialCurrency || 'ILS');
    const api = new APIrequests();
    const { t } = useTranslation();

    useEffect(() => {
        setCurrency(initialCurrency || 'ILS');
    }, [initialCurrency]);

    const handleCurrencyChange = async (e) => {
        const newCurrency = e.target.value;
        setCurrency(newCurrency);
        try {
            await api.putRequest(`/employees/${employeeId}/currency`, {
                currency: newCurrency
            });
        } catch (err) {
            console.error('Error updating employee currency:', err);
        }
    };

    return (
        <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
            <FormLabel component="legend"></FormLabel>
            <RadioGroup
                row
                value={currency}
                onChange={handleCurrencyChange}
            >
                <FormControlLabel value="ILS" control={<Radio />} label={t('currency.ils')} />
                <FormControlLabel value="USD" control={<Radio />} label={t('currency.usd')} />
            </RadioGroup>
        </FormControl>
    );
};

export default EmployeeCurrencySelector;