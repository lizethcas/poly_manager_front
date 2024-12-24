import { getCurrentInstance } from 'vue'

export const useClick = (clickType: string) => {
    const instance = getCurrentInstance();
    
    const handleClick = () => {
        instance?.emit(clickType);
    }

    return {
        handleClick
    }
}