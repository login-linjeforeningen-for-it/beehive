import { NextResponse } from 'next/server'
import holdingsData from './holdings.json'
import { fetchFxRatesToBase } from '@utils/currencyExchange'
import YahooFinance from 'yahoo-finance2'

type Holding = {
    symbol: string
    shares: number
    currency?: string
}

type YahooQuote = {
    symbol?: string
    regularMarketPrice?: number
    currency?: string
}

type HoldingValue = {
    symbol: string
    shares: number
    currency: string
    regularMarketPrice: number
    fxRateToNok: number
    valueNok: number
}

type HoldingsTotalPayload = {
    totalBase: number
    currency: string
    holdings: HoldingValue[]
    updatedAt: number
}

const BASE_CURRENCY = 'NOK'
const CACHE_TTL_MS = 10_000
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

let cachedPayload: HoldingsTotalPayload | null = null
let cachedUntil = 0

const HOLDINGS: Holding[] = (() => {
    const data = Array.isArray(holdingsData) ? holdingsData : []
    const currentHoldingsEntry = data.find((entry) => entry.until_date === '')

    if (!currentHoldingsEntry || !Array.isArray(currentHoldingsEntry.holdning)) {
        return []
    }

    return currentHoldingsEntry.holdning.flatMap((entry) => {
        const firstValidEntry = Object.entries(entry).find(([, value]) => typeof value === 'number')
        const [symbol, shares] = firstValidEntry || []
        const currency = typeof entry.currency === 'string' ? entry.currency.toUpperCase() : undefined

        if (typeof symbol !== 'string' || typeof shares !== 'number') {
            return []
        }

        return [{ symbol, shares, currency }]
    })
})()

async function fetchYahooQuotes(symbols: string[]): Promise<YahooQuote[]> {
    if (symbols.length === 0) return []

    const quotes = await Promise.allSettled(
        symbols.map((symbol) => yahooFinance.quote(symbol))
    )

    const successfulQuotes: YahooQuote[] = []

    for (const quoteResult of quotes) {
        if (quoteResult.status !== 'fulfilled') continue

        successfulQuotes.push({
            symbol: quoteResult.value.symbol,
            regularMarketPrice: quoteResult.value.regularMarketPrice,
            currency: quoteResult.value.currency
        })
    }

    if (successfulQuotes.length === 0) {
        throw new Error('No quote data available from Yahoo Finance')
    }

    return successfulQuotes
}

async function calculateTotalHoldingsValue(baseCurrency: string) {
    const symbols = HOLDINGS.map((holding) => holding.symbol)
    const quotes = await fetchYahooQuotes(symbols)

    const quoteBySymbol = new Map<string, YahooQuote>()
    for (const quote of quotes) {
        if (quote.symbol) {
            quoteBySymbol.set(quote.symbol, quote)
        }
    }

    const currenciesToResolve = [...new Set(HOLDINGS.map((holding) => holding.currency || quoteBySymbol.get(holding.symbol)?.currency || baseCurrency).filter((currency) => currency !== baseCurrency))]
    const fxRates = await fetchFxRatesToBase(currenciesToResolve, baseCurrency)

    const holdings = HOLDINGS.map((holding) => {
        const quote = quoteBySymbol.get(holding.symbol)
        const price = typeof quote?.regularMarketPrice === 'number' ? quote.regularMarketPrice : 0
        const currency = holding.currency || quote?.currency || baseCurrency
        const fxRate = currency === baseCurrency ? 1 : (fxRates.get(currency) || 0)

        return {
            symbol: holding.symbol,
            shares: holding.shares,
            currency,
            regularMarketPrice: price,
            fxRateToNok: fxRate,
            valueNok: holding.shares * price * fxRate
        }
    })

    const totalBase = holdings.reduce((sum, holding) => {
        return sum + holding.valueNok
    }, 0)

    return {
        totalBase,
        currency: baseCurrency,
        holdings,
        updatedAt: Date.now()
    } satisfies HoldingsTotalPayload
}

async function getCachedHoldingsTotal(baseCurrency = BASE_CURRENCY): Promise<HoldingsTotalPayload> {
    const now = Date.now()
    if (cachedPayload && now < cachedUntil && cachedPayload.currency === baseCurrency) {
        return cachedPayload
    }

    const payload = await calculateTotalHoldingsValue(baseCurrency)
    cachedPayload = payload
    cachedUntil = now + CACHE_TTL_MS

    return payload
}

export async function GET() {
    try {
        const payload = await getCachedHoldingsTotal(BASE_CURRENCY)

        return NextResponse.json(payload, {
            headers: {
                'Cache-Control': 'public, max-age=10, s-maxage=10, stale-while-revalidate=10'
            }
        })
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            {
                status: 502,
                headers: {
                    'Cache-Control': 'no-store'
                }
            }
        )
    }
}
