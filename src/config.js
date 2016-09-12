export const API_ROOT = (process.env.NODE_ENV === 'production')
			? 'http://pmker.com'
			:'http://pmker.com'

export const CookieDomain = (process.env.NODE_ENV === 'production')
			? '.pmker.com'
			:''

export const User_Center=(process.env.NODE_ENV === 'production')
	? 'http://pmker.com/wechat'
	:''


 