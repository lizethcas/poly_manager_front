export function useGetColor() {
    const getLevelColor = (level: string, isBackground = false) => {
        const backgroundTransparency = isBackground ? "bg-opacity-40" : ""; 
        if (level.includes("A0")) return isBackground ? `bg-baby-steps-color ${backgroundTransparency}` : "border-baby-steps-color text-baby-steps-color";
        if (level.includes("A1")) return isBackground ? `bg-elementary-color ${backgroundTransparency}` : "border-elementary-color text-elementary-color";
        if (level.includes("A2")) return isBackground ? `bg-pre-intermediate-color ${backgroundTransparency}` : "border-pre-intermediate-color text-pre-intermediate-color";
        if (level.includes("B1")) return isBackground ? `bg-intermediate-color ${backgroundTransparency}` : "border-intermediate-color text-intermediate-color";
        return isBackground ? `bg-upper-intermediate-color ${backgroundTransparency}` : "border-upper-intermediate-color text-upper-intermediate-color";
    };

    return {
        getLevelColor
    }
}
