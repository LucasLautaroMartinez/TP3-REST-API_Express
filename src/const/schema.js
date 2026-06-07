//* Esquema utilizado para body.validation.js
//* Las lineas comentadas son porque body.validation tiene problemas a resolver y esas lineas hacen que explote

const gameSchema = {
	Name: {
		required: true,
		type: "string",
	},
	Description: {
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
			if (isNaN(date.getTime())) return "Invalid date";
			return null;
		},
	},
	Rating: {
		required: true,
		type: "number",
		validate: (value) => {
			if (value < 1 || value > 5) return "Rating must be between 1 and 5";
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
	//! ESTO ESTÁ DESACTIVADO YA QUE HAY QUE MODIFICAR EL UPDATE
	// genres: {
	// 	required: true,
	// 	type: "array",
	// 	allowedValues: [
	// 		"Action",
	// 		"Adventure",
	// 		"RPG",
	// 		"Strategy",
	// 		"Sports",
	// 		"Racing",
	// 		"Puzzle",
	// 		"Horror",
	// 		"Simulation",
	// 	],
	// 	validate: (value) => {
	// 		if (!Array.isArray(value)) return "Genres must be an array";
	// 		if (value.length === 0) return "At least one genre is required";
	// 		return null;
	// 	},
	// },
	// screenshots: {
	// 	required: true,
	// 	type: "array",
	// 	validate: (value) => {
	// 		if (value.length === 0) return "There has to be at least 1 screenshot";
	// 		return null;
	// 	},
	// },
};

module.exports = gameSchema;
