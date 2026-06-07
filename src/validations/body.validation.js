/**
 * Valida un body para endpoints POST y PUT
 * @param {Object} body - El objeto a validar
 * @param {Object} schema - Esquema de validación con las reglas
 * @returns {Object} { isValid: boolean, errors: Object, message: string }
 */

const validateBody = (body, schema) => {
	// Valida que no sea objeto vacio
	if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
		return {
			isValid: false,
			errors: { _global: "El body no puede estar vacío" },
			message: "Error: El body no puede estar vacío",
		};
	}

	const errors = {};

	// Valida cada campo segun el esquema
	for (const [field, rules] of Object.entries(schema)) {
		const value = body[field];

		// Valida campo obligatorio existe y que no este vacio
		if (rules.required) {
			if (value === undefined || value === null) {
				errors[field] = `El campo '${field}' es obligatorio`;
				continue;
			}

			// Valida strings no vacios
			if (
				rules.type === "string" &&
				typeof value === "string" &&
				value.trim() === ""
			) {
				errors[field] = `El campo '${field}' no puede estar vacío`;
				continue;
			}
		}

		// Si el campo no existe y no es obligatorio, saltar
		if (value === undefined || value === null) {
			continue;
		}

		// Valida tipo numero
		if (rules.type === "number") {
			const num = Number(value);
			if (isNaN(num) || !isFinite(num)) {
				errors[field] = `El campo '${field}' debe ser un número válido`;
				continue;
			}
		}

		// Valida tipo array
		if (rules.type === "array") {
			// Verifica que sea un array
			if (!Array.isArray(value)) {
				errors[field] = `El campo '${field}' debe ser un array`;
				continue;
			}

			// Verifica que no estr vacio si es requerido
			if (rules.required && value.length === 0) {
				errors[field] = `El campo '${field}' no puede estar vacío`;
				continue;
			}

			// Valida cada elemento del array contra allowedValues
			if (rules.allowedValues && Array.isArray(rules.allowedValues)) {
				const invalidValues = value.filter(
					(item) => !rules.allowedValues.includes(item),
				);
				if (invalidValues.length > 0) {
					errors[field] =
						`El campo '${field}' contiene valores no permitidos: ${invalidValues.join(", ")}. Valores permitidos: ${rules.allowedValues.join(", ")}`;
					continue;
				}
			}
		}

		// Valida opciones limitadas para valores que no son array
		if (!rules.type || rules.type !== "array") {
			if (rules.allowedValues && Array.isArray(rules.allowedValues)) {
				if (!rules.allowedValues.includes(value)) {
					errors[field] =
						`El campo '${field}' debe ser uno de: ${rules.allowedValues.join(", ")}`;
					continue;
				}
			}
		}

		// Validacion personalizada
		if (rules.validate && typeof rules.validate === "function") {
			const customError = rules.validate(value, body);
			if (customError) {
				errors[field] = customError;
			}
		}
	}

	const isValid = Object.keys(errors).length === 0;

	return {
		isValid,
		errors,
		message: isValid ? "Datos válidos" : "Datos inválidos, revise los errores",
	};
};

// Ejemplo de un esquema que se quiera validar (games)

// const gameSchema = {
//   precio: {
//     required: true,
//     type: 'number',
//     validate: (value) => {
//       if (value < 0) return 'El precio no puede ser negativo';
//       return null;
//     }
//   },

//   desarrolladora: {
//     required: true,
//     type: 'string'
//   },

//   fechaSalida: {
//     required: true,
//     type: 'date',
//     validate: (value) => {
//       const fecha = new Date(value);
//       if (isNaN(fecha.getTime())) return 'Fecha inválida';
//       return null;
//     }
//   },

//   rating: {
//     required: true,
//     type: 'number',
//     min: 1,
//     max: 5,
//     validate: (value) => {
//       if (value < 1 || value > 5) return 'El rating debe ser entre 1 y 5 estrellas';
//       return null;
//     }
//   },

//   generos: {
//     required: true,
//     type: 'array',
//     allowedValues: ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Carreras', 'Puzzle', 'Terror', 'Simulación'],  // Opciones limitadas
//     validate: (value) => {
//       if (!Array.isArray(value)) return 'Los géneros deben ser un array';
//       if (value.length === 0) return 'Debe seleccionar al menos un género';
//       return null;
//     }
//   }
// };

// Uso en POST/PUT
// const handlePostJuego = (body) => {
//   const result = validateBody(body, gameSchema);

//   if (!result.isValid) {
//     console.log(result.message);
//     console.log(result.errors);
//     return;
//   }

//   Hacer fetch/post del juego...
// };
