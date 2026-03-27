import { useState } from "react";

const useForm = (initialValues, validations) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    if (!validations) return true;
    let isValid = true;

    for (const field in validations) {
      const value = formData[field];
      const rules = validations[field];

      if (rules.required && !value?.toString().trim()) {
        setErrors((prev) => ({ ...prev, [field]: rules.required }));
        isValid = false;
        continue;
      }
      if (rules.minLength && value?.trim().length < rules.minLength.value) {
        setErrors((prev) => ({ ...prev, [field]: rules.minLength.message }));
        isValid = false;
        continue;
      }
      if (rules.maxLength && value?.trim().length > rules.maxLength.value) {
        setErrors((prev) => ({ ...prev, [field]: rules.maxLength.message }));
        isValid = false;
        continue;
      }
      if (rules.pattern && !rules.pattern.value.test(value)) {
        setErrors((prev) => ({ ...prev, [field]: rules.pattern.message }));
        isValid = false;
        continue;
      }
      if (rules.custom) {
        const result = rules.custom(value, formData);
        if (result) {
          setErrors((prev) => ({ ...prev, [field]: result }));
          isValid = false;
          continue;
        }
      }
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    return isValid;
  };

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setFormData, // ← exported so ProfilePage can populate form from fetched data
  };
};

export default useForm;
