import { useGameDataStore } from '@/stores/data'
import { useLeistungsangebotStore } from '@/stores/leistungsangebot'
import { useForschungStore } from '@/stores/forschung'
import { useFallpauschalenStore } from '@/stores/fallpauschalen'
import { useGeneralInputStore } from '@/stores/generalInput'
import { useVerweildauerStore } from '@/stores/verweildauer'
import { usePersonalUndAbteilungenStore } from '@/stores/personalUndAbteilungen'
import { useGoalsStore } from '@/stores/goals'

export async function initializeAllStores() {
  // Hauptdaten laden
  const gameStore = useGameDataStore()
  await gameStore.load()

  // Alle relevanten Module initialisieren
  const stores = {
    leistungsangebot: useLeistungsangebotStore(),
    forschung: useForschungStore(),
    fallpauschalen: useFallpauschalenStore(),
    generalInput: useGeneralInputStore(),
    verweildauer: useVerweildauerStore(),
    personalUndAbteilungen: usePersonalUndAbteilungenStore(),
    goals: useGoalsStore()
  }

  // Liste der Modulnamen, wie sie im gameStore gespeichert sind
  const moduleNames = Object.keys(stores)
  moduleNames.forEach(moduleName => {
    const moduleData = gameStore.currentPeriodData.decisions.data[moduleName]
    // Prüfe ob das Modul noch nicht initialisierte Daten enthält
    if (
      !moduleData ||
      (Array.isArray(moduleData) && moduleData.length === 0) ||
      (typeof moduleData === 'object' && Object.keys(moduleData).length === 0)
    ) {
      // Rufe je nach Modul die jeweilige Update-Funktion mit dem Default-State auf.
      switch (moduleName) {
        case 'leistungsangebot':
          stores[moduleName].updateLeistungsangebotInput(stores[moduleName].$state)
          break
        case 'forschung':
          stores[moduleName].updateForschungInput({
            forschung: stores[moduleName].$state.forschung,
            investition: stores[moduleName].$state.investition,
            zbg: stores[moduleName].$state.zbg
          })
          break
        case 'fallpauschalen':
          // Beispiel: updateFallpauschalenInput – passe dies an Deinen Store an!
          stores[moduleName].initialize()
          break
        case 'generalInput':
          // Falls Dein Store eine updateGeneralInput-Funktion anbietet:
          stores[moduleName].initialize()
          break
        case 'verweildauer':
          // Der verweildauer Store erwartet z. B. ein Objekt für verwZentral
          stores[moduleName].updateVerweildauerInput(stores[moduleName].$state.verwZentral)
          break
        case 'personalUndAbteilungen':
          stores[moduleName].initialize()
          break
        case 'goals':
          stores[moduleName].initialize()
          break
        default:
          break
      }
    }
  })
}