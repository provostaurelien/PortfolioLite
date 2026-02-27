<template>
  <div :class="{ dark: isDarkMode }">
    <!-- Bouton global pour basculer entre les modes -->
    <DarkModeHandler :is-dark="isDarkMode" @dark-mode-changed="handleDarkModeChange" />

    <!-- Conteneur principal (sidebar + contenu) -->
    <div id="app" class="app-container">
      <div class="content-wrapper">
        <!-- Sidebar -->
        <TheHeader :is-dark="isDarkMode" class="header" />
        <!-- Contenu principal -->
        <main class="main-content">
          <router-view :is-dark="isDarkMode" />
        </main>
      </div>

      <!-- Footer -->
      <TheFooter :is-dark="isDarkMode" class="footer" />
    </div>
  </div>
</template>

<script>
import DarkModeHandler from '@/components/DarkModeHandler.vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
import { onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'App',
  components: { DarkModeHandler, TheHeader, TheFooter },
  data() {
    return {
      isDarkMode: false,
    }
  },
  methods: {
    handleDarkModeChange(isDark) {
      this.isDarkMode = isDark
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
    },
  },
  setup() {
    let observer

    const addAriaHiddenAndLabel = () => {
      const recaptchaTextarea = document.getElementById('g-recaptcha-response')

      if (recaptchaTextarea) {
        // Vérifie si le label existe déjà pour éviter de le dupliquer
        if (!document.getElementById('g-recaptcha-label')) {
          const label = document.createElement('label')
          label.setAttribute('for', 'g-recaptcha-response')
          label.setAttribute('id', 'g-recaptcha-label')
          label.classList.add('sr-only') // Classe pour cacher le label visuellement
          label.innerText = 'Champ caché pour reCAPTCHA'

          // Insère le label juste avant le textarea
          recaptchaTextarea.parentNode.insertBefore(label, recaptchaTextarea)
        }

        // Ajoute aria-hidden et role=presentation au textarea
        recaptchaTextarea.setAttribute('aria-hidden', 'true')
        recaptchaTextarea.setAttribute('role', 'presentation')
      }
    }

    onMounted(() => {
      addAriaHiddenAndLabel() // Applique immédiatement si l'élément existe déjà

      // Observer les changements dans le DOM
      observer = new MutationObserver(() => {
        addAriaHiddenAndLabel()
      })

      observer.observe(document.body, { childList: true, subtree: true })
    })

    onBeforeUnmount(() => {
      if (observer) observer.disconnect() // Stoppe l'observateur quand le composant est détruit
    })
  }
}
</script>

<style scoped>
/* Layout global */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content-wrapper {
  display: flex;
  flex-grow: 1;
}

.main-content {
  margin-left: 15%; /* Compense la largeur de la sidebar */
  flex-grow: 1;
  height: 100%;
}

@media (max-width: 768px) {
  .content-wrapper {
    display: block;
    flex-grow: 1;
  }
  .main-content {
    margin-left: 0%; /* Compense la largeur de la sidebar */
    height: 94%; /* Laisse le contenu s'étendre naturellement */
  }
}
</style>
