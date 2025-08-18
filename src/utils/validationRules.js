export const registerValidationRules = {
  email: [
    {
      test: (value) => value && value.trim().length > 0,
      message: "Email tidak boleh kosong."
    },
    {
      test: (value) => /\S+@\S+\.\S+/.test(value),
      message: "Format email tidak valid."
    }
  ],
  password: [
    {
      test: (value) => value && value.trim().length > 0,
      message: "Password tidak boleh kosong."
    },
    {
      test: (value) => value && value.length >= 8,
      message: "Password harus mengandung minimal 8 karakter."
    },
    {
      test: (value) => /[a-z]/.test(value),
      message: "Password harus mengandung minimal 1 huruf kecil."
    },
    {
      test: (value) => /[A-Z]/.test(value),
      message: "Password harus mengandung minimal 1 huruf besar."
    },
    {
      test: (value) => /[!@#$%^&*/><]/.test(value),
      message: "Password harus mengandung minimal 1 karakter spesial (!@#$%^&*/><)."
    },
    {
      test: (value) => /[\d]/.test(value),
      message: "Password harus mengandung minimal 1 angka."
    }
  ],
  terms: [
    {
      test: (value) => value === true,
      message: "Anda harus menyetujui syarat & ketentuan."
    }
  ]
};

export const loginValidationRules = {
  email: [
    {
      test: (value) => value && value.trim().length > 0,
      message: "Email tidak boleh kosong."
    },
    {
      test: (value) => /\S+@\S+\.\S+/.test(value),
      message: "Format email tidak valid."
    }
  ],
  password: [
    {
      test: (value) => value && value.trim().length > 0,
      message: "Password tidak boleh kosong."
    }
  ]
};