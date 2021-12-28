export interface MailModuleOptions {
  API_KEY: string
  DOMAIN: string
  FROM_EMAIL: string
}

export interface EmailVars {
  code: string
  email: string
}
