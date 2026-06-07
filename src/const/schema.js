//* Esquema utilizado para body.validation.js
//* Las lineas comentadas son porque body.validation tiene problemas a resolver y esas lineas hacen que explote

const gameSchema = {
	title: {
		required: true,
		type: "string",
	},
	description: {
		required: true,
		type: "string",
	},
	price: {
		required: true,
		type: "number",
		validate: (value) => {
			if (value < 0) return "Price cannot be negative";
			return null;
		},
	},
	developer: {
		required: true,
		type: "string",
	},
	releaseDate: {
		required: true,
		type: "date",
		validate: (value) => {
			const date = new Date(value);
			if (isNaN(date.getTime())) return "Invalid date";
			return null;
		},
	},
	rating: {
		required: true,
		type: "number",
		validate: (value) => {
			if (value < 1 || value > 5) return "Rating must be between 1 and 5";
			return null;
		},
	},
	imageUrl: {
		required: true,
		type: "string",
	},
	isFavorite: {
		required: false,
		type: "boolean",
	},
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
	//     required: true,
	//     type: "array",
	//     validate: (value) => {
	//         if(value.length === 0) return "There has to be at least 1 screenshot"
	//         return null
	//     }
	// }
};

module.exports = gameSchema;
