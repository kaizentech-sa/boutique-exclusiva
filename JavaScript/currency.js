// Dual-currency formatter for the South African + Angolan markets.
// Base prices are stored as numeric South African Rand (ZAR).
const Currency = (() => {
    const AOA_PER_ZAR = 45; // approximate ZAR -> Angolan Kwanza rate

    const zarFmt = new Intl.NumberFormat('en-ZA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const aoaFmt = new Intl.NumberFormat('en-ZA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // Accepts a number or any legacy "$225.00" / "R 225" string.
    function toBase(value) {
        if (typeof value === 'number') return value;
        const match = String(value).replace(/,/g, '').match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    function zar(value) {
        return 'R ' + zarFmt.format(Math.round(toBase(value)));
    }

    function aoa(value) {
        return 'Kz ' + aoaFmt.format(Math.round(toBase(value) * AOA_PER_ZAR));
    }

    // HTML markup: ZAR primary, AOA secondary.
    function dual(value) {
        return `<span class="amt"><span class="amt--zar">${zar(value)}</span>` +
               `<span class="amt--aoa">${aoa(value)}</span></span>`;
    }

    return { dual, zar, aoa, toBase, AOA_PER_ZAR };
})();
