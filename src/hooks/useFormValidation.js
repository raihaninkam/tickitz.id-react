import { useState } from 'react';

export const useFormValidation = (initialState, validationRules) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  const validate = (additionalData = {}) => {
    const dataToValidate = { ...formData, ...additionalData };
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = dataToValidate[field];

      for (const rule of rules) {
        if (!rule.test(value, dataToValidate)) {
          newErrors[field] = rule.message;
          break;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData(initialState);
    setErrors({});
  };

  const setError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  return {
    formData,
    errors,
    handleChange,
    validate,
    reset,
    setError,
    setFormData
  };
};