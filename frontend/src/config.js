export const API =
	import.meta.env.VITE_API_URL ||
	(import.meta.env.PROD
		? "https://erp-showroom.onrender.com"
		: "http://localhost:8000")