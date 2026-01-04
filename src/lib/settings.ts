import { CompanySettings, defaultSettings } from '@/types/settings'

const SETTINGS_KEY = 'meu_serralheiro_settings'

export function getSettings(): CompanySettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)
  }
  return defaultSettings
}

export function saveSettings(settings: CompanySettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  }
}
