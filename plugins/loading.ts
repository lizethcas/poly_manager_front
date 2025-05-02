// plugins/loading.ts
export default defineNuxtPlugin((nuxtApp) => {
    const loading = useLoading()

    nuxtApp.hook('page:start', () => {
        loading.value = true
    })

    nuxtApp.hook('page:finish', () => {
        loading.value = false
    })
})