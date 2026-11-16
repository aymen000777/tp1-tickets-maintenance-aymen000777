export interface Ticket {
  id: string
  titre: string
  description: string
  demandeur: string
  priorite: 'Haute' | 'Moyenne' | 'Basse'
  statut: 'Ouvert' | 'En cours' | 'Résolu'
  dateCreation: string
}
