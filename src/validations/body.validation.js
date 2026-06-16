/**
 * Valida un body para endpoints POST y PUT
 * @param {Object} body - El objeto a validar
 * @param {Object} schema - Esquema de validación con las reglas
 * @param {Boolean} partial - Si es true, permite actualizaciones parciales (PUT/PATCH)
 * @returns {Object} { isValid: boolean, errors: Object, message: string }
 */

const validateBody = (body, schema, partial = false) => {
	// Valida que no sea objeto vacío
	if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
		return {
			isValid: false,
			errors: { _global: "El body no puede estar vacío" },
			message: "Error: El body no puede estar vacío",
		};
	}

	const errors = {};

	// Valida campos no permitidos
	for (const field of Object.keys(body)) {
		if (!schema[field]) {
			errors[field] = `El campo '${field}' no está permitido`;
		}
	}

	// Valida cada campo según el esquema
	for (const [field, rules] of Object.entries(schema)) {
		const value = body[field];

		// Valida campo obligatorio
		if (rules.required && !partial) {
			if (value === undefined || value === null) {
				errors[field] = `El campo '${field}' es obligatorio`;
				continue;
			}

			if (
				rules.type === "string" &&
				typeof value === "string" &&
				value.trim() === ""
			) {
				errors[field] = `El campo '${field}' no puede estar vacío`;
				continue;
			}
		}

		// Si no existe y no es obligatorio, continuar
		if (value === undefined || value === null) {
			continue;
		}

		// Valida string
		if (
			rules.type === "string" &&
			typeof value !== "string"
		) {
			errors[field] = `El campo '${field}' debe ser un string`;
			continue;
		}

		// Valida número
		if (rules.type === "number") {
			const num = Number(value);

			if (isNaN(num) || !isFinite(num)) {
				errors[field] = `El campo '${field}' debe ser un número válido`;
				continue;
			}
		}

		// Valida boolean
		if (
			rules.type === "boolean" &&
			typeof value !== "boolean"
		) {
			errors[field] = `El campo '${field}' debe ser boolean`;
			continue;
		}

		// Valida fecha
		if (rules.type === "date") {
			const date = new Date(value);

			if (isNaN(date.getTime())) {
				errors[field] = `El campo '${field}' debe ser una fecha válida`;
				continue;
			}
		}

		// Valida array
		if (rules.type === "array") {
			if (!Array.isArray(value)) {
				errors[field] = `El campo '${field}' debe ser un array`;
				continue;
			}

			if (rules.required && value.length === 0) {
				errors[field] = `El campo '${field}' no puede estar vacío`;
				continue;
			}

			// Valida elementos simples
			if (rules.itemType) {
				const invalidItem = value.find(
					(item) => typeof item !== rules.itemType
				);

				if (invalidItem !== undefined) {
					errors[field] =
						`Todos los elementos de '${field}' deben ser ${rules.itemType}`;
					continue;
				}
			}

			// Valida arrays de objetos
			if (rules.itemSchema) {
				let hasError = false;

				for (const item of value) {
					if (
						typeof item !== "object" ||
						item === null ||
						Array.isArray(item)
					) {
						errors[field] =
							`Todos los elementos de '${field}' deben ser objetos`;
						hasError = true;
						break;
					}

					for (const [key, expectedType] of Object.entries(
						rules.itemSchema
					)) {
						if (!(key in item)) {
							errors[field] =
								`Falta la propiedad '${key}' en '${field}'`;
							hasError = true;
							break;
						}

						if (typeof item[key] !== expectedType) {
							errors[field] =
								`La propiedad '${key}' en '${field}' debe ser ${expectedType}`;
							hasError = true;
							break;
						}

						if (
							expectedType === "string" &&
							item[key].trim() === ""
						) {
							errors[field] =
								`La propiedad '${key}' en '${field}' no puede estar vacía`;
							hasError = true;
							break;
						}
					}

					if (hasError) break;
				}

				if (hasError) continue;
			}

			// Valida allowedValues para arrays
			if (
				rules.allowedValues &&
				Array.isArray(rules.allowedValues)
			) {
				const invalidValues = value.filter(
					(item) => !rules.allowedValues.includes(item)
				);

				if (invalidValues.length > 0) {
					errors[field] =
						`El campo '${field}' contiene valores no permitidos: ${invalidValues.join(", ")}. Valores permitidos: ${rules.allowedValues.join(", ")}`;
					continue;
				}
			}
		}

		// Valida allowedValues para campos simples
		if (rules.type !== "array") {
			if (
				rules.allowedValues &&
				Array.isArray(rules.allowedValues)
			) {
				if (!rules.allowedValues.includes(value)) {
					errors[field] =
						`El campo '${field}' debe ser uno de: ${rules.allowedValues.join(", ")}`;
					continue;
				}
			}
		}

		// Validación personalizada
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
		message: isValid
			? "Datos válidos"
			: "Datos inválidos, revise los errores",
	};
};

module.exports = validateBody;