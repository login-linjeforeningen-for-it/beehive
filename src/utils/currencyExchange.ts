const FX_API_BASE_URL = 'https://api.frankfurter.app'

export type FxHistoricalSeries = {
    closeByDate: Map<string, number>
    orderedDates: Date[]
}

const latestRateCache = new Map<string, number>()
const historicalRateCache = new Map<string, FxHistoricalSeries>()

function getDateKey(date: Date) {
    return date.toISOString().slice(0, 10)
}

export async function fetchFxRateToBase(currency: string, baseCurrency: string) {
    if (currency === baseCurrency) {
        return 1
    }

    const normalizedCurrency = currency.toUpperCase()
    const normalizedBaseCurrency = baseCurrency.toUpperCase()
    const cacheKey = `${normalizedCurrency}:${normalizedBaseCurrency}`
    const cachedRate = latestRateCache.get(cacheKey)

    if (typeof cachedRate === 'number') {
        return cachedRate
    }

    const response = await fetch(`${FX_API_BASE_URL}/latest?from=${normalizedCurrency}&to=${normalizedBaseCurrency}`, {
        cache: 'no-store'
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch FX rate for ${normalizedCurrency} to ${normalizedBaseCurrency}`)
    }

    const payload = await response.json() as { rates?: Record<string, number> }
    const rate = payload.rates?.[normalizedBaseCurrency]

    if (typeof rate !== 'number') {
        throw new Error(`Missing FX rate for ${normalizedCurrency} to ${normalizedBaseCurrency}`)
    }

    latestRateCache.set(cacheKey, rate)
    return rate
}

export async function fetchFxRatesToBase(currencies: string[], baseCurrency: string) {
    const uniqueCurrencies = [...new Set(currencies.filter((currency) => currency && currency !== baseCurrency))]
    const entries = await Promise.all(
        uniqueCurrencies.map(async (currency) => [currency, await fetchFxRateToBase(currency, baseCurrency)] as const)
    )

    return new Map(entries)
}

export async function fetchFxHistoricalSeries(currency: string, period1: Date, period2: Date, baseCurrency: string) {
    if (currency === baseCurrency) {
        return {
            closeByDate: new Map<string, number>(),
            orderedDates: [] as Date[]
        }
    }

    const normalizedCurrency = currency.toUpperCase()
    const normalizedBaseCurrency = baseCurrency.toUpperCase()
    const cacheKey = `${normalizedCurrency}:${getDateKey(period1)}:${getDateKey(period2)}:${normalizedBaseCurrency}`
    const cachedSeries = historicalRateCache.get(cacheKey)

    if (cachedSeries) {
        return cachedSeries
    }

    const response = await fetch(
        `${FX_API_BASE_URL}/${getDateKey(period1)}..${getDateKey(period2)}?from=${normalizedCurrency}&to=${normalizedBaseCurrency}`,
        { cache: 'no-store' }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch FX history for ${normalizedCurrency} to ${normalizedBaseCurrency}`)
    }

    const payload = await response.json() as {
        rates?: Record<string, Record<string, number>>
    }

    const closeByDate = new Map<string, number>()
    const orderedDates: Date[] = []

    for (const [dateKey, rates] of Object.entries(payload.rates || {})) {
        const rate = rates?.[normalizedBaseCurrency]
        if (typeof rate !== 'number') {
            continue
        }

        closeByDate.set(dateKey, rate)
        orderedDates.push(new Date(`${dateKey}T00:00:00.000Z`))
    }

    const series = {
        closeByDate,
        orderedDates: orderedDates.sort((a, b) => a.getTime() - b.getTime())
    }

    historicalRateCache.set(cacheKey, series)
    return series
}