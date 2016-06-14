export const API_ROOT = (process.env.NODE_ENV === 'production')
			? ''
			:'http://api.71an.com:8000'

export const CookieDomain = (process.env.NODE_ENV === 'production')
			? '.71an.com'
			:''

 