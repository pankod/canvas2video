// Rendering [========-------------] | 30% | 80/320
const progressString: (current: number, total: number, showChunk?: boolean) => string = (
    current,
    total,
    showChunk = true,
) => {
    const barLength = 20;
    const percent = (current * 100) / total;
    const percent5 = Math.round(percent / (barLength / 5));
    const str = "-"
        .repeat(barLength)
        .split("")
        .map((l, i) => (i < percent5 ? "=" : "-"))
        .join("");
    return `[${str}] | ${percent.toFixed(2)}% ${showChunk ? `| [${current}/${total}]` : ""}`;
};

export default progressString;
