const userSchema = {
  name: {
    required: true,
    type: 'string',
    validate: (value) => {
      if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
      return null;
    }
  },
  email: {
    required: true,
    type: 'string',
    validate: (value) => {
      if (!value.includes('@')) return 'Email inválido';
      return null;
    }
  },
  password: {
    required: true,
    type: 'string',
    validate: (value) => {
      if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
      return null;
    }
  }
};

module.exports = userSchema;