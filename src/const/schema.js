//* Esquema utilizado para body.validation.js
//* Adaptado al modelo actual con GameTranslation

const gameSchema = {
	Name: {
		required: true,
		type: "string",
	},

	Price: {
		required: true,
		type: "number",
		validate: (value) => {
			if (value < 0) return "Price cannot be negative";
			return null;
		},
	},

	Developer: {
		required: true,
		type: "string",
	},

	ReleaseDate: {
		required: true,
		type: "date",
		validate: (value) => {
			const date = new Date(value);

			if (isNaN(date.getTime())) {
				return "Invalid date";
			}

			return null;
		},
	},

	Rating: {
		required: true,
		type: "number",
		validate: (value) => {
			if (value < 1 || value > 5) {
				return "Rating must be between 1 and 5";
			}

			return null;
		},
	},

	Image: {
		required: true,
		type: "string",
	},

	isFavorite: {
		required: false,
		type: "boolean",
	},

	genres: {
		required: true,
		type: "array",
		allowedValues: [
			"Action",
			"RPG",
			"Shooter",
			"Puzzle",
			"Adventure",
			"Indie",
			"Platformer",
			"Massively Multiplayer",
			"Sports",
			"Racing",
			"Simulation",
			"Casual",
			"Strategy",
			"Arcade",
		],
		validate: (value) => {
			if (!Array.isArray(value)) {
				return "Genres must be an array";
			}

			if (value.length === 0) {
				return "At least one genre is required";
			}

			return null;
		},
	},

	screenshots: {
		required: true,
		type: "array",
		validate: (value) => {
			if (!Array.isArray(value)) {
				return "Screenshots must be an array";
			}

			if (value.length === 0) {
				return "There has to be at least 1 screenshot";
			}

			return null;
		},
	},

	translations: {
		required: true,
		type: "array",
		validate: (value) => {
			if (!Array.isArray(value)) {
				return "Translations must be an array";
			}

			if (value.length === 0) {
				return "At least one translation is required";
			}

			for (const translation of value) {
				if (
					!translation.language ||
					typeof translation.language !== "string"
				) {
					return "Translation language is required";
				}

				if (
					!translation.description ||
					typeof translation.description !== "string"
				) {
					return "Translation description is required";
				}
			}

			return null;
		},
	},
};

module.exports = gameSchema;