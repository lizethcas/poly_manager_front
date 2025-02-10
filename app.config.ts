export default defineAppConfig({
  ui: {
    strategy: 'override',
    button: {
      color: {
        freshGreen: {
          solid: 'bg-primary-color'
        },
        gray:{
          solid: 'bg-light-grayish-blue'
        }
      }
    },
    input: {
      default: {
        size: 'sm',
        variant: 'outline',
      },
      variant: {
        gray: 'shadow-sm bg-[#F1F5FB] text-gray-900 dark:text-white  dark:ring-gray-700 focus:ring-1 focus:ring-gray-500 w-full  '
      }

    }
  }
})