<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { getTickets } from '../services/ticketService.js'
import type { Ticket } from '../types/ticket'

const tickets = ref<Ticket[]>([])
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

const statuses = ['Ouvert', 'En cours', 'Résolu']
const priorities = ['Haute', 'Moyenne', 'Basse']

const filteredTickets = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('fr')

  return tickets.value.filter((ticket) => {
    const matchesTitle = ticket.titre.toLocaleLowerCase('fr').includes(query)
    const matchesStatus = !selectedStatus.value || ticket.statut === selectedStatus.value
    const matchesPriority = !selectedPriority.value || ticket.priorite === selectedPriority.value

    return matchesTitle && matchesStatus && matchesPriority
  })
})

onMounted(async () => {
  try {
    tickets.value = await getTickets()
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        'Impossible de charger les tickets. Vérifiez que JSON Server est démarré sur le port 3000.'
    } else {
      errorMessage.value = 'Une erreur inattendue est survenue pendant le chargement des tickets.'
      console.error('Erreur inattendue lors du chargement des tickets :', error)
    }
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="tickets-page" aria-labelledby="tickets-title" :aria-busy="isLoading">
    <header class="page-heading">
      <div>
        <p class="eyebrow">SUPPORT INFORMATIQUE</p>
        <h1 id="tickets-title">Suivi des tickets<span class="heading-period">.</span></h1>
        <p class="page-intro">Consultez les incidents déclarés par les utilisateurs.</p>
      </div>
    </header>

    <div class="filters" aria-label="Recherche et filtres des tickets">
      <div class="filter-field search-field">
        <label for="ticket-search">Rechercher par titre</label>
        <input
          id="ticket-search"
          v-model="searchQuery"
          type="search"
          placeholder="Ex. imprimante"
        />
      </div>
      <div class="filter-field">
        <label for="status-filter">Statut</label>
        <select id="status-filter" v-model="selectedStatus">
          <option value="">Tous les statuts</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="priority-filter">Priorité</label>
        <select id="priority-filter" v-model="selectedPriority">
          <option value="">Toutes les priorités</option>
          <option v-for="priority in priorities" :key="priority" :value="priority">
            {{ priority }}
          </option>
        </select>
      </div>
    </div>

    <p v-if="isLoading" class="notice" role="status">Chargement…</p>
    <p v-else-if="errorMessage" class="notice error-notice" role="alert">{{ errorMessage }}</p>
    <template v-else>
      <div class="tickets-summary" aria-live="polite">
        <h2>Liste des incidents</h2>
        <span>{{ filteredTickets.length }} ticket{{ filteredTickets.length > 1 ? 's' : '' }} visible{{ filteredTickets.length > 1 ? 's' : '' }}</span>
      </div>

      <ul v-if="filteredTickets.length" class="ticket-list">
        <li v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-card">
          <div class="ticket-main">
            <div class="ticket-title-row">
              <h3>{{ ticket.titre }}</h3>
              <span class="badge" :class="`priority-${ticket.priorite.toLowerCase()}`">
                Priorité {{ ticket.priorite }}
              </span>
            </div>
            <p class="ticket-description">{{ ticket.description }}</p>
            <dl class="ticket-details">
              <div>
                <dt>Demandeur</dt>
                <dd>{{ ticket.demandeur }}</dd>
              </div>
              <div>
                <dt>Date de création</dt>
                <dd>
                  <time :datetime="ticket.dateCreation">{{ ticket.dateCreation }}</time>
                </dd>
              </div>
            </dl>
          </div>
          <span class="badge status-badge" :class="`status-${ticket.statut.toLowerCase().replace(' ', '-')}`">
            {{ ticket.statut }}
          </span>
        </li>
      </ul>
      <p v-else class="notice empty-notice" role="status">
        Aucun ticket ne correspond à votre recherche et à vos filtres.
      </p>
    </template>
  </section>
</template>

<style scoped>
.tickets-page {
  max-width: 1040px;
  margin: 0 auto;
}

.page-heading {
  margin: 36px 0 28px;
}

.eyebrow {
  margin-bottom: 10px;
  color: var(--green);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h1 {
  color: var(--ink);
  font-size: clamp(30px, 5vw, 43px);
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.heading-period {
  color: var(--coral);
}

.page-intro {
  margin-top: 12px;
  color: var(--muted);
  font-size: 15px;
}

.filters {
  display: grid;
  grid-template-columns: minmax(220px, 1.6fr) repeat(2, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--white);
}

.filter-field {
  display: grid;
  gap: 7px;
}

.filter-field label {
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
}

.filter-field input,
.filter-field select {
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--white);
  color: var(--ink);
}

.filter-field input::placeholder {
  color: var(--muted);
}

.tickets-summary {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.tickets-summary h2 {
  color: var(--ink);
  font-size: 15px;
  font-weight: 750;
}

.tickets-summary span {
  color: var(--muted);
  font-size: 12px;
}

.ticket-list {
  display: grid;
  gap: 12px;
  padding: 0;
  list-style: none;
}

.ticket-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--white);
  box-shadow: 0 3px 12px rgb(23 53 46 / 3%);
}

.ticket-main {
  min-width: 0;
  flex: 1;
}

.ticket-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.ticket-title-row h3 {
  color: var(--ink);
  font-size: 16px;
  font-weight: 750;
}

.ticket-description {
  margin-top: 7px;
  color: var(--muted);
  font-size: 13px;
}

.ticket-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin-top: 16px;
}

.ticket-details div {
  display: flex;
  gap: 6px;
  font-size: 12px;
}

.ticket-details dt {
  color: var(--muted);
}

.ticket-details dd {
  color: var(--ink);
  font-weight: 650;
}

.badge {
  display: inline-flex;
  min-height: 26px;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
}

.priority-haute {
  background: #fae5df;
  color: #8d321d;
}

.priority-moyenne {
  background: #fff1d2;
  color: #72510c;
}

.priority-basse {
  background: #e4efe2;
  color: #315d34;
}

.status-badge {
  flex-shrink: 0;
}

.status-ouvert {
  background: #e3edf8;
  color: #244e78;
}

.status-en-cours {
  background: #fff1d2;
  color: #72510c;
}

.status-résolu {
  background: #e4efe2;
  color: #315d34;
}

.notice {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--white);
  color: var(--muted);
  text-align: center;
}

.error-notice {
  border-color: #e8b6a8;
  background: #fff5f1;
  color: #8d321d;
}

@media (max-width: 700px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .page-heading {
    margin: 24px 0;
  }

  .filters {
    gap: 12px;
    padding: 14px;
  }

  .ticket-card {
    flex-direction: column-reverse;
    gap: 10px;
    padding: 16px;
  }
}
</style>
