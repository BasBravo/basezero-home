export default defineNuxtPlugin({
  name: 'firebase-init',
  parallel: false,
  async setup() {
    const { initializeFirebase } = useFirebase()
    await initializeFirebase()
  }
})